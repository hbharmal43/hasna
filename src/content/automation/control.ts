/**
 * Automation control module for the LinkedIn Easy Apply extension
 * Handles starting, stopping, and managing the automation lifecycle
 */

import { UserProfile } from '../../types';
import { processApplication } from './core';

/**
 * Interface for automation state management
 */
export interface AutomationState {
  isRunning: boolean;
  continuing: boolean;
  automationInterval: number | null;
  appliedJobIds: Set<string>;
  userData: UserProfile | null;
}

// Global reference objects that persist across start/stop cycles
let globalIsRunningRef: { current: boolean } | null = null;
let globalContinuingRef: { current: boolean } | null = null;

/**
 * Starts the automation process
 * Sets up the main automation interval and initializes state management
 * @param state - The automation state object
 * @param setIsRunning - Function to update the isRunning state
 * @param setContinuing - Function to update the continuing state
 */
export const startAutomation = (
  state: AutomationState,
  setIsRunning: (value: boolean) => void,
  setContinuing: (value: boolean) => void
) => {
  // Update state first
  setIsRunning(true);
  setContinuing(false);
  
  console.log("🚀 Starting automation, state.isRunning:", state.isRunning);
  
  chrome.storage.local.set({ isAutomationRunning: true });
  
  // Clear any existing interval
  if (state.automationInterval) {
    console.log("🧹 Clearing existing automation interval");
    window.clearInterval(state.automationInterval);
    state.automationInterval = null;
  }
  
  // Create or reuse reference objects for state management
  if (!globalIsRunningRef) {
    globalIsRunningRef = { current: state.isRunning };
  } else {
    globalIsRunningRef.current = state.isRunning;
  }
  
  if (!globalContinuingRef) {
    globalContinuingRef = { current: state.continuing };
  } else {
    globalContinuingRef.current = state.continuing;
  }
  
  const setContinuingInternal = (value: boolean) => {
    setContinuing(value);
    if (globalContinuingRef) {
      globalContinuingRef.current = value;
    }
  };
  
  state.automationInterval = window.setInterval(async () => {
    // Always check the current state values
    if (!state.isRunning) {
      console.log("⏹️ Automation stopped, clearing interval");
      if (state.automationInterval) {
        window.clearInterval(state.automationInterval);
        state.automationInterval = null;
      }
      return;
    }

    // Update reference objects with current state
    if (globalIsRunningRef) globalIsRunningRef.current = state.isRunning;
    if (globalContinuingRef) globalContinuingRef.current = state.continuing;

    if (!state.continuing && globalIsRunningRef && globalContinuingRef) {
      await processApplication(globalIsRunningRef, globalContinuingRef, state.appliedJobIds, setContinuingInternal);
    }
  }, 2000);
  
  console.log("✅ Automation interval started with ID:", state.automationInterval);
};

/**
 * Stops the automation process
 * Cleans up intervals and resets state
 * @param state - The automation state object
 * @param setIsRunning - Function to update the isRunning state
 * @param setContinuing - Function to update the continuing state
 */
export const stopAutomation = (
  state: AutomationState,
  setIsRunning: (value: boolean) => void,
  setContinuing: (value: boolean) => void
) => {
  console.log("🛑 Stopping automation, current interval ID:", state.automationInterval);
  console.log("🛑 Current state.isRunning:", state.isRunning);
  
  // Update state first
  setIsRunning(false);
  setContinuing(false);
  
  // CRITICAL: Update global reference objects immediately so running processes stop
  if (globalIsRunningRef) {
    globalIsRunningRef.current = false;
    console.log("🛑 Updated globalIsRunningRef.current:", globalIsRunningRef.current);
  }
  if (globalContinuingRef) {
    globalContinuingRef.current = false;
    console.log("🛑 Updated globalContinuingRef.current:", globalContinuingRef.current);
  }
  
  console.log("🛑 Updated state.isRunning:", state.isRunning);
  
  // Clear the interval
  if (state.automationInterval) {
    console.log("🧹 Clearing automation interval:", state.automationInterval);
    window.clearInterval(state.automationInterval);
    state.automationInterval = null;
    console.log("✅ Interval cleared, state.automationInterval:", state.automationInterval);
  } else {
    console.log("⚠️ No automation interval to clear");
  }
  
  // Store the stopped state
  chrome.storage.local.set({ isAutomationRunning: false });
  console.log("✅ Automation stopped and state saved");
}; 