# Supabase Storage Setup for Coraxalia

This document provides instructions for setting up the storage buckets required for the Coraxalia application.

## Profile Images Bucket

1. Go to the Storage section in your Supabase dashboard
2. Click "Create a new bucket"
3. Enter the following details:
   - Name: `profiles`
   - Public bucket: Yes (check the box)
   - File size limit: 5MB (recommended)

4. After creating the bucket, click on it and go to the "Policies" tab

5. Create the following policies:

### Upload Policy

\`\`\`sql
CREATE POLICY "Allow users to upload their own profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
\`\`\`

### Update Policy

\`\`\`sql
CREATE POLICY "Allow users to update their own profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
\`\`\`

### Delete Policy

\`\`\`sql
CREATE POLICY "Allow users to delete their own profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
\`\`\`

### Select Policy (Public Access)

\`\`\`sql
CREATE POLICY "Allow public access to profile images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');
\`\`\`

## Sheet Music Bucket

1. Create another bucket with the following details:
   - Name: `sheet_music`
   - Public bucket: No (unchecked)
   - File size limit: 10MB

2. Create the following policies:

### Upload Policy

\`\`\`sql
CREATE POLICY "Allow directors and admins to upload sheet music"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'sheet_music' AND
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('director', 'admin')
);
\`\`\`

### Update/Delete Policy

\`\`\`sql
CREATE POLICY "Allow directors and admins to manage sheet music"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'sheet_music' AND
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('director', 'admin')
);

CREATE POLICY "Allow directors and admins to delete sheet music"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'sheet_music' AND
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('director', 'admin')
);
\`\`\`

### Select Policy (Authenticated Access)

\`\`\`sql
CREATE POLICY "Allow authenticated users to access sheet music"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'sheet_music');
\`\`\`

## Audio Files Bucket

1. Create another bucket with the following details:
   - Name: `audio`
   - Public bucket: No (unchecked)
   - File size limit: 20MB

2. Create the following policies (similar to sheet music):

### Upload Policy

\`\`\`sql
CREATE POLICY "Allow directors and admins to upload audio files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio' AND
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('director', 'admin')
);
\`\`\`

### Update/Delete Policy

\`\`\`sql
CREATE POLICY "Allow directors and admins to manage audio files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'audio' AND
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('director', 'admin')
);

CREATE POLICY "Allow directors and admins to delete audio files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'audio' AND
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('director', 'admin')
);
\`\`\`

### Select Policy (Authenticated Access)

\`\`\`sql
CREATE POLICY "Allow authenticated users to access audio files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'audio');
\`\`\`

## Testing Storage Setup

After setting up the storage buckets and policies, you should test them to ensure they work as expected:

1. Log in as a regular user and try to upload a profile image
2. Log in as a director/admin and try to upload sheet music and audio files
3. Verify that regular users can access sheet music and audio files but cannot upload or modify them
4. Verify that profile images are publicly accessible

If any of these tests fail, review your policies and make adjustments as needed.
