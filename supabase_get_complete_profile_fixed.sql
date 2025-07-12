-- Fixed get_complete_profile function - removes 'minor', e.minor from education section
CREATE OR REPLACE FUNCTION public.get_complete_profile(user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    -- Personal Information from profiles table
    'profile', json_build_object(
      'id', p.id,
      'email', p.email,
      'first_name', p.first_name,
      'last_name', p.last_name,
      'full_name', p.full_name,
      'title', p.title,
      'phone', p.phone,
      'phone_device_type', p.phone_device_type,
      'country_phone_code', p.country_phone_code,
      'phone_extension', p.phone_extension,
      'bio', p.bio,
      
      -- Address Information
      'address_line_1', p.address_line_1,
      'address_line_2', p.address_line_2,
      'city', p.city,
      'state', p.state,
      'postal_code', p.postal_code,
      'country', p.country,
      'county', p.county,
      
      -- Work Authorization
      'work_authorization_status', p.work_authorization_status,
      'visa_sponsorship_required', p.visa_sponsorship_required,
      'work_authorization_us', p.work_authorization_us,
      'work_authorization_canada', p.work_authorization_canada,
      'work_authorization_uk', p.work_authorization_uk,
      
      -- Application Preferences
      'how_did_you_hear_about_us', p.how_did_you_hear_about_us,
      'previously_worked_for_workday', p.previously_worked_for_workday,
      'salary_expectation', p.salary_expectation,
      'available_start_date', p.available_start_date,
      'willing_to_relocate', p.willing_to_relocate,
      'years_of_experience', p.years_of_experience,
      'highest_education_level', p.highest_education_level,
      
      -- Voluntary Disclosures
      'gender', p.gender,
      'ethnicity', p.ethnicity,
      'military_veteran', p.military_veteran,
      'disability_status', p.disability_status,
      'lgbtq_status', p.lgbtq_status,
      
      -- Documents & Links
      'resume_url', p.resume_url,
      'resume_filename', p.resume_filename,
      'cover_letter_url', p.cover_letter_url,
      'cover_letter_filename', p.cover_letter_filename,
      'linkedin_url', p.linkedin_url,
      'github_url', p.github_url,
      'personal_website', p.personal_website,
      
      -- Consent Fields
      'references_available', p.references_available,
      'background_check_consent', p.background_check_consent,
      'drug_test_consent', p.drug_test_consent
    ),
    
    -- Work Experiences (from separate work_experiences table)
    'work_experiences', COALESCE(
      (SELECT json_agg(
        json_build_object(
          'id', we.id,
          'company_name', we.company_name,
          'position_title', we.position_title,
          'location', we.location,
          'experience_type', we.experience_type,
          'start_month', we.start_month,
          'start_year', we.start_year,
          'end_month', we.end_month,
          'end_year', we.end_year,
          'is_current', we.is_current,
          'description', we.description
        ) ORDER BY 
          CASE WHEN we.is_current THEN 0 ELSE 1 END,
          we.start_year DESC,
          CASE 
            WHEN we.start_month = 'January' THEN 1
            WHEN we.start_month = 'February' THEN 2
            WHEN we.start_month = 'March' THEN 3
            WHEN we.start_month = 'April' THEN 4
            WHEN we.start_month = 'May' THEN 5
            WHEN we.start_month = 'June' THEN 6
            WHEN we.start_month = 'July' THEN 7
            WHEN we.start_month = 'August' THEN 8
            WHEN we.start_month = 'September' THEN 9
            WHEN we.start_month = 'October' THEN 10
            WHEN we.start_month = 'November' THEN 11
            WHEN we.start_month = 'December' THEN 12
            ELSE 13
          END DESC
      ) FROM work_experiences we WHERE we.profile_id = p.id), 
      '[]'::json
    ),
    
    -- Education (from separate education table) - FIXED: removed 'minor', e.minor
    'education', COALESCE(
      (SELECT json_agg(
        json_build_object(
          'id', e.id,
          'institution_name', e.institution_name,
          'degree_type', e.degree_type,
          'major', e.major,
          'gpa', e.gpa,
          'start_year', e.start_year,
          'end_year', e.end_year,
          'is_current', e.is_current,
          'description', e.description
        ) ORDER BY 
          CASE WHEN e.is_current THEN 0 ELSE 1 END,
          e.end_year DESC NULLS FIRST
      ) FROM education e WHERE e.profile_id = p.id), 
      '[]'::json
    ),
    
    -- Skills (from separate profile_skills table)
    'skills', COALESCE(
      (SELECT json_agg(
        json_build_object(
          'skill_name', ps.skill_name,
          'proficiency_level', ps.proficiency_level,
          'is_preferred', ps.is_preferred,
          'category', ps.category
        ) ORDER BY ps.proficiency_level DESC, ps.skill_name
      ) FROM profile_skills ps WHERE ps.profile_id = p.id), 
      '[]'::json
    ),
    
    -- Languages (from separate profile_languages table)
    'languages', COALESCE(
      (SELECT json_agg(
        json_build_object(
          'language_name', pl.language_name
        ) ORDER BY pl.language_name
      ) FROM profile_languages pl WHERE pl.profile_id = p.id), 
      '[]'::json
    ),
    
    -- Certifications (from separate certifications table)
    'certifications', COALESCE(
      (SELECT json_agg(
        json_build_object(
          'certification_name', c.certification_name,
          'issuing_organization', c.issuing_organization,
          'issue_date', c.issue_date,
          'expiry_date', c.expiry_date,
          'credential_id', c.credential_id,
          'credential_url', c.credential_url
        ) ORDER BY c.issue_date DESC NULLS LAST
      ) FROM certifications c WHERE c.profile_id = p.id), 
      '[]'::json
    ),
    
    -- Portfolio Links (from separate portfolio_links table)
    'portfolio_links', COALESCE(
      (SELECT json_agg(
        json_build_object(
          'platform', pl.platform,
          'url', pl.url,
          'display_name', pl.display_name
        ) ORDER BY pl.platform
      ) FROM portfolio_links pl WHERE pl.profile_id = p.id), 
      '[]'::json
    )
    
  ) INTO result
  FROM profiles p
  WHERE p.id = user_id;
  
  -- Return the complete profile data
  RETURN result;
END;
$function$; 