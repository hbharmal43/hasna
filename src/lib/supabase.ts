import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tedelpcjgknjnlhezsdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZGVscGNqZ2tuam5saGV6c2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MTU4ODUsImV4cCI6MjA1NjQ5MTg4NX0.TUfoy4jG2t9YzniUbd-GnHGHYW6k4NY4yeUiBzyCYqw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;

  // Store the session in chrome.storage.local
  if (data.session) {
    await chrome.storage.local.set({
      'supabase_session': data.session
    });
    console.log('Session stored in chrome.storage.local');

    // Set up session refresh
    if (data.session.expires_at) {
      const timeUntilExpiry = new Date(data.session.expires_at).getTime() - Date.now();
      if (timeUntilExpiry > 0) {
        setTimeout(async () => {
          await refreshSession();
        }, timeUntilExpiry - 5 * 60 * 1000);
      }
    }

    // Notify all tabs about the authentication state change
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, { type: 'AUTH_STATE_CHANGED' });
          console.log('Sent auth state change notification to tab:', tab.id);
        } catch (err) {
          console.log('Could not send message to tab:', tab.id, err);
        }
      }
    }
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;

  // Clear the stored session
  await chrome.storage.local.remove('supabase_session');
  
  // Notify all tabs about the authentication state change
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, { type: 'AUTH_STATE_CHANGED' });
        console.log('Sent auth state change notification to tab:', tab.id);
      } catch (err) {
        console.log('Could not send message to tab:', tab.id, err);
      }
    }
  }
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Add this new function to check for existing applications
export const checkExistingApplication = async (position: string, company: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.error('No user found when checking existing application');
      return null;
    }

    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('position', position)
      .eq('company', company)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
      console.error('Error checking existing application:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception checking existing application:', error);
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
}) => {
  const maxRetries = 3;
  let retryCount = 0;
  let lastError = null;

  // First check for existing application
  const existingApplication = await checkExistingApplication(position, company);
  if (existingApplication) {
    console.log('Application already exists in database:', { position, company });
    return existingApplication;
  }

  while (retryCount < maxRetries) {
    try {
      console.log(`Attempt ${retryCount + 1}/${maxRetries} to track job application:`, { position, company });
      
      const user = await getCurrentUser();
      if (!user) {
        console.error('No user found when trying to track application - Please check if you are logged in');
        return null;
      }

      const session = await getSession();
      if (!session) {
        console.error('No active session found - Please check if you are logged in');
        return null;
      }

      // Double-check for duplicates right before insertion
      const duplicateCheck = await checkExistingApplication(position, company);
      if (duplicateCheck) {
        console.log('Application was added by another process:', { position, company });
        return duplicateCheck;
      }

      // Convert apply_time to Unix timestamp (seconds)
      const currentTime = Math.floor(Date.now() / 1000);
      const applyTime = additionalData?.apply_time || currentTime;

      console.log('Attempting to insert application into database with user_id:', user.id);
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            user_id: user.id,
            position,
            company,
            location: additionalData?.location,
            work_type: additionalData?.work_type || 'onsite',
            salary_min: additionalData?.salary_min,
            salary_max: additionalData?.salary_max,
            salary_currency: additionalData?.salary_currency || 'USD',
            apply_time: applyTime,
            source: 'linkedin',
            status: 'applied',
            company_url: additionalData?.company_url,
            job_description: additionalData?.job_description,
            notes: additionalData?.notes,
            application_type: 'easy_apply'
          }
        ])
        .select();

      if (error) {
        lastError = error;
        console.error(`Database error on attempt ${retryCount + 1}:`, error.message);
        console.error('Error details:', {
          code: error.code,
          details: error.details,
          hint: error.hint,
          message: error.message
        });
        
        // If it's a unique constraint violation, the application already exists
        if (error.code === '23505') {
          console.log('Application already exists (caught by constraint):', { position, company });
          const existing = await checkExistingApplication(position, company);
          return existing;
        }
        
        // If it's a network error or temporary issue, retry
        if (error.code === '503' || error.code === '504' || error.code.startsWith('40')) {
          retryCount++;
          if (retryCount < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        return null;
      }

      console.log('Successfully tracked job application in database:', data);
      return data;

    } catch (error) {
      lastError = error;
      console.error(`Exception on attempt ${retryCount + 1}:`, error);
      
      retryCount++;
      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  console.error(`Failed to track job application after ${maxRetries} attempts. Last error:`, lastError);
  return null;
};

// Add a new function to refresh the session
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing session:', error);
      return false;
    }

    if (session) {
      await chrome.storage.local.set({
        'supabase_session': session
      });
      console.log('Session refreshed and stored');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error in refreshSession:', error);
    return false;
  }
};

// Update initSupabaseClient to handle session refresh
export const initSupabaseClient = async () => {
  try {
    const { supabase_session } = await chrome.storage.local.get('supabase_session');
    if (supabase_session) {
      // First try to set the existing session
      const { error: setError } = await supabase.auth.setSession({
        access_token: supabase_session.access_token,
        refresh_token: supabase_session.refresh_token
      });
      
      if (!setError) {
        console.log('Successfully restored Supabase session');
        
        // Set up automatic session refresh
        const expiresAt = supabase_session.expires_at;
        if (expiresAt) {
          const timeUntilExpiry = new Date(expiresAt).getTime() - Date.now();
          if (timeUntilExpiry > 0) {
            // Refresh 5 minutes before expiry
            setTimeout(async () => {
              await refreshSession();
            }, timeUntilExpiry - 5 * 60 * 1000);
          } else {
            // Session is expired, try to refresh immediately
            const refreshed = await refreshSession();
            if (!refreshed) {
              console.log('Could not refresh expired session');
              return false;
            }
          }
        }
        
        return true;
      }
      
      // If setting session failed, try to refresh it
      console.log('Session restore failed, attempting refresh...');
      const refreshed = await refreshSession();
      if (refreshed) {
        console.log('Successfully refreshed session');
        return true;
      }
    }
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
  }
  return false;
};

export const getUserProfile = async () => {
  try {
    console.log('🔍 [Profile] Getting current user...');
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('❌ [Profile] No authenticated user found');
      return null;
    }

    console.log('✅ [Profile] User found:', user.id);
    console.log('🔍 [Profile] Fetching profile data...');
    
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
      console.error('❌ [Profile] Database error:', error.message);
      return null;
    }

    if (!data) {
      console.log('⚠️ [Profile] No profile data found for user');
      // Create a new profile for the user
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
        console.error('❌ [Profile] Error creating profile:', insertError.message);
        return null;
      }

      console.log('✅ [Profile] Created new profile for user');
      return newProfile;
    }

    console.log('✅ [Profile] Data retrieved:', {
      full_name: data.full_name,
      title: data.title,
      skills: data.skills?.length || 0,
      experience: data.experience?.length || 0
    });
    
    return data;
  } catch (error) {
    console.error('❌ [Profile] Error:', error);
    return null;
  }
}; 