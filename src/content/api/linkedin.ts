/**
 * LinkedIn API handling module for the LinkedIn Easy Apply extension
 * Handles fetch interception, LinkedIn API response processing, and 409 conflict error management
 */

/**
 * Interface for LinkedIn API handling dependencies
 */
interface LinkedInAPIHandlingDependencies {
  skipped409Jobs: Set<string>;
}

// Store reference to the original fetch function
let originalFetch: typeof window.fetch;

/**
 * Sets up LinkedIn API fetch interception to handle Easy Apply requests and 409 conflicts
 * Patches the global fetch function to intercept LinkedIn API calls and track already-applied jobs
 * @param deps - Dependencies required for API handling
 */
export const setupLinkedInAPIInterception = (deps: LinkedInAPIHandlingDependencies) => {
  // Save the original fetch function
  originalFetch = window.fetch;

  // Patch the fetch API to intercept LinkedIn API calls and handle 409 errors
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    // Check if this is a LinkedIn Easy Apply API request
    let url = '';
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else if ('url' in input) {
      // It's a Request object
      url = input.url;
    }
    
    if (url.includes('voyagerJobsDashOnsiteApplyApplication') && init?.method === 'POST') {
      try {
        // Extract the job ID from the URL or body
        let jobId = '';
        try {
          if (init.body) {
            const bodyText = init.body.toString();
            // Try to extract the job ID from the request body
            const match = bodyText.match(/jobId=(\d+)/);
            if (match && match[1]) {
              jobId = match[1];
            }
          }
          
          if (!jobId) {
            // Try to extract from URL
            const urlMatch = url.match(/jobId=(\d+)/);
            if (urlMatch && urlMatch[1]) {
              jobId = urlMatch[1];
            }
          }
        } catch (e) {
          // Ignore parsing errors, just continue
        }
        
        // Make the actual request
        const response = await originalFetch(input, init);
        
        // If we get a 409 Conflict and have a job ID
        if (response.status === 409 && jobId) {
          if (!deps.skipped409Jobs.has(jobId)) {
            console.log(`🔁 Skipping already-applied job ID: ${jobId}`);
            deps.skipped409Jobs.add(jobId);
            
            // Persist to Chrome storage
            chrome.storage.local.get(['skipped409Jobs'], result => {
              const storedIds = result.skipped409Jobs || [];
              if (!storedIds.includes(jobId)) {
                storedIds.push(jobId);
                chrome.storage.local.set({ skipped409Jobs: storedIds });
              }
            });
          }
        }
        
        return response;
      } catch (error) {
        return await originalFetch(input, init);
      }
    }
    
    // For all other requests, just pass through to the original fetch
    return await originalFetch(input, init);
  };
};

/**
 * Restores the original fetch function (for cleanup or testing)
 * Removes the LinkedIn API interception and restores normal fetch behavior
 */
export const restoreOriginalFetch = () => {
  if (originalFetch) {
    window.fetch = originalFetch;
  }
};

/**
 * Extracts job ID from LinkedIn API request
 * Utility function to extract job ID from various sources in LinkedIn API calls
 * @param url - The request URL
 * @param body - The request body (optional)
 * @returns The extracted job ID or null if not found
 */
export const extractJobIdFromRequest = (url: string, body?: BodyInit | null): string | null => {
  let jobId: string | null = null;
  
  try {
    // Try to extract from request body first
    if (body) {
      const bodyText = body.toString();
      const match = bodyText.match(/jobId=(\d+)/);
      if (match && match[1]) {
        jobId = match[1];
      }
    }
    
    // Try to extract from URL if not found in body
    if (!jobId) {
      const urlMatch = url.match(/jobId=(\d+)/);
      if (urlMatch && urlMatch[1]) {
        jobId = urlMatch[1];
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  return jobId;
};

/**
 * Checks if a URL is a LinkedIn Easy Apply API endpoint
 * @param url - The URL to check
 * @param method - The HTTP method (optional)
 * @returns True if this is a LinkedIn Easy Apply API request
 */
export const isLinkedInEasyApplyRequest = (url: string, method?: string): boolean => {
  return url.includes('voyagerJobsDashOnsiteApplyApplication') && 
         (!method || method.toUpperCase() === 'POST');
}; 