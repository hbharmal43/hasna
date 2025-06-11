/**
 * Form completion utility functions for the LinkedIn Easy Apply extension
 * These functions handle waiting for user form completion and automatic form field filling
 */

import { isElementVisible, sleep } from '../utils';
import { hasValidationErrors } from './validation';
import { isFieldEmpty } from './inputs';

/**
 * Waits for user to finish typing in a specific element
 * Resolves when user hasn't typed for the specified timeout duration
 * @param element - The input element to monitor
 * @param timeout - Time to wait after last keystroke (default: 2000ms)
 * @returns Promise<void> that resolves when user stops typing
 */
export const waitForUserFinishTyping = (element: HTMLElement, timeout = 2000): Promise<void> => {
  return new Promise((resolve) => {
    let timer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        element.removeEventListener('keydown', resetTimer);
        element.removeEventListener('input', resetTimer);
        resolve();
      }, timeout);
    };

    // Listen for keydown and input events
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

/**
 * Waits for form completion by monitoring required fields and user interactions
 * @param isRunning - Optional state object to check if automation should continue
 * @returns Promise<boolean> that resolves to true when form is complete, false on timeout or stop
 */
export const waitForFormCompletion = async (isRunning?: { current: boolean }): Promise<boolean> => {
  return new Promise((resolve) => {
    let isTyping = false;
    let typingTimer: NodeJS.Timeout;
    let userInteractionInProgress = false;
    let stateCheckInterval: NodeJS.Timeout;
    
    // Function declarations first to avoid temporal dead zone issues
    
    // Periodically check if automation should stop
    if (isRunning) {
      stateCheckInterval = setInterval(() => {
        if (!isRunning.current) {
          console.log("🛑 Automation stopped during form completion");
          cleanup();
          resolve(false);
          return;
        }
      }, 500); // Check every 500ms
    }
    
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
      // Check automation state first
      if (isRunning && !isRunning.current) {
        console.log("🛑 Automation stopped during field check");
        cleanup();
        resolve(false);
        return;
      }
      
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
        cleanup();
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
        setTimeout(() => {
          cleanup();
          resolve(true);
        }, 300);
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

    // Cleanup function - defined after all function declarations
    const cleanup = () => {
      clearTimeout(typingTimer);
      if (stateCheckInterval) clearInterval(stateCheckInterval);
      document.querySelectorAll('input, textarea').forEach(input => {
        input.removeEventListener('input', handleInput);
        input.removeEventListener('change', checkFields);
      });
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

    // Cleanup after 3 minutes to prevent memory leaks (reduced from 5 minutes)
    setTimeout(() => {
      cleanup();
      resolve(false);
    }, 180000);
  });
};

/**
 * Checks if all required form fields are filled
 * @returns Promise<boolean> true if all required fields are filled, false otherwise
 */
export const fillFormFields = async (): Promise<boolean> => {
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