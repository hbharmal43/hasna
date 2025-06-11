/**
 * Navigation and pagination utility functions for the LinkedIn Easy Apply extension
 * These functions handle page navigation, pagination, and scrollable container detection
 */

import { SELECTORS } from '../../types';
import { isElementVisible } from '../utils';

/**
 * Attempts to click on the next page number button in LinkedIn's pagination
 * Uses multiple detection methods to find and click the next page
 * @returns Promise<boolean> true if next page button was clicked, false otherwise
 */
export const clickNextPageNumber = async (): Promise<boolean> => {
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
export const findScrollableJobListContainer = (): HTMLElement | null => {
  // First try to find job list using known selector
  const jobListContainer = document.querySelector(SELECTORS.JOBS_LIST);
  if (jobListContainer && 
      (window.getComputedStyle(jobListContainer as HTMLElement).overflowY === 'auto' ||
       window.getComputedStyle(jobListContainer as HTMLElement).overflowY === 'scroll')) {
    return jobListContainer as HTMLElement;
  }

  // If not found with known selector, try dynamic detection
  const allDivs = Array.from(document.querySelectorAll('div'));

  let bestMatch: HTMLElement | null = null;
  let maxJobItems = 0;

  for (const div of allDivs) {
    const style = window.getComputedStyle(div);

    // Must be scrollable vertically
    const isScrollableY =
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      div.scrollHeight > div.clientHeight;

    if (!isScrollableY) continue;

    // Try different job card selectors to find container with most cards
    // Use the expanded selectors similar to JOB_CARD in SELECTORS
    const jobSelectors = [
      'li.scaffold-layout__list-item',
      'li.jobs-search-results__list-item',
      'li.job-card-container',
      'li.job-card-job-posting-card-wrapper',
      'li[class*="job-card"]',
      'li[class*="job-posting"]'
    ];

    let totalJobItems = 0;
    for (const selector of jobSelectors) {
      const items = div.querySelectorAll(selector);
      totalJobItems += items.length;
    }

    // If this container has more job items than our previous best match, update
    if (isScrollableY && totalJobItems > maxJobItems) {
      maxJobItems = totalJobItems;
      bestMatch = div;
    }
  }

  if (bestMatch && maxJobItems >= 3) {
    localStorage.setItem("lastSuccessfulScrollClass", bestMatch.className); // optional debug
    return bestMatch;
  }

  // Last resort - try to find any scrollable container with <li> elements
  for (const div of allDivs) {
    const style = window.getComputedStyle(div);
    const isScrollableY =
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      div.scrollHeight > div.clientHeight;

    const listItems = div.querySelectorAll('li');
    if (isScrollableY && listItems.length >= 5) {
      return div;
    }
  }

  console.warn("❌ Could not detect scrollable job list container");
  return null;
}; 