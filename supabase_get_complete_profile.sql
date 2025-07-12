-- RPC function to get complete profile data with all normalized tables
-- This replaces any existing get_complete_profile function and removes references to e.minor

CREATE OR REPLACE FUNCTION get_complete_profile(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    profile_data JSON;
    work_experiences_data JSON;
    education_data JSON;
    skills_data JSON;
    languages_data JSON;
    certifications_data JSON;
    portfolio_links_data JSON;
BEGIN
    -- Get profile data
    SELECT row_to_json(p) INTO profile_data
    FROM (
        SELECT 
            id,
            email,
            first_name,
            last_name,
            full_name,
            title,
            phone,
            phone_device_type,
            country_phone_code,
            phone_extension,
            bio,
            address_line_1,
            address_line_2,
            city,
            state,
            postal_code,
            country,
            county,
            work_authorization_status,
            visa_sponsorship_required,
            work_authorization_us,
            work_authorization_canada,
            work_authorization_uk,
            how_did_you_hear_about_us,
            previously_worked_for_workday,
            salary_expectation,
            available_start_date,
            willing_to_relocate,
            years_of_experience,
            highest_education_level,
            gender,
            ethnicity,
            military_veteran,
            disability_status,
            lgbtq_status,
            resume_url,
            resume_filename,
            cover_letter_url,
            cover_letter_filename,
            linkedin_url,
            github_url,
            personal_website,
            references_available,
            background_check_consent,
            drug_test_consent,
            avatar_url,
            daily_goal,
            profile_completion_percentage,
            job_search_status,
            birthday,
            created_at,
            updated_at
        FROM profiles 
        WHERE id = user_id
    ) p;
    
    -- Get work experiences
    SELECT COALESCE(json_agg(row_to_json(w)), '[]'::json) INTO work_experiences_data
    FROM (
        SELECT 
            id,
            profile_id,
            position_title,
            company_name,
            company_logo_url,
            location,
            start_month,
            start_year,
            end_month,
            end_year,
            is_current,
            description,
            created_at,
            updated_at
        FROM work_experiences 
        WHERE profile_id = user_id
        ORDER BY start_year DESC, start_month DESC
    ) w;
    
    -- Get education (WITHOUT minor field)
    SELECT COALESCE(json_agg(row_to_json(e)), '[]'::json) INTO education_data
    FROM (
        SELECT 
            id,
            profile_id,
            institution_name,
            institution_logo_url,
            degree_type,
            major,
            -- NOTE: minor field removed from database schema
            gpa,
            start_year,
            end_year,
            is_current,
            description,
            created_at,
            updated_at
        FROM education 
        WHERE profile_id = user_id
        ORDER BY start_year DESC
    ) e;
    
    -- Get skills
    SELECT COALESCE(json_agg(row_to_json(s)), '[]'::json) INTO skills_data
    FROM (
        SELECT 
            id,
            profile_id,
            skill_name,
            proficiency_level,
            years_of_experience,
            created_at,
            updated_at
        FROM profile_skills 
        WHERE profile_id = user_id
        ORDER BY skill_name
    ) s;
    
    -- Get languages
    SELECT COALESCE(json_agg(row_to_json(l)), '[]'::json) INTO languages_data
    FROM (
        SELECT 
            id,
            profile_id,
            language_name,
            proficiency_level,
            created_at,
            updated_at
        FROM profile_languages 
        WHERE profile_id = user_id
        ORDER BY language_name
    ) l;
    
    -- Get certifications
    SELECT COALESCE(json_agg(row_to_json(c)), '[]'::json) INTO certifications_data
    FROM (
        SELECT 
            id,
            profile_id,
            certification_name,
            issuing_organization,
            issue_date,
            expiration_date,
            credential_id,
            credential_url,
            created_at,
            updated_at
        FROM certifications 
        WHERE profile_id = user_id
        ORDER BY issue_date DESC
    ) c;
    
    -- Get portfolio links
    SELECT COALESCE(json_agg(row_to_json(pl)), '[]'::json) INTO portfolio_links_data
    FROM (
        SELECT 
            id,
            profile_id,
            platform,
            url,
            created_at,
            updated_at
        FROM portfolio_links 
        WHERE profile_id = user_id
        ORDER BY platform
    ) pl;
    
    -- Build the complete result
    result := json_build_object(
        'profile', profile_data,
        'work_experiences', work_experiences_data,
        'education', education_data,
        'skills', skills_data,
        'languages', languages_data,
        'certifications', certifications_data,
        'portfolio_links', portfolio_links_data
    );
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_complete_profile(UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_complete_profile(UUID) IS 'Returns complete profile data with all normalized tables. Updated to remove minor field reference.'; 