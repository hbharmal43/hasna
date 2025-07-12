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
    '',
    '',
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
    '',
    '',
    'button[title="OK"]'
  ],
  ADD_ANOTHER_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
    '',
    'button[data-automation-id*="addAnother"]'
  ],
  DONE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
    '',
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
    'input[placeholder*="Major"]',
    'input[data-automation-id*="major"]',
    'input[data-automation-id*="fieldOfStudy"]',
    'input[aria-label*="Field of Study"]',
    'input[aria-label*="Major"]',
    'div[data-automation-id*="major"] input',
    'div[data-automation-id*="fieldOfStudy"] input'
  ],
  FIELD_OF_STUDY_MULTISELECT: [
    'div[data-automation-id="multiSelectContainer"] input',
    'div[data-automation-id="multiSelectContainer"] input[type="text"]',
    'div[data-automation-id="multiSelectContainer"] input[placeholder*="Field"]',
    'div[data-automation-id="multiSelectContainer"] input[placeholder*="Major"]',
    'div[data-automation-id="multiSelectContainer"] input[placeholder*="Study"]',
    'div[data-automation-id*="fieldOfStudy"] div[data-automation-id="multiSelectContainer"] input',
    'div[data-automation-id*="major"] div[data-automation-id="multiSelectContainer"] input'
  ],
  GPA: [
    'input[name*="gpa"]',
    'input[placeholder*="GPA"]',
    'input[placeholder*="Grade Point Average"]',
    'input[data-automation-id*="gpa"]',
    'input[aria-label*="GPA"]',
    'input[aria-label*="Grade Point Average"]',
    'div[data-automation-id*="gpa"] input'
  ],
  GRADUATION_DATE: [
    'input[placeholder*="MM/YYYY"]',
    'input[placeholder*="MM/YY"]',
    'input[placeholder*="Graduation"]',
    'input[placeholder*="YYYY"]',
    'input[name*="graduation"]',
    'input[name*="completionDate"]',
    'input[data-automation-id*="graduation"]',
    'input[data-automation-id*="completionDate"]',
    'input[aria-label*="Graduation"]',
    'input[aria-label*="Completion Date"]',
    'div[data-automation-id*="graduation"] input',
    'div[data-automation-id*="completionDate"] input'
  ],
  SAVE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_okButton"]',
    '',
    '',
    'button[title="OK"]'
  ],
  ADD_ANOTHER_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
    '',
    'button[data-automation-id*="addAnother"]'
  ],
  DONE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
    '',
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
    '',
    '',
    'button[title="OK"]'
  ],
  ADD_ANOTHER_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
    '',
    'button[data-automation-id*="addAnother"]'
  ],
  DONE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
    '',
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
    '',
    '',
    'button[title="OK"]'
  ],
  ADD_ANOTHER_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
    '',
    'button[data-automation-id*="addAnother"]'
  ],
  DONE_BUTTON: [
    'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
    '',
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
  // Name field
  NAME: [
    'input[id="selfIdentifiedDisabilityData--name"]',
    'input[name="name"]',
    'div[data-automation-id="formField-name"] input'
  ],
  
  // Employee ID field (optional, usually not filled)
  EMPLOYEE_ID: [
    'input[id="selfIdentifiedDisabilityData--employeeId"]',
    'input[name="employeeId"]',
    'div[data-automation-id="formField-employeeId"] input'
  ],
  
  // Date field (special Workday date inputs)
  DATE_MONTH: [
    'input[id="selfIdentifiedDisabilityData--dateSignedOn-dateSectionMonth-input"]',
    'input[aria-label="Month"]',
    'div[id*="dateSignedOn"] input[data-automation-id="dateSectionMonth-input"]'
  ],
  DATE_DAY: [
    'input[id="selfIdentifiedDisabilityData--dateSignedOn-dateSectionDay-input"]',
    'input[aria-label="Day"]',
    'div[id*="dateSignedOn"] input[data-automation-id="dateSectionDay-input"]'
  ],
  DATE_YEAR: [
    'input[id="selfIdentifiedDisabilityData--dateSignedOn-dateSectionYear-input"]',
    'input[aria-label="Year"]',
    'div[id*="dateSignedOn"] input[data-automation-id="dateSectionYear-input"]'
  ],
  
  // Language dropdown (usually pre-filled)
  LANGUAGE_DROPDOWN: [
    'button[id="selfIdentifiedDisabilityData--disabilityForm"]',
    'button[name="disabilityForm"]',
    'div[data-automation-id="formField-disabilityForm"] button'
  ],
  
  // Disability Status Checkboxes - these are in a fieldset with ReactVirtualized
  DISABILITY_CHECKBOXES: [
    'fieldset[data-automation-id="disabilityStatus-CheckboxGroup"] input[type="checkbox"]',
    'div[data-automation-id="formField-disabilityStatus"] input[type="checkbox"]',
    'input[id*="disabilityStatus"][type="checkbox"]'
  ],
  
  // Specific disability status options by ID patterns
  DISABILITY_YES: [
    'input[id*="64cbff5f364f10000ae7a421cf210000-disabilityStatus"]', // Yes option ID from HTML
    'label[for*="disabilityStatus"]:contains("Yes, I have a disability")'
  ],
  DISABILITY_NO: [
    'input[id*="64cbff5f364f10000aeec521b4ec0000-disabilityStatus"]', // No option ID from HTML  
    'label[for*="disabilityStatus"]:contains("No, I do not have a disability")'
  ],
  DISABILITY_NO_ANSWER: [
    'input[id*="64cbff5f364f10000af3af293a050000-disabilityStatus"]', // No answer option ID from HTML
    'label[for*="disabilityStatus"]:contains("I do not want to answer")'
  ]
};

// Helper functions
function findElement(selectors: string[]): HTMLElement | null {
  // Guard against empty or invalid selectors
  if (!selectors || selectors.length === 0) {
    console.log(`⚠️ No selectors provided to findElement`);
    return null;
  }
  
  for (const selector of selectors) {
    // Skip empty selectors
    if (!selector || selector.trim() === '') {
      console.log(`⚠️ Skipping empty selector`);
      continue;
    }
    
    try {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        console.log(`✅ Found element with selector: ${selector}`);
        return element;
      }
    } catch (error) {
      console.log(`❌ Invalid selector: ${selector}`, error);
    }
  }
  console.log(`❌ No element found for selectors:`, selectors);
  return null;
}

// Helper function to find buttons by text content (since :contains() doesn't work)
function findButtonByText(texts: string[]): HTMLElement | null {
  // Guard against empty texts
  if (!texts || texts.length === 0) {
    console.log(`⚠️ No texts provided to findButtonByText`);
    return null;
  }
  
  const buttons = document.querySelectorAll('button');
  for (const button of buttons) {
    const buttonText = button.textContent?.trim().toLowerCase() || '';
    for (const text of texts) {
      if (text && buttonText.includes(text.toLowerCase())) {
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

// Comprehensive function for all Workday inputs - handles React + Workday validation (FIXED)
function setWorkdayInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  console.log(`🔄 Setting input value: "${value}" on input:`, input.id);
  
  if (!input) return;

  // Step 1: Focus first (Workday needs to "see" user interaction)
  input.focus();
  
  // Step 2: Clear existing value first using React-compatible method (CRITICAL!)
  setNativeValue(input, '');
  
  // Step 3: Set new value using React-compatible method
  setNativeValue(input, value);
  
  // Step 4: Dispatch React events to sync component state
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  
  // Step 5: Blur to commit the value and trigger validation
  input.blur();
  
  // Step 6: Final validation trigger
  input.dispatchEvent(new Event('blur', { bubbles: true }));
  input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  
  console.log(`✅ Input value set and committed: "${input.value}"`);
}

function fillInput(element: HTMLElement, value: string | undefined): boolean {
  if (!value || !element) return false;
  
  const input = element as HTMLInputElement | HTMLTextAreaElement;
  
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

// Universal text input filling function for better compatibility
function setTextInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string): boolean {
  if (!input || !value) return false;
  
  try {
    input.focus();
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    return true;
  } catch (error) {
    console.log(`❌ Error with setTextInputValue:`, error);
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

// Helper function to map common majors to likely Workday field of study options
function mapFieldOfStudyValue(major: string): string[] {
  const lowerMajor = major.toLowerCase();
  
  // Return array of possible matches (in order of preference)
  const mappings: { [key: string]: string[] } = {
    'computer science': ['Computer Information Systems', 'Computer Science', 'Information Technology', 'Information Systems', 'Computer Engineering'],
    'computer engineering': ['Computer Engineering', 'Computer Information Systems', 'Engineering', 'Computer Science'],
    'software engineering': ['Computer Information Systems', 'Software Engineering', 'Computer Science', 'Information Technology'],
    'information technology': ['Information Technology', 'Computer Information Systems', 'Information Systems'],
    'information systems': ['Information Systems', 'Computer Information Systems', 'Information Technology'],
    'business': ['Business Administration', 'Business Management', 'Business', 'Management'],
    'business administration': ['Business Administration', 'Business Management', 'Business'],
    'marketing': ['Marketing', 'Business Administration', 'Advertising'],
    'finance': ['Finance', 'Business Administration', 'Accounting'],
    'accounting': ['Accounting', 'Business Administration', 'Finance'],
    'economics': ['Economics', 'Business Administration'],
    'psychology': ['Psychology', 'Behavioral Sciences'],
    'engineering': ['Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
    'mechanical engineering': ['Mechanical Engineering', 'Engineering'],
    'electrical engineering': ['Electrical Engineering', 'Engineering'],
    'civil engineering': ['Civil Engineering', 'Engineering'],
    'biology': ['Biology', 'Biological Sciences'],
    'chemistry': ['Chemistry', 'Chemical Engineering'],
    'physics': ['Physics', 'Engineering'],
    'mathematics': ['Mathematics', 'Applied Mathematics'],
    'english': ['English', 'English Literature', 'Literature'],
    'history': ['History'],
    'political science': ['Political Science', 'Government'],
    'communications': ['Communications', 'Journalism'],
    'journalism': ['Journalism', 'Communications'],
    'education': ['Education', 'Educational Leadership'],
    'nursing': ['Nursing', 'Health Sciences'],
    'medicine': ['Health Sciences', 'Biology'],
    'law': ['Legal Studies', 'Political Science'],
    'art': ['Art', 'Fine Arts', 'Visual Arts'],
    'music': ['Music', 'Fine Arts'],
    'philosophy': ['Philosophy'],
    'sociology': ['Sociology', 'Social Sciences'],
    'anthropology': ['Anthropology', 'Social Sciences']
  };
  
  // Check for exact matches first
  if (mappings[lowerMajor]) {
    return mappings[lowerMajor];
  }
  
  // Check for partial matches
  for (const [key, values] of Object.entries(mappings)) {
    if (lowerMajor.includes(key) || key.includes(lowerMajor)) {
      return values;
    }
  }
  
  // Return original value if no mapping found
  return [major];
}

// Helper function to fill multiselect field of study using native Workday behavior
async function fillMultiselectFieldOfStudy(element: HTMLElement, major: string): Promise<boolean> {
  if (!major || !element) return false;
  
  try {
    const input = element as HTMLInputElement;
    
    // Click the input to open dropdown
    input.click();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Focus and clear any existing content
    input.focus();
    input.value = '';
    
    // Type the value
    input.value = major;
    
    // Dispatch input event to trigger Workday's search
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: major,
    }));
    
    // Wait for dropdown to react
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Press Enter to let Workday auto-select the closest match
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      bubbles: true,
    }));
    
    input.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'Enter',
      code: 'Enter',
      bubbles: true,
    }));
    
    // Wait for selection to process
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Blur the input to close the dropdown/search interface
    input.blur();
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error filling multiselect field of study:`, error);
    return false;
  }
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
// Removed base64ToFile function - no longer needed with Supabase signed URLs

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

// Workday-compatible resume injection using React-friendly DOM selectors and events
async function handleResumeUpload(fileInput: HTMLElement, resumeUrl?: string): Promise<boolean> {
  if (!resumeUrl) {
    console.log(`⚠️ Resume upload: No resume URL provided`);
      return false;
    }
    
  console.log(`📄 Starting Workday-compatible resume upload process...`);
  console.log(`📄 Resume URL: ${resumeUrl}`);
  
  try {
    // Method 1: Use Workday's specific file input selector (as identified by ChatGPT)
    console.log(`🔄 Method 1: Looking for Workday file input...`);
    const workdayInput = document.querySelector('input[data-automation-id="file-upload-input-ref"]') as HTMLInputElement;
    
    if (workdayInput) {
      console.log(`✅ Found Workday file input: data-automation-id="file-upload-input-ref"`);
      const success = await injectResumeIntoWorkday(workdayInput, resumeUrl);
      if (success) {
        console.log(`✅ Resume uploaded successfully via Workday method`);
        return true;
      }
    }
    
    // Method 2: Fallback to provided file input element
    console.log(`🔄 Method 2: Using provided file input element...`);
    if (fileInput) {
      const success = await uploadResumeFromUrl(fileInput as HTMLInputElement, resumeUrl);
      if (success) {
        console.log(`✅ Resume uploaded successfully via fallback method`);
        return true;
      }
    }
    
    // Method 3: Try to find and click "Select Files" button to trigger manual upload
    console.log(`🔄 Method 3: Looking for Select Files button...`);
    const selectFilesButton = document.querySelector('[data-automation-id="select-files"]') as HTMLElement;
    
    if (selectFilesButton) {
      console.log(`✅ Found Select Files button, clicking to open file dialog...`);
      selectFilesButton.click();
      console.log(`ℹ️ File dialog should be open - please select your resume manually`);
      return true; // Consider this a success since we opened the dialog
    }

    console.log(`⚠️ Resume upload: All Workday methods attempted`);
    console.log(`ℹ️ You may need to manually upload your resume file`);
    scanAllFileInputs(); // Debug: scan all file inputs
    return false;
    
  } catch (error) {
    console.log(`❌ Error in resume upload process:`, error);
    return false;
  }
}

// Workday-specific resume injection function (based on ChatGPT's analysis)
async function injectResumeIntoWorkday(input: HTMLInputElement, resumeUrl: string): Promise<boolean> {
  if (!input || !resumeUrl) return false;
  
  try {
    console.log(`🔄 Fetching resume file from Supabase URL...`);
    
    // Fetch the resume file
    const response = await fetch(resumeUrl);
    if (!response.ok) {
      console.log(`❌ Failed to fetch resume: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const blob = await response.blob();
    console.log(`✅ Resume fetched successfully, size: ${blob.size} bytes`);
    
    // Determine filename from URL or use default
    let fileName = 'resume.pdf';
    try {
      const urlPath = new URL(resumeUrl).pathname;
      const extractedName = urlPath.split('/').pop();
      if (extractedName && extractedName.includes('.')) {
        fileName = extractedName;
      }
    } catch (e) {
      // Use default filename if URL parsing fails
    }
    
    // Create File object
    const file = new File([blob], fileName, { type: blob.type || 'application/pdf' });
    console.log(`✅ Created file object: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    // Simulate React-compatible file selection
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;
    
    // Trigger React-compatible events
    console.log(`🔄 Dispatching React-compatible change events...`);
    const nativeChangeEvent = new Event('change', { bubbles: true });
    input.dispatchEvent(nativeChangeEvent);
    
    // Also trigger input event for additional React compatibility
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
    
    // Optional: Click the "Select Files" button to ensure Workday's upload logic fires
    const selectFilesButton = document.querySelector('[data-automation-id="select-files"]') as HTMLElement;
    if (selectFilesButton) {
      console.log(`🔄 Clicking Select Files button to trigger Workday upload logic...`);
      selectFilesButton.click();
    }
    
    // Wait for Workday's React upload preview to process
    console.log(`⏳ Waiting for Workday to process the file upload...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if upload preview appeared (validation)
    const uploadPreview = document.querySelector('[data-automation-id*="upload"]') || 
                         document.querySelector('.css-1hyfx7x') || 
                         document.querySelector('[class*="upload"]');
    
    if (uploadPreview) {
      console.log(`✅ Resume injection complete - upload preview detected`);
      return true;
    } else {
      console.log(`⚠️ Resume injection complete but no upload preview detected`);
      return true; // Still consider it successful since we injected the file
    }
    
  } catch (error) {
    console.log(`❌ Error in Workday resume injection:`, error);
    return false;
  }
}

// Helper function to create and upload file from URL
async function uploadResumeFromUrl(fileInput: HTMLInputElement, resumeUrl: string): Promise<boolean> {
  if (!resumeUrl || !fileInput) return false;
  
  try {
    console.log(`🔄 Attempting to fetch resume from URL: ${resumeUrl}`);
    
    // Fix double encoding: decode first, then encode properly
    const safeUrl = encodeURI(decodeURIComponent(resumeUrl));
    console.log(`🔄 Safe URL: ${safeUrl}`);
    
    // Fetch the resume file with proper headers for Supabase
    const response = await fetch(safeUrl, { 
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Range': 'bytes=0-'
      }
    });
    
    if (!response.ok) {
      console.log(`⚠️ Failed to fetch resume: ${response.status} ${response.statusText}`);
      console.log(`⚠️ Response headers:`, Object.fromEntries(response.headers.entries()));
      console.log(`⚠️ Full response:`, response);
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
  console.log(`🔄 formatWorkdayDate called with: month="${month}", year=${year}`);
  
  const monthMap: { [key: string]: string } = {
    // Full month names
    'January': '01', 'February': '02', 'March': '03', 'April': '04',
    'May': '05', 'June': '06', 'July': '07', 'August': '08',
    'September': '09', 'October': '10', 'November': '11', 'December': '12',
    // Abbreviated month names
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Sept': '09',
    'Oct': '10', 'Nov': '11', 'Dec': '12',
    // Lowercase variants
    'january': '01', 'february': '02', 'march': '03', 'april': '04',
    'may': '05', 'june': '06', 'july': '07', 'august': '08',
    'september': '09', 'october': '10', 'november': '11', 'december': '12',
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
    'jun': '06', 'jul': '07', 'aug': '08', 'sep': '09', 'sept': '09',
    'oct': '10', 'nov': '11', 'dec': '12'
  };
  
  const monthNum = monthMap[month] || monthMap[month.toLowerCase()] || '01';
  console.log(`🔄 Mapped month "${month}" to "${monthNum}"`);
  
  // Check element placeholder to determine format
  if (element) {
    const input = element as HTMLInputElement;
    const placeholder = input.placeholder?.toLowerCase() || '';
    
    if (placeholder.includes('yyyy')) {
      const result = `${monthNum}/${year}`;
      console.log(`✅ Using MM/YYYY format: ${result}`);
      return result;
    } else if (placeholder.includes('yy')) {
      const shortYear = year.toString().slice(-2);
      const result = `${monthNum}/${shortYear}`;
      console.log(`✅ Using MM/YY format: ${result}`);
      return result;
    } else if (placeholder.includes('mm') && !placeholder.includes('/')) {
      const result = `${monthNum}${year}`;
      console.log(`✅ Using MMYYYY format: ${result}`);
      return result;
    }
  }
  
  // Default format
  const result = `${monthNum}/${year}`;
  console.log(`✅ Using default MM/YYYY format: ${result}`);
  return result;
}

// Enhanced date conversion function to handle various date formats from database
function convertToMMYYYY(dateStr: string): string {
  console.log(`🔄 Converting date string: "${dateStr}"`);
  
  if (!dateStr) return '';
  
  const months: { [key: string]: string } = {
    'jan': '01', 'january': '01',
    'feb': '02', 'february': '02', 
    'mar': '03', 'march': '03',
    'apr': '04', 'april': '04',
    'may': '05',
    'jun': '06', 'june': '06',
    'jul': '07', 'july': '07',
    'aug': '08', 'august': '08',
    'sep': '09', 'september': '09', 'sept': '09',
    'oct': '10', 'october': '10',
    'nov': '11', 'november': '11',
    'dec': '12', 'december': '12'
  };
  
  // Split by common separators
  const parts = dateStr.toLowerCase().split(/[\s/\-.,]+/);
  console.log(`🔄 Date parts:`, parts);
  
  let monthStr = '';
  let year = '';
  
  // Try to find month and year
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    // Check if it's a month
    if (months[trimmed] || months[trimmed.slice(0, 3)]) {
      monthStr = months[trimmed] || months[trimmed.slice(0, 3)];
    }
    
    // Check if it's a year (4 digits)
    if (/^\d{4}$/.test(trimmed)) {
      year = trimmed;
    }
  }
  
  if (monthStr && year) {
    const result = `${monthStr}/${year}`;
    console.log(`✅ Converted "${dateStr}" → "${result}"`);
    return result;
  }
  
  console.log(`⚠️ Could not convert date: "${dateStr}"`);
  return dateStr; // Return original if conversion fails
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
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // CRITICAL: Focus + Blur cycle to make Workday commit the value
    input.focus();  // Simulate clicking into the field
    await new Promise(resolve => setTimeout(resolve, 100));
    input.blur();   // Simulate clicking away to commit the field
    
    // Check if the value was set correctly
    if (input.value === dateValue || input.value.includes(dateValue.replace('/', ''))) {
      console.log(`✅ Date field filled successfully: ${input.value}`);
      return true;
    }
    
    // Method 2: Character-by-character typing for masked inputs
    console.log(`🔄 Trying character-by-character method for masked input`);
    input.focus();
    setNativeValue(input, '');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Type each character with delays (for masked inputs)
    for (let i = 0; i < dateValue.length; i++) {
      const char = dateValue[i];
      
      // Build value character by character
      input.value += char;
      
      // Trigger comprehensive events for each character
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
      
      // Slower typing for better reliability
      await new Promise(resolve => setTimeout(resolve, 80));
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
  
  // Wait for modal to load and DOM to stabilize
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // CRITICAL: Always re-query elements fresh (Workday reuses modal DOM)
  console.log(`🔄 Re-querying all modal elements (DOM may have been updated)`);
  
  let filledCount = 0;
  
  // Add smooth scrolling to modal for better UX
  const modal = document.querySelector('[role="dialog"], .modal, [data-automation-id*="modal"]') as HTMLElement;
  if (modal) {
    modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // ALWAYS re-query elements fresh (don't cache DOM references)
  
  // Fill Job Title
  let jobTitleEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.JOB_TITLE);
  if (jobTitleEl) {
    // Use comprehensive Workday-compatible method
    setWorkdayInputValue(jobTitleEl as HTMLInputElement, workExp.position_title);
    filledCount++;
    console.log(`✅ Filled job title: ${workExp.position_title}`);
  } else {
    console.log(`⚠️ Job title element not found`);
  }
  
  // Fill Company
  let companyEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.COMPANY);
  if (companyEl) {
    // Use comprehensive Workday-compatible method
    setWorkdayInputValue(companyEl as HTMLInputElement, workExp.company_name);
    filledCount++;
    console.log(`✅ Filled company: ${workExp.company_name}`);
  } else {
    console.log(`⚠️ Company element not found`);
  }
  
  // Fill Location (if available)
  const locationEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.LOCATION);
  if (locationEl && workExp.location) {
    // Use comprehensive Workday-compatible method
    setWorkdayInputValue(locationEl as HTMLInputElement, workExp.location);
    filledCount++;
    console.log(`✅ Filled location: ${workExp.location}`);
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
  let fromDateEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.FROM_DATE);
  if (fromDateEl && workExp.start_month && workExp.start_year) {
    const fromDate = formatWorkdayDate(workExp.start_month, workExp.start_year, fromDateEl);
    
    // Add delay before date filling for better reliability
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (await fillWorkdayDateField(fromDateEl, fromDate)) {
      filledCount++;
      console.log(`✅ Filled start date: ${fromDate}`);
    } else {
      console.log(`⚠️ Could not fill start date: ${fromDate}`);
    }
  }
  
  // Fill To Date (only if not current job)
  if (!isCurrentJob) {
    let toDateEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.TO_DATE);
    if (toDateEl && workExp.end_month && workExp.end_year) {
      const toDate = formatWorkdayDate(workExp.end_month, workExp.end_year, toDateEl);
      
      // Add delay before date filling for better reliability
      await new Promise(resolve => setTimeout(resolve, 400));
      
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
    // Use comprehensive Workday-compatible method
    setWorkdayInputValue(descriptionEl as HTMLInputElement, workExp.description);
    filledCount++;
    console.log(`✅ Filled description`);
  }
  
  // Handle Save vs Add Another vs Done based on whether this is the last entry
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`🔄 Looking for buttons... isLastEntry: ${isLastEntry}`);
  
  if (isLastEntry) {
    console.log(`ℹ️ Last work experience entry - form will auto-save, no buttons needed`);
    // No need to click Done or Save - Workday auto-saves
    await new Promise(resolve => setTimeout(resolve, 1000));
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
      
      // CRITICAL: Wait longer for DOM to update and re-render
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Force re-query of all elements after modal updates
      console.log(`🔄 Modal updated - DOM elements will be re-queried for next entry`);
      
      // Clear any cached DOM references (they become stale after "Add Another")
      // This ensures fresh element queries for the next iteration
    } else {
      console.log(`ℹ️ Add Another button not found - form will auto-save`);
      // No need to click Save - Workday auto-saves
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`✅ Filled ${filledCount} work experience fields`);
  return filledCount > 0;
}

// Helper function to fill education modal
async function fillEducationModal(education: any, isLastEntry: boolean = false): Promise<boolean> {
  // Debug the education object to fix undefined issues
  console.log(`🎓 Filling education entry`, JSON.stringify(education, null, 2));
  
  // Handle field name variations and provide fallbacks
  const schoolName = education.institution_name || education.school_name || education.school || 'Unknown School';
  const degreeType = education.degree_type || education.degree || education.level || 'Bachelor\'s Degree';
  const major = education.major || education.field_of_study || education.field || '';
  const gpa = education.gpa || education.grade_point_average || '';
  
  console.log(`🔄 Filling education: ${degreeType} from ${schoolName}`);
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  let filledCount = 0;
  
  // Fill School Name
  const schoolEl = findElement(WORKDAY_EDUCATION_MODAL.SCHOOL_NAME);
  if (schoolEl) {
    // Use comprehensive Workday-compatible method
    setWorkdayInputValue(schoolEl as HTMLInputElement, schoolName);
    filledCount++;
    console.log(`✅ Filled school: ${schoolName}`);
  }
  
  // Fill Degree Type (dropdown)
  const degreeEl = findElement(WORKDAY_EDUCATION_MODAL.DEGREE_TYPE);
  if (degreeEl && degreeType) {
    const success = await clickWorkdayDropdown(degreeEl, degreeType);
    if (success) {
      filledCount++;
      console.log(`✅ Filled degree type: ${degreeType}`);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Fill Field of Study/Major - Try multiselect first, then fallback to regular input
  let majorFilled = false;
  
  // Try multiselect approach first
  const multiselectMajorEl = findElement(WORKDAY_EDUCATION_MODAL.FIELD_OF_STUDY_MULTISELECT);
  if (multiselectMajorEl && major) {
    console.log(`🎓 Attempting multiselect field of study fill...`);
    majorFilled = await fillMultiselectFieldOfStudy(multiselectMajorEl, major);
    if (majorFilled) {
      filledCount++;
      console.log(`✅ Filled major via multiselect: ${major}`);
    }
  }
  
  // Fallback to regular input if multiselect didn't work
  if (!majorFilled) {
    const majorEl = findElement(WORKDAY_EDUCATION_MODAL.FIELD_OF_STUDY);
    if (majorEl && major && fillInput(majorEl, major)) {
      filledCount++;
      console.log(`✅ Filled major via regular input: ${major}`);
    }
  }
  
  // Fill GPA
  const gpaEl = findElement(WORKDAY_EDUCATION_MODAL.GPA);
  if (gpaEl && gpa && fillInput(gpaEl, gpa.toString())) {
    filledCount++;
    console.log(`✅ Filled GPA: ${gpa}`);
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
    console.log(`ℹ️ Last education entry - form will auto-save, no buttons needed`);
    // No need to click Done or Save - Workday auto-saves
    await new Promise(resolve => setTimeout(resolve, 1000));
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
      console.log(`ℹ️ Add Another button not found - form will auto-save`);
      // No need to click Save - Workday auto-saves
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    console.log(`ℹ️ Last certification entry - form will auto-save, no buttons needed`);
    // No need to click Done or Save - Workday auto-saves
    await new Promise(resolve => setTimeout(resolve, 1000));
  } else {
    // Click Add Another for non-last entries
    const addAnotherBtn = findElement(WORKDAY_CERTIFICATIONS_MODAL.ADD_ANOTHER_BUTTON);
    if (addAnotherBtn) {
      addAnotherBtn.click();
      console.log(`✅ Clicked Add Another for certification`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      console.log(`ℹ️ Add Another button not found - form will auto-save`);
      // No need to click Save - Workday auto-saves
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    console.log(`ℹ️ Last language entry - form will auto-save, no buttons needed`);
    // No need to click Done or Save - Workday auto-saves
    await new Promise(resolve => setTimeout(resolve, 1000));
  } else {
    // Click Add Another for non-last entries
    const addAnotherBtn = findElement(WORKDAY_LANGUAGES_MODAL.ADD_ANOTHER_BUTTON);
    if (addAnotherBtn) {
      addAnotherBtn.click();
      console.log(`✅ Clicked Add Another for language`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      console.log(`ℹ️ Add Another button not found - form will auto-save`);
      // No need to click Save - Workday auto-saves
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`✅ Filled ${filledCount} language fields`);
  return filledCount > 0;
}

function getGenericQuestionAnswer(questionText: string, profile: any): string | null {
  const text = questionText.toLowerCase();
  
  console.log(`🤔 Analyzing question: "${questionText}"`);
  console.log(`🔍 Profile authorization data:`, {
    work_authorization_us: profile.work_authorization_us,
    visa_sponsorship_required: profile.visa_sponsorship_required,
    willing_to_relocate: profile.willing_to_relocate
  });
  
  // Work Authorization
  if (text.includes('authorized to work') && text.includes('country')) {
    const answer = profile.work_authorization_us ? 'Yes' : 'No';
    console.log(`✅ Work authorization question detected - Answer: ${answer}`);
    return answer;
  }
  
  // Visa Sponsorship
  if (text.includes('visa sponsorship') || text.includes('immigration filing') || text.includes('sponsorship for employment')) {
    // If visa_sponsorship_required is 'yes' or true, they need sponsorship
    // If visa_sponsorship_required is 'no' or false, they don't need sponsorship
    const needsSponsorship = profile.visa_sponsorship_required === 'yes' || profile.visa_sponsorship_required === true;
    const answer = needsSponsorship ? 'Yes' : 'No';
    console.log(`✅ Visa sponsorship question detected - Answer: ${answer}`);
    return answer;
  }
  
  // Relocation
  if (text.includes('relocating') || text.includes('relocation')) {
    const answer = profile.willing_to_relocate ? 'Yes' : 'No';
    console.log(`✅ Relocation question detected - Answer: ${answer}`);
    return answer;
  }
  
  // Additional jobs
  if (text.includes('additional jobs') || text.includes('other employment') || text.includes('additional job')) {
    console.log(`✅ Additional jobs question detected - Answer: No (default safe answer)`);
    return 'No'; // Most people don't have additional jobs
  }
  
  // Board positions
  if (text.includes('sit on') && text.includes('board')) {
    console.log(`✅ Board position question detected - Answer: No (default safe answer)`);
    return 'No'; // Most people don't sit on boards
  }
  
  // Government work
  if (text.includes('government') && (text.includes('worked') || text.includes('employed'))) {
    console.log(`✅ Government work question detected - Answer: No (default safe answer)`);
    return 'No'; // Most people haven't worked for government
  }
  
  // Industry-specific questions (alcohol, etc.) - Default to No for safety
  if (text.includes('alcohol') || text.includes('beverage') || text.includes('industry')) {
    console.log(`✅ Industry-specific question detected - Answer: No (default safe answer)`);
    return 'No';
  }
  
  // Family/relationship questions (conflict of interest)
  if (text.includes('family member') || text.includes('close personal relationship')) {
    console.log(`✅ Family/relationship question detected - Answer: No (default safe answer)`);
    return 'No';
  }
  
  // Consultant/influencer questions
  if (text.includes('consultant') || text.includes('influencer') || text.includes('endorser') || text.includes('advisor')) {
    console.log(`✅ Consultant/influencer question detected - Answer: No (default safe answer)`);
    return 'No';
  }
  
  // Non-compete agreements
  if (text.includes('non-compete') || text.includes('non-solicitation')) {
    console.log(`✅ Non-compete question detected - Answer: No (default safe answer)`);
    return 'No'; // Default safe answer for most people
  }
  
  // Acknowledgment questions
  if (text.includes('acknowledge') && text.includes('truthfully')) {
    console.log(`✅ Acknowledgment question detected - Answer: Yes`);
    return 'Yes'; // Always acknowledge truthfulness
  }
  
  console.log(`ℹ️ No match found for this question - skipping (likely company-specific)`);
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

// Step 2: Fill My Experience - Sequential Approach
async function fillStep2MyExperience(profile: any, completeProfile: any): Promise<void> {
  console.log("🔄 Starting Step 2: My Experience - Sequential Approach");
  
  // Debug: Log all available data
  console.log("🧠 Available work experiences:", completeProfile?.work_experiences?.length || 0);
  console.log("🧠 Available education entries:", completeProfile?.education?.length || 0);
  console.log("🧠 Available skills:", completeProfile?.profile_skills?.length || 0);
  
  // STEP 1: Work Experience First
  await fillWorkExperienceSection(completeProfile);
  
  // STEP 2: Education Second  
  await fillEducationSection(completeProfile);
  
  // STEP 3: Websites Third
  await fillWebsitesSection(completeProfile);
  
  // STEP 4: Languages Fourth
  await fillLanguagesSection(completeProfile);
  
  // STEP 5: Skills Fifth
  await fillSkillsSection(completeProfile);
  
  // STEP 6: Resume Last
  await fillResumeSection(profile);
  
  console.log("✅ Step 2: My Experience completed sequentially");
}

// ===== UTILITY FUNCTIONS FOR NEW BLOCK-BASED APPROACH =====

function getBlocks(prefix: string): HTMLElement[] {
  const selector = `div[data-fkit-id^="${prefix}-"]`;
  console.log(`🔍 Looking for blocks with selector: ${selector}`);
  
  const blocks = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
  console.log(`🔍 Found ${blocks.length} blocks for prefix "${prefix}"`);
  
  // Debug: Show what blocks were found
  blocks.forEach((block, index) => {
    console.log(`🔍 Block ${index + 1}:`, {
      id: block.id || 'no-id',
      'data-fkit-id': block.dataset.fkitId || 'no-fkit-id',
      className: block.className || 'no-class',
      innerHTML: block.innerHTML.substring(0, 200) + '...' // First 200 chars
    });
  });
  
  // If no blocks found, show what's actually on the page
  if (blocks.length === 0) {
    console.log(`🔍 No blocks found. Searching for alternative patterns...`);
    
    // Try alternative selectors
    const alternativeSelectors = [
      `div[data-fkit-id*="${prefix}"]`,           // Contains prefix
      `[id*="${prefix}"]`,                        // ID contains prefix
      `div[class*="${prefix}"]`,                  // Class contains prefix
      `div[data-automation-id*="${prefix}"]`,     // data-automation-id contains prefix
      `div[data-fkit-id^="${prefix}-"][data-fkit-id$="--null"]`, // Old empty blocks pattern
    ];
    
    alternativeSelectors.forEach((altSelector, index) => {
      const altBlocks = document.querySelectorAll(altSelector);
      console.log(`🔍 Alternative ${index + 1}: ${altSelector} found ${altBlocks.length} elements`);
      if (altBlocks.length > 0 && altBlocks.length <= 5) {
        altBlocks.forEach((el, i) => {
          const element = el as HTMLElement;
          console.log(`  ${i + 1}.`, {
            tagName: element.tagName,
            id: element.id || 'no-id',
            'data-fkit-id': element.dataset.fkitId || 'no-fkit-id',
            className: element.className || 'no-class'
          });
        });
      }
    });
  }
  
  return blocks;
}

// New function to group blocks by unique root ID
function getGroupedBlocks(prefix: string): Array<{blockId: string, elements: HTMLElement[]}> {
  console.log(`🔍 Getting grouped blocks for prefix: ${prefix}`);
  
  const all = Array.from(document.querySelectorAll(`[data-fkit-id^="${prefix}-"]`)) as HTMLElement[];
  console.log(`🔍 Found ${all.length} total elements with prefix ${prefix}`);
  
  const groups: {[key: string]: HTMLElement[]} = {};
  
  for (const el of all) {
    const id = el.getAttribute("data-fkit-id");
    const match = id?.match(new RegExp(`^${prefix}-(\\d+)`));
    if (match) {
      const blockNum = match[1];
      if (!groups[blockNum]) groups[blockNum] = [];
      groups[blockNum].push(el);
    }
  }
  
  const result = Object.keys(groups).map(k => ({
    blockId: `${prefix}-${k}`,
    elements: groups[k]
  }));
  
  console.log(`🔍 Grouped into ${result.length} unique blocks:`);
  result.forEach((group, index) => {
    console.log(`  ${index + 1}. Block ID: ${group.blockId} (${group.elements.length} elements)`);
  });
  
  return result;
}

// Helper functions for grouped blocks
function fillBlockInputByGroupId(blockId: string, field: string, value: string): void {
  if (!value) return;
  
  console.log(`🔄 Filling input ${field}: "${value}" for block ${blockId}`);
  
  // Try multiple selector strategies for finding the input
  const possibleSelectors = [
    `#${blockId}--${field}`,                    // Strategy 1: Original approach
    `[id$="--${field}"]`,                      // Strategy 2: Ends with field name
    `[id*="${field}"]`,                        // Strategy 3: Contains field name
    `input[data-automation-id*="${field}"]`,   // Strategy 4: data-automation-id
    `input[name*="${field}"]`,                 // Strategy 5: name attribute
  ];
  
  console.log(`🔍 Trying ${possibleSelectors.length} selector strategies for ${field}:`);
  
  let input: HTMLInputElement | null = null;
  
  for (let i = 0; i < possibleSelectors.length; i++) {
    const selector = possibleSelectors[i];
    console.log(`  ${i + 1}. ${selector}`);
    
    input = document.querySelector(selector) as HTMLInputElement;
    if (input) {
      console.log(`✅ Found input using strategy ${i + 1}: ${selector}`);
            break;
          }
        }
  
  if (input) {
    console.log(`🔍 Input element found:`, {
      tagName: input.tagName,
      id: input.id,
      name: input.name,
      type: input.type,
      placeholder: input.placeholder,
      value: input.value
    });
    
    // Use comprehensive Workday-compatible method (clears and sets value with focus+blur)
    setWorkdayInputValue(input, value);
    
    console.log(`✅ Filled ${field} with: "${value}"`);
    console.log(`🔍 Final input value: "${input.value}"`);
  } else {
    console.log(`❌ Input not found for ${field} using any strategy`);
  }
}

function fillCheckboxByGroupId(blockId: string, field: string, checked: boolean): void {
  const checkboxId = `${blockId}--${field}`;
  const checkbox = document.querySelector(`#${checkboxId}`) as HTMLInputElement;
  
  console.log(`🔄 Setting checkbox ${field}: ${checked} for block ${blockId}`);
  console.log(`🔍 Looking for checkbox with ID: ${checkboxId}`);
  
  if (checkbox) {
    if (checkbox.checked !== checked) {
      checkbox.click();
      console.log(`✅ Clicked checkbox ${field} to set to: ${checked}`);
    } else {
      console.log(`ℹ️ Checkbox ${field} already set to: ${checked}`);
    }
  } else {
    console.log(`⚠️ Checkbox not found for ${field} (ID: ${checkboxId})`);
  }
}

// Clean, working date field function (like before when it was working)
// Simple, focused date input function based on user's working example
function setDateInputValue(input: HTMLInputElement, value: string) {
  input.value = value;
  input.setAttribute('aria-valuenow', value);
  input.setAttribute('aria-valuetext', value);

  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
}

async function fillWorkdayDateInputs(monthInput: HTMLInputElement, yearInput: HTMLInputElement, month: string, year: string) {
  console.log(`📅 Filling date inputs in YEAR-FIRST order: year="${year}", month="${month}"`);
  
  // Find the date container that wraps both month and year
  const dateWrapper = monthInput.closest('[data-automation-id="dateInputWrapper"]') as HTMLElement;
  if (!dateWrapper) {
    console.warn(`⚠️ Could not find dateInputWrapper container`);
    return;
  }
  
  console.log(`📅 Step 0: Focusing the WHOLE date field container`);
  dateWrapper.focus();
  
  // Wait a moment for focus to register
  await new Promise((res) => setTimeout(res, 50));
  
  // CRITICAL: Fill YEAR FIRST (Simplify's working approach)
  // This will temporarily show "Invalid Date" error, which is expected and OK
  console.log(`📅 Step 1: Filling YEAR first (will show temp error)`);
  yearInput.value = year;
  yearInput.setAttribute('aria-valuenow', year);
  yearInput.setAttribute('aria-valuetext', year);
  yearInput.dispatchEvent(new Event('input', { bubbles: true }));
  yearInput.dispatchEvent(new Event('change', { bubbles: true }));

  // Wait a moment for the temporary error to render
  await new Promise((res) => setTimeout(res, 100));

  // Now fill MONTH (this should resolve the error and make date valid)
  console.log(`📅 Step 2: Filling MONTH (should resolve the error)`);
  monthInput.value = month;
  monthInput.setAttribute('aria-valuenow', month);
  monthInput.setAttribute('aria-valuetext', month);
  monthInput.dispatchEvent(new Event('input', { bubbles: true }));
  monthInput.dispatchEvent(new Event('change', { bubbles: true }));

  // Wait for React to process both changes
  await new Promise((res) => setTimeout(res, 100));

  // CRITICAL: Blur the WHOLE date field container (like user clicking away)
  console.log(`📅 Step 3: Blurring the WHOLE date field container`);
  dateWrapper.blur();
  dateWrapper.dispatchEvent(new Event('blur', { bubbles: true }));
  dateWrapper.dispatchEvent(new Event('focusout', { bubbles: true }));

  // Wait for validation to complete
  await new Promise((res) => setTimeout(res, 200));

  // Check the final results
  console.log(`📅 Month input final state: value="${monthInput.value}", aria-valuenow="${monthInput.getAttribute('aria-valuenow')}"`);
  console.log(`📅 Year input final state: value="${yearInput.value}", aria-valuenow="${yearInput.getAttribute('aria-valuenow')}"`);
  
  const wrapperId = dateWrapper?.getAttribute("id") ?? "unknown";
  const wrapperAria = dateWrapper?.getAttribute("aria-labelledby") ?? "";
  console.log(`📅 Final validation check for: ${wrapperId}`);
  console.log(`📅 aria-labelledby: ${wrapperAria}`);
  
  // Check if the container focus/blur approach resolved the validation
  if (wrapperAria.includes('ERROR')) {
    console.warn(`⚠️ Date validation error still present after container focus/blur approach`);
  } else {
    console.log(`✅ Date filled successfully using CONTAINER FOCUS/BLUR method - error resolved!`);
  }
}

// Self Identity date filling function (adapted from work experience approach)
async function fillSelfIdentityDateInputs(monthInput: HTMLInputElement, dayInput: HTMLInputElement, yearInput: HTMLInputElement, month: string, day: string, year: string) {
  console.log(`📅 Filling Self Identity date inputs in YEAR-FIRST order: year="${year}", month="${month}", day="${day}"`);
  
  // Find the date container that wraps month, day, and year
  const dateWrapper = monthInput.closest('[data-automation-id="dateInputWrapper"]') as HTMLElement;
  if (!dateWrapper) {
    console.warn(`⚠️ Could not find dateInputWrapper container`);
    return;
  }
  
  console.log(`📅 Step 0: Focusing the WHOLE date field container`);
  dateWrapper.focus();
  
  // Wait a moment for focus to register
  await new Promise((res) => setTimeout(res, 50));
  
  // CRITICAL: Fill YEAR FIRST (same as work experience)
  // This will temporarily show "Invalid Date" error, which is expected and OK
  console.log(`📅 Step 1: Filling YEAR first (will show temp error)`);
  yearInput.value = year;
  yearInput.setAttribute('aria-valuenow', year);
  yearInput.setAttribute('aria-valuetext', year);
  yearInput.dispatchEvent(new Event('input', { bubbles: true }));
  yearInput.dispatchEvent(new Event('change', { bubbles: true }));

  // Wait a moment for the temporary error to render
  await new Promise((res) => setTimeout(res, 100));

  // Now fill MONTH (this should partially resolve the error)
  console.log(`📅 Step 2: Filling MONTH (should partially resolve the error)`);
  monthInput.value = month;
  monthInput.setAttribute('aria-valuenow', month);
  monthInput.setAttribute('aria-valuetext', month);
  monthInput.dispatchEvent(new Event('input', { bubbles: true }));
  monthInput.dispatchEvent(new Event('change', { bubbles: true }));

  // Wait for React to process the change
  await new Promise((res) => setTimeout(res, 100));

  // Finally fill DAY (this should completely resolve the error)
  console.log(`📅 Step 3: Filling DAY (should fully resolve the error)`);
  dayInput.value = day;
  dayInput.setAttribute('aria-valuenow', day);
  dayInput.setAttribute('aria-valuetext', day);
  dayInput.dispatchEvent(new Event('input', { bubbles: true }));
  dayInput.dispatchEvent(new Event('change', { bubbles: true }));

  // Wait for React to process all changes
  await new Promise((res) => setTimeout(res, 100));

  // CRITICAL: Blur the WHOLE date field container (like user clicking away)
  console.log(`📅 Step 4: Blurring the WHOLE date field container`);
  dateWrapper.blur();
  dateWrapper.dispatchEvent(new Event('blur', { bubbles: true }));
  dateWrapper.dispatchEvent(new Event('focusout', { bubbles: true }));

  // Wait for validation to complete
  await new Promise((res) => setTimeout(res, 200));

  // Check the final results
  console.log(`📅 Month input final state: value="${monthInput.value}", aria-valuenow="${monthInput.getAttribute('aria-valuenow')}"`);
  console.log(`📅 Day input final state: value="${dayInput.value}", aria-valuenow="${dayInput.getAttribute('aria-valuenow')}"`);
  console.log(`📅 Year input final state: value="${yearInput.value}", aria-valuenow="${yearInput.getAttribute('aria-valuenow')}"`);
  
  const wrapperId = dateWrapper?.getAttribute("id") ?? "unknown";
  const wrapperAria = dateWrapper?.getAttribute("aria-labelledby") ?? "";
  console.log(`📅 Final validation check for: ${wrapperId}`);
  console.log(`📅 aria-labelledby: ${wrapperAria}`);
  
  // Check if the container focus/blur approach resolved the validation
  if (wrapperAria.includes('ERROR')) {
    console.warn(`⚠️ Date validation error still present after container focus/blur approach`);
  } else {
    console.log(`✅ Date filled successfully using CONTAINER FOCUS/BLUR method - error resolved!`);
  }
}

async function fillDateByGroupId(blockId: string, dateField: string, date: string): Promise<void> {
  if (!date) return;
  
  console.log(`🔄 Filling date ${dateField}: "${date}" for block ${blockId}`);
  
  // Parse MM/YYYY format
  const [mm, yyyy] = date.split('/');
  if (!mm || !yyyy) {
    console.log(`⚠️ Invalid date format: ${date} (expected MM/YYYY)`);
    return;
  }
  
  // Find inputs using data-automation-id (more reliable)
  const blockElement = document.querySelector(`[data-fkit-id="${blockId}"]`) as HTMLElement;
  if (!blockElement) {
    console.log(`❌ Could not find block element with ID: ${blockId}`);
    return;
  }
  
  const monthInput = blockElement.querySelector('[data-automation-id="dateSectionMonth-input"]') as HTMLInputElement;
  const yearInput = blockElement.querySelector('[data-automation-id="dateSectionYear-input"]') as HTMLInputElement;
  
  console.log(`🔍 Looking for month/year inputs in block ${blockId}`);
  
  if (monthInput && yearInput) {
    await fillWorkdayDateInputs(monthInput, yearInput, mm, yyyy);
    console.log(`✅ Filled date ${dateField}: ${mm}/${yyyy} (WORKING METHOD)`);
  } else {
    console.log(`⚠️ Date inputs not found for ${dateField}`);
    console.log(`⚠️ Month input found: ${!!monthInput}`);
    console.log(`⚠️ Year input found: ${!!yearInput}`);
  }
}

function fillYearByGroupId(blockId: string, field: string, year: string): void {
  if (!year) return;
  
  const inputId = `${blockId}--${field}-dateSectionYear-input`;
  const input = document.querySelector(`#${inputId}`) as HTMLInputElement;
  
  console.log(`🔄 Filling year ${field}: "${year}" for block ${blockId}`);
  console.log(`🔍 Looking for year input: ${inputId}`);
  
  if (input) {
    // Use comprehensive Workday-compatible method
    setWorkdayInputValue(input, year);
    
    console.log(`✅ Filled year ${field}: ${year}`);
  } else {
    console.log(`⚠️ Year input not found for ${field} (ID: ${inputId})`);
  }
}

function fillBlockInput(block: HTMLElement, field: string, value: string): void {
  if (!value) return;
  
  const blockId = block.dataset.fkitId;
  console.log(`🔄 Filling input ${field}: "${value}"`);
  console.log(`🔍 Block ID: ${blockId}`);
  
  // Try multiple selector strategies for finding the input
  const possibleSelectors = [
    `#${blockId}--${field}`,                    // Strategy 1: Original approach
    `[id$="--${field}"]`,                      // Strategy 2: Ends with field name
    `[id*="${field}"]`,                        // Strategy 3: Contains field name
    `input[data-automation-id*="${field}"]`,   // Strategy 4: data-automation-id
    `input[name*="${field}"]`,                 // Strategy 5: name attribute
  ];
  
  console.log(`🔍 Trying ${possibleSelectors.length} selector strategies for ${field}:`);
  
  let input: HTMLInputElement | null = null;
  
  for (let i = 0; i < possibleSelectors.length; i++) {
    const selector = possibleSelectors[i];
    console.log(`  ${i + 1}. ${selector}`);
    
    // First try within the block
    input = block.querySelector(selector) as HTMLInputElement;
    if (input) {
      console.log(`✅ Found input using strategy ${i + 1} (within block): ${selector}`);
      break;
    }
    
    // Then try globally
    input = document.querySelector(selector) as HTMLInputElement;
    if (input) {
      console.log(`✅ Found input using strategy ${i + 1} (globally): ${selector}`);
      break;
    }
  }
  
  if (input) {
    console.log(`🔍 Input element found:`, {
      tagName: input.tagName,
      id: input.id,
      name: input.name,
      type: input.type,
      placeholder: input.placeholder,
      value: input.value
    });
    
    // Use comprehensive Workday-compatible method (clears and sets value with focus+blur)
    setWorkdayInputValue(input, value);
    
    console.log(`✅ Filled ${field} with: "${value}"`);
    console.log(`🔍 Final input value: "${input.value}"`);
  } else {
    console.log(`❌ Input not found for ${field} using any strategy`);
    
    // Debug: Show what inputs are actually in the block
    const allInputs = block.querySelectorAll('input, textarea, select');
    console.log(`🔍 DEBUG: Found ${allInputs.length} form elements in block:`);
    allInputs.forEach((el, index) => {
      const element = el as HTMLElement;
      console.log(`  ${index + 1}.`, {
        tagName: element.tagName,
        id: element.id || 'no-id',
        name: (element as HTMLInputElement).name || 'no-name',
        type: (element as HTMLInputElement).type || 'no-type',
        placeholder: (element as HTMLInputElement).placeholder || 'no-placeholder',
        className: element.className || 'no-class'
      });
    });
  }
}

function fillCheckbox(block: HTMLElement, field: string, checked: boolean): void {
  const blockId = block.dataset.fkitId;
  const checkboxId = `${blockId}--${field}`;
  const checkbox = document.querySelector(`#${checkboxId}`) as HTMLInputElement;
  
  console.log(`🔄 Setting checkbox ${field}: ${checked}`);
  console.log(`🔍 Looking for checkbox with ID: ${checkboxId}`);
  
  if (checkbox) {
    if (checkbox.checked !== checked) {
      checkbox.click();
      console.log(`✅ Clicked checkbox ${field} to set to: ${checked}`);
    } else {
      console.log(`ℹ️ Checkbox ${field} already set to: ${checked}`);
    }
  } else {
    console.log(`⚠️ Checkbox not found for ${field} (ID: ${checkboxId})`);
  }
}

function fillDate(block: HTMLElement, dateField: string, date: string): void {
  if (!date) return;
  
  console.log(`🔄 Filling date ${dateField}: "${date}"`);
  
  // Parse MM/YYYY format
  const [mm, yyyy] = date.split('/');
  if (!mm || !yyyy) {
    console.log(`⚠️ Invalid date format: ${date} (expected MM/YYYY)`);
    return;
  }
  
  const blockId = block.dataset.fkitId;
  const monthInputId = `${blockId}--${dateField}-dateSectionMonth-input`;
  const yearInputId = `${blockId}--${dateField}-dateSectionYear-input`;
  
  const monthInput = document.querySelector(`#${monthInputId}`) as HTMLInputElement;
  const yearInput = document.querySelector(`#${yearInputId}`) as HTMLInputElement;
  
  console.log(`🔍 Looking for month input: ${monthInputId}`);
  console.log(`🔍 Looking for year input: ${yearInputId}`);
  
  if (monthInput && yearInput) {
    // Fill YEAR FIRST (Workday validates month against year context)
    setWorkdayInputValue(yearInput, yyyy);
    
    // Then fill month (now has year context for validation)
    setWorkdayInputValue(monthInput, mm);
    
    console.log(`✅ Filled date ${dateField}: ${mm}/${yyyy} (year first strategy)`);
  } else {
    console.log(`⚠️ Date inputs not found for ${dateField}`);
    console.log(`⚠️ Month input found: ${!!monthInput}`);
    console.log(`⚠️ Year input found: ${!!yearInput}`);
  }
}

function fillYear(block: HTMLElement, field: string, year: string): void {
  if (!year) return;
  
  const blockId = block.dataset.fkitId;
  const inputId = `${blockId}--${field}-dateSectionYear-input`;
  const input = document.querySelector(`#${inputId}`) as HTMLInputElement;
  
  console.log(`🔄 Filling year ${field}: "${year}"`);
  console.log(`🔍 Looking for year input: ${inputId}`);
  
  if (input) {
    // Use comprehensive Workday-compatible method
    setWorkdayInputValue(input, year);
    console.log(`✅ Filled year ${field}: ${year}`);
  } else {
    console.log(`⚠️ Year input not found for ${field} (ID: ${inputId})`);
  }
}

// Helper function to fill a single work experience block (updated for grouped blocks)
async function fillWorkExperienceBlock(blockGroup: {blockId: string, elements: HTMLElement[]}, workExp: any): Promise<void> {
  console.log(`🔄 Filling work experience block group: ${blockGroup.blockId}`);
  console.log(`🔄 Block has ${blockGroup.elements.length} elements`);
  
  // Fill job title
  fillBlockInputByGroupId(blockGroup.blockId, 'jobTitle', workExp.position_title);
  
  // Fill company name
  fillBlockInputByGroupId(blockGroup.blockId, 'companyName', workExp.company_name);
  
  // Fill location
  if (workExp.location) {
    fillBlockInputByGroupId(blockGroup.blockId, 'location', workExp.location);
  }
  
  // Fill start date
  if (workExp.start_year) {
    const startMonth = workExp.start_month || '1'; // Default to January if month is missing
    const startDate = formatWorkdayDate(startMonth, workExp.start_year);
    console.log(`🔄 Formatted start date: ${startDate} (month: ${startMonth}, year: ${workExp.start_year})`);
    
    // Find the actual block element and use fillDate function
    for (const blockElement of blockGroup.elements) {
      const monthInput = blockElement.querySelector('[id*="startDate"][data-automation-id="dateSectionMonth-input"]') as HTMLInputElement;
      const yearInput = blockElement.querySelector('[id*="startDate"][data-automation-id="dateSectionYear-input"]') as HTMLInputElement;
      
      if (monthInput && yearInput) {
        const [mm, yyyy] = startDate.split('/');
        console.log(`📅 Found start date inputs, filling: ${mm}/${yyyy}`);
        await fillWorkdayDateInputs(monthInput, yearInput, mm, yyyy);
        break;
      }
    }
  }
  
  // Handle current job checkbox
  const isCurrentJob = !workExp.end_month || !workExp.end_year;
  if (isCurrentJob) {
    console.log(`🔄 Checking "currently work here" for current job`);
    fillCheckboxByGroupId(blockGroup.blockId, 'currentlyWorkHere', true);
  } else {
    // Fill end date for non-current jobs
    const endMonth = workExp.end_month || '12'; // Default to December if month is missing
    const endDate = formatWorkdayDate(endMonth, workExp.end_year);
    console.log(`🔄 Formatted end date: ${endDate} (month: ${endMonth}, year: ${workExp.end_year})`);
    
    // Find the actual block element and use fillDate function
    for (const blockElement of blockGroup.elements) {
      const monthInput = blockElement.querySelector('[id*="endDate"][data-automation-id="dateSectionMonth-input"]') as HTMLInputElement;
      const yearInput = blockElement.querySelector('[id*="endDate"][data-automation-id="dateSectionYear-input"]') as HTMLInputElement;
      
      if (monthInput && yearInput) {
        const [mm, yyyy] = endDate.split('/');
        console.log(`📅 Found end date inputs, filling: ${mm}/${yyyy}`);
        await fillWorkdayDateInputs(monthInput, yearInput, mm, yyyy);
        break;
      }
    }
  }
  
  // Fill description
  if (workExp.description) {
    fillBlockInputByGroupId(blockGroup.blockId, 'roleDescription', workExp.description);
  }
}

// Helper function to fill a single education block (updated for grouped blocks)
async function fillEducationBlock(blockGroup: {blockId: string, elements: HTMLElement[]}, education: any): Promise<void> {
  console.log(`🔄 Filling education block group: ${blockGroup.blockId}`);
  console.log(`🔄 Block has ${blockGroup.elements.length} elements`);
  
  // 🔍 CRITICAL DEBUG: Log the raw education object to see what's actually being passed
  console.log(`🔍 RAW education object:`, JSON.stringify(education, null, 2));
  
  console.log(`🔄 Education data:`, {
    institution: education.institution_name,
    degree: education.degree_type,
    major: education.major,
    gpa: education.gpa,
    startYear: education.start_year,
    endYear: education.end_year,
    startMonth: education.start_month,
    endMonth: education.end_month
  });
  
  // Fill school name - try multiple field name variations
  const schoolName = education.institution_name || education.school_name || education.school || '';
  if (schoolName) {
    const schoolInput = blockGroup.elements
      .map(el => el.querySelector?.('input[id*="schoolName"]') || 
                  el.querySelector?.('input[id*="school"]') || 
                  el.querySelector?.('input[id*="institution"]') ||
                  el.querySelector?.('input[id*="university"]'))
      .find(Boolean) as HTMLInputElement;
    
    if (schoolInput) {
      // Use comprehensive Workday-compatible method
      setWorkdayInputValue(schoolInput, schoolName);
      console.log(`✅ Filled school name: ${schoolName}`);
    } else {
      console.log(`❌ Could not find school name input in block ${blockGroup.blockId}`);
    }
  }
  
  // Fill degree type (dropdown) - try multiple field name variations
  const degreeType = education.degree_type || education.degree || education.level || '';
  if (degreeType) {
    const degreeDropdown = blockGroup.elements
      .map(el => el.querySelector?.('button[id*="degree"]') || 
                  el.querySelector?.('button[id*="level"]') ||
                  el.querySelector?.('div[id*="degree"] button') ||
                  el.querySelector?.('div[role="button"][id*="degree"]'))
      .find(Boolean) as HTMLElement;
    
    if (degreeDropdown) {
      console.log(`🔍 Found degree dropdown in block ${blockGroup.blockId}, attempting to select: ${degreeType}`);
      const success = await clickWorkdayDropdown(degreeDropdown, degreeType);
      if (success) {
        console.log(`✅ Selected degree type: ${degreeType}`);
      } else {
        console.log(`❌ Failed to select degree type: ${degreeType}`);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`❌ Could not find degree dropdown in block ${blockGroup.blockId}`);
      
      // Debug: Show all button elements in this block
      const allButtons = blockGroup.elements.flatMap(el => Array.from(el.querySelectorAll('button')));
      console.log(`🔍 DEBUG: Found ${allButtons.length} buttons in block:`, 
        allButtons.map(btn => ({ id: btn.id, text: btn.textContent?.trim() })));
    }
  }
  
  // Fill field of study/major - try multiselect first, then dropdown, then regular input
  const fieldOfStudy = education.major || education.field_of_study || education.field || '';
  if (fieldOfStudy) {
    let fieldFilled = false;
    
    // Add timing delay to ensure elements are rendered
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Method 1: Try multiselect input (scoped to current block)
    console.log(`🎓 Attempting multiselect field of study in block ${blockGroup.blockId}...`);
    const multiselectInput = blockGroup.elements
      .map(el => el.querySelector?.('div[data-automation-id="multiSelectContainer"] input') ||
                  el.querySelector?.('div[data-automation-id="multiSelectContainer"] input[type="text"]') ||
                  el.querySelector?.('input[placeholder*="Search"]') ||
                  el.querySelector?.('input[id*="fieldOfStudy"]') ||
                  el.querySelector?.('input[aria-label*="Field of Study"]'))
      .find(Boolean) as HTMLInputElement;
    
    if (multiselectInput) {
      console.log(`🔍 Found multiselect input in block ${blockGroup.blockId}, attempting to fill: ${fieldOfStudy}`);
      fieldFilled = await fillMultiselectFieldOfStudy(multiselectInput, fieldOfStudy);
      if (fieldFilled) {
        console.log(`✅ Filled field of study via multiselect: ${fieldOfStudy}`);
      }
    }
    
    // Method 2: Try dropdown button (fallback)
    if (!fieldFilled) {
      const fieldDropdown = blockGroup.elements
        .map(el => el.querySelector?.('button[id*="fieldOfStudy"]') || 
                    el.querySelector?.('button[id*="major"]') ||
                    el.querySelector?.('button[id*="field"]') ||
                    el.querySelector?.('button[id*="study"]') ||
                    el.querySelector?.('div[id*="fieldOfStudy"] button') ||
                    el.querySelector?.('div[role="button"][id*="field"]'))
        .find(Boolean) as HTMLElement;
      
      if (fieldDropdown) {
        console.log(`🔍 Found field of study dropdown in block ${blockGroup.blockId}, attempting to select: ${fieldOfStudy}`);
        const success = await clickWorkdayDropdown(fieldDropdown, fieldOfStudy);
        if (success) {
          console.log(`✅ Selected field of study via dropdown: ${fieldOfStudy}`);
          fieldFilled = true;
        } else {
          console.log(`❌ Failed to select field of study via dropdown: ${fieldOfStudy}`);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Method 3: Try regular input (final fallback)
    if (!fieldFilled) {
      const fieldInput = blockGroup.elements
        .map(el => el.querySelector?.('input[id*="fieldOfStudy"]') ||
                    el.querySelector?.('input[id*="major"]') ||
                    el.querySelector?.('input[placeholder*="Field of Study"]') ||
                    el.querySelector?.('input[placeholder*="Major"]'))
        .find(Boolean) as HTMLInputElement;
      
      if (fieldInput) {
        // Use React-compatible method
        setNativeValue(fieldInput, fieldOfStudy);
        console.log(`✅ Filled field of study via regular input: ${fieldOfStudy}`);
        fieldFilled = true;
      }
    }
    
    // Enhanced debugging if nothing worked
    if (!fieldFilled) {
      console.log(`❌ Could not find field of study input in block ${blockGroup.blockId}`);
      
      // Debug: Show all elements in this specific block
      console.warn("❌ Field of Study input not found in:", blockGroup.elements[0]);
      
      // Debug: Show all inputs/buttons in this block
      const allElements = blockGroup.elements.flatMap(el => Array.from(el.querySelectorAll('input, button, div[data-automation-id]')));
      console.log(`🔍 DEBUG: Found ${allElements.length} elements in education block ${blockGroup.blockId}:`);
      allElements.forEach((el, index) => {
        const element = el as HTMLElement;
        console.log(`  ${index + 1}.`, {
          tagName: element.tagName,
          id: element.id || 'no-id',
          type: element.tagName === 'INPUT' ? (element as HTMLInputElement).type : 'not-input',
          placeholder: element.tagName === 'INPUT' ? (element as HTMLInputElement).placeholder : 'not-input',
          'data-automation-id': element.getAttribute('data-automation-id') || 'none',
          className: element.className || 'no-class',
          textContent: element.textContent?.trim().slice(0, 50) || 'no-text'
        });
      });
    }
  }
  
  // Fill GPA - try multiple field name variations
  const gpa = education.gpa || education.grade_point_average || '';
  if (gpa) {
    const gpaInput = blockGroup.elements
      .map(el => el.querySelector?.('input[id*="gpa"]') || 
                  el.querySelector?.('input[id*="grade"]') ||
                  el.querySelector?.('input[id*="gradeAverage"]') ||
                  el.querySelector?.('input[id*="gradePointAverage"]') ||
                  el.querySelector?.('input[type="number"]'))
      .find(Boolean) as HTMLInputElement;
    
    if (gpaInput) {
      gpaInput.value = gpa.toString();
      gpaInput.dispatchEvent(new Event('input', { bubbles: true }));
      gpaInput.dispatchEvent(new Event('change', { bubbles: true }));
      gpaInput.dispatchEvent(new Event('blur', { bubbles: true }));
      console.log(`✅ Filled GPA: ${gpa}`);
    } else {
      console.log(`❌ Could not find GPA input in block ${blockGroup.blockId}`);
    }
  }
  
  // Fill start year/date
  if (education.start_year) {
    const startYearInput = blockGroup.elements
      .map(el => el.querySelector?.('input[id*="firstYearAttended"]') || 
                  el.querySelector?.('input[id*="startYear"]') ||
                  el.querySelector?.('input[id*="start"]') ||
                  el.querySelector?.('input[id*="from"]'))
      .find(Boolean) as HTMLInputElement;
    
    if (startYearInput) {
      // Check if this expects a full date or just year
      const placeholder = startYearInput.placeholder?.toLowerCase() || '';
      let dateValue: string;
      
      if (placeholder.includes('mm') && placeholder.includes('yyyy')) {
        // Expects MM/YYYY format
        const month = education.start_month || 1;
        dateValue = `${month.toString().padStart(2, '0')}/${education.start_year}`;
      } else {
        // Just year
        dateValue = education.start_year.toString();
      }
      
      // Use comprehensive Workday-compatible method
      setWorkdayInputValue(startYearInput, dateValue);
      console.log(`✅ Filled start date: ${dateValue}`);
    } else {
      console.log(`❌ Could not find start year input in block ${blockGroup.blockId}`);
    }
  }
  
  // Fill end year/graduation date
  if (education.end_year) {
    const endYearInput = blockGroup.elements
      .map(el => el.querySelector?.('input[id*="lastYearAttended"]') || 
                  el.querySelector?.('input[id*="endYear"]') ||
                  el.querySelector?.('input[id*="graduationYear"]') ||
                  el.querySelector?.('input[id*="graduation"]') ||
                  el.querySelector?.('input[id*="end"]') ||
                  el.querySelector?.('input[id*="to"]'))
      .find(Boolean) as HTMLInputElement;
    
    if (endYearInput) {
      // Check if this expects a full date or just year
      const placeholder = endYearInput.placeholder?.toLowerCase() || '';
      let dateValue: string;
      
      if (placeholder.includes('mm') && placeholder.includes('yyyy')) {
        // Expects MM/YYYY format
        const month = education.end_month || 12;
        dateValue = `${month.toString().padStart(2, '0')}/${education.end_year}`;
      } else {
        // Just year
        dateValue = education.end_year.toString();
      }
      
      // Use comprehensive Workday-compatible method
      setWorkdayInputValue(endYearInput, dateValue);
      console.log(`✅ Filled end date: ${dateValue}`);
    } else {
      console.log(`❌ Could not find end year input in block ${blockGroup.blockId}`);
    }
  }
  
  // Debug: Show all input elements in this block for troubleshooting
  const allInputs = blockGroup.elements.flatMap(el => Array.from(el.querySelectorAll('input, button')));
  console.log(`🔍 DEBUG: Found ${allInputs.length} inputs/buttons in education block:`, 
    allInputs.map(input => ({ 
      id: input.id, 
      type: input.tagName.toLowerCase() === 'input' ? (input as HTMLInputElement).type : 'button',
      placeholder: input.tagName.toLowerCase() === 'input' ? (input as HTMLInputElement).placeholder : '',
      text: input.textContent?.trim() || ''
    })));
}

// Helper function to check if a section has any visible blocks
function isSectionEmpty(prefix: string): boolean {
  return getGroupedBlocks(prefix).length === 0;
}

// Helper function to find the initial "Add" button for a section (scoped to correct section)
function findSectionAddButton(sectionName: string): HTMLElement | null {
  console.log(`🔍 Looking for "Add" button for ${sectionName} section`);
  
  // First, try to find the section header and scope the search to that container
  const headers = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6, strong, span, div[role='heading']"));
  
  for (const header of headers) {
    const headerText = header.textContent?.toLowerCase() || "";
    const sectionNameLower = sectionName.toLowerCase();
    
    // Check if this header contains the section name
    if (headerText.includes(sectionNameLower) || 
        headerText.includes(sectionNameLower.replace(/\s+/g, '')) ||
        (sectionName === "Work Experience" && headerText.includes("experience")) ||
        (sectionName === "Education" && headerText.includes("education"))) {
      
      console.log(`🔍 Found potential section header: "${headerText.trim()}"`);
      
      // Find the container for this section
      const container = header.closest("section, div, fieldset") || 
                       header.parentElement?.closest("section, div") ||
                       header.parentElement;
      
      if (container) {
        console.log(`🔍 Searching for Add button within section container`);
        
        // Look for buttons within this container
        const buttons = container.querySelectorAll("button");
        for (const btn of buttons) {
          const buttonText = (btn.textContent || "").toLowerCase().trim();
          console.log(`🔍 Checking button in section: "${buttonText}"`);
          
          // Look for "Add" buttons but exclude "Add Another"
          if (buttonText.includes("add") && 
              !buttonText.includes("another") && 
              !buttonText.includes("more")) {
            console.log(`✅ Found scoped Add button in section '${sectionName}': "${buttonText}"`);
            return btn as HTMLElement;
          }
        }
      }
    }
  }
  
  // Fallback: Try section-specific selectors
  console.log(`🔍 Trying fallback selectors for ${sectionName}`);
  const sectionSpecificSelectors = [
    `div[aria-labelledby="${sectionName}-section"] button[data-automation-id="add-button"]`,
    `div[aria-labelledby="${sectionName}"] button[data-automation-id="add-button"]`,
    `button[data-automation-id="add${sectionName.replace(/\s+/g, '')}"]`,
    `button[data-automation-id="${sectionName.toLowerCase().replace(/\s+/g, '')}-add-button"]`,
    `div[data-automation-id="${sectionName}"] button`,
    `div[data-automation-id="${sectionName.toLowerCase()}"] button`
  ];
  
  for (const selector of sectionSpecificSelectors) {
    const button = document.querySelector(selector) as HTMLElement;
    if (button) {
      console.log(`✅ Found "Add" button using fallback selector: ${selector}`);
      return button;
    }
  }
  
  // Final fallback: Look for any Add button with section-specific text
  const addButtonTexts = [
    `Add ${sectionName}`,
    `+ Add ${sectionName}`,
    "Add Entry",
    "+ Add Entry",
    "Add"
  ];
  
  for (const buttonText of addButtonTexts) {
    const buttons = Array.from(document.querySelectorAll("button"));
    for (const button of buttons) {
      const text = (button.textContent || "").toLowerCase().trim();
      if (text === buttonText.toLowerCase() || 
          (buttonText === "Add" && text === "add" && !text.includes("another"))) {
        console.log(`✅ Found "Add" button with exact text match: "${text}"`);
        return button as HTMLElement;
      }
    }
  }
  
  console.warn(`❌ Could not find scoped Add button for section: ${sectionName}`);
  return null;
}

// Helper function to ensure a section is visible by clicking Add if needed
async function ensureSectionVisible(sectionName: string, prefix: string): Promise<void> {
  console.log(`🔍 Ensuring ${sectionName} section is visible`);
  
  if (isSectionEmpty(prefix)) {
    console.log(`📝 ${sectionName} section is empty, clicking "Add" button`);
    const addButton = findSectionAddButton(sectionName);
    if (addButton) {
      addButton.click();
      console.log(`✅ Clicked "Add" button for ${sectionName}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for DOM to render block
      
      // Verify block was created
      const blocks = getGroupedBlocks(prefix);
      if (blocks.length > 0) {
        console.log(`✅ ${sectionName} block successfully created`);
      } else {
        console.log(`⚠️ ${sectionName} block not created after clicking Add`);
      }
    } else {
      console.log(`❌ Could not find "Add" button for ${sectionName}`);
    }
  } else {
    console.log(`✅ ${sectionName} section already has visible blocks`);
  }
}

async function clickAddAnother(sectionLabel: string): Promise<void> {
  console.log(`🔄 Looking for "Add Another" button for section: ${sectionLabel}`);
  
  const buttons = Array.from(document.querySelectorAll('button[data-automation-id="add-button"]'));
  console.log(`🔍 Found ${buttons.length} add buttons`);
  
  const labelMatches = new RegExp(sectionLabel, 'i');
  
  for (const btn of buttons) {
    const group = btn.closest('div[role="group"]');
    const h3 = group?.querySelector('h3')?.textContent;
    
    console.log(`🔍 Checking button with section header: "${h3}"`);
    
    if (h3 && labelMatches.test(h3)) {
      console.log(`✅ Found matching "Add Another" button for ${sectionLabel}`);
      (btn as HTMLElement).click();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for new block to appear
      return;
    }
  }
  
  console.log(`⚠️ No "Add Another" button found for section: ${sectionLabel}`);
}

// Helper function to fill Work Experience section using Add Button Aware logic
async function fillWorkExperienceSection(completeProfile: any): Promise<void> {
  console.log("💼 === STARTING WORK EXPERIENCE SECTION ===");
  
  if (!completeProfile?.work_experiences?.length) {
    console.log("❌ No work experiences found in profile");
    return;
  }
  
  const workExperiences = completeProfile.work_experiences.slice(0, 3);
  console.log(`🧠 Processing ${workExperiences.length} work experiences:`);
  
  // 🔍 CRITICAL DEBUG: Log all work experience titles to verify array iteration
  console.log(`🔍 DEBUG - All work experience titles:`, workExperiences.map((exp: any) => exp.position_title));
  console.log(`🔍 DEBUG - All work experience companies:`, workExperiences.map((exp: any) => exp.company_name));
  
  workExperiences.forEach((exp: any, i: number) => {
    console.log(`  ${i + 1}. ${exp.position_title} at ${exp.company_name}`);
  });
  
  // Step 1: Ensure Work Experience section is visible (click Add if needed)
  await ensureSectionVisible("Work Experience", "workExperience");
  
  // Step 2: Fill each work experience using improved block-based approach
  for (let i = 0; i < workExperiences.length; i++) {
    const workExp = workExperiences[i];
    
    console.log(`\n💼 === FILLING WORK EXPERIENCE ${i + 1}/${workExperiences.length} ===`);
    console.log(`📋 Job: ${workExp.position_title}`);
    console.log(`🏢 Company: ${workExp.company_name}`);
    console.log(`📍 Location: ${workExp.location || 'N/A'}`);
    console.log(`🗓️ Dates: ${workExp.start_month}/${workExp.start_year} - ${workExp.end_month || 'Present'}/${workExp.end_year || ''}`);
    
    // Get current grouped blocks
    let workBlocks = getGroupedBlocks('workExperience');
    console.log(`🔍 Found ${workBlocks.length} work experience block groups before processing entry ${i + 1}`);
    
    // Only click "Add Another" if we need more blocks for THIS entry
    if (i >= workBlocks.length) {
      console.log(`🔄 Need more blocks (entry ${i + 1} needs block ${i + 1}, but only ${workBlocks.length} blocks exist). Clicking Add Another.`);
      await clickAddAnother("Work Experience");
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for new block to appear
      
      // Refresh blocks after clicking "Add Another"
      workBlocks = getGroupedBlocks('workExperience');
      console.log(`🔍 Refreshed blocks after Add Another: ${workBlocks.length} work experience block groups`);
    }
    
    // Use the block group at index i
    const blockGroup = workBlocks[i];
    if (blockGroup) {
      console.log(`🔄 Using block group ${i + 1} with ID: ${blockGroup.blockId}`);
      
      // Fill the work experience
      fillWorkExperienceBlock(blockGroup, workExp);
      console.log(`✅ Filled work experience ${i + 1}/${workExperiences.length}`);
    } else {
      console.log(`❌ Could not find work experience block group ${i + 1} after ensuring it exists`);
    }
    
    // Wait between entries
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("✅ Work Experience section completed");
}

// Helper function to fill Education section using Add Button Aware logic
async function fillEducationSection(completeProfile: any): Promise<void> {
  console.log("\n🎓 === STARTING EDUCATION SECTION ===");
  
  // Wait for work experience to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (!completeProfile?.education?.length) {
    console.log("❌ No education entries found in profile");
    return;
  }
  
  const educationEntries = completeProfile.education.slice(0, 2);
  console.log(`🧠 Processing ${educationEntries.length} education entries:`);
  
  // 🔍 CRITICAL DEBUG: Log all education entries to verify array iteration
  console.log(`🔍 DEBUG - All education degrees:`, educationEntries.map((edu: any) => edu.degree_type || 'Unknown'));
  console.log(`🔍 DEBUG - All education schools:`, educationEntries.map((edu: any) => edu.institution_name || 'Unknown'));
  
  educationEntries.forEach((edu: any, i: number) => {
    console.log(`  ${i + 1}. ${edu.degree_type || 'Unknown Degree'} from ${edu.institution_name || 'Unknown School'}`);
  });
  
  // Step 1: Ensure Education section is visible (click Add if needed)
  await ensureSectionVisible("Education", "education");
  
  // Step 2: Fill each education entry using improved block-based approach
  for (let i = 0; i < educationEntries.length; i++) {
    const education = educationEntries[i];
    
    console.log(`\n🎓 === FILLING EDUCATION ${i + 1}/${educationEntries.length} ===`);
    console.log(`🔍 RAW education entry ${i + 1}:`, JSON.stringify(education, null, 2));
    console.log(`🏫 School: ${education.institution_name || 'Unknown'}`);
    console.log(`🎓 Degree: ${education.degree_type || 'Unknown'}`);
    console.log(`📚 Major: ${education.major || education.field_of_study || 'N/A'}`);
    console.log(`📊 GPA: ${education.gpa || 'N/A'}`);
    console.log(`🗓️ Dates: ${education.start_month || 'N/A'}/${education.start_year || 'N/A'} - ${education.end_month || 'N/A'}/${education.end_year || 'N/A'}`);
    
    // Get current grouped blocks
    let educationBlocks = getGroupedBlocks('education');
    console.log(`🔍 Found ${educationBlocks.length} education block groups before processing entry ${i + 1}`);
    
    // Only click "Add Another" if we need more blocks for THIS entry
    if (i >= educationBlocks.length) {
      console.log(`🔄 Need more blocks (entry ${i + 1} needs block ${i + 1}, but only ${educationBlocks.length} blocks exist). Clicking Add Another.`);
      await clickAddAnother("Education");
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for new block to appear
      
      // Refresh blocks after clicking "Add Another"
      educationBlocks = getGroupedBlocks('education');
      console.log(`🔍 Refreshed blocks after Add Another: ${educationBlocks.length} education block groups`);
    }
    
    // Use the block group at index i
    const blockGroup = educationBlocks[i];
    if (blockGroup) {
      console.log(`🔄 Using block group ${i + 1} with ID: ${blockGroup.blockId}`);
      
      // Fill the education (now async)
      await fillEducationBlock(blockGroup, education);
      console.log(`✅ Filled education ${i + 1}/${educationEntries.length}`);
    } else {
      console.log(`❌ Could not find education block group ${i + 1} after ensuring it exists`);
    }
    
    // Wait between entries
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("✅ Education section completed");
}

// Helper function to fill a single website block (grouped blocks approach)
function fillWebsiteBlock(blockGroup: {blockId: string, elements: HTMLElement[]}, websiteUrl: string): void {
  console.log(`🔄 Filling website block group: ${blockGroup.blockId}`);
  console.log(`🔄 Block has ${blockGroup.elements.length} elements`);
  
  // Find the input within this specific block group (scoped search)
  const input = blockGroup.elements
    .map(el => el.querySelector?.('input[id$="--url"]') || el.querySelector?.('input[id*="webAddress"]') || el.querySelector?.('input[type="text"]'))
    .find(Boolean) as HTMLInputElement;
  
  if (input) {
    console.log(`🔍 Found scoped input in block ${blockGroup.blockId}:`, {
      id: input.id,
      name: input.name,
      type: input.type,
      placeholder: input.placeholder
    });
    
    // Use comprehensive Workday-compatible method (clears and sets value with focus+blur)
    setWorkdayInputValue(input, websiteUrl);
    
    console.log(`✅ Website filled in block ${blockGroup.blockId}: ${websiteUrl}`);
    console.log(`🔍 Final input value: "${input.value}"`);
  } else {
    console.warn(`❌ Could not find website input in block group ${blockGroup.blockId}`);
    
    // Debug: Show what elements are in this block group
    console.log(`🔍 DEBUG: Block group elements:`, blockGroup.elements.map(el => ({
      tagName: el.tagName,
      id: el.id || 'no-id',
      className: el.className || 'no-class',
      innerHTML: el.innerHTML.substring(0, 100) + '...'
    })));
  }
}

// Helper function to fill Websites section using Add Button Aware logic
async function fillWebsitesSection(completeProfile: any): Promise<void> {
  console.log("\n🌐 === STARTING WEBSITES SECTION ===");
  
  // Wait for education to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Get website URLs from portfolio_links
  const websites = completeProfile?.portfolio_links?.map((link: any) => link.url).filter((url: string) => url) || [];
  
  if (!websites.length) {
    console.log("❌ No websites found in profile");
    return;
  }
  
  console.log(`🧠 Found ${websites.length} websites to add:`, websites);
  
  // Step 1: Ensure Websites section is visible (click Add if needed)
  await ensureSectionVisible("Websites", "webAddress");
  
  // Step 2: Fill each website using improved block-based approach
  for (let i = 0; i < websites.length && i < 3; i++) { // Limit to 3 websites
    const website = websites[i];
    
    console.log(`\n🌐 === FILLING WEBSITE ${i + 1}/${Math.min(websites.length, 3)} ===`);
    console.log(`🔗 URL: ${website}`);
    
    // Get current grouped blocks
    let websiteBlocks = getGroupedBlocks('webAddress');
    console.log(`🔍 Found ${websiteBlocks.length} website block groups before processing entry ${i + 1}`);
    
    // Only click "Add Another" if we need more blocks for THIS entry
    if (i >= websiteBlocks.length) {
      console.log(`🔄 Need more blocks (entry ${i + 1} needs block ${i + 1}, but only ${websiteBlocks.length} blocks exist). Clicking Add Another.`);
      await clickAddAnother("Websites");
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for new block to appear
      
      // Refresh blocks after clicking "Add Another"
      websiteBlocks = getGroupedBlocks('webAddress');
      console.log(`🔍 Refreshed blocks after Add Another: ${websiteBlocks.length} website block groups`);
    }
    
    // Use the block group at index i
    const blockGroup = websiteBlocks[i];
    if (blockGroup) {
      console.log(`🔄 Using block group ${i + 1} with ID: ${blockGroup.blockId}`);
      
      // Fill the website
      fillWebsiteBlock(blockGroup, website);
      console.log(`✅ Filled website ${i + 1}/${Math.min(websites.length, 3)}: ${website}`);
    } else {
      console.log(`❌ Could not find website block group ${i + 1} after ensuring it exists`);
    }
    
    // Wait between entries
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("✅ Websites section completed");
}

// Helper function to fill Languages section
async function fillLanguagesSection(completeProfile: any): Promise<void> {
  console.log("\n🗣️ === STARTING LANGUAGES SECTION ===");
  
  // Wait for websites to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (!completeProfile?.profile_languages?.length) {
    console.log("❌ No languages found in profile");
    return;
  }
  
  console.log(`🧠 Found ${completeProfile.profile_languages.length} languages to add`);
  // Languages implementation will come next
  console.log("🚧 Languages section - implementation pending");
}

// Helper function to fill Skills section
async function fillSkillsSection(completeProfile: any): Promise<void> {
  console.log("\n🎯 === STARTING SKILLS SECTION ===");
  
  const skillsEl = findElement(WORKDAY_STEP2_SELECTORS.SKILLS_INPUT);
  if (!skillsEl) {
    console.log("❌ Skills input not found");
    return;
  }
  
  if (!completeProfile?.profile_skills?.length) {
    console.log("❌ No skills found in profile");
    return;
  }
  
  const skills = completeProfile.profile_skills.map((skill: any) => skill.skill_name);
  console.log(`🧠 Found ${skills.length} skills:`, skills.slice(0, 5));
  
  const success = await fillSkillsInput(skillsEl, skills);
  if (success) {
    console.log("✅ Skills section completed");
  } else {
    console.log("❌ Skills section failed");
  }
}

// Helper function to fill Resume section using locally stored resume data
async function fillResumeSection(profile: any): Promise<void> {
  console.log("\n📄 === STARTING RESUME SECTION ===");
  
  const resumeInputEl = findElement(WORKDAY_STEP2_SELECTORS.RESUME_FILE_INPUT);
  if (!resumeInputEl) {
    console.log("❌ Resume upload element not found");
    return;
  }
  
  try {
    // Check for resume URL in locally stored profile data
    const resumeUrl = profile.resume_url || profile.resumeUrl || profile.resume;
    
    if (!resumeUrl) {
      console.log("⚠️ No resume URL found in local profile data");
      console.log("🔍 Available profile keys:", Object.keys(profile));
      return;
    }
    
    console.log("✅ Found resume URL in local profile data");
    console.log("📄 Resume URL:", resumeUrl.substring(0, 100) + "...");
    console.log("📄 Found resume upload element, attempting upload...");
    
    const success = await handleResumeUpload(resumeInputEl, resumeUrl);
    if (success) {
      console.log("✅ Resume section completed successfully");
    } else {
      console.log("❌ Resume section failed");
    }
    
  } catch (error) {
    console.log("❌ Error in resume section:", error);
  }
}

// Main Workday Autofill Function - Entry Point
export async function autofillWorkday(userData: any): Promise<void> {
  console.log("🔄 Starting Workday autofill process with user data:", userData);
  
  // 🔍 CRITICAL DEBUG: Log the structure of userData to understand what we're working with
  console.log("🔍 DEBUG - userData keys:", Object.keys(userData));
  console.log("🔍 DEBUG - userData.education type:", typeof userData.education);
  console.log("🔍 DEBUG - userData.education_records type:", typeof userData.education_records);
  console.log("🔍 DEBUG - userData.education sample:", userData.education?.[0]);
  console.log("🔍 DEBUG - userData.education_records sample:", userData.education_records?.[0]);
  
  try {
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract profile data
    const profile = userData;
    
    // 🔍 CRITICAL FIX: Use the normalized data arrays, not the transformed legacy format
    const completeProfile: any = {
      profile: userData,
      work_experiences: userData.work_experiences || [],
      education: userData.education_records || [], // Use education_records (normalized) not education (legacy)
      skills: userData.profile_skills || [],
      languages: userData.profile_languages || [],
      certifications: userData.certifications || [],
      portfolio_links: userData.portfolio_links || []
    };
    
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
  
  // Try Step 3 fields
  const step3Button = document.querySelector(WORKDAY_STEP3_SELECTORS.QUESTION_BUTTONS.join(', '));
  if (step3Button) {
    console.log("📝 Found Step 3 fields, filling...");
    await fillStep3ApplicationQuestions(profile);
    return;
  }
  
  // Try Step 4 fields
  const step4Button = findElement(WORKDAY_STEP4_SELECTORS.GENDER) || findElement(WORKDAY_STEP4_SELECTORS.ETHNICITY);
  if (step4Button) {
    console.log("📝 Found Step 4 fields, filling...");
    await fillStep4VoluntaryDisclosures(profile);
    return;
  }
  
  // Try Step 5 fields
  const step5NameField = findElement(WORKDAY_STEP5_SELECTORS.NAME);
  const step5DisabilityField = findElement(WORKDAY_STEP5_SELECTORS.DISABILITY_CHECKBOXES);
  if (step5NameField || step5DisabilityField) {
    console.log("📝 Found Step 5 fields, filling...");
    await fillStep5SelfIdentification(profile);
    return;
  }
  
  console.log("ℹ️ No recognizable step fields found");
}

// Step 3: Application Questions
async function fillStep3ApplicationQuestions(profile: any): Promise<void> {
  console.log("\\n❓ === STARTING STEP 3: APPLICATION QUESTIONS ===");
  
  // Find all question buttons using the improved selectors
  const questionButtons = document.querySelectorAll(WORKDAY_STEP3_SELECTORS.QUESTION_BUTTONS.join(', '));
  console.log(`🔍 Found ${questionButtons.length} application question dropdown(s)`);
  
  if (questionButtons.length === 0) {
    console.log("ℹ️ No application questions found on this page");
    return;
  }
  
  let questionsAnswered = 0;
  
  for (let i = 0; i < questionButtons.length; i++) {
    const button = questionButtons[i] as HTMLButtonElement;
    
    try {
      // Get the question text from the legend or label
      const fieldset = button.closest('fieldset');
      const legend = fieldset?.querySelector('legend');
      const questionText = legend?.textContent?.trim() || '';
      
      console.log(`\\n❓ Question ${i + 1}: "${questionText}"`);
      
      // Check current state of the question
      const currentValue = button.textContent?.trim() || '';
      const isAnswered = currentValue && currentValue !== 'Select One';
      
      if (isAnswered) {
        console.log(`🔄 Question already answered with: "${currentValue}" - but REFILLING as requested`);
      }
      
      if (!questionText) {
        console.log("⚠️ Could not extract question text, skipping");
        continue;
      }
      
      // Use our existing generic question answer logic
      const answer = getGenericQuestionAnswer(questionText, profile);
      
      if (answer) {
        console.log(`✅ Found answer: "${answer}"`);
        
        // ALWAYS click to refill, even if already answered
        if (isAnswered) {
          console.log(`🔄 Overriding existing answer "${currentValue}" with "${answer}"`);
        }
        
        // Click the dropdown to open it
        button.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find and click the matching option
        const success = await selectDropdownOption(answer);
        
        if (success) {
          questionsAnswered++;
          console.log(`✅ Successfully ${isAnswered ? 'refilled' : 'answered'} question ${i + 1}`);
        } else {
          console.log(`❌ Failed to select answer for question ${i + 1}`);
        }
        
        // Wait a bit between questions
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } else {
        console.log(`ℹ️ No predefined answer for this question - skipping (company-specific)`);
        if (isAnswered) {
          console.log(`ℹ️ Leaving existing answer "${currentValue}" unchanged`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Error processing question ${i + 1}:`, error);
    }
  }
  
  console.log(`\\n✅ Step 3 completed: Answered ${questionsAnswered} out of ${questionButtons.length} questions`);
}

// Helper function to select dropdown option by text
async function selectDropdownOption(optionText: string): Promise<boolean> {
  // Wait for dropdown to open
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Look for the option in the dropdown
  const options = document.querySelectorAll('[role="option"], [role="listbox"] li, .wd-popup li, [data-automation-id*="option"]');
  
  for (const option of options) {
    const text = option.textContent?.trim() || '';
    
    // Exact match or contains match
    if (text === optionText || text.toLowerCase().includes(optionText.toLowerCase())) {
      console.log(`🎯 Found matching option: "${text}"`);
      (option as HTMLElement).click();
      return true;
    }
  }
  
  console.log(`❌ Could not find option matching: "${optionText}"`);
  console.log(`Available options:`, Array.from(options).map(o => o.textContent?.trim()));
  
  return false;
}

// Step 4: Voluntary Disclosures
async function fillStep4VoluntaryDisclosures(profile: any): Promise<void> {
  console.log("\\n🤐 === STARTING STEP 4: VOLUNTARY DISCLOSURES ===");
  
  console.log(`🔍 Profile voluntary disclosure data:`, {
    gender: profile.gender,
    ethnicity: profile.ethnicity,
    military_veteran: profile.military_veteran
  });
  
  let fieldsAttempted = 0;
  let fieldsSuccessful = 0;
  
     // Gender Selection
   if (profile.gender) {
     console.log(`\\n👤 Filling Gender: "${profile.gender}"`);
     const genderButton = findElement(WORKDAY_STEP4_SELECTORS.GENDER) as HTMLButtonElement;
     
     if (genderButton) {
       fieldsAttempted++;
       const success = await fillVoluntaryDisclosureDropdown(genderButton, profile.gender, 'Gender');
       if (success) fieldsSuccessful++;
     } else {
       console.log("❌ Gender dropdown not found");
     }
   } else {
     console.log("ℹ️ No gender data in profile, skipping");
   }
   
   // Ethnicity Selection  
   if (profile.ethnicity) {
     console.log(`\\n🌎 Filling Ethnicity: "${profile.ethnicity}"`);
     const ethnicityButton = findElement(WORKDAY_STEP4_SELECTORS.ETHNICITY) as HTMLButtonElement;
     
     if (ethnicityButton) {
       fieldsAttempted++;
       const success = await fillVoluntaryDisclosureDropdown(ethnicityButton, profile.ethnicity, 'Ethnicity');
       if (success) fieldsSuccessful++;
     } else {
       console.log("❌ Ethnicity dropdown not found");
     }
   } else {
     console.log("ℹ️ No ethnicity data in profile, skipping");
   }
   
   // Military Veteran Status
   if (profile.military_veteran !== undefined && profile.military_veteran !== null) {
     console.log(`\\n🎖️ Filling Military Veteran Status: "${profile.military_veteran}"`);
     const veteranButton = findElement(WORKDAY_STEP4_SELECTORS.VETERAN_STATUS) as HTMLButtonElement;
     
     if (veteranButton) {
       fieldsAttempted++;
       // Convert database value to Yes/No format
       const veteranAnswer = (profile.military_veteran === 'yes' || profile.military_veteran === true || profile.military_veteran === 'Yes') ? 'Yes' : 'No';
       const success = await fillVoluntaryDisclosureDropdown(veteranButton, veteranAnswer, 'Military Veteran');
       if (success) fieldsSuccessful++;
     } else {
       console.log("❌ Military veteran dropdown not found");
     }
   } else {
     console.log("ℹ️ No military veteran data in profile, skipping");
   }
  
  // NOTE: Intentionally skipping Terms & Conditions checkbox as requested
  console.log("ℹ️ Skipping Terms & Conditions checkbox as requested");
  
  console.log(`\\n✅ Step 4 completed: ${fieldsSuccessful}/${fieldsAttempted} voluntary disclosure fields filled successfully`);
}

// Helper function to fill voluntary disclosure dropdowns
async function fillVoluntaryDisclosureDropdown(button: HTMLButtonElement, value: string, fieldName: string): Promise<boolean> {
  try {
    console.log(`🔄 Attempting to fill ${fieldName} with value: "${value}"`);
    
    // Check current state
    const currentValue = button.textContent?.trim() || '';
    const isAlreadyFilled = currentValue && currentValue !== 'Select One';
    
    if (isAlreadyFilled) {
      console.log(`🔄 ${fieldName} already has value: "${currentValue}" - but refilling as requested`);
    }
    
    // Click to open dropdown
    button.click();
    await new Promise(resolve => setTimeout(resolve, 600)); // Extra time for dropdown to load
    
    // Look for matching option with flexible matching
    const success = await selectVoluntaryDisclosureOption(value, fieldName);
    
    if (success) {
      console.log(`✅ Successfully ${isAlreadyFilled ? 'refilled' : 'filled'} ${fieldName}`);
      return true;
    } else {
      console.log(`❌ Failed to select ${fieldName} option`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Error filling ${fieldName}:`, error);
    return false;
  }
}

// Helper function to select voluntary disclosure options with smart matching
async function selectVoluntaryDisclosureOption(targetValue: string, fieldName: string): Promise<boolean> {
  // Wait for dropdown to fully load
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Look for options in various possible containers
  const optionSelectors = [
    '[role="option"]',
    '[role="listbox"] li', 
    '.wd-popup li',
    '[data-automation-id*="option"]',
    '[data-automation-id*="menuItem"]',
    'li[role="menuitem"]',
    'div[role="menuitem"]'
  ];
  
  const options = document.querySelectorAll(optionSelectors.join(', '));
  console.log(`🔍 Found ${options.length} dropdown options for ${fieldName}`);
  
  if (options.length === 0) {
    console.log(`❌ No dropdown options found for ${fieldName}`);
    return false;
  }
  
  // Smart matching logic for different field types
  for (const option of options) {
    const optionText = option.textContent?.trim() || '';
    
    if (matchesVoluntaryDisclosureValue(optionText, targetValue, fieldName)) {
      console.log(`🎯 Found matching option for ${fieldName}: "${optionText}"`);
      (option as HTMLElement).click();
      await new Promise(resolve => setTimeout(resolve, 200));
      return true;
    }
  }
  
  console.log(`❌ No matching option found for ${fieldName} value: "${targetValue}"`);
  console.log(`Available ${fieldName} options:`, Array.from(options).map(o => `"${o.textContent?.trim()}"`));
  
  return false;
}

// Smart matching for voluntary disclosure values
function matchesVoluntaryDisclosureValue(optionText: string, targetValue: string, fieldName: string): boolean {
  const option = optionText.toLowerCase().trim();
  const target = targetValue.toLowerCase().trim();
  
  console.log(`🔍 Matching: "${target}" against option: "${option}" for ${fieldName}`);
  
  // Exact match first
  if (option === target) {
    console.log(`✅ Exact match found`);
    return true;
  }
  
  // Field-specific matching rules
  switch (fieldName.toLowerCase()) {
    case 'gender':
      // FIXED: Proper word-boundary matching for gender
      if (target === 'male' && (option === 'male' || option.startsWith('male ') || option.endsWith(' male'))) {
        console.log(`✅ Male gender match found`);
        return true;
      }
      if (target === 'female' && (option === 'female' || option.startsWith('female ') || option.endsWith(' female'))) {
        console.log(`✅ Female gender match found`);
        return true;
      }
      if ((target.includes('other') || target.includes('non-binary')) && (option.includes('other') || option.includes('non-binary'))) {
        console.log(`✅ Other/Non-binary gender match found`);
        return true;
      }
      if ((target.includes('prefer not') || target.includes('decline')) && (option.includes('prefer not') || option.includes('decline'))) {
        console.log(`✅ Prefer not to answer gender match found`);
        return true;
      }
      break;
      
    case 'ethnicity':
      // Common ethnicity mappings
      if (target.includes('hispanic') && option.includes('hispanic')) return true;
      if (target.includes('latino') && option.includes('latino')) return true;
      if (target.includes('white') && option.includes('white')) return true;
      if (target.includes('black') && option.includes('black')) return true;
      if (target.includes('african') && option.includes('african')) return true;
      if (target.includes('asian') && option.includes('asian')) return true;
      if (target.includes('native') && option.includes('native')) return true;
      if (target.includes('pacific') && option.includes('pacific')) return true;
      if ((target.includes('prefer not') || target.includes('decline')) && (option.includes('prefer not') || option.includes('decline'))) return true;
      break;
      
    case 'military veteran':
      // Specific veteran status matching for Workday options
      if (target === 'yes') {
        // For YES - match protected veteran or general veteran identification
        if (option.includes('protected veteran') || option.includes('yes')) {
          console.log(`✅ Veteran status YES match found`);
          return true;
        }
      }
      if (target === 'no') {
        // For NO - ONLY match "I am not a veteran" (exact phrase match)
        if (option.includes('i am not a veteran') || option === 'not a veteran') {
          console.log(`✅ Veteran status NO match found`);
          return true;
        }
        // Explicitly REJECT the "veteran, just not protected" option for NO answers
        if (option.includes('veteran, just not') || option.includes('just not a protected')) {
          console.log(`❌ Rejecting "veteran but not protected" option for NO answer`);
          return false;
        }
      }
      break;
  }
  
  console.log(`❌ No match found for "${target}" against "${option}"`);
  return false;
}

// React-compatible input value setter for Workday date fields
function setReactInputValue(input: HTMLInputElement, value: string): void {
  if (!input) return;
  
  console.log(`🔄 Setting React input value: "${value}" on ${input.id}`);
  
  // Use native setter to properly sync with React state
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  if (nativeSetter) {
    nativeSetter.call(input, value);
  } else {
    input.value = value;
  }
  
  // Trigger both input and change events for React
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  
  console.log(`✅ React input value set and events fired: "${input.value}"`);
}

async function fillStep5SelfIdentification(profile: any): Promise<void> {
  console.log("\n🆔 === STARTING STEP 5: SELF IDENTIFICATION ===");
  
  let fieldsAttempted = 0;
  let fieldsSuccessful = 0;
  
  // Fill Name Field
  console.log("\n👤 Filling Name field...");
  const nameInput = findElement(WORKDAY_STEP5_SELECTORS.NAME) as HTMLInputElement;
  
  if (nameInput && profile.first_name) {
    fieldsAttempted++;
    const fullName = `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`.trim();
    console.log(`📝 Setting name: "${fullName}"`);
    
    try {
      // Focus, clear, and set value with blur
      nameInput.focus();
      setWorkdayInputValue(nameInput, fullName);
      nameInput.blur();
      fieldsSuccessful++;
      console.log("✅ Name field filled successfully");
      
      // Wait a bit for validation
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.log("❌ Error filling name field:", error);
    }
  } else if (!nameInput) {
    console.log("❌ Name input field not found");
  } else {
    console.log("ℹ️ No name data in profile, skipping");
  }
  
  // Fill Date Field with Today's Date
  console.log("\n📅 Filling Date field with today's date...");
  const monthInput = findElement(WORKDAY_STEP5_SELECTORS.DATE_MONTH) as HTMLInputElement;
  const dayInput = findElement(WORKDAY_STEP5_SELECTORS.DATE_DAY) as HTMLInputElement;
  const yearInput = findElement(WORKDAY_STEP5_SELECTORS.DATE_YEAR) as HTMLInputElement;
  
  if (monthInput && dayInput && yearInput) {
    fieldsAttempted++;
    
    try {
      // Get today's date
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const day = String(today.getDate()).padStart(2, '0');
      const year = String(today.getFullYear());
      
      console.log(`📅 Setting today's date: ${month}/${day}/${year}`);
      console.log(`📅 Debug - Month: ${month}, Day: ${day}, Year: ${year}`);
      
      // Use the same approach as work experience fillWorkdayDateInputs
      await fillSelfIdentityDateInputs(monthInput, dayInput, yearInput, month, day, year);
      
      fieldsSuccessful++;
      console.log(`✅ Date field filled successfully: ${month}/${day}/${year}`);
      
    } catch (error) {
      console.log("❌ Error filling date field:", error);
    }
  } else {
    console.log("❌ Date input fields not found (month/day/year)");
  }
  
  // Check Language Dropdown (usually pre-filled, but log status)
  console.log("\n🌐 Checking Language dropdown...");
  const languageButton = findElement(WORKDAY_STEP5_SELECTORS.LANGUAGE_DROPDOWN) as HTMLButtonElement;
  
  if (languageButton) {
    const currentLanguage = languageButton.textContent?.trim() || '';
    console.log(`ℹ️ Language dropdown current value: "${currentLanguage}"`);
    
    if (currentLanguage && currentLanguage !== 'Select One') {
      console.log("✅ Language already selected, leaving as-is");
    } else {
      console.log("ℹ️ Language not selected, but we'll leave it for user to choose");
    }
  } else {
    console.log("❌ Language dropdown not found");
  }
  
  // Fill Disability Status (use profile preference or default to "No")
  console.log("\n♿ Filling Disability Status...");
  
  // Default to "No" if no preference specified
  let disabilityChoice = 'no'; // Default
  
  if (profile.disability_status) {
    disabilityChoice = profile.disability_status.toLowerCase();
  }
  
  console.log(`🔍 Disability status choice: "${disabilityChoice}"`);
  
  let targetCheckbox: HTMLElement | null = null;
  
  // Find the right checkbox based on user preference
  // First try direct approach by finding all checkboxes in the disability fieldset
  const allDisabilityCheckboxes = document.querySelectorAll('fieldset[data-automation-id="disabilityStatus-CheckboxGroup"] input[type="checkbox"]');
  console.log(`🔍 Found ${allDisabilityCheckboxes.length} disability checkboxes`);
  
  // Log all available options
  if (allDisabilityCheckboxes.length > 0) {
    console.log("🔍 Available disability options:");
    allDisabilityCheckboxes.forEach((checkbox, index) => {
      const label = document.querySelector(`label[for="${checkbox.id}"]`);
      const labelText = label?.textContent?.trim() || 'No label found';
      console.log(`  ${index + 1}. ${labelText}`);
    });
  }
  
  if (disabilityChoice === 'yes' || disabilityChoice === 'true' || disabilityChoice === 'have') {
    console.log("🎯 Looking for 'Yes' disability option (first checkbox)");
    targetCheckbox = allDisabilityCheckboxes[0] as HTMLElement; // Usually first option
  } else if (disabilityChoice === 'no answer' || disabilityChoice === 'prefer not' || disabilityChoice === 'decline') {
    console.log("🎯 Looking for 'Do not want to answer' option (third checkbox)");
    targetCheckbox = allDisabilityCheckboxes[2] as HTMLElement; // Usually third option
  } else {
    // Default to "No" - usually second checkbox
    console.log("🎯 Looking for 'No' disability option (second checkbox - default)");
    targetCheckbox = allDisabilityCheckboxes[1] as HTMLElement; // Usually second option
  }
  
  if (targetCheckbox) {
    fieldsAttempted++;
    console.log("✅ Found target disability checkbox");
    
    try {
      // Check if it's already checked
      const isChecked = (targetCheckbox as HTMLInputElement).checked;
      
      if (isChecked) {
        console.log("✅ Disability status already selected correctly");
        fieldsSuccessful++;
      } else {
        console.log("🔄 Clicking disability status checkbox...");
        
        // Focus and click the checkbox
        targetCheckbox.focus();
        await clickWorkdayCheckbox(targetCheckbox, true);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Verify it was checked
        const nowChecked = (targetCheckbox as HTMLInputElement).checked;
        if (nowChecked) {
          fieldsSuccessful++;
          console.log("✅ Disability status checkbox selected successfully");
        } else {
          console.log("❌ Disability status checkbox was not checked after click");
        }
      }
    } catch (error) {
      console.log("❌ Error clicking disability status checkbox:", error);
    }
  } else {
    console.log("❌ Could not find disability status checkbox - no checkboxes available");
  }
  
  console.log(`\n✅ Step 5 completed: ${fieldsSuccessful}/${fieldsAttempted} fields filled successfully`);
}
