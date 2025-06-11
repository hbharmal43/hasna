/**
 * API handling module exports
 * Re-exports all LinkedIn API handling functions for easy importing
 */

// LinkedIn API interception and utilities
export { 
  setupLinkedInAPIInterception, 
  restoreOriginalFetch, 
  extractJobIdFromRequest, 
  isLinkedInEasyApplyRequest 
} from './linkedin'; 