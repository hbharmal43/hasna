/**
 * Automation core module for the LinkedIn Easy Apply extension
 * Contains the main application processing logic that orchestrates the entire job application flow
 */

import { SELECTORS } from '../../types';
import { sleep, isElementVisible, clickElement } from '../utils';
import { waitForFormCompletion } from '../forms';
import { findNextJob, scrollToJob, markJobAsApplied, clickJob } from '../jobs';
import { clickNextPageNumber, findScrollableJobListContainer } from '../navigation';
import { handleButtonClick, handleSaveApplicationPopup } from '../application';

/**
 * Main automation function that processes job applications
 * Orchestrates the entire application flow including job finding, scrolling, form completion, and error handling
 * @param isRunning - Reference to the global running state
 * @param continuing - Reference to the global continuing state  
 * @param appliedJobIds - Set of job IDs that have already been processed
 * @param setContinuing - Function to update the continuing state
 * @returns Promise<void>
 */
export const processApplication = async (
  isRunning: { current: boolean },
  continuing: { current: boolean },
  appliedJobIds: Set<string>,
  setContinuing: (value: boolean) => void
) => {
  try {
    while (isRunning.current) {
      // Check for save application popup first
      if (await handleSaveApplicationPopup()) {
        await sleep(250);
      }

      console.log("🔍 Looking for next applicable job...");
      const nextJob = findNextJob();
      
      if (!nextJob) {
        console.log("🔄 No applicable job found, attempting to scroll for more jobs");
        
        // Use dynamic detection instead of hardcoded selectors
        let jobList = findScrollableJobListContainer();
        
        let scrollPerformed = false;
        
        if (jobList) {
          // Calculate a smooth scrolling amount (about 70% of viewport height)
          const scrollAmount = window.innerHeight * 0.5;
          const currentScrollTop = jobList.scrollTop;
          
          // Only scroll if we're not already at the bottom
          const isAtBottom = jobList.scrollHeight - jobList.scrollTop <= jobList.clientHeight + 50;
          
          if (!isAtBottom) {
            console.log(`📜 Scrolling job list by ${scrollAmount}px to load more jobs (scrollTop: ${currentScrollTop}, scrollHeight: ${jobList.scrollHeight})`);
            
            // Force scroll upward first to trigger LinkedIn's job loading
            jobList.scrollTo({
              top: Math.max(0, currentScrollTop - 100),
              behavior: 'smooth'
            });
            
            await sleep(1000);
            
            // Then scroll down more
            jobList.scrollTo({
              top: currentScrollTop + scrollAmount,
              behavior: 'smooth'
            });
            
            scrollPerformed = true;
          } else {
            console.log("📄 Reached bottom of job list, trying to click next page number");
            
            // We're at the bottom of the list, try to click the next page number button
            if (await clickNextPageNumber()) {
              console.log("✅ Successfully clicked next page number");
              await sleep(3000); // Wait for next page to load
              continue;
            } else {
              // Fall back to the old method if page number navigation fails
              console.log("⚠️ Falling back to 'Next' button");
              const nextPageButton = document.querySelector('button[aria-label="Next"]');
              if (nextPageButton && isElementVisible(nextPageButton as HTMLElement)) {
                console.log("🖱️ Clicking next page button");
                (nextPageButton as HTMLElement).click();
                await sleep(3000); // Wait for next page to load
                continue;
              } else {
                console.log("❌ No pagination buttons found - may have reached the end of results");
                
                // Consider pausing automation if we've exhausted all jobs
                let scrollAttempts = parseInt(localStorage.getItem('scrollAttempts') || '0');
                scrollAttempts++;
                localStorage.setItem('scrollAttempts', scrollAttempts.toString());
                
                // If we've tried scrolling multiple times with no jobs, pause briefly
                if (scrollAttempts > 5) {
                  console.log("🛑 Multiple scroll attempts with no jobs found. Pausing automation briefly.");
                  localStorage.setItem('scrollAttempts', '0');
                  await sleep(10000); // Longer pause to allow user to intervene if needed
                }
              }
            }
          }
        } else {
          console.log("❓ Could not find the job list element, trying direct window scroll");
          
          // If we couldn't find the job list, try scrolling the window directly
          window.scrollBy({
            top: window.innerHeight * 0.7,
            behavior: 'smooth'
          });
          
          scrollPerformed = true;
        }
        
        // Wait longer for jobs to load after scrolling
        if (scrollPerformed) {
          await sleep(3000);
            
          // Check if scrolling loaded any new jobs
          const newNextJob = findNextJob();
          if (newNextJob) {
            console.log("✅ Found new job after scrolling");
            continue; // Skip to next iteration to process this job
          }
        }
        
        console.log("⏱️ Waiting briefly before next job check");
        await sleep(2000); // Only 2 seconds wait when no jobs found
        continue;
      }

      try {
        console.log("Processing job: " + nextJob.textContent?.substring(0, 30)?.trim());
        scrollToJob(nextJob);
        await sleep(1000); // Reduced from 2000ms

        if (!clickJob(nextJob)) {
          console.log("Failed to click job, moving to next");
          // Mark this job as applied so we don't get stuck on it
          markJobAsApplied(nextJob);
          continue;
        }
        await sleep(1000); // Reduced from 2000ms
        
        if (!await clickElement(SELECTORS.EASY_APPLY_BUTTON)) {
          console.log("Failed to click Easy Apply button, moving to next job");
          // Mark this job as applied so we don't get stuck on it
          markJobAsApplied(nextJob);
          continue;
        }

        // Get job details
        const jobTitleElement = document.querySelector('.t-24.job-details-jobs-unified-top-card__job-title');
        const companyElement = document.querySelector('.job-details-jobs-unified-top-card__company-name');
        
        const jobTitle = jobTitleElement?.textContent?.trim() || 'Unknown Position';
        const companyName = companyElement?.textContent?.trim() || 'Unknown Company';
        console.log(`Applying to: ${jobTitle} at ${companyName}`);

        setContinuing(true);
        let retryCount = 0;
        const maxRetries = 3;
        let currentFormCompleted = false;

        // Main application loop - stays on current form until completed
        while (continuing.current && isRunning.current) {
          // Check for save application popup
          if (await handleSaveApplicationPopup()) {
            await sleep(250); // Reduced from 500ms
            continue;
          }

          // Display a message to the user that they can interact with the form
          const formElement = document.querySelector('.jobs-easy-apply-modal__content');
          if (formElement) {
            console.log("✍️ Form is ready - you can fill in fields and the script will wait for you to finish");
          }

          // Wait for form completion (user filling fields)
          console.log("Waiting for form completion...");
          const formCompleted = await waitForFormCompletion(isRunning);
          
          if (!formCompleted) {
            console.log("Form completion timed out");
            setContinuing(false);
            // Make sure to click close button before breaking
            await clickElement(SELECTORS.CLOSE_BUTTON);
            break;
          }
          
          console.log("All fields filled, proceeding to next step");
          
          // Try to click next/submit button
          const buttonClicked = await handleButtonClick(jobTitle, companyName, nextJob, appliedJobIds);
          
          if (!buttonClicked) {
            retryCount++;
            console.log(`Failed to click button, retry ${retryCount}/${maxRetries}`);
            if (retryCount >= maxRetries) {
              await clickElement(SELECTORS.CLOSE_BUTTON);
              setContinuing(false);
              break;
            }
            await sleep(500); // Reduced from 1000ms
            continue;
          }

          // Reset retry count after successful button click
          retryCount = 0;
          
          // Wait for new form to load or submit to complete
          await sleep(1000); // Reduced from 2000ms
          
          // Check if we're still in the application modal
          const modal = document.querySelector('.artdeco-modal__content.jobs-easy-apply-modal__content');
          if (!modal) {
            console.log("Application completed successfully");
            currentFormCompleted = true;
            break;
          }

          // After clicking any button, check for save popup
          if (buttonClicked) {
            await sleep(250); // Reduced from 500ms
            if (await handleSaveApplicationPopup()) {
              await sleep(250); // Reduced from 500ms
            }
          }
        }

        // Only mark as applied if we completed the application
        if (currentFormCompleted) {
          console.log("Application successfully completed, waiting before moving to next job");
          // Note: We don't need to call markJobAsApplied here since it's already handled in trackSuccessfulApplication
          await sleep(1500); // Reduced from 3000ms - wait before moving to next job
        } else {
          console.log("Application not completed, closing modal");
          // Make sure to click close button here as well
          await clickElement(SELECTORS.CLOSE_BUTTON);
          
          // Still mark the job as applied to avoid getting stuck
          // Get the job ID if possible
          const jobId = nextJob.closest('[data-job-id]')?.getAttribute('data-job-id') || 
                      window.location.href.match(/\/view\/(\d+)\//)?.[1];
          
          if (jobId && !appliedJobIds.has(jobId)) {
            // Add to our tracking set
            appliedJobIds.add(jobId);
            
            // Mark in DOM
            markJobAsApplied(nextJob);
            
            // Add to storage
            chrome.storage.local.get(['appliedJobIds'], result => {
              const storedIds = result.appliedJobIds || [];
              storedIds.push(jobId);
              chrome.storage.local.set({ appliedJobIds: [...new Set(storedIds)] });
            });
          } else {
            // Just mark in DOM if we can't get the ID
            markJobAsApplied(nextJob);
          }
        }

      } catch (error) {
        console.error("Error during application process:", error);
        // Check for save popup before closing
        await handleSaveApplicationPopup();
        await clickElement(SELECTORS.CLOSE_BUTTON);
        
        // Mark job as applied to avoid getting stuck
        if (nextJob) {
          const jobId = nextJob.closest('[data-job-id]')?.getAttribute('data-job-id') || 
                      window.location.href.match(/\/view\/(\d+)\//)?.[1];
          
          if (jobId && !appliedJobIds.has(jobId)) {
            // Add to our tracking set
            appliedJobIds.add(jobId);
            
            // Mark in DOM
            markJobAsApplied(nextJob);
            
            // Add to storage
            chrome.storage.local.get(['appliedJobIds'], result => {
              const storedIds = result.appliedJobIds || [];
              storedIds.push(jobId);
              chrome.storage.local.set({ appliedJobIds: [...new Set(storedIds)] });
            });
          } else {
            // Just mark in DOM if we can't get the ID
            markJobAsApplied(nextJob);
          }
        }
        continue;
      }
    }
  } catch (error) {
    console.error("Fatal error in processApplication:", error);
    setContinuing(false);
    await handleSaveApplicationPopup();
    await clickElement(SELECTORS.CLOSE_BUTTON);
  }
}; 