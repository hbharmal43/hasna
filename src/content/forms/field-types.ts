/**
 * Form field type detection utility functions for the LinkedIn Easy Apply extension
 * These functions identify different types of form fields based on their structure and labels
 */

/**
 * Checks if a form element is a numeric input field
 * @param element - HTML element to check
 * @returns true if the element is a numeric field, false otherwise
 */
export const isNumericField = (element: HTMLElement): boolean => {
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

/**
 * Checks if a form element is a choice/radio button field
 * @param element - HTML element to check
 * @returns true if the element is a choice field, false otherwise
 */
export const isChoiceField = (element: HTMLElement): boolean => {
  // Check if it's a radio button/choice field
  return !!element.closest('[data-test-form-builder-radio-button-form-component]');
};

/**
 * Checks if a form element is a salary-related field
 * @param element - HTML element to check
 * @returns true if the element is a salary field, false otherwise
 */
export const isSalaryField = (element: HTMLElement): boolean => {
  const label = element.querySelector('label')?.textContent?.toLowerCase() || '';
  return label.includes('salary') || 
         label.includes('compensation') || 
         label.includes('pay') ||
         label.includes('wage');
};

/**
 * Checks if a form element is a name-related field
 * @param element - HTML element to check
 * @returns true if the element is a name field, false otherwise
 */
export const isNameField = (element: HTMLElement): boolean => {
  const label = element.querySelector('label')?.textContent?.toLowerCase() || '';
  return label.includes('name') || 
         label.includes('full') || 
         label.includes('first') || 
         label.includes('last');
};

/**
 * Checks if a form element is a text input field (not numeric)
 * @param element - HTML element to check
 * @returns true if the element is a text input field, false otherwise
 */
export const isTextInputField = (element: HTMLElement): boolean => {
  // Check if it's a text input field by class
  const formComponent = element.closest('[data-test-single-line-text-form-component]');
  if (!formComponent) return false;

  const input = formComponent.querySelector('input');
  // If input has numeric in ID, it's not a text field
  if (input?.id?.includes('numeric')) return false;
  
  return true;
}; 