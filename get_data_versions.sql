-- RPC function to get the latest updated_at timestamps for all autofill-related tables
-- This is used for version checking to determine if local cache is stale

CREATE OR REPLACE FUNCTION get_data_versions(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    profile_updated_at TIMESTAMPTZ;
    education_updated_at TIMESTAMPTZ;
    work_exp_updated_at TIMESTAMPTZ;
    skills_updated_at TIMESTAMPTZ;
    languages_updated_at TIMESTAMPTZ;
    portfolio_updated_at TIMESTAMPTZ;
BEGIN
    -- Get the most recent updated_at for each table
    
    -- Profile (single record)
    SELECT updated_at INTO profile_updated_at
    FROM profiles 
    WHERE id = user_id;
    
    -- Education (get the most recent)
    SELECT MAX(updated_at) INTO education_updated_at
    FROM education 
    WHERE profile_id = user_id;
    
    -- Work experiences (get the most recent)
    SELECT MAX(updated_at) INTO work_exp_updated_at
    FROM work_experiences 
    WHERE profile_id = user_id;
    
    -- Skills (get the most recent)
    SELECT MAX(updated_at) INTO skills_updated_at
    FROM profile_skills 
    WHERE profile_id = user_id;
    
    -- Languages (get the most recent)
    SELECT MAX(updated_at) INTO languages_updated_at
    FROM profile_languages 
    WHERE profile_id = user_id;
    
    -- Portfolio links (get the most recent)
    SELECT MAX(updated_at) INTO portfolio_updated_at
    FROM portfolio_links 
    WHERE profile_id = user_id;
    
    -- Build the result JSON
    result := json_build_object(
        'profiles', profile_updated_at,
        'education', education_updated_at,
        'work_experiences', work_exp_updated_at,
        'profile_skills', skills_updated_at,
        'profile_languages', languages_updated_at,
        'portfolio_links', portfolio_updated_at
    );
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_data_versions(UUID) TO authenticated; 