/**
 * Initialization state module for the LinkedIn Easy Apply extension
 * Handles extension initialization including authentication, storage loading, and automation state setup
 */

import { UserProfile } from '../../types';
import { ensureAuthenticated, initSupabaseClient, getSession, getCurrentUser } from '../../lib/supabase';
import { type AutomationState } from '../automation';

/**
 * Interface for initialization dependencies
 */
interface InitializationDependencies {
  appliedJobIds: Set<string>;
  skipped409Jobs: Set<string>;
  automationState: AutomationState;
  setUserData: (userData: UserProfile | null) => void;
  startAutomation: (
    state: AutomationState,
    setIsRunning: (value: boolean) => void,
    setContinuing: (value: boolean) => void
  ) => void;
  setIsRunning: (value: boolean) => void;
  setContinuing: (value: boolean) => void;
}

/**
 * Initializes the content script state including authentication and storage loading
 * Sets up Supabase authentication, loads persisted data, and restores automation state
 * @param deps - Dependencies required for initialization
 * @returns Promise<void>
 */
export const initializeState = async (deps: InitializationDependencies): Promise<void> => {
  console.log("Initializing content script state");
  
  // First, ensure Supabase authentication is properly restored
  const authResult = await ensureAuthenticated();
  console.log("Authentication initialization result:", authResult);
  
  // Then initialize the client and try to refresh the session
  await initSupabaseClient();
  
  // Check if we can actually get a session
  const session = await getSession();
  if (session) {
    console.log("✅ Successfully authenticated with Supabase");
    
    // Check if we have a valid user
    const user = await getCurrentUser();
    if (user) {
      console.log(`✅ Current user: ${user.email}`);
    } else {
      console.warn("⚠️ No user found despite having a session");
    }
  } else {
    console.warn("⚠️ No valid session available - database operations may fail");
  }
  
  chrome.storage.local.get(['isAutomationRunning', 'userData', 'appliedJobIds', 'skipped409Jobs'], (result) => {
    console.log("Loaded data from storage:", result);
    
    // Load persisted applied job IDs into memory
    if (result.appliedJobIds && Array.isArray(result.appliedJobIds)) {
      result.appliedJobIds.forEach(id => deps.appliedJobIds.add(id));
      console.log(`📋 Loaded ${deps.appliedJobIds.size} previously applied jobs from storage`);
    }
    
    // Load persisted skipped 409 job IDs into memory
    if (result.skipped409Jobs && Array.isArray(result.skipped409Jobs)) {
      result.skipped409Jobs.forEach(id => deps.skipped409Jobs.add(id));
      console.log(`📋 Loaded ${deps.skipped409Jobs.size} previously skipped 409 jobs from storage`);
    }
    
    if (result.isAutomationRunning) {
      const userData = result.userData;
      deps.setUserData(userData);
      deps.automationState.userData = userData;
      deps.startAutomation(deps.automationState, deps.setIsRunning, deps.setContinuing);
    } else {
      deps.setIsRunning(false);
      deps.setContinuing(false);
    }
  });
}; 