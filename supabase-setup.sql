-- =============================================
-- CORAXALIA CHOIR MANAGEMENT APP - DATABASE SETUP
-- =============================================
-- This file contains all the SQL needed to set up the Supabase database for the Coraxalia app.
-- Execute this in the Supabase SQL Editor to create all required tables and security policies.

-- =============================================
-- EXTENSIONS
-- =============================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Profiles Table - Stores user profile information
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL,
  cuerda TEXT NOT NULL, -- Voice part (soprano1, soprano2, tenor1, etc.)
  fecha_nacimiento DATE NOT NULL,
  localidad TEXT NOT NULL,
  image TEXT, -- URL to profile image in storage
  role TEXT NOT NULL DEFAULT 'member', -- 'member', 'director', or 'admin'
  fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Concerts Table - Stores information about concerts
CREATE TABLE concerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  venue TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Repertoire Table - Stores music pieces information
CREATE TABLE repertoire (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  composer TEXT,
  year INTEGER,
  category TEXT NOT NULL, -- 'Navidad', 'Clásico', 'Popular', etc.
  sheet_music_url TEXT, -- URL to sheet music file
  audio_url TEXT, -- URL to audio file
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Concert Repertoire Junction Table - Links concerts with repertoire pieces
CREATE TABLE concert_repertoire (
  concert_id UUID REFERENCES concerts(id) ON DELETE CASCADE,
  repertoire_id UUID REFERENCES repertoire(id) ON DELETE CASCADE,
  PRIMARY KEY (concert_id, repertoire_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Table - Tracks member attendance at concerts
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  concert_id UUID REFERENCES concerts(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, concert_id)
);

-- Payments Table - Tracks member payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  concept TEXT NOT NULL,
  payment_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rehearsals Table - Stores information about rehearsals
CREATE TABLE rehearsals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rehearsal Attendance Table - Tracks member attendance at rehearsals
CREATE TABLE rehearsal_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  rehearsal_id UUID REFERENCES rehearsals(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, rehearsal_id)
);

-- Announcements Table - Stores choir announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE repertoire ENABLE ROW LEVEL SECURITY;
ALTER TABLE concert_repertoire ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehearsals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehearsal_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES TABLE POLICIES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Directors can view all profiles
CREATE POLICY "Directors can view all profiles" 
  ON profiles FOR SELECT 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('director', 'admin'));

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" 
  ON profiles FOR UPDATE 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin');

-- =============================================
-- CONCERTS TABLE POLICIES
-- =============================================

-- All users can view concerts
CREATE POLICY "All users can view concerts" 
  ON concerts FOR SELECT 
  USING (true);

-- Directors and admins can create concerts
CREATE POLICY "Directors and admins can create concerts" 
  ON concerts FOR INSERT 
  WITH CHECK ((SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('director', 'admin'));

-- Directors and admins can update concerts
CREATE POLICY "Directors and admins can update concerts" 
  ON concerts FOR UPDATE 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('director', 'admin'));

-- Admins can delete concerts
CREATE POLICY "Admins can delete concerts" 
  ON concerts FOR DELETE 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin');

-- =============================================
-- REPERTOIRE TABLE POLICIES
-- =============================================

-- All users can view repertoire
CREATE POLICY "All users can view repertoire" 
  ON repertoire FOR SELECT 
  USING (true);

-- Directors and admins can create repertoire
CREATE POLICY "Directors and admins can create repertoire" 
  ON repertoire FOR INSERT 
  WITH CHECK ((SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('director', 'admin'));

-- Directors and admins can update repertoire
CREATE POLICY "Directors and admins can update repertoire" 
  ON repertoire FOR UPDATE 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('director', 'admin'));

-- Admins can delete repertoire
CREATE POLICY "Admins can delete repertoire" 
  ON repertoire FOR DELETE 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin');

-- =============================================
-- CONCERT_REPERTOIRE TABLE POLICIES
-- =============================================

-- All users can view concert repertoire
CREATE POLICY "All users can view concert repertoire" 
  ON concert_repertoire FOR SELECT 
  USING (true);

-- Directors and admins can manage concert repertoire
CREATE POLICY "Directors and admins can manage concert repertoire" 
  ON concert_repertoire FOR ALL 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('director', 'admin'));

-- =============================================
-- ATTENDANCE TABLE POLICIES
-- =============================================

-- Users can view all attendance records
CREATE POLICY "Users can view all attendance records" 
  ON attendance FOR SELECT 
  USING (true);

-- Users can manage their own attendance
CREATE POLICY "Users can manage their own attendance" 
  ON attendance FOR ALL 
  USING (auth.uid() = user_id);

-- Directors and admins can manage all attendance
CREATE POLICY "Directors and admins can manage all attendance" 
  ON attendance FOR ALL 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('director', 'admin'));

-- =============================================
-- PAYMENTS TABLE POLICIES
-- =============================================

-- Users can view their own payments
CREATE POLICY "Users can view their own payments" 
  ON payments FOR SELECT 
  USING (auth.uid() = user_id);

-- Admins can manage all payments
CREATE POLICY "Admins can manage all payments" 
  ON payments FOR ALL 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin');

-- =============================================
-- REHEARSALS TABLE POLICIES
-- =============================================

-- All users can view rehearsals
CREATE POLICY "All users can view rehearsals" 
  ON rehearsals FOR SELECT 
  USING (true);

-- Directors and admins can manage rehearsals
CREATE POLICY "Directors and admins can manage rehearsals" 
  ON rehearsals FOR ALL 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('director', 'admin'));

-- =============================================
-- REHEARSAL_ATTENDANCE TABLE POLICIES
-- =============================================

-- Users can view all rehearsal attendance records
CREATE POLICY "Users can view all rehearsal attendance records" 
  ON rehearsal_attendance FOR SELECT 
  USING (true);

-- Users can manage their own rehearsal attendance
CREATE POLICY "Users can manage their own rehearsal attendance" 
  ON rehearsal_attendance FOR ALL 
  USING (auth.uid() = user_id);

-- Directors and admins can manage all rehearsal attendance
CREATE POLICY "Directors and admins can manage all rehearsal attendance" 
  ON rehearsal_attendance FOR ALL 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('director', 'admin'));

-- =============================================
-- ANNOUNCEMENTS TABLE POLICIES
-- =============================================

-- All users can view announcements
CREATE POLICY "All users can view announcements" 
  ON announcements FOR SELECT 
  USING (true);

-- Directors and admins can manage announcements
CREATE POLICY "Directors and admins can manage announcements" 
  ON announcements FOR ALL 
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) IN ('director', 'admin'));

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the update_modified_column trigger to all tables
CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_concerts_modtime
BEFORE UPDATE ON concerts
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_repertoire_modtime
BEFORE UPDATE ON repertoire
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_attendance_modtime
BEFORE UPDATE ON attendance
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_payments_modtime
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_rehearsals_modtime
BEFORE UPDATE ON rehearsals
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_rehearsal_attendance_modtime
BEFORE UPDATE ON rehearsal_attendance
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_announcements_modtime
BEFORE UPDATE ON announcements
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

-- Create a function to check and set an admin user if none exists
CREATE OR REPLACE FUNCTION ensure_admin_exists()
RETURNS TRIGGER AS $$
DECLARE
  admin_count INT;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM profiles WHERE role = 'admin';
  IF admin_count = 0 AND NEW.role = 'member' THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the ensure_admin_exists trigger to profiles
CREATE TRIGGER ensure_admin_on_insert
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE PROCEDURE ensure_admin_exists();

-- =============================================
-- STORAGE SETUP
-- =============================================

-- Create a storage bucket for profile images
-- Note: This needs to be done through the Supabase dashboard or API
-- 1. Go to Storage in the Supabase dashboard
-- 2. Create a new bucket named 'profiles'
-- 3. Set it as public
-- 4. Add the following policies:

/*
-- Allow authenticated users to upload their own profile images
CREATE POLICY "Allow users to upload their own profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own profile images
CREATE POLICY "Allow users to update their own profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own profile images
CREATE POLICY "Allow users to delete their own profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to profile images
CREATE POLICY "Allow public access to profile images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');
*/

-- =============================================
-- SAMPLE DATA (COMMENTED OUT)
-- =============================================

-- Uncomment and modify the following to insert sample data

/*
-- Insert a director user (replace with your user ID after registration)
INSERT INTO profiles (user_id, email, nombre, cuerda, fecha_nacimiento, localidad, role)
VALUES 
  ('replace-with-actual-user-id', 'director@example.com', 'Carlos Rodríguez', 'tenor1', '1975-01-01', 'Madrid', 'director');

-- Insert sample repertoire
INSERT INTO repertoire (title, composer, year, category, created_by)
VALUES
  ('Noche de Paz', 'Franz Xaver Gruber', 1818, 'Navidad', 'replace-with-director-user-id'),
  ('Adeste Fideles', 'John Francis Wade', 1751, 'Navidad', 'replace-with-director-user-id'),
  ('Ave Maria', 'Franz Schubert', 1825, 'Clásico', 'replace-with-director-user-id'),
  ('Aleluya (El Mesías)', 'Georg Friedrich Händel', 1741, 'Clásico', 'replace-with-director-user-id'),
  ('Bohemian Rhapsody', 'Freddie Mercury', 1975, 'Popular', 'replace-with-director-user-id'),
  ('Hallelujah', 'Leonard Cohen', 1984, 'Popular', 'replace-with-director-user-id');

-- Insert sample concert
INSERT INTO concerts (title, date, time, venue, address, description, created_by)
VALUES
  ('Concierto de Navidad', '2023-12-15', '19:00', 'Auditorio Municipal', 'Calle Mayor 123, Madrid', 'Concierto tradicional de Navidad con villancicos clásicos y modernos.', 'replace-with-director-user-id');

-- Link repertoire to concert
INSERT INTO concert_repertoire (concert_id, repertoire_id)
VALUES
  ((SELECT id FROM concerts WHERE title = 'Concierto de Navidad'), (SELECT id FROM repertoire WHERE title = 'Noche de Paz')),
  ((SELECT id FROM concerts WHERE title = 'Concierto de Navidad'), (SELECT id FROM repertoire WHERE title = 'Adeste Fideles'));

-- Insert sample announcement
INSERT INTO announcements (title, content, created_by)
VALUES
  ('Bienvenida a nuevos miembros', 'Damos la bienvenida a tres nuevos miembros que se incorporan a nuestro coro. ¡Bienvenidos!', 'replace-with-director-user-id');
*/

-- =============================================
-- END OF SETUP
-- =============================================
