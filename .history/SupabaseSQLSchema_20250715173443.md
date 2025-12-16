-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.aircraft (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  organization_id uuid,
  registration_number character varying NOT NULL,
  manufacturer character varying NOT NULL,
  model character varying NOT NULL,
  serial_number character varying,
  remote_id_serial character varying,
  weight_lbs numeric,
  purchase_date date,
  status character varying DEFAULT 'active'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  registration_expiry date,
  remote_id_type character varying,
  CONSTRAINT aircraft_pkey PRIMARY KEY (id),
  CONSTRAINT aircraft_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT aircraft_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.airspace_authorizations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  flight_id uuid,
  laanc_id character varying,
  authorization_type character varying,
  status character varying DEFAULT 'pending'::character varying,
  authorized_altitude_ft integer,
  valid_from timestamp with time zone,
  valid_until timestamp with time zone,
  area_coordinates jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT airspace_authorizations_pkey PRIMARY KEY (id),
  CONSTRAINT airspace_authorizations_flight_id_fkey FOREIGN KEY (flight_id) REFERENCES public.flights(id)
);
CREATE TABLE public.batteries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  aircraft_id uuid,
  serial_number character varying NOT NULL,
  manufacturer character varying,
  model character varying,
  cycle_count integer DEFAULT 0,
  max_cycles integer DEFAULT 500,
  purchase_date date,
  last_cycle_date date,
  voltage numeric,
  capacity_mah integer,
  status character varying DEFAULT 'active'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT batteries_pkey PRIMARY KEY (id),
  CONSTRAINT batteries_aircraft_id_fkey FOREIGN KEY (aircraft_id) REFERENCES public.aircraft(id)
);
CREATE TABLE public.compliance_reports (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  organization_id uuid,
  report_type character varying NOT NULL,
  date_range_start date NOT NULL,
  date_range_end date NOT NULL,
  flight_ids ARRAY NOT NULL,
  generated_at timestamp with time zone DEFAULT now(),
  pdf_url text,
  status character varying DEFAULT 'generated'::character varying,
  download_count integer DEFAULT 0,
  CONSTRAINT compliance_reports_pkey PRIMARY KEY (id),
  CONSTRAINT compliance_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT compliance_reports_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.flight_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  flight_id uuid,
  import_source character varying NOT NULL,
  raw_data jsonb NOT NULL,
  processed_data jsonb,
  file_name character varying,
  file_size integer,
  import_status character varying DEFAULT 'processing'::character varying,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT flight_logs_pkey PRIMARY KEY (id),
  CONSTRAINT flight_logs_flight_id_fkey FOREIGN KEY (flight_id) REFERENCES public.flights(id)
);
CREATE TABLE public.flights (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  aircraft_id uuid NOT NULL,
  pilot_id uuid NOT NULL,
  battery_id uuid,
  flight_number character varying,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  duration_minutes integer,
  takeoff_location jsonb,
  landing_location jsonb,
  max_altitude_ft integer,
  max_distance_ft integer,
  max_speed_mph numeric,
  weather_conditions jsonb,
  purpose text,
  notes text,
  compliance_status character varying DEFAULT 'pending'::character varying,
  remote_id_verified boolean DEFAULT false,
  airspace_authorization_id character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT flights_pkey PRIMARY KEY (id),
  CONSTRAINT flights_aircraft_id_fkey FOREIGN KEY (aircraft_id) REFERENCES public.aircraft(id),
  CONSTRAINT flights_pilot_id_fkey FOREIGN KEY (pilot_id) REFERENCES auth.users(id),
  CONSTRAINT flights_battery_id_fkey FOREIGN KEY (battery_id) REFERENCES public.batteries(id)
);
CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  subscription_tier character varying DEFAULT 'free'::character varying,
  subscription_status character varying DEFAULT 'active'::character varying,
  stripe_customer_id character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT organizations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  email character varying NOT NULL,
  full_name character varying,
  pilot_certificate_number character varying,
  organization_id uuid,
  role character varying DEFAULT 'pilot'::character varying,
  phone character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);