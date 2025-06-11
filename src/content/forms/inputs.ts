/**
 * Form input utility functions for the LinkedIn Easy Apply extension
 * These functions handle filling, selecting, and uploading data to form elements
 */

import { isElementVisible } from '../utils/core';

/**
 * Checks if a form element is empty
 * @param element - Input, textarea, or select element to check
 * @returns true if the element has no value, false otherwise
 */
export const isFieldEmpty = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): boolean => {
  return element.value.trim().length === 0;
};

/**
 * Fills an input field with the specified value
 * @param selector - CSS selector for the input element
 * @param value - Value to fill into the input
 * @returns Promise<boolean> - true if successfully filled, false otherwise
 */
export const fillInput = async (selector: string, value: string): Promise<boolean> => {
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

/**
 * Fills a textarea field with the specified value
 * @param selector - CSS selector for the textarea element
 * @param value - Value to fill into the textarea
 * @returns Promise<boolean> - true if successfully filled, false otherwise
 */
export const fillTextArea = async (selector: string, value: string): Promise<boolean> => {
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

/**
 * Selects an option in a select dropdown
 * @param selector - CSS selector for the select element
 * @param value - Value to select in the dropdown
 * @returns Promise<boolean> - true if successfully selected, false otherwise
 */
export const selectOption = async (selector: string, value: string): Promise<boolean> => {
  const select = document.querySelector(selector) as HTMLSelectElement;
  if (select && isFieldEmpty(select)) {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  return false;
};

/**
 * Uploads a resume file to a file input
 * @param selector - CSS selector for the file input element
 * @param base64Data - Base64 encoded data of the file to upload
 * @returns Promise<boolean> - true if successfully uploaded, false otherwise
 */
export const uploadResume = async (selector: string, base64Data: string): Promise<boolean> => {
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