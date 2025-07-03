// @ts-ignore
import { autofillWorkday } from './autofill/workday';
import { UserProfile } from '../types';

console.log("AutofillEngine module loaded");

/**
 * Enhanced autofill router that detects the current platform and routes to appropriate autofill handler
 * Supports LinkedIn, Workday, and other job application platforms
 * @param userData - User profile data for autofilling forms
 */
export async function autofillRouter(userData: UserProfile): Promise<void> {
  console.log("AutofillRouter called with user data:", userData);
  
  const hostname = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const fullUrl = window.location.href.toLowerCase();
  
  console.log("Current page:", { hostname, pathname, fullUrl: window.location.href });

  try {
    // Workday platform detection (enhanced)
    if (isWorkdayPlatform(hostname, pathname, fullUrl)) {
      console.log("✅ Detected Workday application page, running enhanced Workday autofill");
      await autofillWorkday(userData);
      console.log("✅ Workday autofill completed successfully");
      return;
    }
    
    // LinkedIn platform detection
    if (isLinkedInPlatform(hostname, pathname)) {
      console.log("✅ Detected LinkedIn page - LinkedIn autofill handled by existing automation");
      // LinkedIn autofill is handled by the existing automation system
      // No additional action needed here as the "Autofill This Page" button
      // on LinkedIn is primarily for the automation system
      console.log("ℹ️ LinkedIn autofill delegated to existing automation system");
      return;
    }
    
    // Other platforms can be added here
    // if (isGreenhousePlatform(hostname, pathname)) {
    //   await autofillGreenhouse(userData);
    //   return;
    // }
    
    // if (isLeverPlatform(hostname, pathname)) {
    //   await autofillLever(userData);
    //   return;
    // }
    
    console.warn("⚠️ No specific autofill handler defined for this site:", hostname);
    console.log("ℹ️ Attempting generic form autofill...");
    
    // Generic autofill fallback for unknown platforms
    await attemptGenericAutofill(userData);
    
  } catch (error) {
    console.error("❌ Error in autofill router:", error);
    throw error; // Re-throw to be handled by the message listener
  }
}

/**
 * Detects if the current page is a Workday application platform
 * @param hostname - Current page hostname
 * @param pathname - Current page pathname  
 * @param fullUrl - Full URL for additional checks
 * @returns boolean indicating if this is a Workday platform
 */
function isWorkdayPlatform(hostname: string, pathname: string, fullUrl: string): boolean {
  // Common Workday hostname patterns
  const workdayHostnamePatterns = [
    'workday.com',
    '.workday.com',
    'myworkday.com',
    '.myworkday.com',
    'workdaysuccessfactors.com'
  ];
  
  // Common Workday URL path patterns
  const workdayPathPatterns = [
    '/workday',
    '/careers',
    '/job',
    '/apply',
    '/application',
    '/candidate'
  ];
  
  // Check hostname patterns
  const isWorkdayHostname = workdayHostnamePatterns.some(pattern => 
    hostname.includes(pattern)
  );
  
  // Check path patterns
  const isWorkdayPath = workdayPathPatterns.some(pattern => 
    pathname.includes(pattern)
  );
  
  // Check for Workday-specific URL parameters or fragments
  const hasWorkdayParams = fullUrl.includes('workday') || 
                          fullUrl.includes('wd-') ||
                          fullUrl.includes('wday');
  
  const isWorkday = isWorkdayHostname || (isWorkdayPath && hasWorkdayParams);
  
  if (isWorkday) {
    console.log("🎯 Workday platform detected:", {
      hostname: isWorkdayHostname,
      path: isWorkdayPath,
      params: hasWorkdayParams
    });
  }
  
  return isWorkday;
}

/**
 * Detects if the current page is LinkedIn
 * @param hostname - Current page hostname
 * @param pathname - Current page pathname
 * @returns boolean indicating if this is LinkedIn
 */
function isLinkedInPlatform(hostname: string, pathname: string): boolean {
  const isLinkedIn = hostname.includes('linkedin.com');
  
  if (isLinkedIn) {
    console.log("🎯 LinkedIn platform detected");
  }
  
  return isLinkedIn;
}

/**
 * Attempts generic form autofill for unknown platforms
 * Uses common field selectors and patterns
 * @param userData - User profile data
 */
async function attemptGenericAutofill(userData: UserProfile): Promise<void> {
  console.log("🔄 Attempting generic autofill for unknown platform");
  
  // Generic field selectors for common form fields
  const genericSelectors = {
    firstName: [
      'input[name*="first" i][name*="name" i]',
      'input[placeholder*="first name" i]',
      'input[id*="first" i][id*="name" i]'
    ],
    lastName: [
      'input[name*="last" i][name*="name" i]',
      'input[placeholder*="last name" i]',
      'input[id*="last" i][id*="name" i]'
    ],
    email: [
      'input[type="email"]',
      'input[name*="email" i]',
      'input[placeholder*="email" i]'
    ],
    phone: [
      'input[type="tel"]',
      'input[name*="phone" i]',
      'input[placeholder*="phone" i]'
    ]
  };
  
  let filledFields = 0;
  
  // Try to fill basic fields
  for (const [fieldType, selectors] of Object.entries(genericSelectors)) {
    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLInputElement;
      if (element && !element.value) {
        let value = '';
        switch (fieldType) {
          case 'firstName':
            value = userData.first_name || '';
            break;
          case 'lastName':
            value = userData.last_name || '';
            break;
          case 'email':
            value = userData.email || '';
            break;
          case 'phone':
            value = userData.phone || '';
            break;
        }
        
        if (value) {
          element.value = value;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          filledFields++;
          console.log(`✅ Filled ${fieldType} field with generic selector`);
          break; // Move to next field type
        }
      }
    }
  }
  
  if (filledFields > 0) {
    console.log(`✅ Generic autofill completed: ${filledFields} fields filled`);
  } else {
    console.log("⚠️ No compatible fields found for generic autofill");
  }
}

// Legacy synchronous wrapper for backward compatibility
export function autofillRouterSync(userData: UserProfile): void {
  autofillRouter(userData).catch(error => {
    console.error("Error in async autofill router:", error);
  });
}