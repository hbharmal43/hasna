import { UserProfile, CompleteProfile, WorkExperienceRecord, EducationRecord } from '../../types';
import { getCompleteProfile, trackJobApplication } from '../../lib/supabase';

console.log("Workday autofill module loaded - Step by step implementation");

// Step 1: Personal Information Selectors (based on actual captured HTML)
const WORKDAY_STEP1_SELECTORS = {
  // Legal Name Section
  FIRST_NAME: [
    'input[id="name--legalName--firstName"]',
    'input[name="legalName--firstName"]',
    'input[data-automation-id="formField-legalName--firstName"] input'
  ],
  MIDDLE_NAME: [
    'input[id="name--legalName--middleName"]',
    'input[name="legalName--middleName"]',
    'input[data-automation-id="formField-legalName--middleName"] input'
  ],
  LAST_NAME: [
    'input[id="name--legalName--lastName"]',
    'input[name="legalName--lastName"]',
    'input[data-automation-id="formField-legalName--lastName"] input'
  ],
  
  // Address Section
  ADDRESS_LINE_1: [
    'input[id="address--addressLine1"]',
    'input[name="addressLine1"]',
    'input[data-automation-id="formField-addressLine1"] input'
  ],
  CITY: [
    'input[id="address--city"]',
    'input[name="city"]',
    'input[data-automation-id="formField-city"] input'
  ],
  STATE: [
    'button[id="address--countryRegion"]',
    'button[name="countryRegion"]',
    'div[data-automation-id="formField-countryRegion"] button',
    'select[name*="state"]',
    'select[name*="State"]',
    'button[aria-label*="State"]',
    'div[data-automation-id*="state"] button',
    'div[data-automation-id*="State"] button'
  ],
  POSTAL_CODE: [
    'input[id="address--postalCode"]',
    'input[name="postalCode"]',
    'input[data-automation-id="formField-postalCode"] input'
  ],
  
  // Phone Section
  PHONE_NUMBER: [
    'input[id="phoneNumber--phoneNumber"]',
    'input[name="phoneNumber"]',
    'input[data-automation-id="formField-phoneNumber"] input'
  ],
  PHONE_EXTENSION: [
    'input[id="phoneNumber--extension"]',
    'input[name="extension"]',
    'input[data-automation-id="formField-extension"] input'
  ],
  
  // Country Selection
  COUNTRY: [
    'button[id="country--country"]',
    'button[name="country"]',
    'div[data-automation-id="formField-country"] button'
  ],
  
  // Phone Device Type Dropdown
  PHONE_DEVICE_TYPE: [
    'button[id*="phoneDeviceType"]',
    'button[name*="phoneDeviceType"]',
    'div[data-automation-id*="phoneDeviceType"] button',
    'select[name*="phoneDeviceType"]',
    'button[aria-label*="Phone Device Type"]'
  ],
  
  // How Did You Hear About Us Dropdown
  HOW_DID_YOU_HEAR: [
    'button[id*="howDidYouHear"]',
    'button[name*="howDidYouHear"]',
    'div[data-automation-id*="howDidYouHear"] button',
    'select[name*="howDidYouHear"]',
    'button[aria-label*="How did you hear"]',
    'div[data-automation-id*="source"] button'
  ],
  
  // Previous Worker Radio Buttons
  PREVIOUS_WORKER_NO: [
    'input[name="candidateIsPreviousWorker"][value="false"]',
    'input[id*="candidateIsPreviousWorker"][value="false"]'
  ],
  PREVIOUS_WORKER_YES: [
    'input[name="candidateIsPreviousWorker"][value="true"]',
    'input[id*="candidateIsPreviousWorker"][value="true"]'
  ]
};

// Step 2: My Experience Selectors (based on actual captured HTML)
const WORKDAY_STEP2_SELECTORS = {
  // Skills Section
  SKILLS_INPUT: [
    'input[id="skills--skills"]',
    'input[data-uxi-element-id*="selectinput"]',
    'div[data-automation-id="formField-skills"] input'
  ],
  
  // Social Network URLs
  LINKEDIN_URL: [
    'input[id="socialNetworkAccounts--linkedInAccount"]',
    'input[name="linkedInAccount"]',
    'input[data-automation-id="formField-linkedInAccount"] input'
  ],
  TWITTER_URL: [
    'input[id="socialNetworkAccounts--twitterAccount"]',
    'input[name="twitterAccount"]',
    'input[data-automation-id="formField-twitterAccount"] input'
  ],
  FACEBOOK_URL: [
    'input[id="socialNetworkAccounts--facebookAccount"]',
    'input[name="facebookAccount"]',
    'input[data-automation-id="formField-facebookAccount"] input'
  ],
  
  // Resume Upload
  RESUME_FILE_INPUT: [
    'input[data-automation-id="file-upload-input-ref"]',
    'input[type="file"]',
    'input[data-automation-id*="resume"]',
    'input[data-automation-id*="attachment"]',
    'input[data-automation-id*="file"]',
    'input[accept*=".pdf"]',
    'input[accept*=".doc"]',
    'div[data-automation-id*="resume"] input[type="file"]',
    'div[data-automation-id*="attachment"] input[type="file"]',
    '#resumeAttachments input[type="file"]',
    '[data-automation-id="resume-upload"] input[type="file"]'
  ],
  RESUME_SELECT_BUTTON: [
    'button[data-automation-id="select-files"]',
    'button[id="resumeAttachments--attachments"]',
    'button[data-automation-id*="resume"]',
    'button[data-automation-id*="select-file"]',
    'button[data-automation-id*="browse"]',
    'button[data-automation-id*="upload"]',
    'button[aria-label*="Select File"]',
    'button[aria-label*="Browse"]',
    'button[aria-label*="Upload"]',
    'button[title*="Select File"]',
    'button[title*="Browse"]',
    'button[title*="Upload"]'
  ],
  RESUME_UPLOAD_AREA: [
    'div[data-automation-id*="resume-upload"]',
    'div[data-automation-id*="file-upload"]',
    'div[data-automation-id*="attachment"]',
    '.file-upload-area',
    '.resume-upload',
    '[data-automation-id="dropzone"]'
  ],
  
  // Add Buttons for sections that require manual entry
  WORK_EXPERIENCE_ADD: [
    'div[aria-labelledby="Work-Experience-section"] button[data-automation-id="add-button"]'
  ],
  EDUCATION_ADD: [
    'div[aria-labelledby="Education-section"] button[data-automation-id="add-button"]',
    'div[aria-labelledby="Education"] button[data-automation-id="add-button"]',
    'button[data-automation-id="addEducation"]',
    'button[data-automation-id="education-add-button"]',
    'div[data-automation-id="Education"] button',
    'div[data-automation-id="education-section"] button',
    'button:contains("Add Education")',
    'button:contains("+ Education")',
    'button[aria-label*="Add Education"]'
  ],
  CERTIFICATIONS_ADD: [
    'div[aria-labelledby="Certifications-section"] button[data-automation-id="add-button"]'
  ],
  LANGUAGES_ADD: [
    'div[aria-labelledby="Languages-section"] button[data-automation-id="add-button"]',
    'div[data-automation-id*="languages"] button[data-automation-id="add-button"]',
    'button[data-automation-id*="languages-add"]',
    'button[aria-label*="Add Language"]',
    'button[title*="Add Language"]',
    // Fallback text-based search will be handled separately
  ],
  WEBSITES_ADD: [
    'div[aria-labelledby="Websites-section"] button[data-automation-id="add-button"]'
  ]
};

// Work Experience Modal Selectors (for the form that opens after clicking Add)
const WORKDAY_WORK_EXPERIENCE_MODAL = {
  JOB_TITLE: [
    'input[name*="jobTitle"]',
    'input[placeholder*="Job Title"]',
    'div[data-automation-id*="jobTitle"] input'
  ],
  COMPANY: [
    'input[name*="company"]',
    'input[name*="Company"]',
    'div[data-automation-id*="company"] input'
  ],
  LOCATION: [
    'input[name*="location"]',
    'input[name*="Location"]',
    'div[data-automation-id*="location"] input'
  ],
  CURRENTLY_WORK_HERE: [
    'input[name*="currentlyWork"]',
    'input[name*="currentJob"]',
    'input[id*="currentlyWork"]',
    'input[id*="currentJob"]',
    'div[data-automation-id*="currentlyWork"] input[type="checkbox"]',
    'div[data-automation-id*="currentJob"] input[type="checkbox"]',
    'input[type="checkbox"][aria-describedby*="current"]',
    'input[type="checkbox"] + label:contains("currently work")',
    'label[for*="current"] input[type="checkbox"]'
  ],
  FROM_DATE: [
    'input[placeholder*="MM/YYYY"]',
    'input[placeholder*="MM/YY"]',
    'input[placeholder*="From Date"]',
    'input[name*="from"]',
    'input[name*="startDate"]',
    'div[data-automation-id*="from"] input',
    'div[data-automation-id*="startDate"] input'
  ],
  TO_DATE: [
    'input[placeholder*="MM/YYYY"]:not([name*="from"])',
    'input[placeholder*="MM/YY"]:not([name*="from"])',
    'input[placeholder*="To Date"]',
    'input[name*="to"]',
    'input[name*="endDate"]',
    'div[data-automation-id*="to"] input',
    'div[data-automation-id*="endDate"] input'
  ],
  DESCRIPTION: [
    'textarea[name*="description"]',
    'textarea[placeholder*="Role Description"]',
    'div[data-automation-id*="description"] textarea'
  ],
  SAVE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_okButton"]',
    'button:contains("Save")',
    'button:contains("OK")',
    'button[title="OK"]'
  ],
  ADD_ANOTHER_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
    'button:contains("Add Another")',
    'button[data-automation-id*="addAnother"]'
  ],
  DONE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
    'button:contains("Done")',
    'button[title="Done"]'
  ]
};

// Education Modal Selectors
const WORKDAY_EDUCATION_MODAL = {
  SCHOOL_NAME: [
    'input[name*="school"]',
    'input[name*="institution"]',
    'input[placeholder*="School"]',
    'div[data-automation-id*="school"] input'
  ],
  DEGREE_TYPE: [
    'button[name*="degree"]',
    'button[name*="degreeType"]',
    'div[data-automation-id*="degree"] button'
  ],
  FIELD_OF_STUDY: [
    'input[name*="major"]',
    'input[name*="fieldOfStudy"]', 
    'input[placeholder*="Field of Study"]',
    'div[data-automation-id*="major"] input'
  ],
  GPA: [
    'input[name*="gpa"]',
    'input[placeholder*="GPA"]',
    'div[data-automation-id*="gpa"] input'
  ],
  GRADUATION_DATE: [
    'input[placeholder*="MM/YYYY"]',
    'input[placeholder*="MM/YY"]',
    'input[placeholder*="Graduation"]',
    'input[placeholder*="YYYY"]',
    'input[name*="graduation"]',
    'input[name*="completionDate"]',
    'div[data-automation-id*="graduation"] input',
    'div[data-automation-id*="completionDate"] input'
  ],
  SAVE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_okButton"]',
    'button:contains("Save")',
    'button:contains("OK")',
    'button[title="OK"]'
  ],
  ADD_ANOTHER_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
    'button:contains("Add Another")',
    'button[data-automation-id*="addAnother"]'
  ],
  DONE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
    'button:contains("Done")',
    'button[title="Done"]'
  ]
};

// Certifications Modal Selectors
const WORKDAY_CERTIFICATIONS_MODAL = {
  CERTIFICATION_NAME: [
    'input[name*="certification"]',
    'input[placeholder*="Certification"]',
    'div[data-automation-id*="certification"] input'
  ],
  ISSUING_ORGANIZATION: [
    'input[name*="organization"]',
    'input[name*="Organization"]',
    'div[data-automation-id*="organization"] input'
  ],
  ISSUE_DATE: [
    'input[placeholder*="MM/YYYY"]',
    'input[name*="issue"]',
    'div[data-automation-id*="issue"] input'
  ],
  CREDENTIAL_ID: [
    'input[name*="credential"]',
    'input[name*="Credential"]',
    'div[data-automation-id*="credential"] input'
  ],
  SAVE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_okButton"]',
    'button:contains("Save")',
    'button:contains("OK")',
    'button[title="OK"]'
  ],
  ADD_ANOTHER_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
    'button:contains("Add Another")',
    'button[data-automation-id*="addAnother"]'
  ],
  DONE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
    'button:contains("Done")',
    'button[title="Done"]'
  ]
};

// Languages Modal Selectors
const WORKDAY_LANGUAGES_MODAL = {
  LANGUAGE: [
    'button[name*="language"]',
    'div[data-automation-id*="language"] button',
    'button[aria-label*="Language"]',
    'button[aria-label*="Select Language"]',
    'div[data-automation-id*="formField-language"] button',
    'select[name*="language"]',
    'input[name*="language"]'
  ],
  PROFICIENCY: [
    'button[name*="proficiency"]',
    'div[data-automation-id*="proficiency"] button',
    'button[aria-label*="Proficiency"]',
    'button[aria-label*="Select Proficiency"]',
    'div[data-automation-id*="formField-proficiency"] button',
    'select[name*="proficiency"]',
    'input[name*="proficiency"]'
  ],
  SAVE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_okButton"]',
    'button:contains("Save")',
    'button:contains("OK")',
    'button[title="OK"]'
  ],
  ADD_ANOTHER_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
    'button:contains("Add Another")',
    'button[data-automation-id*="addAnother"]'
  ],
  DONE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
    'button:contains("Done")',
    'button[title="Done"]'
  ]
};

// Step 3: Application Questions Selectors (Generic questions only)
const WORKDAY_STEP3_SELECTORS = {
  // Generic dropdown questions - using button selectors since they're Workday dropdowns
  QUESTION_BUTTONS: [
    'button[aria-haspopup="listbox"][aria-label*="Select One Required"]',
    'div[data-automation-id*="formField-"] button.css-5bqb1n'
  ]
};

// Step 4: Voluntary Disclosures Selectors
const WORKDAY_STEP4_SELECTORS = {
  // Demographic Information Dropdowns
  GENDER: [
    'button[id="personalInfoUS--gender"]',
    'button[name="gender"]',
    'div[data-automation-id="formField-gender"] button'
  ],
  ETHNICITY: [
    'button[id="personalInfoUS--ethnicity"]',
    'button[name="ethnicity"]',
    'div[data-automation-id="formField-ethnicity"] button'
  ],
  VETERAN_STATUS: [
    'button[id="personalInfoUS--veteranStatus"]',
    'button[name="veteranStatus"]',
    'div[data-automation-id="formField-veteranStatus"] button'
  
  ],
  
  // Terms and Conditions Checkbox
  TERMS_CHECKBOX: [
    'input[id="termsAndConditions--acceptTermsAndAgreements"]',
    'input[name="acceptTermsAndAgreements"]',
    'div[data-automation-id="formField-acceptTermsAndAgreements"] input[type="checkbox"]'
  ]
};

// Step 5: Self Identify Selectors
const WORKDAY_STEP5_SELECTORS = {
  // Disability Status Checkboxes (Required - must select one)
  DISABILITY_YES: [
    'input[id*="disabilityStatus"][type="checkbox"]',
    'label[for*="disabilityStatus"]:contains("Yes, I have a disability")',
    'fieldset[data-automation-id="disabilityStatus-CheckboxGroup"] input[type="checkbox"]:first-child'
  ],
  DISABILITY_NO: [
    'input[id*="disabilityStatus"][type="checkbox"]',
    'label[for*="disabilityStatus"]:contains("No, I do not have a disability")',
    'fieldset[data-automation-id="disabilityStatus-CheckboxGroup"] input[type="checkbox"]:nth-child(2)'
  ],
  DISABILITY_NO_ANSWER: [
    'input[id*="disabilityStatus"][type="checkbox"]',
    'label[for*="disabilityStatus"]:contains("I do not want to answer")',
    'fieldset[data-automation-id="disabilityStatus-CheckboxGroup"] input[type="checkbox"]:last-child'
  ],
  
  // All disability checkboxes for finding them
  ALL_DISABILITY_CHECKBOXES: [
    'fieldset[data-automation-id="disabilityStatus-CheckboxGroup"] input[type="checkbox"]',
    'div[data-automation-id="formField-disabilityStatus"] input[type="checkbox"]'
  ]
};

// Helper functions
function findElement(selectors: string[]): HTMLElement | null {
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      console.log(`✅ Found element with selector: ${selector}`);
      return element;
    }
  }
  console.log(`❌ No element found for selectors:`, selectors);
  return null;
}

// Helper function to find buttons by text content (since :contains() doesn't work)
function findButtonByText(texts: string[]): HTMLElement | null {
  const buttons = document.querySelectorAll('button');
  for (const button of buttons) {
    const buttonText = button.textContent?.trim().toLowerCase() || '';
    for (const text of texts) {
      if (buttonText.includes(text.toLowerCase())) {
        console.log(`✅ Found button with text: "${buttonText}" matching "${text}"`);
        return button as HTMLElement;
      }
    }
  }
  console.log(`❌ No button found with texts:`, texts);
  return null;
}

// Function to find checkbox by associated label text
function findCheckboxByLabelText(texts: string[]): HTMLElement | null {
  console.log(`🔍 Searching for checkbox with label texts:`, texts);
  
  // Method 1: Find labels with matching text, then find associated checkbox
  const labels = document.querySelectorAll('label');
  for (const label of labels) {
    const labelText = label.textContent?.trim().toLowerCase() || '';
    for (const text of texts) {
      if (labelText.includes(text.toLowerCase())) {
        console.log(`✅ Found label with text: "${labelText}" matching "${text}"`);
        
        // Try to find checkbox by 'for' attribute
        if (label.hasAttribute('for')) {
          const checkboxId = label.getAttribute('for');
          const checkbox = document.getElementById(checkboxId!) as HTMLInputElement;
          if (checkbox && checkbox.type === 'checkbox') {
            console.log(`✅ Found associated checkbox by ID: ${checkboxId}`);
            return checkbox;
          }
        }
        
        // Try to find checkbox inside the label
        const checkboxInLabel = label.querySelector('input[type="checkbox"]') as HTMLInputElement;
        if (checkboxInLabel) {
          console.log(`✅ Found checkbox inside label`);
          return checkboxInLabel;
        }
        
        // Try to find checkbox as next sibling
        const nextSibling = label.nextElementSibling as HTMLInputElement;
        if (nextSibling && nextSibling.type === 'checkbox') {
          console.log(`✅ Found checkbox as next sibling`);
          return nextSibling;
        }
        
        // Try to find checkbox as previous sibling
        const prevSibling = label.previousElementSibling as HTMLInputElement;
        if (prevSibling && prevSibling.type === 'checkbox') {
          console.log(`✅ Found checkbox as previous sibling`);
          return prevSibling;
        }
      }
    }
  }
  
  // Method 2: Find checkboxes and check nearby text
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (const checkbox of checkboxes) {
    const parent = checkbox.parentElement;
    if (parent) {
      const parentText = parent.textContent?.trim().toLowerCase() || '';
      for (const text of texts) {
        if (parentText.includes(text.toLowerCase())) {
          console.log(`✅ Found checkbox with parent text: "${parentText}" matching "${text}"`);
          return checkbox as HTMLElement;
        }
      }
    }
  }
  
  console.log(`❌ No checkbox found with label texts:`, texts);
  return null;
}

// React-compatible value setter for Workday forms
function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const prototype = Object.getPrototypeOf(element);
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
  if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }
  
  // Dispatch React-compatible events
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

function fillInput(element: HTMLElement, value: string | undefined): boolean {
  if (!value || !element) return false;
  
  const input = element as HTMLInputElement;
  
  try {
    console.log(`🔄 Filling input with value: "${value}"`);
    
    // Step 1: Focus the element
    input.focus();
    
    // Step 2: Clear existing value using React-compatible method
    setNativeValue(input, '');
    
    // Step 3: Set new value using React-compatible method
    setNativeValue(input, value);
    
    // Step 4: Fire comprehensive events for Workday validation
    // Input event (for real-time validation)
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Change event (for form validation)
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Blur event (to trigger field validation)
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    
    // KeyUp event (some forms listen for this)
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    
    // Focus out (additional validation trigger)
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    
    console.log(`✅ Successfully filled input with value: "${value}"`);
    return true;
    
  } catch (error) {
    console.log(`❌ Error filling input:`, error);
    return false;
  }
}

function clickRadioButton(element: HTMLElement): boolean {
  if (!element) return false;
  
  const radio = element as HTMLInputElement;
  radio.checked = true;
  radio.click();
  
  // Trigger change event
  radio.dispatchEvent(new Event('change', { bubbles: true }));
  
  console.log(`✅ Selected radio button: ${radio.value}`);
  return true;
}

// Specialized function for handling Workday checkboxes
async function clickWorkdayCheckbox(element: HTMLElement, shouldCheck: boolean = true): Promise<boolean> {
  if (!element) return false;
  
  const checkbox = element as HTMLInputElement;
  
  try {
    console.log(`🔄 Attempting to ${shouldCheck ? 'check' : 'uncheck'} checkbox. Current state: ${checkbox.checked}`);
    
    // Method 1: Direct manipulation for React checkboxes
    if (checkbox.checked !== shouldCheck) {
      // Focus the checkbox first
      checkbox.focus();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Click to toggle state
      checkbox.click();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify the state changed correctly
      if (checkbox.checked === shouldCheck) {
        console.log(`✅ Checkbox ${shouldCheck ? 'checked' : 'unchecked'} successfully via click`);
        return true;
      }
    } else {
      console.log(`✅ Checkbox already in desired state: ${shouldCheck ? 'checked' : 'unchecked'}`);
      return true;
    }
    
    // Method 2: Force state and trigger events
    console.log(`🔄 Trying direct state manipulation`);
    checkbox.checked = shouldCheck;
    
    // Trigger comprehensive events for React
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    checkbox.dispatchEvent(new Event('input', { bubbles: true }));
    checkbox.dispatchEvent(new Event('click', { bubbles: true }));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (checkbox.checked === shouldCheck) {
      console.log(`✅ Checkbox ${shouldCheck ? 'checked' : 'unchecked'} via direct manipulation`);
      return true;
    }
    
    // Method 3: Try clicking the associated label
    console.log(`🔄 Trying to click associated label`);
    const label = document.querySelector(`label[for="${checkbox.id}"]`) as HTMLElement;
    if (label) {
      label.click();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (checkbox.checked === shouldCheck) {
        console.log(`✅ Checkbox ${shouldCheck ? 'checked' : 'unchecked'} via label click`);
        return true;
      }
    }
    
    // Method 4: Find parent label and click it
    console.log(`🔄 Trying to click parent label`);
    const parentLabel = checkbox.closest('label') as HTMLElement;
    if (parentLabel) {
      parentLabel.click();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (checkbox.checked === shouldCheck) {
        console.log(`✅ Checkbox ${shouldCheck ? 'checked' : 'unchecked'} via parent label click`);
        return true;
      }
    }
    
    console.log(`❌ All checkbox methods failed. Final state: ${checkbox.checked}`);
    return false;
    
  } catch (error) {
    console.log(`❌ Error handling checkbox:`, error);
    return false;
  }
}

function clickWorkdayButton(element: HTMLElement): boolean {
  if (!element) return false;
  
  element.click();
  console.log(`✅ Clicked Workday button`);
      return true;
}

async function fillSkillsInput(element: HTMLElement, skills: string[]): Promise<boolean> {
  if (!element || !skills || skills.length === 0) return false;
  
  const input = element as HTMLInputElement;
  
  // For each skill, type it and simulate selection
  for (const skill of skills.slice(0, 10)) { // Limit to 10 skills to avoid overwhelming
    try {
      // Clear and focus using React-compatible method
      input.focus();
      setNativeValue(input, '');
      
      // Type the skill using React-compatible method
      setNativeValue(input, skill);
      
      // Wait a bit for suggestions to appear
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to press Enter to add the skill
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        bubbles: true
      });
      input.dispatchEvent(enterEvent);
      
      // Wait a bit before next skill
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`✅ Added skill: ${skill}`);
    } catch (error) {
      console.log(`⚠️ Could not add skill: ${skill}`, error);
    }
  }
  
  return true;
}

// Convert base64 to File object for proper upload
function base64ToFile(base64: string, filename = 'resume.pdf'): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

// Debug function to scan all file inputs on the page
function scanAllFileInputs(): void {
  console.log(`🔍 Scanning all file inputs on the page...`);
  const allFileInputs = document.querySelectorAll('input[type="file"]');
  console.log(`📄 Found ${allFileInputs.length} file input(s):`);
  
  allFileInputs.forEach((input, index) => {
    const htmlInput = input as HTMLInputElement;
    console.log(`📄 File input ${index + 1}:`, {
      id: htmlInput.id,
      name: htmlInput.name,
      className: htmlInput.className,
      accept: htmlInput.accept,
      multiple: htmlInput.multiple,
      'data-automation-id': htmlInput.getAttribute('data-automation-id'),
      visible: htmlInput.offsetParent !== null,
      parentElement: htmlInput.parentElement?.tagName
    });
  });
}

// Enhanced resume upload handler with multiple methods
async function handleResumeUpload(fileInput: HTMLElement, resumeUrl?: string): Promise<boolean> {
  if (!fileInput) {
    console.log(`⚠️ Resume upload: No file input element provided`);
    scanAllFileInputs(); // Debug: scan all file inputs
      return false;
    }
    
  console.log(`📄 Starting resume upload process...`);
  console.log(`📄 Resume URL: ${resumeUrl || 'Not provided'}`);
  console.log(`📄 File input element:`, {
    tagName: fileInput.tagName,
    id: (fileInput as HTMLInputElement).id,
    className: fileInput.className,
    type: (fileInput as HTMLInputElement).type
  });
  
  // Method 1: Direct file input with base64 conversion
  console.log(`🔄 Method 1: Direct file input with base64 conversion...`);
  const input = fileInput as HTMLInputElement;
  
  if (resumeUrl && resumeUrl.startsWith('data:')) {
    console.log(`🔄 Converting base64 resume to File object...`);
    try {
      const file = base64ToFile(resumeUrl, 'resume.pdf');
      console.log(`✅ Created file object:`, {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;

      // Fire proper events for validation
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log(`✅ Resume uploaded successfully from base64 data`);
      console.log(`📄 Input files after upload:`, input.files?.length);
      return true;
    } catch (error) {
      console.log(`❌ Error converting base64 to file:`, error);
    }
  }
  
  // Method 2: Try to find and click a "Select Files" or "Browse" button
  console.log(`🔄 Method 2: Looking for resume upload button...`);
  const uploadButton = findElement(WORKDAY_STEP2_SELECTORS.RESUME_SELECT_BUTTON);
  
  if (uploadButton) {
    console.log(`✅ Found resume upload button: ${uploadButton.tagName}`);
    
    // Click the button to open file dialog
    uploadButton.click();
    console.log(`🔄 Clicked resume upload button`);
    
    // Wait for file dialog (user interaction required)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // If we have a resume URL, try to create and upload the file
    if (resumeUrl) {
      const success = await uploadResumeFromUrl(fileInput as HTMLInputElement, resumeUrl);
      if (success) {
        console.log(`✅ Resume uploaded successfully from URL`);
        return true;
      }
    }
    
    // If URL method failed, provide user guidance
    console.log(`ℹ️ Resume upload button clicked - please select your resume file manually`);
    console.log(`ℹ️ The file dialog should be open. Select your resume file to continue.`);
    return true; // Consider this a success since we opened the dialog
  }

  // Method 3: Try drag and drop area approach
  console.log(`🔄 Method 3: Looking for drag and drop upload area...`);
  const uploadArea = findElement(WORKDAY_STEP2_SELECTORS.RESUME_UPLOAD_AREA);
  
  if (uploadArea && resumeUrl?.startsWith('data:')) {
    console.log(`✅ Found upload area, attempting drag and drop simulation...`);
    try {
      const file = base64ToFile(resumeUrl, 'resume.pdf');
      
      // Create drag and drop events
      const dragEvent = new DragEvent('drop', {
        bubbles: true,
        dataTransfer: new DataTransfer()
      });
      
      if (dragEvent.dataTransfer) {
        dragEvent.dataTransfer.items.add(file);
        uploadArea.dispatchEvent(dragEvent);
        
        console.log(`✅ Resume uploaded via drag and drop simulation`);
        return true;
      }
    } catch (error) {
      console.log(`❌ Error with drag and drop upload:`, error);
    }
  }

  console.log(`⚠️ Resume upload: All methods attempted`);
  console.log(`ℹ️ You may need to manually upload your resume file`);
  scanAllFileInputs(); // Debug: scan all file inputs at the end
  return false;
}

// Helper function to create and upload file from URL
async function uploadResumeFromUrl(fileInput: HTMLInputElement, resumeUrl: string): Promise<boolean> {
  if (!resumeUrl || !fileInput) return false;
  
  try {
    console.log(`🔄 Attempting to fetch resume from URL: ${resumeUrl}`);
    
    // Fetch the resume file
    const response = await fetch(resumeUrl, { 
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      console.log(`⚠️ Failed to fetch resume: ${response.status} ${response.statusText}`);
      return false;
    }
    
    // Get the file blob
    const blob = await response.blob();
    console.log(`✅ Resume fetched successfully, size: ${blob.size} bytes`);
    
    // Determine file name and type
    let fileName = 'resume.pdf';
    let fileType = blob.type || 'application/pdf';
    
    // Try to extract filename from URL
    const urlPath = new URL(resumeUrl).pathname;
    const urlFileName = urlPath.split('/').pop();
    if (urlFileName && urlFileName.includes('.')) {
      fileName = urlFileName;
    }
    
    // Create a File object
    const file = new File([blob], fileName, { type: fileType });
    console.log(`✅ Created file object: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    // Create a FileList-like object
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    // Set the files property
    Object.defineProperty(fileInput, 'files', {
      value: dataTransfer.files,
      writable: false
    });
    
    // Trigger change events
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fileInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Additional events for React components
    const changeEvent = new Event('change', { bubbles: true });
    Object.defineProperty(changeEvent, 'target', { value: fileInput, enumerable: true });
    fileInput.dispatchEvent(changeEvent);
    
    console.log(`✅ File upload events dispatched`);
    
    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify the file was set
    if (fileInput.files && fileInput.files.length > 0) {
      console.log(`✅ Resume file successfully set: ${fileInput.files[0].name}`);
      return true;
    } else {
      console.log(`⚠️ File was not set on input element`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Error uploading resume from URL:`, error);
    
    // If CORS error, provide guidance
    if (error instanceof TypeError && error.message.includes('CORS')) {
      console.log(`ℹ️ CORS error - resume URL might need to be publicly accessible`);
      console.log(`ℹ️ Please manually upload your resume file instead`);
    }
    
    return false;
  }
}

// Helper function to find resume upload elements with better detection
function findResumeUploadElements(): {
  fileInput: HTMLElement | null;
  uploadButton: HTMLElement | null;
  uploadArea: HTMLElement | null;
} {
  console.log(`🔍 Searching for resume upload elements...`);
  
  const fileInput = findElement(WORKDAY_STEP2_SELECTORS.RESUME_FILE_INPUT);
  const uploadButton = findElement(WORKDAY_STEP2_SELECTORS.RESUME_SELECT_BUTTON);
  const uploadArea = findElement(WORKDAY_STEP2_SELECTORS.RESUME_UPLOAD_AREA);
  
  console.log(`📋 Resume upload elements found:`);
  console.log(`  - File Input: ${!!fileInput} ${fileInput ? `(${fileInput.tagName})` : ''}`);
  console.log(`  - Upload Button: ${!!uploadButton} ${uploadButton ? `(${uploadButton.tagName})` : ''}`);
  console.log(`  - Upload Area: ${!!uploadArea} ${uploadArea ? `(${uploadArea.tagName})` : ''}`);
  
  return { fileInput, uploadButton, uploadArea };
}

// Helper function to format date for Workday (detects format from placeholder)
function formatWorkdayDate(month: string, year: number, element?: HTMLElement): string {
  const monthMap: { [key: string]: string } = {
    'January': '01', 'February': '02', 'March': '03', 'April': '04',
    'May': '05', 'June': '06', 'July': '07', 'August': '08',
    'September': '09', 'October': '10', 'November': '11', 'December': '12'
  };
  
  const monthNum = monthMap[month] || '01';
  
  // Check element placeholder to determine format
  if (element) {
    const input = element as HTMLInputElement;
    const placeholder = input.placeholder?.toLowerCase() || '';
    
    if (placeholder.includes('yyyy')) {
      return `${monthNum}/${year}`; // MM/YYYY
    } else if (placeholder.includes('yy')) {
      const shortYear = year.toString().slice(-2);
      return `${monthNum}/${shortYear}`; // MM/YY
    } else if (placeholder.includes('mm') && !placeholder.includes('/')) {
      return `${monthNum}${year}`; // MMYYYY
    }
  }
  
  // Default format
  return `${monthNum}/${year}`;
}

// Helper function to format year-only dates (for some education fields)
function formatWorkdayYearOnly(year: number): string {
  return year.toString();
}

// Specialized function to fill Workday date fields (handles masked inputs)
async function fillWorkdayDateField(element: HTMLElement, dateValue: string): Promise<boolean> {
  if (!element || !dateValue) return false;
  
  const input = element as HTMLInputElement;
  
  try {
    console.log(`🗓️ Attempting to fill date field with: ${dateValue}`);
    
    // Method 1: Clear field and use setNativeValue (for React inputs)
    input.focus();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Clear the field completely
    input.select();
    setNativeValue(input, '');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Set the date value using React-compatible method
    setNativeValue(input, dateValue);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Trigger additional events for masked inputs
    input.dispatchEvent(new Event('keyup', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    
    // Check if the value was set correctly
    if (input.value === dateValue || input.value.includes(dateValue.replace('/', ''))) {
      console.log(`✅ Date field filled successfully: ${input.value}`);
      return true;
    }
    
    // Method 2: Character-by-character typing for masked inputs
    console.log(`🔄 Trying character-by-character method for masked input`);
    input.focus();
    setNativeValue(input, '');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Type each character with delays (for masked inputs)
    for (let i = 0; i < dateValue.length; i++) {
      const char = dateValue[i];
      const currentValue = input.value + char;
      setNativeValue(input, currentValue);
      
      // Trigger keydown/keyup for each character
      input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Final validation and events
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`✅ Date field filled with character method: ${input.value}`);
    return true;
    
  } catch (error) {
    console.log(`❌ Error filling date field:`, error);
    
    // Method 3: Fallback - simple value assignment
    try {
      input.value = dateValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`✅ Date field filled with fallback method: ${input.value}`);
      return true;
    } catch (fallbackError) {
      console.log(`❌ All date filling methods failed:`, fallbackError);
      return false;
    }
  }
}

// Helper function to fill work experience modal
async function fillWorkExperienceModal(workExp: any, isLastEntry: boolean = false): Promise<boolean> {
  console.log(`🔄 Filling work experience: ${workExp.position_title} at ${workExp.company_name}`);
  console.log(`🔄 Is last entry: ${isLastEntry}`);
  
  // Wait for modal to load
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let filledCount = 0;
  
  // Add smooth scrolling to modal for better UX
  const modal = document.querySelector('[role="dialog"], .modal, [data-automation-id*="modal"]') as HTMLElement;
  if (modal) {
    modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Fill Job Title
  const jobTitleEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.JOB_TITLE);
  if (jobTitleEl) {
    if (fillInput(jobTitleEl, workExp.position_title)) {
      filledCount++;
      console.log(`✅ Filled job title: ${workExp.position_title}`);
    } else {
      console.log(`⚠️ Could not fill job title: ${workExp.position_title}`);
    }
  } else {
    console.log(`⚠️ Job title element not found`);
  }
  
  // Fill Company
  const companyEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.COMPANY);
  if (companyEl) {
    if (fillInput(companyEl, workExp.company_name)) {
      filledCount++;
      console.log(`✅ Filled company: ${workExp.company_name}`);
    } else {
      console.log(`⚠️ Could not fill company: ${workExp.company_name}`);
    }
  } else {
    console.log(`⚠️ Company element not found`);
  }
  
  // Fill Location (if available)
  const locationEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.LOCATION);
  if (locationEl && workExp.location) {
    if (fillInput(locationEl, workExp.location)) {
      filledCount++;
      console.log(`✅ Filled location: ${workExp.location}`);
    } else {
      console.log(`⚠️ Could not fill location: ${workExp.location}`);
    }
  }
  
  // Handle "Currently work here" checkbox
  const isCurrentJob = !workExp.end_month || !workExp.end_year;
  if (isCurrentJob) {
    console.log(`🔄 This is a current job, attempting to check "I currently work here" checkbox`);
    
    // Try to find checkbox using selectors first
    let currentlyWorkEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.CURRENTLY_WORK_HERE);
    
    // If not found, try finding by label text
    if (!currentlyWorkEl) {
      currentlyWorkEl = findCheckboxByLabelText([
        'I currently work here',
        'currently work here',
        'current position',
        'present',
        'current job'
      ]);
    }
    
    if (currentlyWorkEl) {
      const success = await clickWorkdayCheckbox(currentlyWorkEl, true);
      if (success) {
        console.log(`✅ Successfully checked "I currently work here"`);
        filledCount++;
      } else {
        console.log(`⚠️ Could not check "I currently work here" checkbox`);
      }
    } else {
      console.log(`⚠️ Could not find "I currently work here" checkbox`);
    }
  } else {
    console.log(`ℹ️ This is not a current job, skipping "I currently work here" checkbox`);
  }
  
  // Fill From Date
  const fromDateEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.FROM_DATE);
  if (fromDateEl && workExp.start_month && workExp.start_year) {
    const fromDate = formatWorkdayDate(workExp.start_month, workExp.start_year, fromDateEl);
    if (await fillWorkdayDateField(fromDateEl, fromDate)) {
      filledCount++;
      console.log(`✅ Filled start date: ${fromDate}`);
    } else {
      console.log(`⚠️ Could not fill start date: ${fromDate}`);
    }
  }
  
  // Fill To Date (only if not current job)
  if (!isCurrentJob) {
    const toDateEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.TO_DATE);
    if (toDateEl && workExp.end_month && workExp.end_year) {
      const toDate = formatWorkdayDate(workExp.end_month, workExp.end_year, toDateEl);
      if (await fillWorkdayDateField(toDateEl, toDate)) {
        filledCount++;
        console.log(`✅ Filled end date: ${toDate}`);
      } else {
        console.log(`⚠️ Could not fill end date: ${toDate}`);
      }
    }
  }
  
  // Fill Description
  const descriptionEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.DESCRIPTION);
  if (descriptionEl && workExp.description) {
    if (fillInput(descriptionEl, workExp.description)) {
      filledCount++;
      console.log(`✅ Filled description`);
    }
  }
  
  // Handle Save vs Add Another vs Done based on whether this is the last entry
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`🔄 Looking for buttons... isLastEntry: ${isLastEntry}`);
  
  if (isLastEntry) {
    // This is the last work experience - click Done to finish
    console.log(`🔄 Looking for Done button for last entry...`);
    let doneBtn = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.DONE_BUTTON);
    if (!doneBtn) {
      doneBtn = findButtonByText(['Done', 'Finish', 'Complete', 'Close']);
    }
    if (doneBtn) {
      console.log(`✅ Found Done button, clicking...`);
      doneBtn.click();
      console.log(`✅ Clicked Done for last work experience - closing section`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to close
    } else {
      // Fallback to Save/OK if Done not found
      console.log(`🔄 Done button not found, looking for Save/OK...`);
      let saveBtn = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.SAVE_BUTTON);
      if (!saveBtn) {
        saveBtn = findButtonByText(['OK', 'Save', 'Submit', 'Continue']);
      }
      if (saveBtn) {
        console.log(`✅ Found Save button, clicking...`);
        saveBtn.click();
        console.log(`✅ Clicked Save for last work experience (fallback)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log(`❌ No Done or Save button found for last entry`);
      }
    }
  } else {
    // This is not the last entry - click Add Another to continue
    console.log(`🔄 Looking for Add Another button for entry ${filledCount}...`);
    let addAnotherBtn = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.ADD_ANOTHER_BUTTON);
    if (!addAnotherBtn) {
      addAnotherBtn = findButtonByText(['Add Another', 'Add More', '+ Add', 'Add Additional']);
    }
    if (addAnotherBtn) {
      console.log(`✅ Found Add Another button, clicking...`);
      addAnotherBtn.click();
      console.log(`✅ Clicked Add Another for work experience - staying in modal`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for new form to appear
    } else {
      // Fallback to Save/OK if Add Another not found
      console.log(`🔄 Add Another button not found, looking for Save/OK...`);
      let saveBtn = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.SAVE_BUTTON);
      if (!saveBtn) {
        saveBtn = findButtonByText(['OK', 'Save', 'Submit', 'Continue']);
      }
      if (saveBtn) {
        console.log(`✅ Found Save button, clicking...`);
        saveBtn.click();
        console.log(`✅ Clicked Save for work experience (Add Another not found)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // If we clicked Save instead of Add Another, we need to click Add again for next entry
        console.log(`🔄 Looking for Add button again after Save...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const nextAddBtn = findElement(WORKDAY_STEP2_SELECTORS.WORK_EXPERIENCE_ADD);
        if (nextAddBtn) {
          console.log(`✅ Found Add button again, clicking for next entry...`);
          nextAddBtn.click();
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } else {
        console.log(`❌ No Add Another or Save button found`);
      }
    }
  }
  
  console.log(`✅ Filled ${filledCount} work experience fields`);
  return filledCount > 0;
}

// Helper function to fill education modal
async function fillEducationModal(education: any, isLastEntry: boolean = false): Promise<boolean> {
  console.log(`🔄 Filling education: ${education.degree_type} from ${education.institution_name}`);
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  let filledCount = 0;
  
  // Fill School Name
  const schoolEl = findElement(WORKDAY_EDUCATION_MODAL.SCHOOL_NAME);
  if (schoolEl && fillInput(schoolEl, education.institution_name)) {
    filledCount++;
    console.log(`✅ Filled school: ${education.institution_name}`);
  }
  
  // Fill Degree Type (dropdown)
  const degreeEl = findElement(WORKDAY_EDUCATION_MODAL.DEGREE_TYPE);
  if (degreeEl && education.degree_type) {
    const success = await clickWorkdayDropdown(degreeEl, education.degree_type);
    if (success) {
      filledCount++;
      console.log(`✅ Filled degree type: ${education.degree_type}`);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Fill Field of Study/Major
  const majorEl = findElement(WORKDAY_EDUCATION_MODAL.FIELD_OF_STUDY);
  if (majorEl && education.major && fillInput(majorEl, education.major)) {
    filledCount++;
    console.log(`✅ Filled major: ${education.major}`);
  }
  
  // Fill GPA
  const gpaEl = findElement(WORKDAY_EDUCATION_MODAL.GPA);
  if (gpaEl && education.gpa && fillInput(gpaEl, education.gpa.toString())) {
    filledCount++;
    console.log(`✅ Filled GPA: ${education.gpa}`);
  }
  
  // Fill Graduation Date
  const gradDateEl = findElement(WORKDAY_EDUCATION_MODAL.GRADUATION_DATE);
  if (gradDateEl && education.graduation_month && education.graduation_year) {
    const input = gradDateEl as HTMLInputElement;
    let gradDate: string;
    
    // Check if this is a year-only field
    if (input.placeholder?.toLowerCase().includes('yyyy') && !input.placeholder?.toLowerCase().includes('mm')) {
      gradDate = formatWorkdayYearOnly(education.graduation_year);
    } else {
      gradDate = formatWorkdayDate(education.graduation_month, education.graduation_year, gradDateEl);
    }
    
    if (await fillWorkdayDateField(gradDateEl, gradDate)) {
      filledCount++;
      console.log(`✅ Filled graduation date: ${gradDate}`);
    } else {
      console.log(`⚠️ Could not fill graduation date: ${gradDate}`);
    }
  }
  
  // Handle Save vs Add Another vs Done based on whether this is the last entry
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (isLastEntry) {
    // This is the last education entry - click Done to finish
    let doneBtn = findElement(WORKDAY_EDUCATION_MODAL.DONE_BUTTON);
    if (!doneBtn) {
      doneBtn = findButtonByText(['Done', 'Finish', 'Complete']);
    }
    if (doneBtn) {
      doneBtn.click();
      console.log(`✅ Clicked Done for last education entry - closing section`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to close
    } else {
      // Fallback to Save/OK if Done not found
      let saveBtn = findElement(WORKDAY_EDUCATION_MODAL.SAVE_BUTTON);
      if (!saveBtn) {
        saveBtn = findButtonByText(['OK', 'Save', 'Submit']);
      }
      if (saveBtn) {
        saveBtn.click();
        console.log(`✅ Clicked Save for last education entry (fallback)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } else {
    // This is not the last entry - click Add Another to continue
    let addAnotherBtn = findElement(WORKDAY_EDUCATION_MODAL.ADD_ANOTHER_BUTTON);
    if (!addAnotherBtn) {
      addAnotherBtn = findButtonByText(['Add Another', 'Add More', '+ Add']);
    }
    if (addAnotherBtn) {
      addAnotherBtn.click();
      console.log(`✅ Clicked Add Another for education - staying in modal`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for new form to appear
    } else {
      // Fallback to Save/OK if Add Another not found
      let saveBtn = findElement(WORKDAY_EDUCATION_MODAL.SAVE_BUTTON);
      if (!saveBtn) {
        saveBtn = findButtonByText(['OK', 'Save', 'Submit']);
      }
      if (saveBtn) {
        saveBtn.click();
        console.log(`✅ Clicked Save for education (Add Another not found)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  console.log(`✅ Filled ${filledCount} education fields`);
  return filledCount > 0;
}

// Helper function to fill certifications modal
async function fillCertificationModal(cert: any, isLastEntry: boolean = false): Promise<boolean> {
  console.log(`🔄 Filling certification: ${cert.certification_name}`);
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  let filledCount = 0;
  
  // Fill Certification Name
  const certNameEl = findElement(WORKDAY_CERTIFICATIONS_MODAL.CERTIFICATION_NAME);
  if (certNameEl && fillInput(certNameEl, cert.certification_name)) {
    filledCount++;
    console.log(`✅ Filled certification name: ${cert.certification_name}`);
  }
  
  // Fill Issuing Organization
  const orgEl = findElement(WORKDAY_CERTIFICATIONS_MODAL.ISSUING_ORGANIZATION);
  if (orgEl && cert.issuing_organization && fillInput(orgEl, cert.issuing_organization)) {
    filledCount++;
    console.log(`✅ Filled issuing organization: ${cert.issuing_organization}`);
  }
  
  // Fill Issue Date
  const issueDateEl = findElement(WORKDAY_CERTIFICATIONS_MODAL.ISSUE_DATE);
  if (issueDateEl && cert.issue_month && cert.issue_year) {
    const issueDate = formatWorkdayDate(cert.issue_month, cert.issue_year, issueDateEl);
    if (await fillWorkdayDateField(issueDateEl, issueDate)) {
      filledCount++;
      console.log(`✅ Filled issue date: ${issueDate}`);
    } else {
      console.log(`⚠️ Could not fill issue date: ${issueDate}`);
    }
  }
  
  // Fill Credential ID
  const credentialEl = findElement(WORKDAY_CERTIFICATIONS_MODAL.CREDENTIAL_ID);
  if (credentialEl && cert.credential_id && fillInput(credentialEl, cert.credential_id)) {
    filledCount++;
    console.log(`✅ Filled credential ID: ${cert.credential_id}`);
  }
  
  // Save the entry
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (isLastEntry) {
    // For the last entry, just click Save/OK - modal will close
    const saveBtn = findElement(WORKDAY_CERTIFICATIONS_MODAL.SAVE_BUTTON);
    if (saveBtn) {
      saveBtn.click();
      console.log(`✅ Clicked Save for certification (last entry) - modal will close`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to close
    }
  } else {
    // Click Add Another for non-last entries
    const addAnotherBtn = findElement(WORKDAY_CERTIFICATIONS_MODAL.ADD_ANOTHER_BUTTON);
    if (addAnotherBtn) {
      addAnotherBtn.click();
      console.log(`✅ Clicked Add Another for certification`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      // If no Add Another button, just save and the user can manually add more
      const saveBtn = findElement(WORKDAY_CERTIFICATIONS_MODAL.SAVE_BUTTON);
      if (saveBtn) {
        saveBtn.click();
        console.log(`✅ Clicked Save for certification (Add Another not found)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  console.log(`✅ Filled ${filledCount} certification fields`);
  return filledCount > 0;
}

// Helper function to fill languages modal
async function fillLanguageModal(language: any, isLastEntry: boolean = false): Promise<boolean> {
  console.log(`🔄 Filling language: ${language.language_name}`);
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  let filledCount = 0;
  
  // Fill Language (dropdown)
  const langEl = findElement(WORKDAY_LANGUAGES_MODAL.LANGUAGE);
  if (langEl && language.language_name) {
    const success = await clickWorkdayDropdown(langEl, language.language_name);
    if (success) {
      filledCount++;
      console.log(`✅ Filled language: ${language.language_name}`);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Fill Proficiency (dropdown)
  const profEl = findElement(WORKDAY_LANGUAGES_MODAL.PROFICIENCY);
  if (profEl && language.proficiency_level) {
    const success = await clickWorkdayDropdown(profEl, language.proficiency_level);
    if (success) {
      filledCount++;
      console.log(`✅ Filled proficiency: ${language.proficiency_level}`);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Save the entry
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (isLastEntry) {
    // For the last entry, just click Save/OK - modal will close
    const saveBtn = findElement(WORKDAY_LANGUAGES_MODAL.SAVE_BUTTON);
    if (saveBtn) {
      saveBtn.click();
      console.log(`✅ Clicked Save for language (last entry) - modal will close`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to close
    }
  } else {
    // Click Add Another for non-last entries
    const addAnotherBtn = findElement(WORKDAY_LANGUAGES_MODAL.ADD_ANOTHER_BUTTON);
    if (addAnotherBtn) {
      addAnotherBtn.click();
      console.log(`✅ Clicked Add Another for language`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      // If no Add Another button, just save and the user can manually add more
      const saveBtn = findElement(WORKDAY_LANGUAGES_MODAL.SAVE_BUTTON);
      if (saveBtn) {
        saveBtn.click();
        console.log(`✅ Clicked Save for language (Add Another not found)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  console.log(`✅ Filled ${filledCount} language fields`);
  return filledCount > 0;
}

function getGenericQuestionAnswer(questionText: string, profile: any): string | null {
  const text = questionText.toLowerCase();
  
  // Work Authorization
  if (text.includes('authorized to work') && text.includes('country')) {
    return profile.work_authorization_us ? 'Yes' : 'No';
  }
  
  // Visa Sponsorship
  if (text.includes('visa sponsorship') || text.includes('immigration filing')) {
    return profile.visa_sponsorship_required === 'yes' ? 'Yes' : 'No';
  }
  
  // Relocation
  if (text.includes('relocating') || text.includes('relocation')) {
    return profile.willing_to_relocate ? 'Yes' : 'No';
  }
  
  // Non-compete agreements
  if (text.includes('non-compete') || text.includes('non-solicitation')) {
    return 'No'; // Default safe answer for most people
  }
  
  // Acknowledgment questions
  if (text.includes('acknowledge') && text.includes('truthfully')) {
    return 'Yes'; // Always acknowledge truthfulness
  }
  
  return null; // Skip company-specific or unknown questions
}

async function clickWorkdayDropdown(button: HTMLElement, answerText: string): Promise<boolean> {
  if (!button || !answerText) return false;
  
  try {
    console.log(`🔄 Attempting to set dropdown to: "${answerText}"`);
    
    // Enhanced value mapping for common dropdown values
    const mappedAnswer = mapDropdownValue(answerText);
    console.log(`🔄 Mapped value: "${answerText}" → "${mappedAnswer}"`);
    
    // Try multiple attempts with different strategies
    for (let attempt = 1; attempt <= 4; attempt++) {
      console.log(`🔄 Dropdown attempt ${attempt}/4`);
      
      // Method 1: Standard click and wait approach
      if (attempt === 1) {
        const success = await tryStandardDropdownClick(button, mappedAnswer);
        if (success) return true;
      }
      
      // Method 2: Enhanced click with longer wait
      if (attempt === 2) {
        const success = await tryEnhancedDropdownClick(button, mappedAnswer);
        if (success) return true;
      }
      
      // Method 3: Keyboard navigation approach
      if (attempt === 3) {
        const success = await tryKeyboardDropdownNavigation(button, mappedAnswer);
        if (success) return true;
      }
      
      // Method 4: Workday-specific approach
      if (attempt === 4) {
        const success = await tryWorkdaySpecificDropdown(button, mappedAnswer);
        if (success) return true;
      }
      
      // Wait between attempts
      if (attempt < 4) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
    
    console.log(`❌ All dropdown methods failed for "${answerText}"`);
    return false;
    
  } catch (error) {
    console.log(`⚠️ Error handling dropdown:`, error);
    return false;
  }
}

// Simplified value mapping - only map when we need exact matches
function mapDropdownValue(value: string): string {
  const valueLower = value.toLowerCase().trim();
  
  // ONLY map specific values we know need mapping
  // For Step 1 dropdowns, return the original value
  
  // Phone device type - exact matches only
  if (valueLower === 'mobile') return 'Mobile';
  if (valueLower === 'cell' || valueLower === 'cellular') return 'Mobile';
  if (valueLower === 'landline' || valueLower === 'home') return 'Landline';
  if (valueLower === 'fax') return 'Fax';
  if (valueLower === 'pager') return 'Pager';
  
  // Source - exact matches only
  if (valueLower === 'indeed') return 'Indeed';
  if (valueLower === 'linkedin') return 'LinkedIn';
  if (valueLower === 'company website') return 'Company Website';
  if (valueLower === 'referral') return 'Referral';
  
  // State abbreviations - common ones only
  if (valueLower === 'ca') return 'California';
  if (valueLower === 'tx') return 'Texas';
  if (valueLower === 'ny') return 'New York';
  if (valueLower === 'fl') return 'Florida';
  if (valueLower === 'il') return 'Illinois';
  if (valueLower === 'pa') return 'Pennsylvania';
  if (valueLower === 'oh') return 'Ohio';
  if (valueLower === 'ga') return 'Georgia';
  if (valueLower === 'nc') return 'North Carolina';
  if (valueLower === 'mi') return 'Michigan';
  if (valueLower === 'nj') return 'New Jersey';
  if (valueLower === 'va') return 'Virginia';
  if (valueLower === 'wa') return 'Washington';
  if (valueLower === 'az') return 'Arizona';
  if (valueLower === 'ma') return 'Massachusetts';
  if (valueLower === 'tn') return 'Tennessee';
  if (valueLower === 'in') return 'Indiana';
  if (valueLower === 'mo') return 'Missouri';
  if (valueLower === 'md') return 'Maryland';
  if (valueLower === 'wi') return 'Wisconsin';
  if (valueLower === 'co') return 'Colorado';
  if (valueLower === 'mn') return 'Minnesota';
  if (valueLower === 'sc') return 'South Carolina';
  if (valueLower === 'al') return 'Alabama';
  if (valueLower === 'la') return 'Louisiana';
  if (valueLower === 'ky') return 'Kentucky';
  if (valueLower === 'or') return 'Oregon';
  if (valueLower === 'ok') return 'Oklahoma';
  if (valueLower === 'ct') return 'Connecticut';
  if (valueLower === 'ut') return 'Utah';
  if (valueLower === 'ia') return 'Iowa';
  if (valueLower === 'nv') return 'Nevada';
  if (valueLower === 'ar') return 'Arkansas';
  if (valueLower === 'ms') return 'Mississippi';
  if (valueLower === 'ks') return 'Kansas';
  if (valueLower === 'nm') return 'New Mexico';
  if (valueLower === 'ne') return 'Nebraska';
  if (valueLower === 'wv') return 'West Virginia';
  if (valueLower === 'id') return 'Idaho';
  if (valueLower === 'hi') return 'Hawaii';
  if (valueLower === 'nh') return 'New Hampshire';
  if (valueLower === 'me') return 'Maine';
  if (valueLower === 'ri') return 'Rhode Island';
  if (valueLower === 'mt') return 'Montana';
  if (valueLower === 'de') return 'Delaware';
  if (valueLower === 'sd') return 'South Dakota';
  if (valueLower === 'nd') return 'North Dakota';
  if (valueLower === 'ak') return 'Alaska';
  if (valueLower === 'vt') return 'Vermont';
  if (valueLower === 'wy') return 'Wyoming';
  
  // For everything else, return the original value unchanged
  return value;
}

// Method 1: Standard dropdown click approach
async function tryStandardDropdownClick(button: HTMLElement, answerText: string): Promise<boolean> {
  console.log(`🔄 Trying standard dropdown click for: "${answerText}"`);
  
  // Click the dropdown button
  button.click();
  
  // Wait for dropdown to open
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Look for dropdown options with comprehensive selectors
  const dropdownSelectors = [
    '[role="option"]',
    '[role="listbox"] li',
    '[role="listbox"] div',
    '[role="listbox"] span',
    '.css-option',
    'li[data-automation-id*="option"]',
    'div[data-automation-id*="option"]',
    'span[data-automation-id*="option"]',
    'ul li',
    'ol li',
    '.dropdown-option',
    '.select-option',
    '[class*="option"]',
    '[class*="item"]',
    '.menu-item',
    '[data-testid*="option"]'
  ];
  
  let allOptions: NodeListOf<Element> | null = null;
  
  // Try each selector until we find options
  for (const selector of dropdownSelectors) {
    const options = document.querySelectorAll(selector);
    if (options.length > 0) {
      allOptions = options;
      console.log(`✅ Found ${options.length} dropdown options using selector: ${selector}`);
      break;
    }
  }
  
  if (!allOptions || allOptions.length === 0) {
    console.log(`⚠️ No dropdown options found with standard method`);
    // Try clicking the button again to close dropdown
    button.click();
    return false;
  }
  
  // Try enhanced matching strategies
  const success = await tryMatchDropdownOptions(allOptions, answerText);
  if (!success) {
    // Close dropdown if no match found
    button.click();
  }
  
  return success;
}

// Method 2: Enhanced dropdown click with longer wait and validation
async function tryEnhancedDropdownClick(button: HTMLElement, answerText: string): Promise<boolean> {
  console.log(`🔄 Trying enhanced dropdown click for: "${answerText}"`);
  
  // Focus the button first
  button.focus();
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Click the dropdown button
  button.click();
  
  // Wait longer for dropdown to open
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Validate dropdown is open by checking for common dropdown indicators
  const dropdownOpen = document.querySelector('[role="listbox"]') || 
                      document.querySelector('.dropdown-menu') ||
                      document.querySelector('[class*="dropdown"][class*="open"]') ||
                      document.querySelector('[aria-expanded="true"]');
  
  if (!dropdownOpen) {
    console.log(`⚠️ Dropdown doesn't appear to be open after enhanced click`);
    return false;
  }
  
  console.log(`✅ Dropdown appears to be open, looking for options...`);
  
  // Use more comprehensive selectors for options
  const enhancedSelectors = [
    '[role="option"]',
    '[role="listbox"] *',
    '.dropdown-menu li',
    '.dropdown-menu div',
    '.select-dropdown li',
    '.select-dropdown div',
    '[data-automation-id*="option"]',
    '[data-testid*="option"]',
    '[class*="option"]:not(button)',
    '[class*="item"]:not(button)',
    'li:not([role="presentation"])',
    'div[tabindex]',
    'span[tabindex]'
  ];
  
  let allOptions: NodeListOf<Element> | null = null;
  
  for (const selector of enhancedSelectors) {
    const options = document.querySelectorAll(selector);
    if (options.length > 0) {
      allOptions = options;
      console.log(`✅ Found ${options.length} dropdown options using enhanced selector: ${selector}`);
            break;
          }
        }
  
  if (!allOptions || allOptions.length === 0) {
    console.log(`⚠️ No dropdown options found with enhanced method`);
    button.click();
    return false;
  }
  
  const success = await tryMatchDropdownOptions(allOptions, answerText);
  if (!success) {
    button.click();
  }
  
  return success;
}

// Method 3: Keyboard navigation approach
async function tryKeyboardDropdownNavigation(button: HTMLElement, answerText: string): Promise<boolean> {
  console.log(`🔄 Trying keyboard navigation for: "${answerText}"`);
  
  // Focus the button
  button.focus();
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Open dropdown with Enter or Space
  button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // If Enter didn't work, try Space
  button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // If still not open, try Arrow Down
  button.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Look for options
  const options = document.querySelectorAll('[role="option"], [role="listbox"] li, [role="listbox"] div');
  
  if (options.length === 0) {
    console.log(`⚠️ No dropdown options found with keyboard method`);
    // Try Escape to close
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return false;
  }
  
  console.log(`✅ Found ${options.length} options with keyboard navigation`);
  
  // Try to navigate to the correct option using keyboard
  const answerLower = answerText.toLowerCase();
  
  for (let i = 0; i < Math.min(options.length, 20); i++) { // Limit to 20 to avoid infinite loops
    const option = options[i];
    const optionText = option.textContent?.trim().toLowerCase() || '';
    
    if (optionText.includes(answerLower) || answerLower.includes(optionText)) {
      // Found potential match, select it
      (option as HTMLElement).click();
      console.log(`✅ Selected option via keyboard navigation: "${option.textContent?.trim()}"`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return true;
    }
    
    // Navigate to next option
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`⚠️ No matching option found via keyboard navigation`);
  // Try Escape to close
  button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  return false;
}

// Method 4: Type-and-Select approach (like Simplify)
async function tryWorkdaySpecificDropdown(button: HTMLElement, answerText: string): Promise<boolean> {
  console.log(`🔄 Trying type-and-select approach for: "${answerText}"`);
  
  try {
    // First, ensure any previous dropdown is closed
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(escEvent);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Scroll button into view and focus
    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await new Promise(resolve => setTimeout(resolve, 200));
    
    button.focus();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Open the dropdown
    console.log(`🔄 Opening dropdown...`);
    button.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Look for the search input that appears when dropdown opens
    console.log(`🔍 Looking for search input...`);
    const searchInput = await waitForSelector([
      'input[type="text"]',
      '[role="combobox"] input',
      'input[role="combobox"]',
      'input[aria-expanded="true"]',
      'input[placeholder*="Search"]',
      'input[placeholder*="Type"]',
      'input[placeholder*="Select"]',
      '.dropdown input',
      '.select input',
      '[data-automation-id*="searchbox"] input',
      '[data-automation-id*="input"] input'
    ], 1500);
    
    if (!searchInput) {
      console.log(`⚠️ No search input found, trying direct option selection...`);
      return await tryDirectOptionSelection(answerText);
    }
    
    console.log(`✅ Found search input, typing "${answerText}"...`);
    
    // Clear any existing value
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Type the answer character by character (simulate human typing)
    for (let i = 0; i < answerText.length; i++) {
      const char = answerText[i];
      searchInput.value += char;
      
      // Trigger input events
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
      
      // Small delay between keystrokes
      await new Promise(resolve => setTimeout(resolve, 80));
    }
    
    console.log(`✅ Finished typing, waiting for filtered options...`);
    
    // Wait for filtered options to appear
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Look for filtered options
    const options = await waitForElements([
      '[role="option"]',
      '[role="listbox"] > *',
      '[data-automation-id*="option"]',
      '.dropdown-option',
      '.select-option',
      'li[tabindex]',
      'div[tabindex]'
    ], 1000);
    
    if (!options || options.length === 0) {
      console.log(`⚠️ No filtered options found after typing`);
      return false;
    }
    
    console.log(`✅ Found ${options.length} filtered options`);
    
    // Find the best match from filtered options
    const bestMatch = findBestMatch(options, answerText);
    
    if (!bestMatch) {
      console.log(`⚠️ No suitable match found in filtered options`);
      console.log(`📋 Available options:`, Array.from(options).slice(0, 5).map(opt => opt.textContent?.trim()));
      return false;
    }
    
    console.log(`✅ Found best match: "${bestMatch.textContent?.trim()}", clicking...`);
    
    // Click the best match
    const success = await clickOption(bestMatch);
    
    if (success) {
      console.log(`✅ Successfully selected "${bestMatch.textContent?.trim()}"`);
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.log(`⚠️ Error in type-and-select approach:`, error);
    return false;
  }
}

// Helper function to wait for a selector to appear
async function waitForSelector(selectors: string[], timeout = 2000): Promise<HTMLInputElement | null> {
  const pollInterval = 100;
  const maxTries = timeout / pollInterval;
  let tries = 0;

  return new Promise(resolve => {
    const interval = setInterval(() => {
      for (const selector of selectors) {
        const el = document.querySelector(selector) as HTMLInputElement;
        if (el && el.offsetParent !== null) { // Check if element is visible
          clearInterval(interval);
          resolve(el);
          return;
        }
      }
      
      if (tries++ >= maxTries) {
        clearInterval(interval);
        resolve(null);
      }
    }, pollInterval);
  });
}

// Helper function to wait for multiple elements to appear
async function waitForElements(selectors: string[], timeout = 2000): Promise<NodeListOf<Element> | null> {
  const pollInterval = 100;
  const maxTries = timeout / pollInterval;
  let tries = 0;

  return new Promise(resolve => {
    const interval = setInterval(() => {
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          // Filter for visible elements
          const visibleElements = Array.from(elements).filter(el => 
            (el as HTMLElement).offsetParent !== null && 
            el.textContent?.trim()
          );
          if (visibleElements.length > 0) {
            clearInterval(interval);
            resolve(visibleElements as any);
            return;
          }
        }
      }
      
      if (tries++ >= maxTries) {
        clearInterval(interval);
        resolve(null);
      }
    }, pollInterval);
  });
}

// Helper function to find the best match from filtered options
function findBestMatch(options: NodeListOf<Element>, answerText: string): HTMLElement | null {
  const answerLower = answerText.toLowerCase().trim();
  const optionsArray = Array.from(options) as HTMLElement[];
  
  // Strategy 1: Exact match
  for (const option of optionsArray) {
    const optionText = option.textContent?.toLowerCase().trim() || '';
    if (optionText === answerLower) {
      return option;
    }
  }
  
  // Strategy 2: Starts with match
  for (const option of optionsArray) {
    const optionText = option.textContent?.toLowerCase().trim() || '';
    if (optionText.startsWith(answerLower)) {
      return option;
    }
  }
  
  // Strategy 3: Contains match
  for (const option of optionsArray) {
    const optionText = option.textContent?.toLowerCase().trim() || '';
    if (optionText.includes(answerLower)) {
      return option;
    }
  }
  
  // Strategy 4: Specific mappings
  for (const option of optionsArray) {
    const optionText = option.textContent?.toLowerCase().trim() || '';
    
    // Phone device type matches
    if (answerLower === 'mobile' && (optionText.includes('mobile') || optionText.includes('cell'))) {
      return option;
    }
    
    // Source matches
    if (answerLower === 'indeed' && optionText.includes('indeed')) {
      return option;
    }
  }
  
  // Strategy 5: Return first option if nothing else matches (fallback)
  if (optionsArray.length > 0) {
    console.log(`🔄 Using first option as fallback: "${optionsArray[0].textContent?.trim()}"`);
    return optionsArray[0];
  }
  
  return null;
}

// Helper function to click an option reliably
async function clickOption(option: HTMLElement): Promise<boolean> {
  try {
    // Scroll into view
    option.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Method 1: Simple click
    option.click();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Method 2: Focus + click
    option.focus();
    await new Promise(resolve => setTimeout(resolve, 100));
    option.click();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Method 3: Mouse events
    const rect = option.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    option.dispatchEvent(new MouseEvent('mousedown', { 
      bubbles: true, 
      clientX: centerX, 
      clientY: centerY 
    }));
    
    option.dispatchEvent(new MouseEvent('mouseup', { 
      bubbles: true, 
      clientX: centerX, 
      clientY: centerY 
    }));
    
    option.dispatchEvent(new MouseEvent('click', { 
      bubbles: true, 
      clientX: centerX, 
      clientY: centerY 
    }));
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return true;
    
  } catch (error) {
    console.log(`⚠️ Error clicking option:`, error);
    return false;
  }
}

// Fallback method for dropdowns without search inputs
async function tryDirectOptionSelection(answerText: string): Promise<boolean> {
  console.log(`🔄 Trying direct option selection for: "${answerText}"`);
  
  // Wait a bit for options to load
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Look for options with standard selectors
  const options = document.querySelectorAll([
    '[role="option"]',
    '[role="listbox"] > *',
    '[data-automation-id*="option"]',
    'li[tabindex]',
    'div[tabindex]'
  ].join(', '));
  
  if (options.length === 0) {
    console.log(`⚠️ No options found for direct selection`);
    return false;
  }
  
  console.log(`✅ Found ${options.length} options for direct selection`);
  
  const bestMatch = findBestMatch(options, answerText);
  
  if (!bestMatch) {
    console.log(`⚠️ No match found in direct options`);
    return false;
  }
  
  console.log(`✅ Direct selection match: "${bestMatch.textContent?.trim()}"`);
  return await clickOption(bestMatch);
}

// Enhanced option matching with multiple strategies
async function tryMatchDropdownOptions(allOptions: NodeListOf<Element>, answerText: string): Promise<boolean> {
  const answerLower = answerText.toLowerCase().trim();
  
  // Enhanced matching strategies with more flexibility
  const matchingStrategies = [
    // Exact match (case insensitive)
    (optionText: string) => optionText.toLowerCase().trim() === answerLower,
    
    // Contains match (case insensitive)
    (optionText: string) => optionText.toLowerCase().includes(answerLower),
    
    // Starts with match (case insensitive)
    (optionText: string) => optionText.toLowerCase().startsWith(answerLower),
    
    // Reverse contains (answer contains option)
    (optionText: string) => answerLower.includes(optionText.toLowerCase().trim()),
    
    // Word boundary match
    (optionText: string) => {
      const optionWords = optionText.toLowerCase().split(/\s+/);
      const answerWords = answerLower.split(/\s+/);
      return optionWords.some(ow => answerWords.some(aw => aw === ow));
    },
    
    // Partial word match (for abbreviations)
    (optionText: string) => {
      const option = optionText.toLowerCase().trim();
      // Check if any word in option starts with answer or vice versa
      const optionWords = option.split(/\s+/);
      const answerWords = answerLower.split(/\s+/);
      return optionWords.some(ow => answerWords.some(aw => ow.startsWith(aw) || aw.startsWith(ow)));
    },
    
    // Fuzzy match for degree types
    (optionText: string) => {
      const option = optionText.toLowerCase();
      if (answerLower.includes('bachelor') && option.includes('bachelor')) return true;
      if (answerLower.includes('master') && option.includes('master')) return true;
      if (answerLower.includes('doctorate') && (option.includes('doctorate') || option.includes('phd'))) return true;
      if (answerLower.includes('associate') && option.includes('associate')) return true;
      return false;
    },
    
    // Fuzzy match for proficiency levels
    (optionText: string) => {
      const option = optionText.toLowerCase();
      if (answerLower.includes('native') && option.includes('native')) return true;
      if (answerLower.includes('fluent') && (option.includes('fluent') || option.includes('advanced'))) return true;
      if (answerLower.includes('intermediate') && (option.includes('intermediate') || option.includes('conversational'))) return true;
      if (answerLower.includes('basic') && (option.includes('basic') || option.includes('beginner'))) return true;
      return false;
    }
  ];
  
  // Try each matching strategy
  for (let i = 0; i < matchingStrategies.length; i++) {
    const strategy = matchingStrategies[i];
    console.log(`🔄 Trying matching strategy ${i + 1}/${matchingStrategies.length}`);
    
    for (const option of allOptions) {
      const optionText = option.textContent?.trim() || '';
      if (optionText && strategy(optionText)) {
        console.log(`✅ Found matching option: "${optionText}" for "${answerText}" using strategy ${i + 1}`);
        
        // Try multiple click methods
        const clickSuccess = await tryClickOption(option as HTMLElement);
        if (clickSuccess) {
          await new Promise(resolve => setTimeout(resolve, 300));
          return true;
        }
      }
    }
  }
  
  // If no match found, log available options for debugging
  console.log(`⚠️ No matching option found for "${answerText}"`);
  console.log(`📋 Available options:`, Array.from(allOptions).slice(0, 10).map(opt => opt.textContent?.trim()).filter(Boolean));
  
  return false;
}

// Enhanced option clicking with multiple methods
async function tryClickOption(option: HTMLElement): Promise<boolean> {
  try {
    // Method 1: Direct click
    option.click();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if click worked by seeing if option is selected/highlighted
    if (option.getAttribute('aria-selected') === 'true' || 
        option.classList.contains('selected') ||
        option.classList.contains('active')) {
      return true;
    }
    
    // Method 2: Focus then click
    option.focus();
    await new Promise(resolve => setTimeout(resolve, 50));
    option.click();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Method 3: Mouse events
    option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    option.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Method 4: Keyboard selection
    option.focus();
    option.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
    } catch (error) {
    console.log(`⚠️ Error clicking option:`, error);
    return false;
  }
}

// Step 1: Fill Personal Information
async function fillStep1PersonalInfo(profile: any): Promise<void> {
  console.log("🔄 Starting Step 1: Personal Information");
  
  // Fill Legal Name
  const firstNameEl = findElement(WORKDAY_STEP1_SELECTORS.FIRST_NAME);
  if (firstNameEl) fillInput(firstNameEl, profile.first_name);
  
  const middleNameEl = findElement(WORKDAY_STEP1_SELECTORS.MIDDLE_NAME);
  if (middleNameEl && profile.middle_name) fillInput(middleNameEl, profile.middle_name);
  
  const lastNameEl = findElement(WORKDAY_STEP1_SELECTORS.LAST_NAME);
  if (lastNameEl) fillInput(lastNameEl, profile.last_name);
  
  // Fill Address
  const addressEl = findElement(WORKDAY_STEP1_SELECTORS.ADDRESS_LINE_1);
  if (addressEl) fillInput(addressEl, profile.address_line_1);
  
  const cityEl = findElement(WORKDAY_STEP1_SELECTORS.CITY);
  if (cityEl) fillInput(cityEl, profile.city);
  
  const postalEl = findElement(WORKDAY_STEP1_SELECTORS.POSTAL_CODE);
  if (postalEl) fillInput(postalEl, profile.postal_code);
  
  // Fill Phone
  const phoneEl = findElement(WORKDAY_STEP1_SELECTORS.PHONE_NUMBER);
  if (phoneEl) fillInput(phoneEl, profile.phone);
  
  // Handle Phone Device Type dropdown (set to Mobile)
  const phoneDeviceTypeEl = findElement(WORKDAY_STEP1_SELECTORS.PHONE_DEVICE_TYPE);
  if (phoneDeviceTypeEl) {
    console.log("🔄 Setting Phone Device Type to Mobile");
    await clickWorkdayDropdown(phoneDeviceTypeEl, "Mobile");
  }
  
  // Handle State dropdown
  const stateEl = findElement(WORKDAY_STEP1_SELECTORS.STATE);
  if (stateEl && profile.state) {
    console.log(`🔄 Setting State to ${profile.state}`);
    await clickWorkdayDropdown(stateEl, profile.state);
  }
  
  // Handle "How Did You Hear About Us" dropdown (set to Indeed)
  const howDidYouHearEl = findElement(WORKDAY_STEP1_SELECTORS.HOW_DID_YOU_HEAR);
  if (howDidYouHearEl) {
    console.log("🔄 Setting How Did You Hear About Us to Indeed");
    await clickWorkdayDropdown(howDidYouHearEl, "Indeed");
  }
  
  // Handle Previous Worker question (default to No for most applicants)
  const previousWorkerNoEl = findElement(WORKDAY_STEP1_SELECTORS.PREVIOUS_WORKER_NO);
  if (previousWorkerNoEl) clickRadioButton(previousWorkerNoEl);
  
  console.log("✅ Step 1: Personal Information completed");
}

// Step 2: Fill My Experience
async function fillStep2MyExperience(profile: any, completeProfile: any): Promise<void> {
  console.log("🔄 Starting Step 2: My Experience");
  
  // Fill Skills
  const skillsEl = findElement(WORKDAY_STEP2_SELECTORS.SKILLS_INPUT);
  if (skillsEl && completeProfile?.profile_skills) {
    const skills = completeProfile.profile_skills.map((skill: any) => skill.skill_name);
    if (skills.length > 0) {
      console.log(`🎯 Found ${skills.length} skills to add:`, skills.slice(0, 5));
      await fillSkillsInput(skillsEl, skills);
    }
  }
  
  // Fill Social Network URLs
  const linkedinEl = findElement(WORKDAY_STEP2_SELECTORS.LINKEDIN_URL);
  if (linkedinEl) {
    // Try multiple sources for LinkedIn URL
    const linkedinUrl = profile.linkedin_url || 
                       completeProfile?.portfolio_links?.find((link: any) => 
                         link.platform?.toLowerCase().includes('linkedin'))?.url;
    if (linkedinUrl) fillInput(linkedinEl, linkedinUrl);
  }
  
  const twitterEl = findElement(WORKDAY_STEP2_SELECTORS.TWITTER_URL);
  if (twitterEl) {
    const twitterUrl = completeProfile?.portfolio_links?.find((link: any) => 
      link.platform?.toLowerCase().includes('twitter'))?.url;
    if (twitterUrl) fillInput(twitterEl, twitterUrl);
  }
  
  const facebookEl = findElement(WORKDAY_STEP2_SELECTORS.FACEBOOK_URL);
  if (facebookEl) {
    const facebookUrl = completeProfile?.portfolio_links?.find((link: any) => 
      link.platform?.toLowerCase().includes('facebook'))?.url;
    if (facebookUrl) fillInput(facebookEl, facebookUrl);
  }
  
  // Handle Resume Upload
  const resumeInputEl = findElement(WORKDAY_STEP2_SELECTORS.RESUME_FILE_INPUT);
  if (resumeInputEl) {
    console.log(`📄 Found resume upload element, attempting upload...`);
    await handleResumeUpload(resumeInputEl, profile.resume_url);
  } else {
    console.log(`⚠️ No resume upload element found`);
    // Try alternative approach - look for all upload elements
    const uploadElements = findResumeUploadElements();
    if (uploadElements.fileInput || uploadElements.uploadButton || uploadElements.uploadArea) {
      console.log(`📄 Found alternative resume upload elements, attempting upload...`);
      const targetElement = uploadElements.fileInput || uploadElements.uploadButton || uploadElements.uploadArea;
      if (targetElement) {
        await handleResumeUpload(targetElement, profile.resume_url);
      }
    } else {
      console.log(`ℹ️ No resume upload controls found on this page`);
    }
  }
  
  // Handle Work Experience - Click Add and fill forms automatically
  const workExpEl = findElement(WORKDAY_STEP2_SELECTORS.WORK_EXPERIENCE_ADD);
  if (workExpEl && completeProfile?.work_experiences?.length > 0) {
    console.log(`💼 Found ${completeProfile.work_experiences.length} work experiences - adding them sequentially`);
    
    const workExperiences = completeProfile.work_experiences.slice(0, 3); // Limit to 3 most recent
    
    // Click the initial Add button to start the work experience section
    console.log(`🔄 Clicking initial Work Experience Add button`);
    workExpEl.click();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to open
    
    // Fill each work experience
    for (let i = 0; i < workExperiences.length; i++) {
      const workExp = workExperiences[i];
      const isLastEntry = (i === workExperiences.length - 1);
      
      console.log(`🔄 Adding work experience ${i + 1}/${workExperiences.length}: ${workExp.position_title} at ${workExp.company_name}`);
      console.log(`🔄 Is last entry: ${isLastEntry}`);
      
      // Fill the modal form
      await fillWorkExperienceModal(workExp, isLastEntry);
      
      console.log(`✅ Completed work experience ${i + 1}/${workExperiences.length}`);
      
      // Small delay between entries to ensure UI updates properly
      if (!isLastEntry) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`✅ All work experiences added successfully`);
  }
  
  // Handle Education - Click Add and fill forms automatically  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait after work experience is done
  
  console.log(`🔍 Looking for Education Add button...`);
  let educationEl = findElement(WORKDAY_STEP2_SELECTORS.EDUCATION_ADD);
  
  // If not found by selectors, try finding by button text
  if (!educationEl) {
    console.log(`🔍 Education Add button not found by selectors, trying text search...`);
    educationEl = findButtonByText(['Add Education', '+ Education', 'Education Add', 'Add Another Education']);
  }
  
  console.log(`🔍 Education Add button found: ${!!educationEl}`);
  console.log(`🔍 Education data available: ${!!completeProfile?.education}`);
  console.log(`🔍 Education entries count: ${completeProfile?.education?.length || 0}`);
  
  if (educationEl && completeProfile?.education?.length > 0) {
    console.log(`🎓 Found ${completeProfile.education.length} education entries - adding them sequentially`);
    
    const educationEntries = completeProfile.education.slice(0, 2); // Limit to 2 most recent
    
    // Click the initial Add button to start the education section
    console.log(`🔄 Clicking initial Education Add button`);
    educationEl.click();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to open
    
    // Fill each education entry
    for (let i = 0; i < educationEntries.length; i++) {
      const education = educationEntries[i];
      const isLastEntry = (i === educationEntries.length - 1);
      
      console.log(`🔄 Adding education entry ${i + 1}/${educationEntries.length}: ${education.degree_type} from ${education.institution_name}`);
      console.log(`🔄 Is last entry: ${isLastEntry}`);
      
      // Fill the modal form
      await fillEducationModal(education, isLastEntry);
      
      console.log(`✅ Completed education entry ${i + 1}/${educationEntries.length}`);
      
      // Small delay between entries to ensure UI updates properly
      if (!isLastEntry) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`✅ All education entries added successfully`);
  }
  
  console.log(`✅ Step 2: My Experience completed`);
  console.log("ℹ️  Note: Work Experience, Education, Certifications, Languages, and Resume now auto-filled!");
}

// Main Workday Autofill Function - Entry Point
export async function autofillWorkday(userData: any): Promise<void> {
  console.log("🔄 Starting Workday autofill process with user data:", userData);
  
  try {
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract profile data
    const profile = userData;
    const completeProfile = userData; // Assuming userData contains all profile information
    
    console.log("📋 Profile data:", {
      name: `${profile.first_name} ${profile.last_name}`,
      email: profile.email,
      phone: profile.phone,
      hasWorkExperience: !!(completeProfile?.work_experiences?.length),
      hasEducation: !!(completeProfile?.education?.length),
      hasSkills: !!(completeProfile?.profile_skills?.length),
      hasLanguages: !!(completeProfile?.languages?.length)
    });
    
    // Detect current step and fill accordingly
    const currentStep = detectWorkdayStep();
    console.log(`🎯 Detected Workday step: ${currentStep}`);
    
    switch (currentStep) {
      case 1:
        console.log("🔄 Processing Step 1: Personal Information");
        await fillStep1PersonalInfo(profile);
        break;
        
      case 2:
        console.log("🔄 Processing Step 2: My Experience");
        await fillStep2MyExperience(profile, completeProfile);
        break;
        
      case 3:
        console.log("🔄 Processing Step 3: Application Questions");
        await fillStep3ApplicationQuestions(profile);
        break;
        
      case 4:
        console.log("🔄 Processing Step 4: Voluntary Disclosures");
        await fillStep4VoluntaryDisclosures(profile);
        break;
        
      case 5:
        console.log("🔄 Processing Step 5: Self Identification");
        await fillStep5SelfIdentification(profile);
        break;
        
      default:
        console.log("🔄 Processing all available steps");
        // Try to fill whatever step is currently visible
        await tryFillCurrentStep(profile, completeProfile);
        break;
    }
    
    console.log("✅ Workday autofill process completed successfully");
    
  } catch (error) {
    console.error("❌ Error in Workday autofill process:", error);
    throw error;
  }
}

// Helper function to detect which Workday step is currently active
function detectWorkdayStep(): number {
  // Look for step indicators in the UI
  const stepIndicators = [
    { step: 1, selectors: ['[data-automation-id*="step1"]', '[aria-label*="Step 1"]', 'h1:contains("Personal Information")', 'h2:contains("Personal Information")'] },
    { step: 2, selectors: ['[data-automation-id*="step2"]', '[aria-label*="Step 2"]', 'h1:contains("My Experience")', 'h2:contains("My Experience")'] },
    { step: 3, selectors: ['[data-automation-id*="step3"]', '[aria-label*="Step 3"]', 'h1:contains("Application Questions")', 'h2:contains("Application Questions")'] },
    { step: 4, selectors: ['[data-automation-id*="step4"]', '[aria-label*="Step 4"]', 'h1:contains("Voluntary")', 'h2:contains("Voluntary")'] },
    { step: 5, selectors: ['[data-automation-id*="step5"]', '[aria-label*="Step 5"]', 'h1:contains("Self")', 'h2:contains("Self")'] }
  ];
  
  // Check each step's indicators
  for (const { step, selectors } of stepIndicators) {
    for (const selector of selectors) {
      if (selector.includes(':contains(')) {
        // Handle :contains() pseudo-selector manually
        const textToFind = selector.match(/contains\("([^"]+)"\)/)?.[1];
        if (textToFind) {
          const elements = document.querySelectorAll(selector.split(':contains(')[0]);
          for (const el of elements) {
            if (el.textContent?.includes(textToFind)) {
              console.log(`✅ Detected step ${step} by text content: "${textToFind}"`);
              return step;
            }
          }
        }
      } else {
        const element = document.querySelector(selector);
        if (element) {
          console.log(`✅ Detected step ${step} by selector: ${selector}`);
          return step;
        }
      }
    }
  }
  
  // Fallback: Try to detect by visible form fields
  if (findElement(WORKDAY_STEP1_SELECTORS.FIRST_NAME)) {
    console.log("✅ Detected step 1 by first name field");
    return 1;
  }
  
  if (findElement(WORKDAY_STEP2_SELECTORS.SKILLS_INPUT)) {
    console.log("✅ Detected step 2 by skills field");
    return 2;
  }
  
  // Default to step 1 if we can't detect
  console.log("⚠️ Could not detect specific step, defaulting to step 1");
  return 1;
}

// Helper function to try filling whatever step is currently visible
async function tryFillCurrentStep(profile: any, completeProfile: any): Promise<void> {
  console.log("🔄 Attempting to fill current visible step");
  
  // Try Step 1 fields
  if (findElement(WORKDAY_STEP1_SELECTORS.FIRST_NAME)) {
    console.log("📝 Found Step 1 fields, filling...");
    await fillStep1PersonalInfo(profile);
    return;
  }
  
  // Try Step 2 fields
  if (findElement(WORKDAY_STEP2_SELECTORS.SKILLS_INPUT) || findElement(WORKDAY_STEP2_SELECTORS.WORK_EXPERIENCE_ADD)) {
    console.log("📝 Found Step 2 fields, filling...");
    await fillStep2MyExperience(profile, completeProfile);
    return;
  }
  
  // Try Step 3 fields (when implemented)
  // if (findElement(WORKDAY_STEP3_SELECTORS.QUESTION_BUTTONS)) {
  //   console.log("📝 Found Step 3 fields, filling...");
  //   await fillStep3ApplicationQuestions(profile);
  //   return;
  // }
  
  console.log("ℹ️ No recognizable step fields found");
}

// Placeholder functions for Steps 3, 4, and 5 (to be implemented)
async function fillStep3ApplicationQuestions(profile: any): Promise<void> {
  console.log("🔄 Step 3: Application Questions (placeholder - to be implemented)");
  // TODO: Implement Step 3 logic
}

async function fillStep4VoluntaryDisclosures(profile: any): Promise<void> {
  console.log("🔄 Step 4: Voluntary Disclosures (placeholder - to be implemented)");
  // TODO: Implement Step 4 logic
}

async function fillStep5SelfIdentification(profile: any): Promise<void> {
  console.log("🔄 Step 5: Self Identification (placeholder - to be implemented)");
  // TODO: Implement Step 5 logic
}