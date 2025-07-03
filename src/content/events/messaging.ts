/**
 * Event handling module for the LinkedIn Easy Apply extension
 * Handles Chrome extension messaging, page events, and debugging utilities
 */

import { MessageType, ResponseType, UserProfile } from '../../types';
import { autofillRouter } from '../autofillEngine';
import { startAutomation, stopAutomation, type AutomationState } from '../automation';
import { getSession, getCurrentUser, ensureAuthenticated, trackJobApplication } from '../../lib/supabase';

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