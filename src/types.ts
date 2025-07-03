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

// Normalized table interfaces matching database schema
export interface WorkExperienceRecord {
  id?: string;
  profile_id?: string;
  company_name: string;
  company_logo_url?: string;
  position_title: string;
  location?: string;
  experience_type?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  start_month?: string;
  start_year?: number;
  end_month?: string;
  end_year?: number;
  is_current?: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EducationRecord {
  id?: string;
  profile_id?: string;
  institution_name: string;
  institution_logo_url?: string;
  degree_type?: string;
  major?: string;
  minor?: string;
  gpa?: number;
  start_year?: number;
  end_year?: number;
  is_current?: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileSkill {
  id?: string;
  profile_id?: string;
  skill_name: string;
  proficiency_level?: number; // 1-5 scale
  is_preferred?: boolean;
  category?: string;
  created_at?: string;
}

export interface ProfileLanguage {
  id?: string;
  profile_id?: string;
  language_name: string;
  created_at?: string;
}

export interface Certification {
  id?: string;
  profile_id?: string;
  certification_name: string;
  issuing_organization?: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioLink {
  id?: string;
  profile_id?: string;
  platform: string;
  url: string;
  display_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JobPreference {
  id?: string;
  profile_id?: string;
  values_in_role?: string[];
  interested_roles?: string[];
  role_specializations?: string[];
  preferred_locations?: string[];
  role_level?: 'internship' | 'entry_level_new_grad' | 'mid_level' | 'senior_level' | 'staff_level' | 'principal_level';
  company_size?: '1_10' | '11_50' | '51_200' | '201_500' | '501_1000' | '1001_5000' | '5001_10000' | '10000_plus';
  exciting_industries?: string[];
  avoid_industries?: string[];
  preferred_skills?: string[];
  avoid_skills?: string[];
  minimum_salary?: number;
  salary_currency?: string;
  security_clearance_required?: boolean;
  job_search_status?: 'actively_looking' | 'open_to_opportunities' | 'not_looking';
  created_at?: string;
  updated_at?: string;
}

// Complete profile data structure (matches get_complete_profile RPC function)
export interface CompleteProfile {
  profile: {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    title?: string;
    phone?: string;
    phone_device_type?: string;
    country_phone_code?: string;
    phone_extension?: string;
    bio?: string;
    
    // Address Information
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    county?: string;
    
    // Work Authorization
    work_authorization_status?: string;
    visa_sponsorship_required?: string;
    work_authorization_us?: boolean;
    work_authorization_canada?: boolean;
    work_authorization_uk?: boolean;
    
    // Application Preferences
    how_did_you_hear_about_us?: string;
    previously_worked_for_workday?: boolean;
    salary_expectation?: string;
    available_start_date?: string;
    willing_to_relocate?: boolean;
    years_of_experience?: number;
    highest_education_level?: string;
    
    // Voluntary Disclosures
    gender?: string;
    ethnicity?: string;
    military_veteran?: string;
    disability_status?: string;
    lgbtq_status?: string;
    
    // Documents & Links
    resume_url?: string;
    resume_filename?: string;
    cover_letter_url?: string;
    cover_letter_filename?: string;
    linkedin_url?: string;
    github_url?: string;
    personal_website?: string;
    
    // Consent Fields
    references_available?: boolean;
    background_check_consent?: boolean;
    drug_test_consent?: boolean;
    
    // Other fields
    avatar_url?: string;
    daily_goal?: number;
    profile_completion_percentage?: number;
    job_search_status?: string;
    birthday?: string;
    created_at?: string;
    updated_at?: string;
  };
  work_experiences: WorkExperienceRecord[];
  education: EducationRecord[];
  skills: ProfileSkill[];
  languages: ProfileLanguage[];
  certifications: Certification[];
  portfolio_links: PortfolioLink[];
}

// Extended UserProfile interface (keeps existing fields for LinkedIn compatibility + adds new fields)
export interface UserProfile {
  // Existing fields (for LinkedIn compatibility)
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

  // New fields from database schema
  // Personal Information
  phone_device_type?: string;
  country_phone_code?: string;
  phone_extension?: string;
  
  // Address Information (extended)
  address_line_1?: string;
  address_line_2?: string;
  postal_code?: string;
  county?: string;
  
  // Work Authorization
  work_authorization_status?: string;
  visa_sponsorship_required?: string;
  work_authorization_us?: boolean;
  work_authorization_canada?: boolean;
  work_authorization_uk?: boolean;
  
  // Application Preferences
  how_did_you_hear_about_us?: string;
  previously_worked_for_workday?: boolean;
  salary_expectation?: string;
  available_start_date?: string;
  willing_to_relocate?: boolean;
  years_of_experience?: number;
  highest_education_level?: string;
  
  // Voluntary Disclosures
  gender?: string;
  ethnicity?: string;
  military_veteran?: string;
  disability_status?: string;
  lgbtq_status?: string;
  
  // Documents & Links (extended)
  resume_filename?: string;
  cover_letter_url?: string;
  cover_letter_filename?: string;
  github_url?: string;
  personal_website?: string;
  portfolio_urls?: string[];
  
  // Consent Fields
  references_available?: boolean;
  background_check_consent?: boolean;
  drug_test_consent?: boolean;
  
  // Other fields
  birthday?: string;
  profile_completion_percentage?: number;
  job_search_status?: string;
  
  // Normalized data arrays (from separate tables)
  work_experiences?: WorkExperienceRecord[];
  education_records?: EducationRecord[];
  profile_skills?: ProfileSkill[];
  profile_languages?: ProfileLanguage[];
  certifications?: Certification[];
  portfolio_links?: PortfolioLink[];
  job_preferences?: JobPreference;
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