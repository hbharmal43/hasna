/**
 * Application flow utility functions for the LinkedIn Easy Apply extension
 * These functions handle the flow of the application process, including button clicks and popup management
 */

import { sleep, isElementVisible } from '../utils';
import { trackSuccessfulApplication } from '../tracking';

/**
 * Handles clicking buttons in the LinkedIn Easy Apply modal
 * Tries multiple button types in order: submit, review, next, and primary buttons
 * @param jobTitle - The title of the job being applied to
 * @param companyName - The name of the company
 * @param jobElement - The job card HTML element
 * @param appliedJobIds - Set of job IDs that have already been processed
 * @returns Promise<boolean> true if a button was clicked, false otherwise
 */
export const handleButtonClick = async (
  jobTitle: string, 
  companyName: string, 
  jobElement: HTMLElement,
  appliedJobIds: Set<string>
) => {
  // First try to find submit button within the modal
  const modal = document.querySelector('.artdeco-modal__content.jobs-easy-apply-modal__content');
  if (!modal) return false;

  const submitButton = modal.querySelector('button[aria-label="Submit application"]') as HTMLElement;
  if (submitButton && isElementVisible(submitButton)) {
    await sleep(500);
    submitButton.click();
    
    // Track the successful application
    await trackSuccessfulApplication(jobTitle, companyName, jobElement, appliedJobIds);
    
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

/**
 * Handles the "Save Application" popup that sometimes appears
 * Looks for discard button and clicks it to continue without saving
 * @returns Promise<boolean> true if popup was handled, false if no popup found
 */
export const handleSaveApplicationPopup = async (): Promise<boolean> => {
  // Look for any button with the specific data-control-name for discard
  const discardButton = document.querySelector('button[data-control-name="discard_application_confirm_btn"]');
  
  if (discardButton && isElementVisible(discardButton as HTMLElement)) {
    (discardButton as HTMLElement).click();
    await sleep(500);
    return true;
  }

  return false;
}; 