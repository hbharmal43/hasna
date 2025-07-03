

import { MessageType, ResponseType, SELECTORS, UserProfile } from '../types';
import { trackJobApplication, getSession, getCurrentUser, initSupabaseClient, ensureAuthenticated } from '../lib/supabase';
import { sleep, isElementVisible, clickElement, findVisibleElement, findButtonByText, clickAnyElement } from './utils';
import { isFieldEmpty, fillInput, fillTextArea, selectOption, uploadResume, hasValidationErrors, areAllFieldsFilled, isNumericField, isChoiceField, isSalaryField, isNameField, isTextInputField, waitForUserFinishTyping, waitForFormCompletion, fillFormFields } from './forms';
import { isJobAlreadyApplied, isEasyApplyCard, findNextJob, scrollToJob, markJobAsApplied, clickJob } from './jobs';
import { clickNextPageNumber, findScrollableJobListContainer } from './navigation';
import { handleButtonClick, handleSaveApplicationPopup } from './application';
import { trackSuccessfulApplication } from './tracking';
import { processApplication, startAutomation, stopAutomation, type AutomationState } from './automation';
import { initializeState } from './initialization';
import { setupMessageListener, setupPageEventListeners, setupDebugUtilities } from './events';
import { setupLinkedInAPIInterception } from './api';

console.log("LinkedIn Easy Apply content script loaded");

let isRunning = false;
let automationInterval: number | null = null;
let userData: UserProfile | null = null;
let continuing = false;
// Track job IDs that have already been processed to avoid duplicates
const appliedJobIds = new Set<string>();
// Track jobs with 409 Conflict errors to avoid logging multiple times
const skipped409Jobs = new Set<string>();

// Remove all the input listeners - we don't need them
const setupInputListeners = () => {
  // No listeners needed
};

//  Need ti cleanuo all the console logs

const verifySession = async () => {
  // Simply return true without extensive checking
  // This assumes the user is logged in based on previous auth
  return true;
};

// Create automation state object
const automationState: AutomationState = {
  isRunning: false,
  continuing: false,
  automationInterval: null,
  appliedJobIds,
  userData
};

// State management functions
const setIsRunning = (value: boolean) => {
  isRunning = value;
  automationState.isRunning = value;
};

const setContinuing = (value: boolean) => {
  continuing = value;
  automationState.continuing = value;
};

const setUserData = (value: UserProfile | null) => {
  userData = value;
  automationState.userData = value;
};

// Set up LinkedIn API interception
setupLinkedInAPIInterception({ skipped409Jobs });

// Initialize state when content script loads with dependencies
initializeState({
  appliedJobIds,
  skipped409Jobs,
  automationState,
  setUserData,
  startAutomation,
  setIsRunning,
  setContinuing
});

// Set up event handling with dependencies
const eventDependencies = {
  automationState,
  getIsRunning: () => isRunning,
  getUserData: () => userData,
  setIsRunning,
  setContinuing,
  setUserData
};

// Initialize all event handlers
setupMessageListener(eventDependencies);
setupPageEventListeners(eventDependencies);
setupDebugUtilities();

 