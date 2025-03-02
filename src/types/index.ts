export type MessageType = 
  | { type: 'START_AUTOMATION' }
  | { type: 'STOP_AUTOMATION' }
  | { type: 'GET_STATE' }
  | { type: 'SAVE_USER_DATA'; data: UserProfile }
  | { type: 'GET_USER_DATA' };

export type ResponseType = {
  success?: boolean;
  isRunning?: boolean;
  userData?: UserProfile;
};

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  resume: string; // Base64 encoded resume file
  coverLetter?: string;
  linkedin?: string;
  website?: string;
  additionalQuestions: {
    [key: string]: string; // Question -> Answer mapping
  };
  settings: {
    nextJobDelay: number; // Delay in milliseconds between jobs
  };
}

export type WorkExperience = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
};

export type Education = {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
};

export type Selectors = {
  EASY_APPLY_BUTTON: string;
  NEXT_BUTTON: string[];
  SUBMIT_BUTTON: string;
  REVIEW_BUTTON: string[];
  CLOSE_BUTTON: string;
  JOB_CARD: string;
  JOB_TITLE_LINK: string;
  JOBS_LIST: string;
  FIRST_NAME_INPUT: string;
  LAST_NAME_INPUT: string;
  EMAIL_INPUT: string;
  PHONE_INPUT: string;
  LOCATION_INPUT: string;
  RESUME_INPUT: string;
  LINKEDIN_INPUT: string;
  WEBSITE_INPUT: string;
  EXPERIENCE_YEARS: string;
  EDUCATION_LEVEL: string;
  YES_NO_RADIO: string;
  MULTIPLE_CHOICE: string;
  TEXT_INPUT: string;
  TEXT_AREA: string;
};

export const SELECTORS: Selectors = {
  EASY_APPLY_BUTTON: '.jobs-apply-button',
  NEXT_BUTTON: [
    '[data-easy-apply-next-button]',
    '[data-live-test-easy-apply-next-button]',
    'button[aria-label="Continue to next step"]',
    'button.artdeco-button.artdeco-button--2.artdeco-button--primary',
    '.artdeco-button--primary',
    'button[type="button"].artdeco-button--primary'
  ],
  SUBMIT_BUTTON: '[aria-label="Submit application"]',
  REVIEW_BUTTON: [
    '[aria-label="Review your application"]',
    '[aria-label="Review"]',
    'button.artdeco-button--primary',
    '.artdeco-button--primary'
  ],
  CLOSE_BUTTON: '[aria-label="Dismiss"]',
  JOB_CARD: '.job-card-container, .jobs-search-results__list-item',
  JOB_TITLE_LINK: '.job-card-container__link',
  JOBS_LIST: '.jobs-search-results-list',
  // Form field selectors
  FIRST_NAME_INPUT: 'input[name*="first" i]',
  LAST_NAME_INPUT: 'input[name*="last" i]',
  EMAIL_INPUT: 'input[type="email"]',
  PHONE_INPUT: 'input[name*="phone" i]',
  LOCATION_INPUT: 'input[name*="location" i], input[name*="city" i]',
  RESUME_INPUT: 'input[type="file"]',
  LINKEDIN_INPUT: 'input[name*="linkedin" i]',
  WEBSITE_INPUT: 'input[name*="website" i], input[name*="portfolio" i]',
  EXPERIENCE_YEARS: 'select[name*="experience" i], select[name*="years" i]',
  EDUCATION_LEVEL: 'select[name*="education" i], select[name*="degree" i]',
  // Common question selectors
  YES_NO_RADIO: 'input[type="radio"]',
  MULTIPLE_CHOICE: 'select',
  TEXT_INPUT: 'input[type="text"]',
  TEXT_AREA: 'textarea'
}; 