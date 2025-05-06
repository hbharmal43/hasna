import { MessageType, ResponseType, SELECTORS, UserProfile } from '../types';
import { trackJobApplication, getSession, getCurrentUser, initSupabaseClient } from '../lib/supabase';

let isRunning = false;
let automationInterval: number | null = null;
let userData: UserProfile | null = null;
let continuing = false;
// Track job IDs that have already been processed to avoid duplicates
const appliedJobIds = new Set<string>();
// Track jobs with 409 Conflict errors to avoid logging multiple times
const skipped409Jobs = new Set<string>();

// Save the original fetch function
const originalFetch = window.fetch;

// Patch the fetch API to intercept LinkedIn API calls and handle 409 errors
window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
  // Check if this is a LinkedIn Easy Apply API request
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.toString();
  } else if ('url' in input) {
    // It's a Request object
    url = input.url;
  }
  
  if (url.includes('voyagerJobsDashOnsiteApplyApplication') && init?.method === 'POST') {
    try {
      // Extract the job ID from the URL or body
      let jobId = '';
      try {
        if (init.body) {
          const bodyText = init.body.toString();
          // Try to extract the job ID from the request body
          const match = bodyText.match(/jobId=(\d+)/);
          if (match && match[1]) {
            jobId = match[1];
          }
        }
        
        if (!jobId) {
          // Try to extract from URL
          const urlMatch = url.match(/jobId=(\d+)/);
          if (urlMatch && urlMatch[1]) {
            jobId = urlMatch[1];
          }
        }
      } catch (e) {
        // Ignore parsing errors, just continue
      }
      
      // Make the actual request
      const response = await originalFetch(input, init);
      
      // If we get a 409 Conflict and have a job ID
      if (response.status === 409 && jobId) {
        if (!skipped409Jobs.has(jobId)) {
          console.log(`🔁 Skipping already-applied job ID: ${jobId}`);
          skipped409Jobs.add(jobId);
          
          // Persist to Chrome storage
          chrome.storage.local.get(['skipped409Jobs'], result => {
            const storedIds = result.skipped409Jobs || [];
            if (!storedIds.includes(jobId)) {
              storedIds.push(jobId);
              chrome.storage.local.set({ skipped409Jobs: storedIds });
            }
          });
        }
      }
      
      return response;
    } catch (error) {
      return await originalFetch(input, init);
    }
  }
  
  // For all other requests, just pass through to the original fetch
  return await originalFetch(input, init);
};

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
      element.click();
      return true;
    }
  }

  // Then try finding buttons by text content
  const buttonTexts = ['Next', 'Continue', 'Review'];
  for (const text of buttonTexts) {
    const button = findButtonByText(text);
    if (button) {
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
  return element.value.trim().length === 0;
};

const hasValidationErrors = (element: HTMLElement): boolean => {
  // Check for LinkedIn's error classes
  return element.classList.contains('artdeco-text-input--error') || 
         element.getAttribute('aria-invalid') === 'true' ||
         !!element.closest('.artdeco-text-input--error');
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

// Remove all the input listeners - we don't need them
const setupInputListeners = () => {
  // No listeners needed
};

const isNumericField = (element: HTMLElement): boolean => {
  // Check if it's a numeric input field by class and label
  const formComponent = element.closest('[data-test-single-line-text-form-component]');
  if (!formComponent) return false;

  const input = formComponent.querySelector('input');
  const label = formComponent.querySelector('label')?.textContent?.toLowerCase() || '';
  
  // Check if input has numeric-specific ID
  const isNumericInput = input?.id?.includes('numeric') || false;
  
  // Also check label text as backup
  const hasNumericLabel = label.includes('year') || 
                         label.includes('number') || 
                         label.includes('count') || 
                         label.includes('amount');
  
  return isNumericInput || hasNumericLabel;
};

const isChoiceField = (element: HTMLElement): boolean => {
  // Check if it's a radio button/choice field
  return !!element.closest('[data-test-form-builder-radio-button-form-component]');
};

const isSalaryField = (element: HTMLElement): boolean => {
  const label = element.querySelector('label')?.textContent?.toLowerCase() || '';
  return label.includes('salary') || 
         label.includes('compensation') || 
         label.includes('pay') ||
         label.includes('wage');
};

const isNameField = (element: HTMLElement): boolean => {
  const label = element.querySelector('label')?.textContent?.toLowerCase() || '';
  return label.includes('name') || 
         label.includes('full') || 
         label.includes('first') || 
         label.includes('last');
};

const isTextInputField = (element: HTMLElement): boolean => {
  // Check if it's a text input field by class
  const formComponent = element.closest('[data-test-single-line-text-form-component]');
  if (!formComponent) return false;

  const input = formComponent.querySelector('input');
  // If input has numeric in ID, it's not a text field
  if (input?.id?.includes('numeric')) return false;
  
  return true;
};

// Create a function to wait for user to finish typing
const waitForUserFinishTyping = (element: HTMLElement, timeout = 2000): Promise<void> => {
  return new Promise((resolve) => {
    let timer: NodeJS.Timeout;
    let isTyping = false;

    const resetTimer = () => {
      isTyping = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        isTyping = false;
        element.removeEventListener('keydown', resetTimer);
        element.removeEventListener('input', resetTimer);
        console.log('User finished typing');
        resolve();
      }, timeout);
    };

    element.addEventListener('keydown', resetTimer);
    element.addEventListener('input', resetTimer);
    
    // Also resolve if element loses focus
    element.addEventListener('blur', () => {
      clearTimeout(timer);
      element.removeEventListener('keydown', resetTimer);
      element.removeEventListener('input', resetTimer);
      resolve();
    }, { once: true });
    
    // Start the timer initially in case user doesn't type
    resetTimer();
  });
};

const waitForFormCompletion = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    let isTyping = false;
    let typingTimer: NodeJS.Timeout;
    let userInteractionInProgress = false;
    
    // Function to check if user is currently interacting with any field
    const checkUserInteraction = () => {
      const activeElement = document.activeElement;
      if (activeElement && 
          (activeElement.tagName === 'INPUT' || 
           activeElement.tagName === 'TEXTAREA' || 
           activeElement.tagName === 'SELECT')) {
        return true;
      }
      return false;
    };
    
    const checkFields = async () => {
      // If user is currently interacting with a field, wait
      if (checkUserInteraction()) {
        if (!userInteractionInProgress) {
          userInteractionInProgress = true;
          console.log('User interaction detected, waiting for completion...');
          
          // Wait for the user to finish typing or interacting
          const activeElement = document.activeElement as HTMLElement;
          await waitForUserFinishTyping(activeElement, 2000);
          
          userInteractionInProgress = false;
          console.log('User interaction completed, continuing checks');
          
          // Run check again after interaction finishes
          setTimeout(checkFields, 500);
          return;
        }
        return; // Don't proceed with checks while waiting for user
      }
      
      // Find all required fields using LinkedIn's required field indicators
      const requiredFields = document.querySelectorAll([
        // Text inputs with required indicator
        'label:has(span.artdeco-button__text--required) + input',
        'label:has(span.required) + input',
        // Radio button groups with required indicator
        'fieldset:has(legend span.artdeco-button__text--required) input[type="radio"]',
        // Backup selectors for LinkedIn's various required field styles
        '[data-test-single-line-text-form-component] input[required]',
        '[data-test-form-builder-radio-button-form-component] input[aria-required="true"]',
        '.artdeco-text-input--required input',
        '.fb-dash-form-element__label--is-required input'
      ].join(','));

      if (requiredFields.length === 0) {
        console.log('No required fields found, proceeding immediately');
        resolve(true);
        return;
      }

      // Group radio buttons by name attribute
      const radioGroups = new Map<string, HTMLInputElement[]>();
      const textInputs: HTMLInputElement[] = [];

      requiredFields.forEach(field => {
        const input = field as HTMLInputElement;
        if (!isElementVisible(input as HTMLElement)) return;

        if (input.type === 'radio') {
          const name = input.name;
          if (!radioGroups.has(name)) {
            radioGroups.set(name, []);
          }
          radioGroups.get(name)?.push(input);
        } else {
          textInputs.push(input);
        }
      });

      // Check if any text input is empty or has validation errors
      const textInputsValid = textInputs.every(input => {
        const value = input.value.trim();
        const hasError = hasValidationErrors(input);
        return value.length > 0 && !hasError;
      });

      // Check if all required radio groups have a selection
      const radioGroupsValid = Array.from(radioGroups.values()).every(group => 
        group.some(radio => radio.checked)
      );

      // If all fields are already filled, resolve immediately
      if (textInputsValid && radioGroupsValid) {
        console.log('All required fields are already filled, proceeding immediately');
        clearTimeout(typingTimer);
        // Still wait a small amount of time (300ms) before resolving to allow form validation to complete
        setTimeout(() => resolve(true), 300);
        return;
      }

      // Only continue waiting if not all fields are filled
      if (!textInputsValid || !radioGroupsValid) {
        // Schedule to check fields again in 500ms
        clearTimeout(typingTimer);
        typingTimer = setTimeout(checkFields, 500);
      }
    };

    // Add input event listeners to track typing
    const handleInput = () => {
      isTyping = true;
      clearTimeout(typingTimer);
      // Wait 1 second after user stops typing
      typingTimer = setTimeout(() => {
        isTyping = false;
        checkFields();
      }, 1000);
    };

    // Add input listeners to all text inputs
    document.querySelectorAll('input[type="text"], input:not([type]), textarea').forEach(input => {
      input.addEventListener('input', handleInput);
    });

    // Add change listeners to radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', checkFields);
    });

    // Check fields immediately in case they're already filled
    checkFields();

    // Cleanup function
    const cleanup = () => {
      clearTimeout(typingTimer);
      document.querySelectorAll('input, textarea').forEach(input => {
        input.removeEventListener('input', handleInput);
        input.removeEventListener('change', checkFields);
      });
    };

    // Cleanup after 3 minutes to prevent memory leaks (reduced from 5 minutes)
    setTimeout(() => {
      cleanup();
      resolve(false);
    }, 180000);
  });
};

const fillFormFields = async (): Promise<boolean> => {
  try {
    // Find all required fields using LinkedIn's specific classes
    const formFields = document.querySelectorAll([
      '[data-test-single-line-text-form-component] input[required]',
      '[data-test-form-builder-radio-button-form-component] input[aria-required="true"]',
      '.artdeco-text-input--required input',
      '.fb-dash-form-element__label--is-required input'
    ].join(','));

    const requiredFields = Array.from(formFields).filter(field => 
      isElementVisible(field as HTMLElement)
    );
    
    if (requiredFields.length === 0) {
      return true; // No required fields found
    }

    // Check if any field is empty
    const emptyFields = requiredFields.filter(field => 
      isFieldEmpty(field as HTMLInputElement)
    );

    if (emptyFields.length === 0) {
      return true; // All fields are filled
    }

    return false; // Some fields are still empty
  } catch (error) {
    return false;
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
  // Get all visible job cards on the current page
  const jobCards = Array.from(document.querySelectorAll(SELECTORS.JOB_CARD));
  
  // Look for the next non-applied job
  for (const jobCard of jobCards) {
    const card = jobCard as HTMLElement;
    
    // Skip if not visible
    if (!isElementVisible(card)) {
      continue;
    }

    // Skip if already applied
    if (card.getAttribute('data-applied') === 'true' || isJobAlreadyApplied(card)) {
      continue;
    }

    // Found a job to apply to
    return card;
  }

  // No jobs found to apply to
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
        return false;
      }
    }
  }

  // Check for any error messages on the page
  const errorMessages = document.querySelectorAll('.artdeco-inline-feedback--error');
  if (errorMessages.length > 0) {
    return false;
  }

  return true;
};

const verifySession = async () => {
  // Simply return true without extensive checking
  // This assumes the user is logged in based on previous auth
  return true;
};

const trackSuccessfulApplication = async (jobTitle: string, companyName: string, jobElement: HTMLElement) => {
  try {
    // Get the job ID from either the closest parent with data-job-id or from the URL
    const jobId = jobElement.closest('[data-job-id]')?.getAttribute('data-job-id') || 
                  window.location.href.match(/\/view\/(\d+)\//)?.[1];
                 
    if (!jobId) {
      console.log('❌ Could not extract job ID for tracking');
      return false;
    }
    
    // Check if this job has already been processed in this session
    if (appliedJobIds.has(jobId)) {
      console.log(`⏭️ Job ${jobId} already processed in this session. Skipping.`);
      return true;
    }
    
    // Mark job as processed immediately to prevent duplicate processing
    appliedJobIds.add(jobId);
    
    // Mark job as applied in the DOM immediately
    jobElement.setAttribute('data-applied', 'true');
    
    // Also mark any other instances of this job as applied right away
    document.querySelectorAll(`[data-job-id="${jobId}"]`).forEach(card => {
      card.setAttribute('data-applied', 'true');
    });
    
    console.log(`📝 Tracking application for "${jobTitle}" at "${companyName}" (ID: ${jobId})`);
    
    // Add the job ID to Chrome storage for persistence
    chrome.storage.local.get(['appliedJobIds'], result => {
      const storedIds = result.appliedJobIds || [];
      storedIds.push(jobId);
      chrome.storage.local.set({ appliedJobIds: [...new Set(storedIds)] });
    });
    
    // Get additional job details
    const locationElement = document.querySelector('.job-details-jobs-unified-top-card__bullet');
    const workTypeElement = document.querySelector('.job-details-jobs-unified-top-card__workplace-type');
    const salaryElement = document.querySelector('.job-details-jobs-unified-top-card__salary-range');
    const descriptionElement = document.querySelector('.jobs-description');
    const companyUrlElement = document.querySelector('.job-details-jobs-unified-top-card__company-name a');
    
    // Get location data safely
    let location = locationElement?.textContent?.trim() || '';
    
    // Get work type data safely
    let workType = 'onsite'; // default
    if (workTypeElement) {
      const workTypeText = workTypeElement.textContent?.trim()?.toLowerCase() || '';
      if (workTypeText.includes('remote')) {
        workType = 'remote';
      } else if (workTypeText.includes('hybrid')) {
        workType = 'hybrid';
      }
    }
    
    // Get salary data safely
    let salaryMin = null;
    let salaryMax = null;
    if (salaryElement) {
      const salaryText = salaryElement.textContent?.trim() || '';
      const numbers = salaryText.match(/\d+/g);
      if (numbers && numbers.length >= 1) {
        salaryMin = parseInt(numbers[0]) || null;
        if (numbers.length > 1) {
          salaryMax = parseInt(numbers[1]) || null;
        }
      }
    }
    
    // Try to save the application to the database
    const result = await trackJobApplication(jobTitle, companyName, {
      linkedin_job_id: jobId,
      location: location,
      work_type: workType as 'onsite' | 'remote' | 'hybrid',
      salary_min: salaryMin,
      salary_max: salaryMax,
      salary_currency: 'USD',
      job_description: descriptionElement?.textContent?.trim() || '',
      company_url: companyUrlElement?.getAttribute('href') || undefined
    });

    if (result) {
      console.log(`✅ Successfully tracked application for "${jobTitle}" at "${companyName}"`);
      return true;
    } else {
      console.log(`⚠️ Failed to track application in database but continuing`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error tracking application:`, error);
    // Still return true to continue the application process
    return true;
  }
};

const handleButtonClick = async (jobTitle: string, companyName: string, jobElement: HTMLElement) => {
  // First try to find submit button within the modal
  const modal = document.querySelector('.artdeco-modal__content.jobs-easy-apply-modal__content');
  if (!modal) return false;

  const submitButton = modal.querySelector('button[aria-label="Submit application"]') as HTMLElement;
  if (submitButton && isElementVisible(submitButton)) {
    await sleep(500);
    submitButton.click();
    
    // Track the successful application
    await trackSuccessfulApplication(jobTitle, companyName, jobElement);
    
    // Wait 1 second after submit click
    await sleep(1000);
    
    // Look for and click the close button
    const closeButton = document.querySelector('button[aria-label="Dismiss"].artdeco-modal__dismiss');
    if (closeButton && isElementVisible(closeButton as HTMLElement)) {
      await sleep(500);
      (closeButton as HTMLElement).click();
    }
    
    return true;
  }

  // Try review button within the modal
  const reviewButton = modal.querySelector('button[aria-label="Review your application"]') as HTMLElement;
  if (reviewButton && isElementVisible(reviewButton)) {
    await sleep(500);
    reviewButton.click();
    return true;
  }

  // Try next button within the modal
  const nextButton = modal.querySelector('button[aria-label="Continue to next step"]') as HTMLElement;
  if (nextButton && isElementVisible(nextButton)) {
    await sleep(500);
    nextButton.click();
    return true;
  }

  // Try finding any primary button with Next text within the modal
  const primaryButtons = modal.querySelectorAll('.artdeco-button--primary');
  for (const button of primaryButtons) {
    if (isElementVisible(button as HTMLElement)) {
      const text = button.textContent?.trim().toLowerCase() || '';
      if (text.includes('next') || text.includes('continue')) {
        (button as HTMLElement).click();
        return true;
      }
    }
  }

  return false;
};

const handleSaveApplicationPopup = async (): Promise<boolean> => {
  // Look for any button with the specific data-control-name for discard
  const discardButton = document.querySelector('button[data-control-name="discard_application_confirm_btn"]');
  
  if (discardButton && isElementVisible(discardButton as HTMLElement)) {
    (discardButton as HTMLElement).click();
    await sleep(500);
    return true;
  }

  return false;
};

// Function to click on the next page number button
const clickNextPageNumber = async (): Promise<boolean> => {
  try {
    // Look for pagination container from screenshot
    const paginationContainer = document.querySelector('.jobs-search-pagination');
    if (!paginationContainer) {
      console.log("Could not find pagination container");
    } else {
      console.log("Found pagination container");
    }
    
    // Method 1: Try to find the current active page
    const activePageButton = document.querySelector('button[aria-current="page"]');
    if (activePageButton) {
      // Get the current page number
      const currentPageSpan = activePageButton.querySelector('span');
      if (currentPageSpan) {
        // Parse the current page number and calculate the next page number
        const currentPage = parseInt(currentPageSpan.textContent || "1", 10);
        const nextPage = currentPage + 1;
        console.log(`Current page: ${currentPage}, looking for page ${nextPage} button`);
        
        // Find all page buttons
        const pageButtons = document.querySelectorAll('button[aria-label^="Page"]');
        
        // Look for the button with the next page number
        for (const button of pageButtons) {
          const span = button.querySelector('span');
          if (span && span.textContent?.trim() === String(nextPage)) {
            console.log(`Found page ${nextPage} button, clicking...`);
            (button as HTMLElement).click();
            return true;
          }
        }
        
        // Alternative approach: look for specific button with aria-label="Page X"
        const nextPageButton = document.querySelector(`button[aria-label="Page ${nextPage}"]`);
        if (nextPageButton && isElementVisible(nextPageButton as HTMLElement)) {
          console.log(`Found page ${nextPage} button by aria-label, clicking...`);
          (nextPageButton as HTMLElement).click();
          return true;
        }
      }
    }
    
    // Method 2: Direct approach - try to find any numbered page buttons
    const pageNumbers = document.querySelectorAll('.jobs-search-pagination__indicator-button, li.jobs-search-pagination__indicator button');
    const pageNumbersArray = Array.from(pageNumbers);
    console.log(`Found ${pageNumbersArray.length} page number buttons`);
    
    // Find active page
    let activePageIndex = -1;
    let nextPageElement = null;
    
    // Try to find the active page by checking aria-current or CSS classes
    for (let i = 0; i < pageNumbersArray.length; i++) {
      const button = pageNumbersArray[i] as HTMLElement;
      
      // Check if this is the active page 
      if (button.getAttribute('aria-current') === 'page' || 
          button.classList.contains('active') || 
          button.classList.contains('jobs-search-pagination__indicator-button--active') ||
          button.classList.contains('jobs-search-pagination__indicator-button--selected')) {
        activePageIndex = i;
        break;
      }
      
      // Also check parent li if button is inside a list item
      const parentLi = button.closest('li');
      if (parentLi && (
        parentLi.classList.contains('active') || 
        parentLi.classList.contains('jobs-search-pagination__indicator--active') ||
        parentLi.classList.contains('selected'))) {
        activePageIndex = i;
        break;
      }
    }
    
    // If we found the active page, click the next one
    if (activePageIndex !== -1 && activePageIndex < pageNumbersArray.length - 1) {
      nextPageElement = pageNumbersArray[activePageIndex + 1] as HTMLElement;
      console.log(`Found next page element at index ${activePageIndex + 1}`);
      nextPageElement.click();
      return true;
    }
    
    // Method 3: From screenshot - try to find numbered pagination buttons (1, 2, 3, ...)
    // Look through all buttons with spans containing just numbers
    const allButtons = document.querySelectorAll('button');
    for (const button of allButtons) {
      const span = button.querySelector('span');
      if (span && /^\d+$/.test(span.textContent?.trim() || '')) {
        const pageNum = parseInt(span.textContent?.trim() || '0', 10);
        console.log(`Found numeric page button: ${pageNum}`);
        
        // Check if this might be the next page
        const isCurrentPage = button.getAttribute('aria-current') === 'page' || 
                             button.classList.contains('jobs-search-pagination__indicator-button--active');
        
        if (!isCurrentPage && pageNum > 1) {
          console.log(`Clicking numeric page button: ${pageNum}`);
          (button as HTMLElement).click();
          return true;
        }
      }
    }
    
    // Method 4: Last resort - find any "Next" or pagination arrow button
    const nextButtons = [
      document.querySelector('button[aria-label="Next"]'),
      document.querySelector('button.artdeco-pagination__button--next'),
      document.querySelector('.jobs-search-pagination__button--next'),
      document.querySelector('button[aria-label="Next page"]'),
      // Try to find by child SVG 
      document.querySelector('button svg[data-test-icon="chevron-right-small"]')?.closest('button'),
      // Try to find by class or ID containing "next"
      document.querySelector('button[id*="next" i]'),
      document.querySelector('button[class*="next" i]'),
      // From your screenshot - the ember button
      document.querySelector('button#ember289, button[id^="ember"][id$="next"]')
    ];
    
    for (const button of nextButtons) {
      if (button && isElementVisible(button as HTMLElement)) {
        console.log("Found next button by alternative selector, clicking...");
        (button as HTMLElement).click();
        return true;
      }
    }
    
    console.log("Could not find any page navigation buttons");
    return false;
  } catch (error) {
    console.error("Error in clickNextPageNumber:", error);
    return false;
  }
};

/**
 * Dynamically detects the scrollable job list container based on structure and behavior
 * instead of relying on hardcoded class names.
 * @returns The scrollable container div element or null if not found
 */
const findScrollableJobListContainer = (): HTMLElement | null => {
  const allDivs = Array.from(document.querySelectorAll('div'));

  for (const div of allDivs) {
    const style = window.getComputedStyle(div);

    // Must be scrollable vertically
    const isScrollableY =
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      div.scrollHeight > div.clientHeight;

    // Must contain at least 5 <li> job cards inside
    const jobItems = div.querySelectorAll(
      'li.scaffold-layout__list-item, li.jobs-search-results__list-item, li[class*="job-card-search"]'
    );

    if (isScrollableY && jobItems.length >= 5) {
      console.log("✅ Found scrollable job container:", div);
      console.log("📦 ClassName:", div.className);
      localStorage.setItem("lastSuccessfulScrollClass", div.className); // optional debug
      return div;
    }
  }

  console.warn("❌ Could not detect scrollable job list container");
  return null;
};

const processApplication = async () => {
  try {
    while (isRunning) {
      // Check for save application popup first
      if (await handleSaveApplicationPopup()) {
        await sleep(250);
      }

      const nextJob = findNextJob();
      
      if (!nextJob) {
        console.log("No job found, attempting to scroll for more jobs");
        
        // Use dynamic detection instead of hardcoded selectors
        let jobList = findScrollableJobListContainer();
        
        let scrollPerformed = false;
        
        if (jobList) {
          // Calculate a smooth scrolling amount (about 70% of viewport height)
          const scrollAmount = window.innerHeight * 0.5;
          const currentScrollTop = jobList.scrollTop;
          
          // Only scroll if we're not already at the bottom
          const isAtBottom = jobList.scrollHeight - jobList.scrollTop <= jobList.clientHeight + 50;
          
          if (!isAtBottom) {
            console.log(`Scrolling job list by ${scrollAmount}px to load more jobs (scrollTop: ${currentScrollTop}, scrollHeight: ${jobList.scrollHeight})`);
            
            // Force scroll upward first to trigger LinkedIn's job loading
            jobList.scrollTo({
              top: Math.max(0, currentScrollTop - 100),
              behavior: 'smooth'
            });
            
            await sleep(1000);
            
            // Then scroll down more
            jobList.scrollTo({
              top: currentScrollTop + scrollAmount,
              behavior: 'smooth'
            });
            
            scrollPerformed = true;
          } else {
            console.log("Reached bottom of job list, trying to click next page number");
            
            // We're at the bottom of the list, try to click the next page number button
            if (await clickNextPageNumber()) {
              console.log("Successfully clicked next page number");
              await sleep(3000); // Wait for next page to load
              continue;
            } else {
              // Fall back to the old method if page number navigation fails
              console.log("Falling back to 'Next' button");
              const nextPageButton = document.querySelector('button[aria-label="Next"]');
              if (nextPageButton && isElementVisible(nextPageButton as HTMLElement)) {
                console.log("Clicking next page button");
                (nextPageButton as HTMLElement).click();
                await sleep(3000); // Wait for next page to load
                continue;
              } else {
                console.log("No pagination buttons found");
              }
            }
          }
        } else {
          console.log("Could not find the job list element, trying direct window scroll");
          
          // If we couldn't find the job list, try scrolling the window directly
          window.scrollBy({
            top: window.innerHeight * 0.7,
            behavior: 'smooth'
          });
          
          scrollPerformed = true;
        }
        
        // Wait longer for jobs to load after scrolling
        if (scrollPerformed) {
          await sleep(3000);
            
          // Check if scrolling loaded any new jobs
          const newNextJob = findNextJob();
          if (newNextJob) {
            console.log("Found new job after scrolling");
            continue; // Skip to next iteration to process this job
          }
        }
        
        console.log("Waiting before next job check");
        await sleep(2000); // Only 2 seconds wait when no jobs found
        continue;
      }

      try {
        console.log("Processing job: " + nextJob.textContent?.substring(0, 30)?.trim());
        scrollToJob(nextJob);
        await sleep(1000); // Reduced from 2000ms

        if (!clickJob(nextJob)) {
          console.log("Failed to click job, moving to next");
          // Mark this job as applied so we don't get stuck on it
          markJobAsApplied(nextJob);
          continue;
        }
        await sleep(1000); // Reduced from 2000ms
        
        if (!await clickElement(SELECTORS.EASY_APPLY_BUTTON)) {
          console.log("Failed to click Easy Apply button, moving to next job");
          // Mark this job as applied so we don't get stuck on it
          markJobAsApplied(nextJob);
          continue;
        }

        // Get job details
        const jobTitleElement = document.querySelector('.t-24.job-details-jobs-unified-top-card__job-title');
        const companyElement = document.querySelector('.job-details-jobs-unified-top-card__company-name');
        
        const jobTitle = jobTitleElement?.textContent?.trim() || 'Unknown Position';
        const companyName = companyElement?.textContent?.trim() || 'Unknown Company';
        console.log(`Applying to: ${jobTitle} at ${companyName}`);

        continuing = true;
        let retryCount = 0;
        const maxRetries = 3;
        let currentFormCompleted = false;

        // Main application loop - stays on current form until completed
        while (continuing && isRunning) {
          // Check for save application popup
          if (await handleSaveApplicationPopup()) {
            await sleep(250); // Reduced from 500ms
            continue;
          }

          // Display a message to the user that they can interact with the form
          const formElement = document.querySelector('.jobs-easy-apply-modal__content');
          if (formElement) {
            console.log("✍️ Form is ready - you can fill in fields and the script will wait for you to finish");
          }

          // Wait for form completion (user filling fields)
          console.log("Waiting for form completion...");
          const formCompleted = await waitForFormCompletion();
          
          if (!formCompleted) {
            console.log("Form completion timed out");
            continuing = false;
            // Make sure to click close button before breaking
            await clickElement(SELECTORS.CLOSE_BUTTON);
            break;
          }
          
          console.log("All fields filled, proceeding to next step");
          
          // Try to click next/submit button
          const buttonClicked = await handleButtonClick(jobTitle, companyName, nextJob);
          
          if (!buttonClicked) {
            retryCount++;
            console.log(`Failed to click button, retry ${retryCount}/${maxRetries}`);
            if (retryCount >= maxRetries) {
              await clickElement(SELECTORS.CLOSE_BUTTON);
              continuing = false;
              break;
            }
            await sleep(500); // Reduced from 1000ms
            continue;
          }

          // Reset retry count after successful button click
          retryCount = 0;
          
          // Wait for new form to load or submit to complete
          await sleep(1000); // Reduced from 2000ms
          
          // Check if we're still in the application modal
          const modal = document.querySelector('.artdeco-modal__content.jobs-easy-apply-modal__content');
          if (!modal) {
            console.log("Application completed successfully");
            currentFormCompleted = true;
            break;
          }

          // After clicking any button, check for save popup
          if (buttonClicked) {
            await sleep(250); // Reduced from 500ms
            if (await handleSaveApplicationPopup()) {
              await sleep(250); // Reduced from 500ms
            }
          }
        }

        // Only mark as applied if we completed the application
        if (currentFormCompleted) {
          console.log("Application successfully completed, waiting before moving to next job");
          // Note: We don't need to call markJobAsApplied here since it's already handled in trackSuccessfulApplication
          await sleep(1500); // Reduced from 3000ms - wait before moving to next job
        } else {
          console.log("Application not completed, closing modal");
          // Make sure to click close button here as well
          await clickElement(SELECTORS.CLOSE_BUTTON);
          
          // Still mark the job as applied to avoid getting stuck
          // Get the job ID if possible
          const jobId = nextJob.closest('[data-job-id]')?.getAttribute('data-job-id') || 
                      window.location.href.match(/\/view\/(\d+)\//)?.[1];
          
          if (jobId && !appliedJobIds.has(jobId)) {
            // Add to our tracking set
            appliedJobIds.add(jobId);
            
            // Mark in DOM
            markJobAsApplied(nextJob);
            
            // Add to storage
            chrome.storage.local.get(['appliedJobIds'], result => {
              const storedIds = result.appliedJobIds || [];
              storedIds.push(jobId);
              chrome.storage.local.set({ appliedJobIds: [...new Set(storedIds)] });
            });
          } else {
            // Just mark in DOM if we can't get the ID
            markJobAsApplied(nextJob);
          }
        }

      } catch (error) {
        console.error("Error during application process:", error);
        // Check for save popup before closing
        await handleSaveApplicationPopup();
        await clickElement(SELECTORS.CLOSE_BUTTON);
        
        // Mark job as applied to avoid getting stuck
        if (nextJob) {
          const jobId = nextJob.closest('[data-job-id]')?.getAttribute('data-job-id') || 
                      window.location.href.match(/\/view\/(\d+)\//)?.[1];
          
          if (jobId && !appliedJobIds.has(jobId)) {
            // Add to our tracking set
            appliedJobIds.add(jobId);
            
            // Mark in DOM
            markJobAsApplied(nextJob);
            
            // Add to storage
            chrome.storage.local.get(['appliedJobIds'], result => {
              const storedIds = result.appliedJobIds || [];
              storedIds.push(jobId);
              chrome.storage.local.set({ appliedJobIds: [...new Set(storedIds)] });
            });
          } else {
            // Just mark in DOM if we can't get the ID
            markJobAsApplied(nextJob);
          }
        }
        continue;
      }
    }
  } catch (error) {
    console.error("Fatal error in processApplication:", error);
    continuing = false;
    await handleSaveApplicationPopup();
    await clickElement(SELECTORS.CLOSE_BUTTON);
  }
};

const startAutomation = () => {
  isRunning = true;
  continuing = false;
  
  chrome.storage.local.set({ isAutomationRunning: true });
  
  if (automationInterval) {
    window.clearInterval(automationInterval);
    automationInterval = null;
  }
  
  automationInterval = window.setInterval(async () => {
    if (!isRunning) {
      if (automationInterval) {
        window.clearInterval(automationInterval);
        automationInterval = null;
      }
      return;
    }

    if (!continuing) {
      await processApplication();
    }
  }, 2000);
};

const stopAutomation = () => {
  isRunning = false;
  if (automationInterval) {
    window.clearInterval(automationInterval);
    automationInterval = null;
  }
  // Force stop any ongoing process
  continuing = false;
  
  // Store the stopped state
  chrome.storage.local.set({ isAutomationRunning: false });
};

const initializeState = async () => {
  chrome.storage.local.get(['isAutomationRunning', 'userData', 'appliedJobIds', 'skipped409Jobs'], (result) => {
    // Load persisted applied job IDs into memory
    if (result.appliedJobIds && Array.isArray(result.appliedJobIds)) {
      result.appliedJobIds.forEach(id => appliedJobIds.add(id));
      console.log(`📋 Loaded ${appliedJobIds.size} previously applied jobs from storage`);
    }
    
    // Load persisted skipped 409 job IDs into memory
    if (result.skipped409Jobs && Array.isArray(result.skipped409Jobs)) {
      result.skipped409Jobs.forEach(id => skipped409Jobs.add(id));
      console.log(`📋 Loaded ${skipped409Jobs.size} previously skipped 409 jobs from storage`);
    }
    
    if (result.isAutomationRunning) {
      userData = result.userData;
      startAutomation();
    } else {
      isRunning = false;
      continuing = false;
    }
  });
};

// Message listener
chrome.runtime.onMessage.addListener((message: MessageType, sender, sendResponse: (response: ResponseType) => void) => {
  switch (message.type) {
    case 'START_AUTOMATION':
      if (message.settings) {
        userData = {
          ...userData,
          settings: {
            ...userData?.settings,
            nextJobDelay: message.settings.nextJobDelay
          }
        };
      }
      startAutomation();
      sendResponse({ isRunning: true });
      break;
      
    case 'STOP_AUTOMATION':
      stopAutomation();
      sendResponse({ isRunning: false });
      break;
      
    case 'GET_STATE':
      sendResponse({ isRunning });
      break;
      
    default:
      sendResponse({ isRunning });
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