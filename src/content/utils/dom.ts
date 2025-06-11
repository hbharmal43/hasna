/**
 * DOM utility functions for the LinkedIn Easy Apply extension
 * These functions handle DOM element interaction, clicking, and finding elements
 */

import { isElementVisible } from './core';

/**
 * Clicks an element if it exists and is visible
 * @param selector - CSS selector for the element to click
 * @returns Promise<boolean> - true if element was clicked, false otherwise
 */
export const clickElement = async (selector: string): Promise<boolean> => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element && isElementVisible(element)) {
    element.click();
    return true;
  }
  return false;
};

/**
 * Finds a visible element by selector
 * @param selector - CSS selector for the element to find
 * @returns HTMLElement if found and visible, null otherwise
 */
export const findVisibleElement = (selector: string): HTMLElement | null => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element && isElementVisible(element)) {
    return element;
  }
  return null;
};

/**
 * Finds a button by its text content or aria-label
 * @param text - Text to search for in button content or aria-label
 * @returns HTMLElement if found, null otherwise
 */
export const findButtonByText = (text: string): HTMLElement | null => {
  // First try finding by aria-label
  const buttonByAriaLabel = document.querySelector(`button[aria-label*="${text}" i]`);
  if (buttonByAriaLabel && isElementVisible(buttonByAriaLabel as HTMLElement)) {
    return buttonByAriaLabel as HTMLElement;
  }

  // Then try finding by button text content
  const buttons = Array.from(document.getElementsByTagName('button'));
  const buttonByText = buttons.find(button => {
    if (!isElementVisible(button as HTMLElement)) return false;
    
    // Check button's direct text content
    if (button.textContent?.trim().toLowerCase().includes(text.toLowerCase())) {
      return true;
    }
    
    // Check text content in span inside button
    const span = button.querySelector('.artdeco-button__text');
    return span?.textContent?.trim().toLowerCase().includes(text.toLowerCase());
  });

  return buttonByText as HTMLElement || null;
};

/**
 * Attempts to click any element from a list of selectors or by button text
 * @param selectors - Array of CSS selectors to try clicking
 * @returns Promise<boolean> - true if any element was clicked, false otherwise
 */
export const clickAnyElement = async (selectors: string[]): Promise<boolean> => {
  // First try the exact selectors
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && isElementVisible(element)) {
      element.click();
      return true;
    }
  }

  // Then try finding buttons by text content
  const buttonTexts = ['Next', 'Continue', 'Review'];
  for (const text of buttonTexts) {
    const button = findButtonByText(text);
    if (button) {
      button.click();
      return true;
    }
  }

  // Need to provide full class name, there might be some other class name with same variable name,
  // Try finding primary buttons that might be next/review buttons
  const primaryButtons = document.querySelectorAll('.artdeco-button--primary');
  for (const button of primaryButtons) {
    if (isElementVisible(button as HTMLElement)) {
      const text = button.textContent?.trim().toLowerCase() || '';
      if (text.includes('next') || text.includes('continue') || text.includes('review')) {
        (button as HTMLElement).click();
        return true;
      }
    }
  }

  return false;
}; 