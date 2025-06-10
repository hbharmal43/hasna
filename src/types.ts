export type MessageType = {
  type: 'START_AUTOMATION' | 'STOP_AUTOMATION' | 'GET_STATE' | 'AUTH_STATE_CHANGED' | 'SAVE_USER_DATA' | 'AUTOFILL_CURRENT_PAGE';
  data?: UserProfile;
  settings?: {
    nextJobDelay: number;
  };
};

export interface ResponseType {
  isRunning?: boolean;
  error?: string;
  success?: boolean;
  userData?: UserProfile;
}

export interface UserProfile {
  id?: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  title: string;
  email?: string;
  phone: string;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  bio: string;
  education: Array<{
    degree: string;
    school: string;
    date: string;
    description?: string;
  }>;
  education_level?: string;
  experience: Array<{
    id?: string;
    title: string;
    company: string;
    location: string;
    date: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    date: string;
    description: string;
  }>;
  skills: string[];
  languages: string[];
  socials: Record<string, string>;
  linkedin_url?: string;
  website_url?: string;
  resume_url?: string;
  resume?: string; // Base64 encoded resume data
  avatar_url?: string;
  cover_letter?: string;
  daily_goal: number;
  settings?: {
    nextJobDelay: number;
  };
  custom_answers?: Record<string, string>;
}

export interface JobApplication {
  job_id: string;
  title: string;
  company: string;
  location?: string;
  work_type?: 'onsite' | 'remote' | 'hybrid';
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  apply_time?: number;
  company_url?: string;
  job_description?: string;
  notes?: string;
  linkedin_job_id?: string;
}

export type TrackJobApplicationFn = (jobId: string, title: string, company: string, additionalData?: {
  location?: string;
  work_type?: 'onsite' | 'remote' | 'hybrid';
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  apply_time?: number;
  company_url?: string;
  job_description?: string;
  notes?: string;
  linkedin_job_id?: string;
}) => Promise<boolean>;

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
  NEXT_PAGE_BUTTON: string;
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
  JOB_CARD: 'li.jobs-search-results__list-item, li.scaffold-layout__list-item, li.job-card-container, li.job-card-job-posting-card-wrapper, li[class*="job-card"], li[class*="job-posting"]',
  JOB_TITLE_LINK: '.job-card-container__link, a[data-control-name="job_card_title"], a[class*="job-card"][class*="title"]',
  JOBS_LIST: '.jobs-search-results-list, .jobs-search-results__list, div.GDWMPYlbLvJwwJkvOFRdwOcJxcoOxMsCHeyMgIQ, div[class*="GDWMP"], .jobs-search-two-pane__results',
  NEXT_PAGE_BUTTON: 'button[aria-label="Next"]',
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