import { MessageType, ResponseType, SELECTORS, UserProfile } from '../types';

let isRunning = false;
let automationInterval: number | null = null;
let userData: UserProfile | null = null;
let continuing = false;

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
  // Specifically look for jobs in the search results list
  const jobsList = document.querySelector('.jobs-search-results-list');
  if (!jobsList) {
    console.log('Could not find jobs list');
    return null;
  }

  // Get all job cards within the search results list
  const jobCards = jobsList.querySelectorAll('.job-card-container:not([data-applied="true"])');
  
  for (const card of jobCards) {
    const jobCard = card as HTMLElement;
    
    // Skip if not visible
    if (!isElementVisible(jobCard)) {
      continue;
    }

    // Skip if already applied
    if (isJobAlreadyApplied(jobCard)) {
      console.log('Skipping already applied job');
      markJobAsApplied(jobCard);
      continue;
    }

    return jobCard;
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
  try {
    // Find the job card list item
    const jobCard = jobElement.closest('.jobs-search-results__list-item');
    if (!jobCard) {
      console.log('Could not find job card container');
      return false;
    }

    // Click the job card itself to show details in the right panel
    jobCard.click();
    
    // Alternative approach if direct click doesn't work
    const jobLink = jobCard.querySelector('.job-card-container__link');
    if (jobLink) {
      // Prevent default navigation
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      
      // This will show the job details in the right panel without navigation
      return jobLink.dispatchEvent(clickEvent);
    }

    return true;
  } catch (error) {
    console.error('Error clicking job:', error);
    return false;
  }
};

const areAllFieldsFilled = async (): Promise<boolean> => {
  // Check all visible required fields
  const requiredFields = document.querySelectorAll('input[required], textarea[required], select[required]');
  const emptyFields = Array.from(requiredFields).filter(field => {
    const element = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    return isElementVisible(element as HTMLElement) && isFieldEmpty(element);
  });

  if (emptyFields.length > 0) {
    console.log(`Found ${emptyFields.length} empty required fields`);
    return false;
  }

  return true;
};

const processApplication = async () => {
  try {
    // Make sure we're in the search results view
    const searchResults = document.querySelector('.jobs-search-results-list');
    if (!searchResults) {
      console.log('Not in search results view, stopping automation');
      return;
    }

    // Find the next job to apply to
    const nextJob = findNextJob();
    if (!nextJob) {
      console.log('No more jobs found to apply to');
      return;
    }

    // Scroll the job into view in the list
    scrollToJob(nextJob);
    await sleep(1000);

    // Click the job card to show details in right panel
    if (!clickJob(nextJob)) {
      console.log('Could not click the job card');
      return;
    }

    await sleep(2000); // Wait for job details to load

    // Click Easy Apply button
    const applied = await clickElement(SELECTORS.EASY_APPLY_BUTTON);
    if (!applied) {
      console.log('No Easy Apply button found');
      return;
    }

    await sleep(1000); // Wait for modal to open

    // Keep clicking next until we reach submit or review
    continuing = true;
    let retryCount = 0;
    const maxRetries = 3;

    while (continuing && isRunning) {
      if (!isRunning) {
        console.log('Automation stopped, ending process');
        continuing = false;
        break;
      }

      await sleep(1000);

      // Try to fill form fields on each step
      await fillFormFields();
      
      // Wait for fields to be filled and check if all required fields are filled
      await sleep(1000);
      const fieldsAreFilled = await areAllFieldsFilled();
      
      if (!fieldsAreFilled) {
        console.log('Waiting for all required fields to be filled...');
        retryCount++;
        if (retryCount >= maxRetries) {
          console.log('Max retries reached waiting for fields to be filled');
          continuing = false;
        }
        await sleep(1000);
        continue;
      }

      // Now check for Review button
      const reviewed = await clickAnyElement(SELECTORS.REVIEW_BUTTON);
      if (reviewed) {
        console.log('Clicked review button');
        await sleep(2000); // Wait longer for review page to load
        
        // Check if all fields are filled in review page
        const reviewFieldsFilled = await areAllFieldsFilled();
        if (!reviewFieldsFilled) {
          console.log('Review page has empty required fields, waiting...');
          continue;
        }
        
        const submitted = await clickElement(SELECTORS.SUBMIT_BUTTON);
        if (submitted) {
          console.log('Application submitted successfully');
          continuing = false;
          await sleep(1000);
          await clickElement(SELECTORS.CLOSE_BUTTON);
          // Mark the job as applied
          markJobAsApplied(nextJob);
          // Wait for configured delay before moving to next job
          const delay = userData?.settings?.nextJobDelay || 5000;
          console.log(`Waiting ${delay/1000} seconds before next job...`);
          await sleep(delay);
        } else {
          // If submit button isn't immediately visible after review, wait and retry
          retryCount++;
          if (retryCount >= maxRetries) {
            console.log('Max retries reached for submit button');
            continuing = false;
          }
          await sleep(1000);
        }
      } else {
        // If no review button, try next or submit
        const submitted = await clickElement(SELECTORS.SUBMIT_BUTTON);
        if (submitted) {
          console.log('Application submitted successfully');
          continuing = false;
          await sleep(1000);
          await clickElement(SELECTORS.CLOSE_BUTTON);
          // Mark the job as applied
          markJobAsApplied(nextJob);
          // Wait for configured delay before moving to next job
          const delay = userData?.settings?.nextJobDelay || 5000;
          console.log(`Waiting ${delay/1000} seconds before next job...`);
          await sleep(delay);
        } else {
          // Only try next button if all fields are filled
          console.log('Attempting to click next button...');
          const hasNext = await clickAnyElement(SELECTORS.NEXT_BUTTON);
          if (hasNext) {
            console.log('Successfully clicked next button');
            retryCount = 0; // Reset retry count on successful next click
            await sleep(1000); // Wait for next page to load
          } else {
            console.log('No next button found, retrying...');
            retryCount++;
            if (retryCount >= maxRetries) {
              console.log('Max retries reached for navigation');
              continuing = false;
            }
            await sleep(1000);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error during application process:', error);
    continuing = false;
  }
};

const startAutomation = () => {
  console.log('Starting automation...');
  isRunning = true;
  continuing = false; // Reset the continuing flag
  
  // Store the running state
  chrome.storage.local.set({ isAutomationRunning: true }, () => {
    console.log('Automation state saved: running');
  });
  
  // Clear any existing interval first
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

    if (!continuing) { // Only start a new process if not currently running one
      await processApplication();
    }
  }, 3000); // Process every 3 seconds instead of 5
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
const initializeState = () => {
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
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((
  message: MessageType,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: ResponseType) => void
) => {
  if (message.type === 'START_AUTOMATION') {
    // Get user data before starting automation
    chrome.storage.local.get(['userData'], (result) => {
      userData = result.userData;
      startAutomation();
      sendResponse({ success: true, isRunning: true });
    });
  } else if (message.type === 'STOP_AUTOMATION') {
    stopAutomation();
    sendResponse({ success: true, isRunning: false });
  } else if (message.type === 'GET_STATE') {
    // Get the current state from storage to ensure consistency
    chrome.storage.local.get(['isAutomationRunning'], (result) => {
      sendResponse({ 
        success: true, 
        isRunning: result.isAutomationRunning || false 
      });
    });
  }
  return true; // Required for async response
});

// Add cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (isRunning) {
    stopAutomation();
  }
});

// Initialize state when content script loads
initializeState(); 