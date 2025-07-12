import { createClient } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';
import { CompleteProfile, UserProfile } from '../types';

const supabaseUrl = 'https://tedelpcjgknjnlhezsdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZGVscGNqZ2tuam5saGV6c2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MTU4ODUsImV4cCI6MjA1NjQ5MTg4NX0.TUfoy4jG2t9YzniUbd-GnHGHYW6k4NY4yeUiBzyCYqw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }

  // Store the session in chrome.storage.local
  if (data.session) {
    // Set session expiration to one year from now
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const extendedSession = {
      ...data.session,
      expires_at: oneYearFromNow.getTime()
    };
    
    await chrome.storage.local.set({
      'supabase_session': extendedSession
    });

    // Notify all tabs about the authentication state change
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, { type: 'AUTH_STATE_CHANGED' });
        } catch (err) {
          // Ignore errors for tabs that can't receive messages
        }
      }
    }
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }

  await chrome.storage.local.remove('supabase_session');
  
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, { type: 'AUTH_STATE_CHANGED' });
      } catch (err) {
        // Ignore errors for tabs that can't receive messages
      }
    }
  }
};

// Add this function to ensure session is properly restored
export const ensureAuthenticated = async () => {
  try {
    const { supabase_session } = await chrome.storage.local.get('supabase_session');
    
    if (!supabase_session) {
      return false;
    }

    // Simply set the session without checking expiration
    await supabase.auth.setSession({
      access_token: supabase_session.access_token,
      refresh_token: supabase_session.refresh_token
    });

    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    return false;
  }
};

export const getSession = async () => {
  try {
    // Assume authentication is valid without continuously checking
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    // Get user directly without checking authentication first
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    return null;
  }
};

// Update the trackJobApplication function
export const trackJobApplication = async (position: string, company: string, additionalData?: {
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
}) => {
  try {
    console.log('🔍 [DEBUG] trackJobApplication called with:', { position, company, linkedin_job_id: additionalData?.linkedin_job_id });
    
    const session = await getSession();
    console.log('🔍 [DEBUG] Session check result:', !!session);
    
    if (!session) {
      console.log('❌ No session found, cannot track job application. Attempting to re-authenticate...');
      const authResult = await ensureAuthenticated();
      console.log('🔍 [DEBUG] ensureAuthenticated result:', authResult);
      
      if (!authResult) {
        console.log('❌ Re-authentication failed');
        return false;
      }
      
      // Get the session again after re-authentication
      const newSession = await getSession();
      console.log('🔍 [DEBUG] New session after re-auth:', !!newSession);
      
      if (!newSession) {
        console.log('❌ Still no session after re-authentication');
        return false;
      }
      console.log('✅ Re-authentication successful');
    }

    const user = await getCurrentUser();
    console.log('🔍 [DEBUG] getCurrentUser result:', !!user, user?.id);
    
    if (!user) {
      console.log('❌ No user found, cannot track job application');
      return false;
    }

    console.log('✅ User authenticated: ', user.id);

    // Sanitize inputs to prevent issues
    const sanitizedPosition = position?.substring(0, 255) || 'Unknown Position';
    const sanitizedCompany = company?.substring(0, 255) || 'Unknown Company';
    const sanitizedLocation = additionalData?.location?.substring(0, 255) || null;
    // Trim job description length to avoid huge texts
    const sanitizedDescription = additionalData?.job_description?.substring(0, 2000) || null;
    
    // Generate a unique ID for this application if LinkedIn ID is not available
    const uniqueId = additionalData?.linkedin_job_id || 
                     `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

    // Build complete application data matching the database schema
    const applicationData = {
      user_id: user.id,
      position: sanitizedPosition,
      company: sanitizedCompany,
      location: sanitizedLocation,
      work_type: additionalData?.work_type || 'onsite',
      salary_min: additionalData?.salary_min || null,
      salary_max: additionalData?.salary_max || null,
      salary_currency: additionalData?.salary_currency || 'USD',
      apply_time: Math.floor(Date.now() / 1000),
      source: 'linkedin',
      status: 'applied',
      company_url: additionalData?.company_url || null,
      job_description: sanitizedDescription,
      notes: additionalData?.notes || null,
      linkedin_job_id: uniqueId,
      application_type: 'easy_apply'
    };

    console.log('🔄 [DB] Inserting application data:', {
      position: sanitizedPosition,
      company: sanitizedCompany, 
      linkedin_job_id: uniqueId,
      user_id: user.id
    });
    
    // First check if this job already exists in the database
    console.log('🔍 [DEBUG] Checking for existing application...');
    const { data: existingData, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('linkedin_job_id', uniqueId)
      .limit(1);
      
    console.log('🔍 [DEBUG] Existing check result:', { 
      hasError: !!checkError, 
      errorMessage: checkError?.message, 
      existingCount: existingData?.length || 0 
    });
      
    if (checkError) {
      console.log(`⚠️ Error checking for existing application: ${checkError.message}`);
      console.log('🔍 [DEBUG] Full check error:', checkError);
    } else if (existingData && existingData.length > 0) {
      console.log('✅ Job already exists in database, no need to insert again');
      return true;
    }
    
    // Use upsert directly to handle duplicates gracefully
    console.log('🔍 [DEBUG] Attempting database upsert...');
    const { error: upsertError } = await supabase
      .from('applications')
      .upsert([applicationData], {
        onConflict: 'user_id,linkedin_job_id',
        ignoreDuplicates: false
      });
    
    console.log('🔍 [DEBUG] Upsert result:', { 
      hasError: !!upsertError, 
      errorCode: upsertError?.code, 
      errorMessage: upsertError?.message 
    });
    
    if (upsertError) {
      console.error('❌ Failed to track job application:', upsertError.message, upsertError);
      console.log('🔍 [DEBUG] Full upsert error:', upsertError);
      return false;
    }
    
    console.log(`✅ Application upserted: ${sanitizedPosition} at ${sanitizedCompany}`);
    
    return true;
  } catch (error) {
    console.error('❌ Exception tracking job application:', error);
    return false;
  }
};

// Add a new function to refresh the session
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error || !session) {
      return false;
    }

    // Extend session expiration to one year from now
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const extendedSession = {
      ...session,
      expires_at: oneYearFromNow.getTime()
    };
    
    await chrome.storage.local.set({
      'supabase_session': extendedSession
    });
    
    return true;
  } catch (error) {
    return false;
  }
};

// Update initSupabaseClient to handle session refresh
export const initSupabaseClient = async () => {
  try {
    // Just return true without checking auth status - assume it's valid
    return true;
  } catch (error) {
    return false;
  }
};

export const getUserProfile = async () => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        title,
        location,
        phone,
        bio,
        education,
        experience,
        projects,
        skills,
        languages,
        socials,
        resume_url,
        avatar_url,
        daily_goal
      `)
      .eq('id', user.id)
      .single();

    if (error) {
      return null;
    }

    if (!data) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            full_name: '',
            title: '',
            education: [],
            experience: [],
            projects: [],
            skills: [],
            languages: [],
            socials: {},
            daily_goal: 10
          }
        ])
        .select()
        .single();

      if (insertError) {
        return null;
      }

      return newProfile;
    }
    
    return data;
  } catch (error) {
    return null;
  }
};

/**
 * Get complete profile data using the database RPC function
 * Returns profile with all normalized tables (work_experiences, education, skills, etc.)
 */
export const getCompleteProfile = async (): Promise<CompleteProfile | null> => {
  try {
    console.log('🔍 [DEBUG] getCompleteProfile called');
    
    const user = await getCurrentUser();
    
    if (!user) {
      console.log('❌ No user found, cannot get complete profile');
      return null;
    }
    
    console.log('✅ User authenticated:', user.id);
    
    // Call the database RPC function
    const { data, error } = await supabase
      .rpc('get_complete_profile', { user_id: user.id });
    
    if (error) {
      console.error('❌ Error calling get_complete_profile RPC:', error.message);
      console.log('🔍 [DEBUG] Full RPC error:', error);
      return null;
    }
    
    if (!data) {
      console.log('⚠️ No profile data returned from RPC');
      return null;
    }
    
    console.log('✅ Complete profile data retrieved successfully');
    console.log('🔍 [DEBUG] Profile data structure:', {
      hasProfile: !!data.profile,
      workExperiencesCount: data.work_experiences?.length || 0,
      educationCount: data.education?.length || 0,
      skillsCount: data.skills?.length || 0,
      languagesCount: data.languages?.length || 0,
      certificationsCount: data.certifications?.length || 0,
      portfolioLinksCount: data.portfolio_links?.length || 0
    });
    
    return data as CompleteProfile;
  } catch (error) {
    console.error('❌ Exception getting complete profile:', error);
    return null;
  }
};

/**
 * Transform CompleteProfile data into UserProfile format for autofill engine
 */
export const transformCompleteProfileToUserProfile = (completeProfile: CompleteProfile): UserProfile => {
  const profile = completeProfile.profile;
  
  // Transform work experiences to old format
  const experience = completeProfile.work_experiences?.map(work => ({
    id: work.id,
    title: work.position_title,
    company: work.company_name,
    location: work.location || '',
    date: work.is_current 
      ? `${work.start_month} ${work.start_year} - Present`
      : `${work.start_month} ${work.start_year} - ${work.end_month} ${work.end_year}`,
    description: work.description || ''
  })) || [];

  // Transform education to old format
  const education = completeProfile.education?.map(edu => ({
    degree: edu.degree_type || '',
    school: edu.institution_name,
    date: edu.is_current
      ? `${edu.start_year} - Present`
      : `${edu.start_year} - ${edu.end_year}`,
    description: edu.description || ''
  })) || [];

  // Transform skills to array of strings
  const skills = completeProfile.skills?.map(skill => skill.skill_name) || [];

  // Transform languages to array of strings
  const languages = completeProfile.languages?.map(lang => lang.language_name) || [];

  // Transform portfolio links to socials object
  const socials: Record<string, string> = {};
  completeProfile.portfolio_links?.forEach(link => {
    socials[link.platform] = link.url;
  });

  return {
    id: profile.id,
    full_name: profile.full_name || '',
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    title: profile.title || '',
    email: profile.email || '',
    phone: profile.phone || '',
    location: `${profile.city || ''}, ${profile.state || ''}`.replace(/^,\s*|,\s*$/g, '') || '',
    
    // Address fields
    address: profile.address_line_1 || '',
    address_line_1: profile.address_line_1,
    address_line_2: profile.address_line_2,
    city: profile.city || '',
    state: profile.state || '',
    zip_code: profile.postal_code || '',
    postal_code: profile.postal_code,
    country: profile.country || '',
    county: profile.county,
    
    // Contact details
    phone_device_type: profile.phone_device_type,
    country_phone_code: profile.country_phone_code,
    phone_extension: profile.phone_extension,
    
    bio: profile.bio || '',
    
    // Transform normalized data to old format
    education,
    experience,
    skills,
    languages,
    socials,
    
    // URLs and documents
    linkedin_url: profile.linkedin_url,
    website_url: profile.personal_website,
    resume_url: profile.resume_url,
    resume_filename: profile.resume_filename,
    cover_letter_url: profile.cover_letter_url,
    cover_letter_filename: profile.cover_letter_filename,
    github_url: profile.github_url,
    personal_website: profile.personal_website,
    avatar_url: profile.avatar_url,
    
    // Work authorization
    work_authorization_status: profile.work_authorization_status,
    visa_sponsorship_required: profile.visa_sponsorship_required,
    work_authorization_us: profile.work_authorization_us,
    work_authorization_canada: profile.work_authorization_canada,
    work_authorization_uk: profile.work_authorization_uk,
    
    // Application preferences
    how_did_you_hear_about_us: profile.how_did_you_hear_about_us,
    previously_worked_for_workday: profile.previously_worked_for_workday,
    salary_expectation: profile.salary_expectation,
    available_start_date: profile.available_start_date,
    willing_to_relocate: profile.willing_to_relocate,
    years_of_experience: profile.years_of_experience,
    highest_education_level: profile.highest_education_level,
    education_level: profile.highest_education_level,
    
    // Voluntary disclosures
    gender: profile.gender,
    ethnicity: profile.ethnicity,
    military_veteran: profile.military_veteran,
    disability_status: profile.disability_status,
    lgbtq_status: profile.lgbtq_status,
    
    // Consent fields
    references_available: profile.references_available,
    background_check_consent: profile.background_check_consent,
    drug_test_consent: profile.drug_test_consent,
    
    // Other fields
    birthday: profile.birthday,
    daily_goal: profile.daily_goal || 10,
    profile_completion_percentage: profile.profile_completion_percentage,
    job_search_status: profile.job_search_status,
    
    // Keep normalized data arrays for advanced usage
    work_experiences: completeProfile.work_experiences,
    education_records: completeProfile.education,
    profile_skills: completeProfile.skills,
    profile_languages: completeProfile.languages,
    certifications: completeProfile.certifications,
    portfolio_links: completeProfile.portfolio_links,
    
    // Default values
    projects: [],
    custom_answers: {},
    settings: {
      nextJobDelay: 5000
    }
  };
};

/**
 * Get the latest updated_at timestamps for all autofill-related tables
 * Used for version checking to determine if local cache is stale
 */
export const getDataVersions = async (): Promise<{
  profiles: string | null;
  education: string | null;
  work_experiences: string | null;
  profile_skills: string | null;
  profile_languages: string | null;
  portfolio_links: string | null;
} | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log('❌ No user found, cannot get data versions');
      return null;
    }

    // Get the most recent updated_at timestamp for each table
    const { data, error } = await supabase
      .rpc('get_data_versions', { user_id: user.id });

    if (error) {
      console.error('❌ Error getting data versions:', error.message);
      return null;
    }

    console.log('✅ Data versions retrieved:', data);
    return data;
  } catch (error) {
    console.error('❌ Exception getting data versions:', error);
    return null;
  }
};

/**
 * Check if local cache is stale by comparing timestamps
 * Returns true if fresh data should be fetched from Supabase
 */
export const shouldRefreshData = async (): Promise<boolean> => {
  try {
    // Get remote versions
    const remoteVersions = await getDataVersions();
    if (!remoteVersions) {
      console.log('⚠️ Could not get remote versions, assuming refresh needed');
      return true;
    }

    // Get cached versions from Chrome storage
    const result = await chrome.storage.local.get(['dataVersions']);
    const cachedVersions = result.dataVersions;

    if (!cachedVersions) {
      console.log('📝 No cached versions found, refresh needed');
      return true;
    }

    // Compare each table's timestamp
    const tables = ['profiles', 'education', 'work_experiences', 'profile_skills', 'profile_languages', 'portfolio_links'];
    
    for (const table of tables) {
      const remoteTime = remoteVersions[table as keyof typeof remoteVersions];
      const cachedTime = cachedVersions[table];
      
      if (!cachedTime || !remoteTime) {
        console.log(`📝 Missing timestamp for ${table}, refresh needed`);
        return true;
      }
      
      if (new Date(remoteTime) > new Date(cachedTime)) {
        console.log(`🔄 ${table} has newer data (remote: ${remoteTime}, cached: ${cachedTime}), refresh needed`);
        return true;
      }
    }

    console.log('✅ All data is up to date, no refresh needed');
    return false;
  } catch (error) {
    console.error('❌ Error checking data freshness:', error);
    return true; // Default to refresh on error
  }
};

/**
 * Save data versions to Chrome storage after successful data fetch
 */
export const saveDataVersions = async (versions: any): Promise<void> => {
  try {
    await chrome.storage.local.set({ dataVersions: versions });
    console.log('✅ Data versions saved to cache');
  } catch (error) {
    console.error('❌ Error saving data versions:', error);
  }
}; 