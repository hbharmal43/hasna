// @ts-ignore
import { autofillWorkday } from './autofill/workday';
import { UserProfile } from '../types';

console.log("AutofillEngine module loaded");

export function autofillRouter(userData: UserProfile): void {
  console.log("AutofillRouter called with user data:", userData);
  
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  console.log("Current page:", { hostname, pathname, fullUrl: window.location.href });

  if (hostname.includes("workday") || pathname.includes("workday")) {
    console.log("Detected Workday application page, running Workday autofill");
    try {
      autofillWorkday(userData);
    } catch (error) {
      console.error("Error in Workday autofill:", error);
    }
  }
  // Add more conditions here as we support other platforms
  else {
    console.warn("No autofill handler defined for this site.");
  }
}