Table and column

| table_name         | column_name            | data_type                | column_default                | is_nullable | character_maximum_length |
| ------------------ | ---------------------- | ------------------------ | ----------------------------- | ----------- | ------------------------ |
| applications       | id                     | uuid                     | uuid_generate_v4()            | NO          | null                     |
| applications       | user_id                | uuid                     | null                          | NO          | null                     |
| applications       | position               | text                     | null                          | NO          | null                     |
| applications       | company                | text                     | null                          | NO          | null                     |
| applications       | location               | text                     | null                          | YES         | null                     |
| applications       | work_type              | USER-DEFINED             | 'onsite'::work_type           | YES         | null                     |
| applications       | salary_min             | integer                  | null                          | YES         | null                     |
| applications       | salary_max             | integer                  | null                          | YES         | null                     |
| applications       | salary_currency        | text                     | 'USD'::text                   | YES         | null                     |
| applications       | applied_date           | timestamp with time zone | now()                         | YES         | null                     |
| applications       | apply_time             | integer                  | null                          | YES         | null                     |
| applications       | source                 | text                     | null                          | YES         | null                     |
| applications       | status                 | USER-DEFINED             | 'applied'::application_status | YES         | null                     |
| applications       | company_url            | text                     | null                          | YES         | null                     |
| applications       | job_description        | text                     | null                          | YES         | null                     |
| applications       | notes                  | text                     | null                          | YES         | null                     |
| applications       | created_at             | timestamp with time zone | now()                         | YES         | null                     |
| applications       | updated_at             | timestamp with time zone | now()                         | YES         | null                     |
| applications       | application_type       | text                     | 'standard'::text              | YES         | null                     |
| extension_activity | id                     | uuid                     | uuid_generate_v4()            | NO          | null                     |
| extension_activity | user_id                | uuid                     | null                          | NO          | null                     |
| extension_activity | action                 | text                     | null                          | NO          | null                     |
| extension_activity | created_at             | timestamp with time zone | now()                         | YES         | null                     |
| extension_activity | metadata               | jsonb                    | '{}'::jsonb                   | YES         | null                     |
| profiles           | id                     | uuid                     | null                          | NO          | null                     |
| profiles           | full_name              | text                     | null                          | YES         | null                     |
| profiles           | title                  | text                     | null                          | YES         | null                     |
| profiles           | location               | text                     | null                          | YES         | null                     |
| profiles           | phone                  | text                     | null                          | YES         | null                     |
| profiles           | bio                    | text                     | null                          | YES         | null                     |
| profiles           | skills                 | ARRAY                    | null                          | YES         | null                     |
| profiles           | experience             | text                     | null                          | YES         | null                     |
| profiles           | education              | text                     | null                          | YES         | null                     |
| profiles           | created_at             | timestamp with time zone | now()                         | YES         | null                     |
| profiles           | updated_at             | timestamp with time zone | now()                         | YES         | null                     |
| profiles           | daily_goal             | integer                  | 10                            | YES         | null                     |
| profiles           | extension_access_token | uuid                     | null                          | YES         | null                     |
| profiles           | extension_last_used    | timestamp with time zone | null                          | YES         | null                     |
| profiles           | extension_status       | boolean                  | false                         | YES         | null                     |


VIEWS

| view_name           | view_definition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| recent_applications |  SELECT applications.id,
    applications.user_id,
    applications."position",
    applications.company,
    applications.location,
    applications.work_type,
    applications.salary_min,
    applications.salary_max,
    applications.salary_currency,
    applications.applied_date,
    applications.apply_time,
    applications.source,
    applications.status
   FROM applications
  WHERE (applications.applied_date >= (now() - '30 days'::interval))
  ORDER BY applications.applied_date DESC; |


  FUNCTIONSSS

  | function_name            | function_definition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| get_application_stats    | CREATE OR REPLACE FUNCTION public.get_application_stats(user_id uuid, OUT total_applications bigint, OUT applications_this_week bigint, OUT applications_today bigint, OUT average_apply_time numeric, OUT response_rate numeric)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Initialize with default values
    total_applications := 0;
    applications_this_week := 0;
    applications_today := 0;
    average_apply_time := 0;
    response_rate := 0;

    -- Calculate total applications
    SELECT COUNT(*)
    INTO total_applications
    FROM applications
    WHERE applications.user_id = $1;

    -- Only continue if there are applications
    IF total_applications > 0 THEN
        -- Calculate applications this week
        SELECT COUNT(*)
        INTO applications_this_week
        FROM applications
        WHERE applications.user_id = $1
        AND applied_date >= NOW() - INTERVAL '7 days';

        -- Calculate applications today
        SELECT COUNT(*)
        INTO applications_today
        FROM applications
        WHERE applications.user_id = $1
        AND DATE(applied_date) = CURRENT_DATE;

        -- Calculate average apply time
        SELECT COALESCE(AVG(NULLIF(apply_time, 0)), 0)
        INTO average_apply_time
        FROM applications
        WHERE applications.user_id = $1;

        -- Calculate response rate (percentage of applications with status other than 'applied')
        SELECT COALESCE(
            (COUNT(*) FILTER (WHERE status != 'applied') * 100.0 / NULLIF(COUNT(*), 0)),
            0
        )
        INTO response_rate
        FROM applications
        WHERE applications.user_id = $1;
    END IF;
END;
$function$
 |
| generate_extension_token | CREATE OR REPLACE FUNCTION public.generate_extension_token()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    new_token UUID;
BEGIN
    new_token := uuid_generate_v4();
    
    UPDATE profiles
    SET extension_access_token = new_token,
        extension_status = true,
        extension_last_used = NOW()
    WHERE id = auth.uid();
    
    RETURN new_token;
END;
$function$ |                                                                                                                                                                                                                                                                                                                                                                  
Indexes 

| tablename          | indexname               | indexdef                                                                                  |
| ------------------ | ----------------------- | ----------------------------------------------------------------------------------------- |
| profiles           | profiles_pkey           | CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id)                     |
| applications       | applications_pkey       | CREATE UNIQUE INDEX applications_pkey ON public.applications USING btree (id)             |
| extension_activity | extension_activity_pkey | CREATE UNIQUE INDEX extension_activity_pkey ON public.extension_activity USING btree (id) |

All foreign key 

SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE 
    tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public';


RLS Policcies 
| schemaname | tablename          | policyname                                    | permissive | roles    | cmd    | qual                   | with_check             |
| ---------- | ------------------ | --------------------------------------------- | ---------- | -------- | ------ | ---------------------- | ---------------------- |
| public     | extension_activity | Users can insert their own extension activity | PERMISSIVE | {public} | INSERT | null                   | (auth.uid() = user_id) |
| public     | extension_activity | Users can view their own extension activity   | PERMISSIVE | {public} | SELECT | (auth.uid() = user_id) | null                   |

ENUMS
| enum_name          | enum_value |
| ------------------ | ---------- |
| application_status | applied    |
| application_status | screening  |
| application_status | interview  |
| application_status | offer      |
| application_status | rejected   |
| application_status | withdrawn  |
| work_type          | remote     |
| work_type          | hybrid     |
| work_type          | onsite     |

TABLE SIZE 
| table_name         | total_size | data_size  | external_size |
| ------------------ | ---------- | ---------- | ------------- |
| profiles           | 32 kB      | 8192 bytes | 24 kB         |
| applications       | 16 kB      | 0 bytes    | 16 kB         |
| extension_activity | 16 kB      | 0 bytes    | 16 kB         |