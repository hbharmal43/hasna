/**
 * Job detection utility functions for the LinkedIn Easy Apply extension
 * These functions handle detecting whether jobs are already applied to or are Easy Apply jobs
 */

/**
 * Checks if a job card indicates the job has already been applied to
 * Uses multiple detection methods to be layout-agnostic
 * @param jobCard - The job card HTML element to check
 * @returns true if the job has already been applied to, false otherwise
 */
export const isJobAlreadyApplied = (jobCard: HTMLElement): boolean => {
  // Layout-agnostic check for "Applied" text in any span
  const appliedTextSpans = Array.from(jobCard.querySelectorAll('span[dir="ltr"]')).some(span =>
    span.textContent?.trim().toLowerCase().includes('applied')
  );
  if (appliedTextSpans) {
    return true;
  }

  // Check for LinkedIn's "Applied" status text in any element
  const appliedTexts = Array.from(jobCard.querySelectorAll('*')).some(el => 
    el.textContent?.trim().toLowerCase() === 'applied'
  );
  if (appliedTexts) {
    return true;
  }

  // Check for "Applied" button state
  const appliedButton = jobCard.querySelector('.jobs-apply-button--applied, [aria-label*="Applied"]');
  if (appliedButton) {
    return true;
  }

  // Check for any feedback message containing "Applied"
  const feedbackMessage = jobCard.querySelector('.artdeco-inline-feedback__message');
  if (feedbackMessage?.textContent?.trim().toLowerCase().includes('applied')) {
    return true;
  }

  // Check for any footer item containing "Applied" text
  const footerItems = jobCard.querySelectorAll('[class*="footer-item"]');
  for (const item of footerItems) {
    if (item.textContent?.trim().toLowerCase().includes('applied')) {
      return true;
    }
  }

  return false;
};

/**
 * Layout-agnostic check for whether a job card is an Easy Apply job.
 * Looks for a span[dir="ltr"] containing "easy apply" (case-insensitive),
 * and optionally checks for a LinkedIn icon SVG.
 * @param card - The job card HTML element to check
 * @returns true if the job card represents an Easy Apply job, false otherwise
 */
export const isEasyApplyCard = (card: HTMLElement): boolean => {
  // Look for any span[dir="ltr"] with text "easy apply"
  const easyApplyLabel = Array.from(card.querySelectorAll('span[dir="ltr"]')).find(span =>
    span.textContent?.trim().toLowerCase().includes("easy apply")
  );
  if (!easyApplyLabel) return false;

  // Optionally, confirm with LinkedIn icon (not strictly required)
  // const hasLinkedInIcon = !!card.querySelector('svg[data-test-icon*="linkedin"]');
  // return hasLinkedInIcon;

  return true;
}; 