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

export const trackJobApplication = async (position: string, company: string) => {
  try {
    console.log('Starting to track job application:', { position, company });
    
    const user = await getCurrentUser();
    console.log('Current user:', user);
    
    if (!user) {
      console.error('No user found when trying to track application - Please check if you are logged in');
      return null;
    }

    const session = await getSession();
    console.log('Current session:', session);

    if (!session) {
      console.error('No active session found - Please check if you are logged in');
      return null;
    }

    console.log('Attempting to insert application into database with user_id:', user.id);
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          user_id: user.id,
          position,
          company,
          source: 'linkedin',
          application_type: 'easy_apply',
          applied_date: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Database error when tracking application:', error.message);
      console.error('Error details:', {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message
      });
      return null;
    }

    console.log('Successfully tracked job application in database:', data);
    return data;
  } catch (error) {
    console.error('Exception while tracking job application:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
};

// Add a new function to initialize the client with stored session
export const initSupabaseClient = async () => {
  try {
    const { supabase_session } = await chrome.storage.local.get('supabase_session');
    if (supabase_session) {
      const { error } = await supabase.auth.setSession({
        access_token: supabase_session.access_token,
        refresh_token: supabase_session.refresh_token
      });
      
      if (error) {
        console.error('Error setting session:', error);
        return false;
      }
      
      console.log('Successfully restored Supabase session');
      return true;
    }
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
  }
  return false;
}; 