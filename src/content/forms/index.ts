/**
 * Forms module exports
 * Re-exports all form-related functions for easy importing
 */

// Form input utilities
export { isFieldEmpty, fillInput, fillTextArea, selectOption, uploadResume } from './inputs';

// Form validation utilities
export { hasValidationErrors, areAllFieldsFilled } from './validation';

// Form field type detection utilities
export { isNumericField, isChoiceField, isSalaryField, isNameField, isTextInputField } from './field-types';

// Form completion utilities
export { waitForUserFinishTyping, waitForFormCompletion, fillFormFields } from './completion'; 