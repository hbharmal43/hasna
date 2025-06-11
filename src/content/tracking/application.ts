/**
 * Job application tracking utility functions for the LinkedIn Easy Apply extension
 * These functions handle tracking successful job applications, extracting job data, and managing persistence
 */

import { trackJobApplication, ensureAuthenticated } from '../../lib/supabase';

// Import global state from content.ts
// Note: This is a temporary solution - ideally this should be managed by a state manager

/**
 * Tracks a successful job application with comprehensive data extraction and storage
 * Extracts job details from LinkedIn's DOM and stores in database and local storage
 * @param jobTitle - The title of the job being applied to
 * @param companyName - The name of the company
 * @param jobElement - The job card HTML element for ID extraction
 * @param appliedJobIds - Set of job IDs that have already been processed
 * @returns Promise<boolean> true if tracking was successful or handled, false only on critical errors
 */
export const trackSuccessfulApplication = async (jobTitle: string, companyName: string, jobElement: HTMLElement, appliedJobIds: Set<string>) => {
  try {
    // Improved job ID extraction with multiple methods and consistency checks
    let jobId: string | null = null;
    
    // Method 1: Get from job element's data attribute
    jobId = jobElement.closest('[data-job-id]')?.getAttribute('data-job-id');
    
    // Method 2: Get from URL (most reliable for LinkedIn)
    if (!jobId) {
      const urlMatch = window.location.href.match(/currentJobId=(\d+)/);
      if (urlMatch && urlMatch[1]) {
        jobId = urlMatch[1];
      }
    }
    
    // Method 3: Alternative URL pattern
    if (!jobId) {
      const urlMatch = window.location.href.match(/\/view\/(\d+)\//);
      if (urlMatch && urlMatch[1]) {
        jobId = urlMatch[1];
      }
    }
    
    // Method 4: Get from job details section
    if (!jobId) {
      const jobDetailsElement = document.querySelector('.jobs-unified-top-card, .job-details-jobs-unified-top-card');
      if (jobDetailsElement) {
        // Try to find any element with data-job-id
        const jobIdElement = jobDetailsElement.querySelector('[data-job-id]');
        if (jobIdElement) {
          jobId = jobIdElement.getAttribute('data-job-id');
        }
      }
    }
    
    // Method 5: Extract from Apply button
    if (!jobId) {
      const applyButton = document.querySelector('.jobs-apply-button, .jobs-s-apply button');
      if (applyButton) {
        const applyId = applyButton.getAttribute('data-job-id');
        if (applyId) {
          jobId = applyId;
        }
      }
    }
    
    // Create a deterministic ID that will be the same for the same job
    if (!jobId) {
      // Use a hash-like approach for consistency
      const baseString = `${jobTitle.trim()}-${companyName.trim()}`;
      const hash = baseString.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a; // Convert to 32-bit integer
      }, 0);
      jobId = `synthetic-${Math.abs(hash)}`;
      console.log('🔧 Created deterministic synthetic job ID:', jobId);
    }
                 
    if (!jobId) {
      console.log('❌ Could not extract job ID for tracking');
      return false;
    }
    
    // Check if this job has already been processed in this session
    if (appliedJobIds.has(jobId)) {
      console.log(`⏭️ Job ${jobId} already processed in this session. Skipping database tracking.`);
      return true;
    }
    
    // Mark job as processed immediately to prevent duplicate processing
    appliedJobIds.add(jobId);
    console.log(`🔄 Marked job ${jobId} as processed to prevent duplicates`);
    
    // Mark job as applied in the DOM immediately
    jobElement.setAttribute('data-applied', 'true');
    
    // Also mark any other instances of this job as applied right away
    document.querySelectorAll(`[data-job-id="${jobId}"]`).forEach(card => {
      card.setAttribute('data-applied', 'true');
    });
    
    console.log(`📝 Tracking application for "${jobTitle}" at "${companyName}" (ID: ${jobId})`);
    
    // Add the job ID to Chrome storage for persistence
    chrome.storage.local.get(['appliedJobIds'], result => {
      const storedIds = result.appliedJobIds || [];
      storedIds.push(jobId);
      chrome.storage.local.set({ appliedJobIds: [...new Set(storedIds)] });
    });
    
    // Get additional job details
    const locationElement = document.querySelector('.job-details-jobs-unified-top-card__bullet');
    const workTypeElement = document.querySelector('.job-details-jobs-unified-top-card__workplace-type');
    const salaryElement = document.querySelector('.job-details-jobs-unified-top-card__salary-range');
    const descriptionElement = document.querySelector('.jobs-description');
    const companyUrlElement = document.querySelector('.job-details-jobs-unified-top-card__company-name a');
    
    // Get location data safely
    let location = locationElement?.textContent?.trim() || '';
    
    // Get work type data safely
    let workType = 'onsite'; // default
    if (workTypeElement) {
      const workTypeText = workTypeElement.textContent?.trim()?.toLowerCase() || '';
      if (workTypeText.includes('remote')) {
        workType = 'remote';
      } else if (workTypeText.includes('hybrid')) {
        workType = 'hybrid';
      }
    }
    
    // Get salary data safely
    let salaryMin = null;
    let salaryMax = null;
    if (salaryElement) {
      const salaryText = salaryElement.textContent?.trim() || '';
      const numbers = salaryText.match(/\d+/g);
      if (numbers && numbers.length >= 1) {
        salaryMin = parseInt(numbers[0]) || null;
        if (numbers.length > 1) {
          salaryMax = parseInt(numbers[1]) || null;
        }
      }
    }
    
    // Job application data to save
    const jobData = {
      linkedin_job_id: jobId,
      location: location,
      work_type: workType as 'onsite' | 'remote' | 'hybrid',
      salary_min: salaryMin,
      salary_max: salaryMax,
      salary_currency: 'USD',
      job_description: descriptionElement?.textContent?.trim() || '',
      company_url: companyUrlElement?.getAttribute('href') || undefined
    };
    
    // Enhanced debugging for database tracking
    console.log('🔍 [DEBUG] About to track application to database with data:', {
      jobTitle,
      companyName,
      jobId,
      location: jobData.location,
      workType: jobData.work_type,
      hasDescription: !!jobData.job_description
    });

    // Try to save the application to the database
    let result = await trackJobApplication(jobTitle, companyName, jobData);
    console.log('🔍 [DEBUG] First tracking attempt result:', result);

    // If tracking failed, try to re-authenticate and try again
    if (!result) {
      console.log('⚠️ Initial tracking failed, attempting to re-authenticate...');
      // Try to ensure we're authenticated
      const authResult = await ensureAuthenticated();
      console.log('🔍 [DEBUG] Re-authentication result:', authResult);
      
      if (authResult) {
        console.log('🔄 Retrying database tracking after re-authentication...');
        // Try to save again after re-authenticating
        result = await trackJobApplication(jobTitle, companyName, jobData);
        console.log('🔍 [DEBUG] Second tracking attempt result:', result);
      } else {
        console.error('❌ Re-authentication failed completely');
      }
    }

    if (result) {
      console.log(`✅ Successfully tracked application for "${jobTitle}" at "${companyName}" (ID: ${jobId})`);
      return true;
    } else {
      console.error(`❌ FAILED to track application in database for "${jobTitle}" at "${companyName}" (ID: ${jobId})`);
      console.log('⚠️ Continuing automation despite database tracking failure');
      return true;
    }
  } catch (error) {
    console.error(`❌ Error tracking application:`, error);
    // Still return true to continue the application process
    return true;
  }
}; 