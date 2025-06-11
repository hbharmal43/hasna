/**
 * Core utility functions for the LinkedIn Easy Apply extension
 * These are the most basic, reusable functions with no dependencies
 */

/**
 * Pauses execution for the specified number of milliseconds
 * @param ms - Number of milliseconds to sleep
 * @returns Promise that resolves after the specified delay
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Checks if an HTML element is visible on the page
 * @param element - The HTML element to check
 * @returns true if the element is visible, false otherwise
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         element.offsetWidth > 0 &&
         element.offsetHeight > 0;
}; 