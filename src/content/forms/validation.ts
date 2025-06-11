/**
 * Form validation utility functions for the LinkedIn Easy Apply extension
 * These functions handle form validation, error checking, and field completion verification
 */

import { isElementVisible } from '../utils/core';
import { isFieldEmpty } from './inputs';

/**
 * Checks if a form element has validation errors
 * @param element - HTML element to check for validation errors
 * @returns true if the element has validation errors, false otherwise
 */
export const hasValidationErrors = (element: HTMLElement): boolean => {
  // Check for LinkedIn's error classes
  return element.classList.contains('artdeco-text-input--error') || 
         element.getAttribute('aria-invalid') === 'true' ||
         !!element.closest('.artdeco-text-input--error');
};

/**
 * Checks if all required form fields are filled and have no validation errors
 * @returns Promise<boolean> - true if all fields are valid and filled, false otherwise
 */
export const areAllFieldsFilled = async (): Promise<boolean> => {
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