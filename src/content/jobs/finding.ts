/**
 * Job finding and interaction utility functions for the LinkedIn Easy Apply extension
 * These functions handle finding job cards, interacting with them, and managing their state
 */

import { SELECTORS } from '../../types';
import { isElementVisible } from '../utils';
import { isJobAlreadyApplied, isEasyApplyCard } from './detection';

/**
 * Finds the next applicable job card on the current page
 * Looks for visible Easy Apply jobs that haven't been applied to yet
 * @returns HTMLElement of the next job card to apply to, or null if none found
 */
export const findNextJob = (): HTMLElement | null => {
  // Get all visible job cards on the current page using expanded selector list
  const jobCards = Array.from(document.querySelectorAll(SELECTORS.JOB_CARD));
  
  if (jobCards.length === 0) {
    console.warn("⚠️ No job cards found with current selectors. LinkedIn layout might be different.");
    // Try logging some visible list items to help debug
    const allListItems = Array.from(document.querySelectorAll('li'));
    const visibleListItems = allListItems.filter(li => isElementVisible(li as HTMLElement));
    console.log(`📊 Found ${visibleListItems.length} visible list items on page`);
    
    return null;
  }
  
  // Look for the next non-applied Easy Apply job
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

    // Only proceed if this is an Easy Apply card
    if (!isEasyApplyCard(card)) {
      continue;
    }

    // Found a job to apply to
    return card;
  }

  // No jobs found to apply to
  console.log("⚠️ No applicable job cards found - may need to scroll or load more");
  return null;
};

/**
 * Scrolls a job element into view smoothly
 * @param jobElement - The job card element to scroll to
 */
export const scrollToJob = (jobElement: HTMLElement) => {
  jobElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

/**
 * Marks a job element as applied by setting data attribute
 * @param jobElement - The job card element to mark as applied
 */
export const markJobAsApplied = (jobElement: HTMLElement) => {
  jobElement.setAttribute('data-applied', 'true');
};

/**
 * Attempts to click on a job card to open the job details
 * Uses multiple fallback strategies to find clickable elements
 * @param jobElement - The job card element to click
 * @returns true if click was attempted, false if no clickable element found
 */
export const clickJob = (jobElement: HTMLElement): boolean => {
  // Try finding any clickable anchor in the job card using more comprehensive selectors
  const clickable = jobElement.querySelector('a.job-card-container__link, a[class*="job-card"], a[data-control-name="job_card_title"], a[href*="/jobs/view/"], a') as HTMLElement;
  
  if (clickable && isElementVisible(clickable)) {
    clickable.scrollIntoView({ behavior: 'smooth', block: 'center' });
    clickable.click();
    return true;
  }
  
  // Fallback to any button if no anchor found
  const clickableButton = jobElement.querySelector('button[data-job-id]') as HTMLElement;
  if (clickableButton && isElementVisible(clickableButton)) {
    clickableButton.click();
    return true;
  }
  
  // Last resort - try clicking the job card itself
  console.warn("⚠️ No clickable anchor or button found inside job card. Trying to click the card itself.");
  jobElement.click();
  
  return true; // Return true to avoid getting stuck, log will show if we had to resort to clicking the card
}; 