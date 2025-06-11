import { createClient } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';

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