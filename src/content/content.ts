import { MessageType, ResponseType, SELECTORS, UserProfile } from '../types';
import { trackJobApplication, getSession, getCurrentUser, initSupabaseClient } from '../lib/supabase';

let isRunning = false;
let automationInterval: number | null = null;
let userData: UserProfile | null = null;
let continuing = false;
let isUserTyping = false;
let lastInputTime = 0;
const INPUT_IDLE_THRESHOLD = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const clickElement = async (selector: string): Promise<boolean> => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element && isElementVisible(element)) {
    element.click();
    return true;
  }
  return false;
};

const isElementVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         element.offsetWidth > 0 &&
         element.offsetHeight > 0;
};

const findButtonByText = (text: string): HTMLElement | null => {
  // First try finding by aria-label
  const buttonByAriaLabel = document.querySelector(`button[aria-label*="${text}" i]`);
  if (buttonByAriaLabel && isElementVisible(buttonByAriaLabel as HTMLElement)) {
    return buttonByAriaLabel as HTMLElement;
  }

  // Then try finding by button text content
  const buttons = Array.from(document.getElementsByTagName('button'));
  const buttonByText = buttons.find(button => {
    if (!isElementVisible(button as HTMLElement)) return false;
    
    // Check button's direct text content
    if (button.textContent?.trim().toLowerCase().includes(text.toLowerCase())) {
      return true;
    }
    
    // Check text content in span inside button
    const span = button.querySelector('.artdeco-button__text');
    return span?.textContent?.trim().toLowerCase().includes(text.toLowerCase());
  });

  return buttonByText as HTMLElement || null;
};

const clickAnyElement = async (selectors: string[]): Promise<boolean> => {
  // First try the exact selectors
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && isElementVisible(element)) {
      console.log(`Clicking element with selector: ${selector}`);
      element.click();
      return true;
    }
  }

  // Then try finding buttons by text content
  const buttonTexts = ['Next', 'Continue', 'Review'];
  for (const text of buttonTexts) {
    const button = findButtonByText(text);
    if (button) {
      console.log(`Clicking button with text: ${text}`);
      button.click();
      return true;
    }
  }

  // Try finding primary buttons that might be next/review buttons
  const primaryButtons = document.querySelectorAll('.artdeco-button--primary');
  for (const button of primaryButtons) {
    if (isElementVisible(button as HTMLElement)) {
      const text = button.textContent?.trim().toLowerCase() || '';
      if (text.includes('next') || text.includes('continue') || text.includes('review')) {
        console.log(`Clicking primary button with text: ${text}`);
        (button as HTMLElement).click();
        return true;
      }
    }
  }

  return false;
};

const findVisibleElement = (selector: string): HTMLElement | null => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element && isElementVisible(element)) {
    return element;
  }
  return null;
};

const isFieldEmpty = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): boolean => {
  // Check if the field has any value and isn't just whitespace
  const value = element.value.trim();
  // Also check if the field has a placeholder that looks like a real value
  const placeholder = element.getAttribute('placeholder')?.trim() || '';
  return !value && !placeholder.match(/^\+?[\d\s-]+$/); // Don't consider phone number placeholders as empty
};

const fillInput = async (selector: string, value: string): Promise<boolean> => {
  const input = document.querySelector(selector) as HTMLInputElement;
  if (input && isElementVisible(input) && isFieldEmpty(input)) {
    // Don't modify if the field already has a value
    if (input.value.trim()) {
      return true;
    }
    
    // Preserve the original value
    const originalValue = input.value;
    
    try {
      input.value = value;
      // Use a more natural event dispatch sequence
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      return true;
    } catch (error) {
      console.error('Error filling input:', error);
      // Restore original value if there was an error
      input.value = originalValue;
      return false;
    }
  }
  return false;
};

const fillTextArea = async (selector: string, value: string): Promise<boolean> => {
  const textarea = document.querySelector(selector) as HTMLTextAreaElement;
  if (textarea && isElementVisible(textarea) && isFieldEmpty(textarea)) {
    // Don't modify if the field already has a value
    if (textarea.value.trim()) {
      return true;
    }
    
    const originalValue = textarea.value;
    
    try {
      textarea.value = value;
      textarea.dispatchEvent(new Event('focus', { bubbles: true }));
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      textarea.dispatchEvent(new Event('blur', { bubbles: true }));
      return true;
    } catch (error) {
      console.error('Error filling textarea:', error);
      textarea.value = originalValue;
      return false;
    }
  }
  return false;
};

const selectOption = async (selector: string, value: string): Promise<boolean> => {
  const select = document.querySelector(selector) as HTMLSelectElement;
  if (select && isFieldEmpty(select)) {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  return false;
};

const uploadResume = async (selector: string, base64Data: string): Promise<boolean> => {
  const input = document.querySelector(selector) as HTMLInputElement;
  // Only upload if there's no file already selected
  if (input && input.type === 'file' && (!input.files || input.files.length === 0)) {
    const blob = await fetch(base64Data).then(res => res.blob());
    const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });
    const container = new DataTransfer();
    container.items.add(file);
    input.files = container.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  return false;
};

const setupInputListeners = () => {
  // Listen for any input events on form fields
  document.addEventListener('input', () => {
    isUserTyping = true;
    lastInputTime = Date.now();
  }, true);

  // Listen for field blur events (user moves to next field)
  document.addEventListener('blur', () => {
    isUserTyping = false;
  }, true);
};

const isUserStillTyping = async (): Promise<boolean> => {
  // Check if user is actively typing or recently typed
  if (isUserTyping) return true;
  
  const timeSinceLastInput = Date.now() - lastInputTime;
  return timeSinceLastInput < INPUT_IDLE_THRESHOLD;
};

const fillFormFields = async () => {
  if (!userData) return;

  try {
    // Fill basic information only if fields are empty
    const fieldsToFill = [
      { selector: SELECTORS.FIRST_NAME_INPUT, value: userData.firstName },
      { selector: SELECTORS.LAST_NAME_INPUT, value: userData.lastName },
      { selector: SELECTORS.EMAIL_INPUT, value: userData.email },
      { selector: SELECTORS.PHONE_INPUT, value: userData.phone },
      { selector: SELECTORS.LOCATION_INPUT, value: userData.location },
      { selector: SELECTORS.LINKEDIN_INPUT, value: userData.linkedin },
      { selector: SELECTORS.WEBSITE_INPUT, value: userData.website }
    ];

    // Fill each field only if it's empty and visible
    for (const field of fieldsToFill) {
      if (field.value) {
        const element = document.querySelector(field.selector) as HTMLInputElement;
        if (element && isElementVisible(element) && isFieldEmpty(element)) {
          await fillInput(field.selector, field.value);
          // Add a small delay between fills to prevent overwhelming the form
          await sleep(100);
        }
      }
    }

    // Upload resume only if no file is selected
    if (userData.resume) {
      await uploadResume(SELECTORS.RESUME_INPUT, userData.resume);
    }

    // Handle additional questions - only fill empty fields
    const textInputs = document.querySelectorAll(SELECTORS.TEXT_INPUT);
    const textAreas = document.querySelectorAll(SELECTORS.TEXT_AREA);
    const selects = document.querySelectorAll(SELECTORS.MULTIPLE_CHOICE);

    // Process each type of field with a delay between fills
    for (const element of [...textInputs, ...textAreas]) {
      if (!isElementVisible(element as HTMLElement) || !isFieldEmpty(element as HTMLInputElement | HTMLTextAreaElement)) {
        continue;
      }

      const question = element.getAttribute('aria-label')?.toLowerCase() || 
                      element.getAttribute('placeholder')?.toLowerCase() || '';
      
      for (const [key, value] of Object.entries(userData.additionalQuestions)) {
        if (question.includes(key.toLowerCase())) {
          if (element instanceof HTMLTextAreaElement) {
            await fillTextArea(element.tagName, value);
          } else if (element instanceof HTMLInputElement) {
            await fillInput(element.tagName, value);
          }
          await sleep(100);
          break;
        }
      }
    }
  } catch (error) {
    console.error('Error filling form fields:', error);
  }
};

const isJobAlreadyApplied = (jobCard: HTMLElement): boolean => {
  // Check for LinkedIn's "Applied" status text
  const appliedText = jobCard.querySelector('.artdeco-inline-feedback__message');
  if (appliedText?.textContent?.trim().toLowerCase().includes('applied')) {
    return true;
  }

  // Check for "Applied" button state
  const appliedButton = jobCard.querySelector('.jobs-apply-button--applied');
  if (appliedButton) {
    return true;
  }

  // Check for any element containing "Applied" text
  const appliedStatus = jobCard.querySelector('.job-card-container__footer-item');
  if (appliedStatus?.textContent?.trim().toLowerCase().includes('applied')) {
    return true;
  }

  return false;
};

const findNextJob = (): HTMLElement | null => {
  // Get all job cards
  const jobCards = Array.from(document.querySelectorAll(SELECTORS.JOB_CARD));
  
  // Find the first non-applied job
  for (let i = 0; i < jobCards.length; i++) {
    const jobCard = jobCards[i] as HTMLElement;
    
    // Skip if not visible
    if (!isElementVisible(jobCard)) {
      continue;
    }

    // Skip if we've marked it as applied in our extension
    if (jobCard.getAttribute('data-applied') === 'true') {
      continue;
    }

    // Check if LinkedIn shows it as already applied
    if (isJobAlreadyApplied(jobCard)) {
      console.log('Skipping already applied job');
      // Optionally mark it in our system too
      markJobAsApplied(jobCard);
      continue;
    }

    // Found the next job to apply to
    console.log('Found next job to apply to');
    return jobCard;
  }
  
  // If we've reached here, we might need to scroll to load more jobs
  const lastJobCard = jobCards[jobCards.length - 1] as HTMLElement;
  if (lastJobCard) {
    console.log('Scrolling to load more jobs...');
    lastJobCard.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  
  return null;
};

const scrollToJob = (jobElement: HTMLElement) => {
  jobElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const markJobAsApplied = (jobElement: HTMLElement) => {
  jobElement.setAttribute('data-applied', 'true');
};

const clickJob = (jobElement: HTMLElement): boolean => {
  // First try to find the job title link specifically
  const jobTitleLink = jobElement.querySelector(SELECTORS.JOB_TITLE_LINK) as HTMLElement;
  if (jobTitleLink && isElementVisible(jobTitleLink)) {
    jobTitleLink.click();
    return true;
  }

  // Fallback to finding any clickable element if title link isn't found
  const clickableElement = jobElement.querySelector('a[href*="/jobs/view/"], button[data-job-id]') as HTMLElement;
  if (clickableElement && isElementVisible(clickableElement)) {
    clickableElement.click();
    return true;
  }

  console.log('No clickable job element found');
  return false;
};

const areAllFieldsFilled = async (): Promise<boolean> => {
  // Get all visible input fields, textareas, and selects that are required or have error messages
  const formFields = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
  
  for (const field of Array.from(formFields)) {
    const element = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    
    // Skip if not visible
    if (!isElementVisible(element as HTMLElement)) {
      continue;
    }

    // Check if field is required or has error message
    const isRequired = element.hasAttribute('required') || 
                      element.getAttribute('aria-required') === 'true' ||
                      element.closest('.required') !== null;

    // Check for error messages
    const hasError = element.getAttribute('aria-invalid') === 'true' ||
                    element.classList.contains('artdeco-text-input--error');

    if (isRequired || hasError) {
      const isEmpty = isFieldEmpty(element);
      if (isEmpty) {
        console.log('Empty required field found:', element);
        return false;
      }
    }
  }

  // Check for any error messages on the page
  const errorMessages = document.querySelectorAll('.artdeco-inline-feedback--error');
  if (errorMessages.length > 0) {
    console.log('Error messages found on page');
    return false;
  }

  return true;
};

const verifySession = async () => {
  console.log('Verifying session...');
  const session = await getSession();
  console.log('Current session:', session);
  const user = await getCurrentUser();
  console.log('Current user:', user);
  return !!session && !!user;
};

const processApplication = async () => {
  try {
    // Add session verification at the start
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      console.error('Not authenticated - please sign in to the extension');
      return;
    }

    setupInputListeners();
    
    const nextJob = findNextJob();
    if (!nextJob) {
      console.log('No more jobs found to apply to');
      return;
    }

    // Use LinkedIn's specific class names for job details
    const jobTitleElement = document.querySelector('.t-24.job-details-jobs-unified-top-card__job-title');
    const companyElement = document.querySelector('.job-details-jobs-unified-top-card__company-name');
    
    const jobTitle = jobTitleElement?.textContent?.trim() || 'Unknown Position';
    const companyName = companyElement?.textContent?.trim() || 'Unknown Company';
    
    console.log('Found job details:', { jobTitle, companyName });

    if (isJobAlreadyApplied(nextJob)) {
      await sleep(500);
      return;
    }

    scrollToJob(nextJob);
    await sleep(1000);

    if (!clickJob(nextJob)) {
      console.log('Could not click the job card');
      return;
    }
    await sleep(1000);
    
    const applied = await clickElement(SELECTORS.EASY_APPLY_BUTTON);
    if (!applied) {
      console.log('No Easy Apply button found');
      return;
    }

    await sleep(1000);

    continuing = true;
    let retryCount = 0;
    const maxRetries = 3;

    while (continuing && isRunning) {
      if (!isRunning) {
        console.log('Automation stopped, ending process');
        continuing = false;
        break;
      }

      await sleep(500);

      // Try to fill form fields on each step
      await fillFormFields();
      
      // Give time for fields to be filled and validated
      await sleep(500);

      // Check if all required fields are filled
      const fieldsAreFilled = await areAllFieldsFilled();
      
      if (!fieldsAreFilled) {
        console.log('Waiting for all required fields to be filled...');
        await sleep(1000);
        // Check again after waiting
        const recheckedFields = await areAllFieldsFilled();
        if (!recheckedFields) {
          console.log('Fields still not filled, waiting more...');
          await sleep(1000);
          continue;
        }
      }

      // Wait until user is done typing before proceeding
      while (await isUserStillTyping()) {
        console.log('Waiting for user to finish typing...');
        await sleep(500);
      }

      // Add a small delay after user is done typing
      await sleep(1000);

      // Only proceed with Review/Next/Submit if fields are filled and user is done typing
      const reviewed = await clickAnyElement(SELECTORS.REVIEW_BUTTON);
      if (reviewed) {
        console.log('Clicked review button');
        await sleep(500);
        
        // Check fields again in review page
        const reviewFieldsFilled = await areAllFieldsFilled();
        if (!reviewFieldsFilled) {
          console.log('Review page has empty required fields, waiting...');
          await sleep(1000);
          continue;
        }
        
        const submitted = await clickElement(SELECTORS.SUBMIT_BUTTON);
        if (submitted) {
          console.log('Application submitted successfully');
          continuing = false;
          
          // Track the application in the database with enhanced error handling
          try {
            console.log('Attempting to track application for:', { jobTitle, companyName });
            const trackingResult = await trackJobApplication(jobTitle, companyName);
            
            if (trackingResult) {
              console.log('Successfully saved application to database:', trackingResult);
            } else {
              console.error('Failed to save application to database - trackingResult is null');
              // Continue with the process even if tracking fails
            }
          } catch (error) {
            console.error('Error while trying to track application:', error);
            // Continue with the process even if tracking fails
          }
          
          // Wait for the "Application sent" modal
          await sleep(1000);
          
          // Try to find and click the "Done" button in the success modal
          const doneButton = findButtonByText('Done');
          if (doneButton) {
            console.log('Clicking Done button in success modal');
            doneButton.click();
            await sleep(500);
          } else {
            // Fallback to close button if Done button not found
            await clickElement(SELECTORS.CLOSE_BUTTON);
            await sleep(500);
          }
          
          markJobAsApplied(nextJob);

          // Use the user's configured delay from settings
          const delay = userData?.settings?.nextJobDelay || 5000; // Default to 5 seconds if not set
          console.log(`Waiting ${delay/1000} seconds before next job...`);
          await sleep(delay);

          // Find and click the next job card to prepare for the next application
          const nextJobCard = findNextJob();
          if (nextJobCard) {
            scrollToJob(nextJobCard);
            await sleep(1000);
            clickJob(nextJobCard);
          }
        } else {
          retryCount++;
          if (retryCount >= maxRetries) {
            console.log('Could not find submit button, closing application');
            continuing = false;
            await clickElement(SELECTORS.CLOSE_BUTTON);
          }
          await sleep(500);
        }
      } else {
        const submitted = await clickElement(SELECTORS.SUBMIT_BUTTON);
        if (submitted) {
          console.log('Application submitted successfully');
          continuing = false;
          
          // Track the application in the database with enhanced error handling
          try {
            console.log('Attempting to track application for:', { jobTitle, companyName });
            const trackingResult = await trackJobApplication(jobTitle, companyName);
            
            if (trackingResult) {
              console.log('Successfully saved application to database:', trackingResult);
            } else {
              console.error('Failed to save application to database - trackingResult is null');
              // Continue with the process even if tracking fails
            }
          } catch (error) {
            console.error('Error while trying to track application:', error);
            // Continue with the process even if tracking fails
          }
          
          // Wait for the "Application sent" modal
          await sleep(1000);
          
          // Try to find and click the "Done" button in the success modal
          const doneButton = findButtonByText('Done');
          if (doneButton) {
            console.log('Clicking Done button in success modal');
            doneButton.click();
            await sleep(500);
          } else {
            // Fallback to close button if Done button not found
            await clickElement(SELECTORS.CLOSE_BUTTON);
            await sleep(500);
          }
          
          markJobAsApplied(nextJob);

          // Use the user's configured delay from settings
          const delay = userData?.settings?.nextJobDelay || 5000; // Default to 5 seconds if not set
          console.log(`Waiting ${delay/1000} seconds before next job...`);
          await sleep(delay);

          // Find and click the next job card to prepare for the next application
          const nextJobCard = findNextJob();
          if (nextJobCard) {
            scrollToJob(nextJobCard);
            await sleep(1000);
            clickJob(nextJobCard);
          }
        } else {
          // Only try next button if all fields are properly filled
          const fieldsReady = await areAllFieldsFilled();
          if (fieldsReady) {
            console.log('All fields filled, attempting to click next button...');
            const hasNext = await clickAnyElement(SELECTORS.NEXT_BUTTON);
            if (hasNext) {
              console.log('Successfully clicked next button');
              retryCount = 0;
              await sleep(500);
            } else {
              console.log('No next button found, waiting...');
              retryCount++;
              if (retryCount >= maxRetries) {
                console.log('Could not proceed with application, closing');
                continuing = false;
                await clickElement(SELECTORS.CLOSE_BUTTON);
              }
              await sleep(500);
            }
          } else {
            console.log('Waiting for fields to be filled before proceeding...');
            await sleep(1000);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error during application process:', error);
    continuing = false;
    await clickElement(SELECTORS.CLOSE_BUTTON);
  }
};

const startAutomation = () => {
  console.log('Starting automation...');
  isRunning = true;
  continuing = false;
  
  chrome.storage.local.set({ isAutomationRunning: true }, () => {
    console.log('Automation state saved: running');
  });
  
  if (automationInterval) {
    window.clearInterval(automationInterval);
    automationInterval = null;
  }
  
  automationInterval = window.setInterval(async () => {
    if (!isRunning) {
      console.log('Automation stopped, clearing interval');
      if (automationInterval) {
        window.clearInterval(automationInterval);
        automationInterval = null;
      }
      return;
    }

    if (!continuing) {
      await processApplication();
    }
  }, 1000); // Reduced from 3000ms to 1000ms
};

const stopAutomation = () => {
  console.log('Stopping automation...');
  isRunning = false;
  if (automationInterval) {
    window.clearInterval(automationInterval);
    automationInterval = null;
  }
  // Force stop any ongoing process
  continuing = false;
  
  // Store the stopped state
  chrome.storage.local.set({ isAutomationRunning: false }, () => {
    console.log('Automation state saved: stopped');
  });
};

// Initialize state when content script loads
const initializeState = async () => {
  try {
    // First initialize the Supabase client with stored session
    const isAuthenticated = await initSupabaseClient();
    console.log('Supabase client initialized, authenticated:', isAuthenticated);

    if (!isAuthenticated) {
      console.error('Failed to initialize Supabase client - please sign in to the extension');
      return;
    }

    chrome.storage.local.get(['isAutomationRunning', 'userData'], (result) => {
      if (result.isAutomationRunning) {
        console.log('Restoring automation state: running');
        userData = result.userData;
        startAutomation();
      } else {
        console.log('Restoring automation state: stopped');
        isRunning = false;
        continuing = false;
      }
    });
  } catch (error) {
    console.error('Error during initialization:', error);
  }
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((
  message: MessageType,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: ResponseType) => void
) => {
  if (message.type === 'START_AUTOMATION') {
    startAutomation();
    sendResponse({ isRunning: true, success: true });
  } else if (message.type === 'STOP_AUTOMATION') {
    stopAutomation();
    sendResponse({ isRunning: false, success: true });
  } else if (message.type === 'GET_STATE') {
    sendResponse({ isRunning });
  } else if (message.type === 'AUTH_STATE_CHANGED') {
    // Reinitialize the Supabase client when auth state changes
    console.log('Received auth state change notification');
    initSupabaseClient().then(isAuthenticated => {
      console.log('Reinitialized Supabase client, authenticated:', isAuthenticated);
      if (!isAuthenticated && isRunning) {
        // Stop automation if we're no longer authenticated
        stopAutomation();
      }
    });
    sendResponse({ success: true });
  }
  return true;
});

// Add cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (isRunning) {
    stopAutomation();
  }
});

// Initialize state when content script loads
initializeState(); 