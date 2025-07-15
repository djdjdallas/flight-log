-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'active',
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    pilot_certificate_number VARCHAR(50),
    pilot_certificate_expiry DATE,
    organization_id UUID REFERENCES organizations(id),
    role VARCHAR(50) DEFAULT 'pilot',
    phone VARCHAR(20),
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aircraft table
CREATE TABLE aircraft (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    registration_number VARCHAR(20) NOT NULL,
    registration_expiry DATE,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100),
    remote_id_serial VARCHAR(100),
    remote_id_type VARCHAR(50) DEFAULT 'standard', -- 'standard', 'broadcast', 'network'
    weight_lbs DECIMAL(5,2),
    purchase_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Batteries table
CREATE TABLE batteries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    aircraft_id UUID REFERENCES aircraft(id) ON DELETE CASCADE,
    serial_number VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    cycle_count INTEGER DEFAULT 0,
    max_cycles INTEGER DEFAULT 500,
    purchase_date DATE,
    last_cycle_date DATE,
    voltage DECIMAL(4,2),
    capacity_mah INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flights table
CREATE TABLE flights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    aircraft_id UUID REFERENCES aircraft(id) NOT NULL,
    pilot_id UUID REFERENCES auth.users(id) NOT NULL,
    battery_id UUID REFERENCES batteries(id),
    flight_number VARCHAR(50),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    takeoff_location JSONB, -- {lat, lng, address}
    landing_location JSONB,
    max_altitude_ft INTEGER,
    max_distance_ft INTEGER,
    max_speed_mph DECIMAL(5,2),
    weather_conditions JSONB,
    purpose TEXT,
    notes TEXT,
    compliance_status VARCHAR(20) DEFAULT 'pending',
    remote_id_verified BOOLEAN DEFAULT false,
    airspace_authorization_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flight logs (raw imported data)
CREATE TABLE flight_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    import_source VARCHAR(50) NOT NULL, -- 'dji', 'autel', 'manual'
    raw_data JSONB NOT NULL,
    processed_data JSONB,
    file_name VARCHAR(255),
    file_size INTEGER,
    import_status VARCHAR(20) DEFAULT 'processing',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance reports
CREATE TABLE compliance_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    report_type VARCHAR(50) NOT NULL, -- 'audit', 'part107', 'remote_id'
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    flight_ids UUID[] NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    pdf_url TEXT,
    status VARCHAR(20) DEFAULT 'generated',
    download_count INTEGER DEFAULT 0
);

-- Airspace authorizations
CREATE TABLE airspace_authorizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    flight_id UUID REFERENCES flights(id),
    laanc_id VARCHAR(100),
    authorization_type VARCHAR(50), -- 'laanc', 'coa', 'part107'
    status VARCHAR(20) DEFAULT 'pending',
    authorized_altitude_ft INTEGER,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    area_coordinates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance checks
CREATE TABLE compliance_checks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    flight_id UUID REFERENCES flights(id),
    aircraft_id UUID REFERENCES aircraft(id),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    check_type VARCHAR(50) NOT NULL, -- 'remote_id', 'registration', 'part107', 'weight', 'airspace'
    status VARCHAR(20) NOT NULL, -- 'pass', 'fail', 'warning'
    details JSONB,
    violation_message TEXT,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'compliance', 'expiry', 'violation', 'info'
    severity VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'error'
    data JSONB,
    read_at TIMESTAMP WITH TIME ZONE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings
CREATE TABLE user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    notification_email BOOLEAN DEFAULT true,
    notification_push BOOLEAN DEFAULT true,
    compliance_alerts BOOLEAN DEFAULT true,
    expiry_reminders BOOLEAN DEFAULT true,
    weekly_summary BOOLEAN DEFAULT true,
    reminder_days_registration INTEGER DEFAULT 30,
    reminder_days_part107 INTEGER DEFAULT 60,
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE batteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE airspace_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- User can only access their own data
CREATE POLICY "Users can access own profile" ON user_profiles 
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can access own aircraft" ON aircraft 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own flights" ON flights 
    FOR ALL USING (auth.uid() = pilot_id);

CREATE POLICY "Users can access own flight logs" ON flight_logs
    FOR ALL USING (EXISTS (
        SELECT 1 FROM flights 
        WHERE flights.id = flight_logs.flight_id 
        AND flights.pilot_id = auth.uid()
    ));

CREATE POLICY "Users can access own batteries" ON batteries
    FOR ALL USING (EXISTS (
        SELECT 1 FROM aircraft 
        WHERE aircraft.id = batteries.aircraft_id 
        AND aircraft.user_id = auth.uid()
    ));

CREATE POLICY "Users can access own compliance reports" ON compliance_reports 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own airspace authorizations" ON airspace_authorizations
    FOR ALL USING (EXISTS (
        SELECT 1 FROM flights 
        WHERE flights.id = airspace_authorizations.flight_id 
        AND flights.pilot_id = auth.uid()
    ));

CREATE POLICY "Users can access own compliance checks" ON compliance_checks 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own notifications" ON notifications 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own settings" ON user_settings 
    FOR ALL USING (auth.uid() = user_id);

-- Organization members can access shared data
CREATE POLICY "Organization members can access organization data" ON organizations
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.organization_id = organizations.id 
        AND user_profiles.id = auth.uid()
    ));

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_aircraft_updated_at BEFORE UPDATE ON aircraft
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_batteries_updated_at BEFORE UPDATE ON batteries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_flights_updated_at BEFORE UPDATE ON flights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Compliance checking functions
CREATE OR REPLACE FUNCTION check_remote_id_requirement(aircraft_weight_lbs DECIMAL)
RETURNS BOOLEAN AS $$
BEGIN
    -- Remote ID required for aircraft over 0.55 lbs (250g)
    RETURN aircraft_weight_lbs > 0.55;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_registration_expiry_days(registration_expiry DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(DAYS FROM registration_expiry - CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_part107_expiry_days(cert_expiry DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(DAYS FROM cert_expiry - CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_compliance_score(user_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_flights INTEGER;
    compliant_flights INTEGER;
    score DECIMAL;
BEGIN
    -- Get total flights for user
    SELECT COUNT(*) INTO total_flights
    FROM flights
    WHERE pilot_id = user_uuid;
    
    -- Get compliant flights
    SELECT COUNT(*) INTO compliant_flights
    FROM flights
    WHERE pilot_id = user_uuid AND compliance_status = 'compliant';
    
    -- Calculate score
    IF total_flights = 0 THEN
        RETURN 100;
    END IF;
    
    score := (compliant_flights::DECIMAL / total_flights::DECIMAL) * 100;
    RETURN ROUND(score, 2);
END;
$$ LANGUAGE plpgsql;