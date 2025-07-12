/**
 * Event handling module for the LinkedIn Easy Apply extension
 * Handles Chrome extension messaging, page events, and debugging utilities
 */

import { MessageType, ResponseType, UserProfile } from '../../types';
import { autofillRouter } from '../autofillEngine';
import { startAutomation, stopAutomation, type AutomationState } from '../automation';
import { getSession, getCurrentUser, ensureAuthenticated, trackJobApplication } from '../../lib/supabase';

// Continuous autofill state
let isContinuousRunning = false;
let continuousInterval: number | null = null;
let continuousUserData: UserProfile | null = null;
let currentStep = 0;
let maxSteps = 10; // Safety limit
let stepNames = ['Personal Info', 'Experience', 'Application Questions', 'Voluntary Disclosures', 'Self Identity'];
let attemptCount = 0;
let maxAttempts = 3; // Max attempts per step
let lastDetectedStep = 0;
let stuckStepCount = 0;

/**
 * Starts continuous autofill process
 * @param userData - User profile data for autofill
 */
const startContinuousAutofill = async (userData: UserProfile): Promise<void> => {
  console.log("🚀 Starting continuous autofill process");
  
  if (isContinuousRunning) {
    console.log("⚠️ Continuous autofill already running");
    return;
  }
  
  isContinuousRunning = true;
  continuousUserData = userData;
  currentStep = 0;
  attemptCount = 0;
  lastDetectedStep = 0;
  stuckStepCount = 0;
  
  // Update storage to reflect continuous mode state
  await chrome.storage.local.set({ 
    isContinuousRunning: true,
    continuousProgress: {
      currentStep: 1,
      totalSteps: stepNames.length,
      stepName: stepNames[0] || 'Starting...'
    }
  });
  
  // Start the continuous process
  await runContinuousAutofillStep();
};

/**
 * Stops continuous autofill process
 */
const stopContinuousAutofill = async (): Promise<void> => {
  console.log("🛑 Stopping continuous autofill process");
  
  isContinuousRunning = false;
  
  if (continuousInterval) {
    clearTimeout(continuousInterval);
    continuousInterval = null;
  }
  
  // Update storage to reflect stopped state
  await chrome.storage.local.set({ 
    isContinuousRunning: false,
    continuousProgress: null
  });
  
  continuousUserData = null;
  currentStep = 0;
  attemptCount = 0;
  lastDetectedStep = 0;
  stuckStepCount = 0;
  
  console.log("✅ Continuous autofill stopped");
};

/**
 * Runs a single step of the continuous autofill process
 */
const runContinuousAutofillStep = async (): Promise<void> => {
  if (!isContinuousRunning || !continuousUserData) {
    console.log("🛑 Continuous autofill stopped or no user data");
    return;
  }
  
  if (currentStep >= maxSteps) {
    console.log("🛑 Maximum steps reached, stopping continuous autofill");
    await stopContinuousAutofill();
    return;
  }
  
  try {
    // Detect current step
    const detectedStep = detectCurrentWorkdayStep();
    console.log(`🔄 Running continuous autofill - detected step: ${detectedStep} (attempt ${attemptCount + 1}/${maxAttempts})`);
    
    // Check if we're stuck on the same step
    if (detectedStep === lastDetectedStep) {
      stuckStepCount++;
      console.log(`⚠️ Still on step ${detectedStep}, stuck count: ${stuckStepCount}`);
      
      if (stuckStepCount >= maxAttempts) {
        console.log("🛑 Stuck on same step too many times, stopping continuous autofill");
        await stopContinuousAutofill();
        return;
      }
    } else {
      // Reset stuck counter when we progress
      stuckStepCount = 0;
      lastDetectedStep = detectedStep;
    }
    
    // Update progress with detected step
    const stepName = stepNames[detectedStep - 1] || `Step ${detectedStep}`;
    await chrome.storage.local.set({
      continuousProgress: {
        currentStep: detectedStep,
        totalSteps: stepNames.length,
        stepName
      }
    });
    
    // Run autofill for current page
    await autofillRouter(continuousUserData);
    
    // Wait for page to process/validate
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we're at the final submission page
    if (isAtFinalSubmissionPage()) {
      console.log("🎉 Reached final submission page, stopping continuous autofill");
      await stopContinuousAutofill();
      return;
    }
    
    // Check if we can proceed to next step
    if (canProceedToNextStep()) {
      console.log("✅ Step completed successfully, proceeding to next step");
      
      // Reset attempt count for next step
      attemptCount = 0;
      
      // Schedule next step
      continuousInterval = window.setTimeout(async () => {
        await runContinuousAutofillStep();
      }, 3000); // 3 second delay between steps
      
    } else {
      // Increment attempt count
      attemptCount++;
      
      if (attemptCount >= maxAttempts) {
        console.log("❌ Maximum attempts reached for current step, stopping continuous autofill");
        await stopContinuousAutofill();
      } else {
        console.log(`⚠️ Cannot proceed yet, retrying in 5 seconds (attempt ${attemptCount}/${maxAttempts})`);
        
        // Schedule retry with longer delay
        continuousInterval = window.setTimeout(async () => {
          await runContinuousAutofillStep();
        }, 5000); // 5 second delay for retries
      }
    }
    
  } catch (error) {
    console.error("❌ Error in continuous autofill step:", error);
    attemptCount++;
    
    if (attemptCount >= maxAttempts) {
      console.log("❌ Maximum attempts reached due to errors, stopping continuous autofill");
      await stopContinuousAutofill();
    } else {
      console.log(`⚠️ Error occurred, retrying in 5 seconds (attempt ${attemptCount}/${maxAttempts})`);
      
      // Schedule retry after error
      continuousInterval = window.setTimeout(async () => {
        await runContinuousAutofillStep();
      }, 5000);
    }
  }
};

/**
 * Detects the current Workday step (imported from workday.ts logic)
 */
const detectCurrentWorkdayStep = (): number => {
  // Look for step indicators in the UI
  const stepIndicators = [
    { step: 1, selectors: ['[data-automation-id*="step1"]', '[aria-label*="Step 1"]'] },
    { step: 2, selectors: ['[data-automation-id*="step2"]', '[aria-label*="Step 2"]'] },
    { step: 3, selectors: ['[data-automation-id*="step3"]', '[aria-label*="Step 3"]'] },
    { step: 4, selectors: ['[data-automation-id*="step4"]', '[aria-label*="Step 4"]'] },
    { step: 5, selectors: ['[data-automation-id*="step5"]', '[aria-label*="Step 5"]'] }
  ];
  
  // Check each step's indicators
  for (const { step, selectors } of stepIndicators) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`✅ Detected step ${step} by selector: ${selector}`);
        return step;
      }
    }
  }
  
  // Fallback: Try to detect by visible form fields
  // Step 1: Personal Information
  if (document.querySelector('input[id*="firstName"], input[id*="legalName--firstName"]')) {
    console.log("✅ Detected step 1 by first name field");
    return 1;
  }
  
  // Step 2: My Experience
  if (document.querySelector('input[id*="skills"], button[data-automation-id*="addItemButton"]')) {
    console.log("✅ Detected step 2 by skills/experience fields");
    return 2;
  }
  
  // Step 3: Application Questions
  if (document.querySelector('button[data-automation-id*="radioButton"], fieldset[data-automation-id*="RadioButtonGroup"]')) {
    console.log("✅ Detected step 3 by radio button questions");
    return 3;
  }
  
  // Step 4: Voluntary Disclosures
  if (document.querySelector('fieldset[data-automation-id*="gender"], fieldset[data-automation-id*="ethnicity"]')) {
    console.log("✅ Detected step 4 by voluntary disclosure fields");
    return 4;
  }
  
  // Step 5: Self Identification
  if (document.querySelector('input[id*="selfIdentifiedDisabilityData"], fieldset[data-automation-id*="disabilityStatus"]')) {
    console.log("✅ Detected step 5 by self identification fields");
    return 5;
  }
  
  // Default to step 1 if we can't detect
  console.log("⚠️ Could not detect specific step, defaulting to step 1");
  return 1;
};

/**
 * Checks if we're at the final submission page
 */
const isAtFinalSubmissionPage = (): boolean => {
  // Check for final submission indicators
  const submitButton = document.querySelector('button[aria-label*="Submit"], button[data-automation-id*="submit"]');
  const reviewText = document.querySelector('h1, h2, h3, [role="heading"]');
  
  // Check if review text contains submission keywords
  const hasSubmissionText = reviewText && (
    reviewText.textContent?.toLowerCase().includes('review') ||
    reviewText.textContent?.toLowerCase().includes('submit') ||
    reviewText.textContent?.toLowerCase().includes('final')
  );
  
  const isSubmissionPage = !!(submitButton || hasSubmissionText);
  
  if (isSubmissionPage) {
    console.log("🎉 Final submission page detected");
  }
  
  return isSubmissionPage;
};

/**
 * Checks if we can proceed to the next step
 */
const canProceedToNextStep = (): boolean => {
  // Check for validation errors
  const errors = document.querySelectorAll('[data-automation-id*="error"], .error, [aria-invalid="true"], [aria-labelledby*="ERROR"]');
  if (errors.length > 0) {
    console.log("⚠️ Validation errors found, cannot proceed:", errors.length);
    return false;
  }
  
  // Check for next button or step progression
  const nextButton = document.querySelector('button[aria-label*="Next"], button[data-automation-id*="next"]');
  const continueButton = document.querySelector('button[aria-label*="Continue"]');
  
  const canProceed = !!(nextButton || continueButton);
  
  if (canProceed) {
    console.log("✅ Can proceed to next step");
  } else {
    console.log("❌ Cannot proceed - no next/continue button found");
  }
  
  return canProceed;
};

/**
 * Interface for message handling dependencies
 */
interface MessageHandlingDependencies {
  automationState: AutomationState;
  getIsRunning: () => boolean;
  getUserData: () => UserProfile | null;
  setIsRunning: (value: boolean) => void;
  setContinuing: (value: boolean) => void;
  setUserData: (value: UserProfile | null) => void;
}

/**
 * Sets up Chrome extension message listener with comprehensive message handling
 * Handles START_AUTOMATION, STOP_AUTOMATION, GET_STATE, and AUTOFILL_CURRENT_PAGE messages
 * @param deps - Dependencies required for message handling
 */
export const setupMessageListener = (deps: MessageHandlingDependencies) => {
  // Update message listener with more debugging
  chrome.runtime.onMessage.addListener((message: MessageType, sender, sendResponse: (response: ResponseType) => void) => {
    console.log("Content script received message:", message);
    console.log("Content script sender:", sender);
    
    try {
      switch (message.type) {
        case 'START_AUTOMATION':
          console.log("Handling START_AUTOMATION message");
          if (message.settings) {
            const currentUserData = deps.getUserData();
            const updatedUserData = {
              ...currentUserData,
              settings: {
                ...currentUserData?.settings,
                nextJobDelay: message.settings.nextJobDelay
              }
            };
            deps.setUserData(updatedUserData);
            deps.automationState.userData = updatedUserData;
          }
          startAutomation(deps.automationState, deps.setIsRunning, deps.setContinuing);
          sendResponse({ isRunning: true });
          break;
          
        case 'STOP_AUTOMATION':
          console.log("Handling STOP_AUTOMATION message");
          stopAutomation(deps.automationState, deps.setIsRunning, deps.setContinuing);
          sendResponse({ isRunning: false });
          break;
          
        case 'GET_STATE':
          console.log("Handling GET_STATE message");
          sendResponse({ isRunning: deps.getIsRunning() });
          break;
          
        case 'AUTOFILL_CURRENT_PAGE':
          console.log("Handling AUTOFILL_CURRENT_PAGE message", message.data);
          (async () => {
          try {
            if (!message.data) {
              throw new Error("No user data provided for autofill");
            }
              await autofillRouter(message.data);
            sendResponse({ success: true });
          } catch (error) {
            console.error("Error during autofill:", error);
            sendResponse({ success: false, error: (error as Error).message });
          }
          })();
          break;
          
        case 'START_CONTINUOUS_AUTOFILL':
          console.log("🚀 Handling START_CONTINUOUS_AUTOFILL message", message.data);
          (async () => {
            try {
              if (!message.data) {
                throw new Error("No user data provided for continuous autofill");
              }
              await startContinuousAutofill(message.data);
              sendResponse({ success: true });
            } catch (error) {
              console.error("Error starting continuous autofill:", error);
              sendResponse({ success: false, error: (error as Error).message });
            }
          })();
          break;
          
        case 'STOP_CONTINUOUS_AUTOFILL':
          console.log("🛑 Handling STOP_CONTINUOUS_AUTOFILL message");
          (async () => {
            try {
              await stopContinuousAutofill();
              sendResponse({ success: true });
            } catch (error) {
              console.error("Error stopping continuous autofill:", error);
              sendResponse({ success: false, error: (error as Error).message });
            }
          })();
          break;
          
        default:
          console.log("Received unknown message type:", message.type);
          sendResponse({ isRunning: deps.getIsRunning() });
      }
    } catch (e) {
      console.error("Error processing message:", e);
      sendResponse({ error: (e as Error).message });
    }
    
    return true;
  });
};

/**
 * Sets up page event listeners including cleanup on page unload
 * @param deps - Dependencies required for event handling
 */
export const setupPageEventListeners = (deps: MessageHandlingDependencies) => {
  // Add cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (deps.getIsRunning()) {
      stopAutomation(deps.automationState, deps.setIsRunning, deps.setContinuing);
    }
  });
};

/**
 * Sets up debugging utilities available from browser console
 * Creates global functions for testing database connectivity and authentication
 */
export const setupDebugUtilities = () => {
  // Test function for database connectivity - can be called from browser console
  (window as any).testDatabaseConnection = async () => {
    console.log('🔍 Testing database connection...');
    
    try {
      // Test 1: Check session
      const session = await getSession();
      console.log('🔍 Session test:', !!session);
      
      // Test 2: Check user
      const user = await getCurrentUser();
      console.log('🔍 User test:', !!user, user?.email);
      
      // Test 3: Try to track a test application
      const testResult = await trackJobApplication(
        'Test Position', 
        'Test Company', 
        {
          linkedin_job_id: `test-${Date.now()}`,
          location: 'Test Location',
          work_type: 'remote' as const,
          job_description: 'Test description'
        }
      );
      
      console.log('🔍 Database tracking test result:', testResult);
      
      return {
        hasSession: !!session,
        hasUser: !!user,
        userEmail: user?.email,
        trackingWorking: testResult
      };
    } catch (error) {
      console.error('🔍 Database connection test failed:', error);
      return {
        error: (error as Error).message
      };
    }
  };

  console.log('🔧 Database test function available: window.testDatabaseConnection()');

  // Function to check authentication status
  (window as any).checkAuthStatus = async () => {
    console.log('🔍 Checking authentication status...');
    
    try {
      const session = await getSession();
      const user = await getCurrentUser();
      const authResult = await ensureAuthenticated();
      
      console.log('Auth Status:', {
        hasSession: !!session,
        hasUser: !!user,
        userEmail: user?.email,
        ensureAuthResult: authResult
      });
      
      return {
        hasSession: !!session,
        hasUser: !!user,
        userEmail: user?.email,
        ensureAuthResult: authResult
      };
    } catch (error) {
      console.error('Auth check failed:', error);
      return { error: (error as Error).message };
    }
  };

  console.log('🔧 Auth check function available: window.checkAuthStatus()');
}; 