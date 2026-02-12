
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'CLIENT', -- ADMIN, CLIENT, PARTNER
  partner_type TEXT, -- Applicable only for PARTNER role
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Secure the tables with RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for viewing profiles: admins can see all, others can see only their own
CREATE POLICY "Admin can view all profiles" 
  ON profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'ADMIN'
    )
  );

CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Allow insert for authenticated users creating their profile
CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow updates for admins and users updating their own profiles
CREATE POLICY "Admin can update all profiles" 
  ON profiles FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'ADMIN'
    )
  );

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  pricing JSONB,
  contact JSONB,
  discount TEXT,
  services TEXT[],
  availability TEXT[],
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table for partners
CREATE TABLE IF NOT EXISTS partner_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  type TEXT NOT NULL, -- logo, gallery, profile, background
  order_index INTEGER,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for partners
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_images ENABLE ROW LEVEL SECURITY;

-- Partner RLS policies
CREATE POLICY "Partners are viewable by everyone" 
  ON partners FOR SELECT USING (true);

CREATE POLICY "Partners can modify their own data" 
  ON partners FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can modify all partner data" 
  ON partners FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'ADMIN'
    )
  );

-- Partner images RLS policies
CREATE POLICY "Partner images are viewable by everyone" 
  ON partner_images FOR SELECT USING (true);

CREATE POLICY "Partners can modify their own images" 
  ON partner_images FOR ALL
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can modify all partner images" 
  ON partner_images FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'ADMIN'
    )
  );

-- Create talkshows table
CREATE TABLE IF NOT EXISTS talkshows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration TEXT,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  views INTEGER DEFAULT 0,
  image_url TEXT,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create podcasts table
CREATE TABLE IF NOT EXISTS podcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration TEXT,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  views INTEGER DEFAULT 0,
  image_url TEXT,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  response TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  categories JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup talkshow, podcast and rating RLS policies
ALTER TABLE talkshows ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Talkshows RLS policies
CREATE POLICY "Talkshows are viewable by everyone" 
  ON talkshows FOR SELECT 
  USING (status = 'approved' OR 
         partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()) OR
         auth.uid() IN (SELECT id FROM profiles WHERE role = 'ADMIN'));

CREATE POLICY "Partners can insert their own talkshows" 
  ON talkshows FOR INSERT 
  WITH CHECK (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Partners can update their own talkshows" 
  ON talkshows FOR UPDATE 
  USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can modify all talkshows" 
  ON talkshows FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'ADMIN'
    )
  );

-- Podcasts RLS policies (similar to talkshows)
CREATE POLICY "Podcasts are viewable by everyone" 
  ON podcasts FOR SELECT 
  USING (status = 'approved' OR 
         partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()) OR
         auth.uid() IN (SELECT id FROM profiles WHERE role = 'ADMIN'));

CREATE POLICY "Partners can insert their own podcasts" 
  ON podcasts FOR INSERT 
  WITH CHECK (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Partners can update their own podcasts" 
  ON podcasts FOR UPDATE 
  USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can modify all podcasts" 
  ON podcasts FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'ADMIN'
    )
  );

-- Ratings RLS policies
CREATE POLICY "Ratings are viewable by everyone" 
  ON ratings FOR SELECT 
  USING (status = 'approved' OR 
         partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()) OR
         auth.uid() = client_id OR
         auth.uid() IN (SELECT id FROM profiles WHERE role = 'ADMIN'));

CREATE POLICY "Clients can insert their own ratings" 
  ON ratings FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Partners can update ratings on their profiles" 
  ON ratings FOR UPDATE 
  USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  )
  WITH CHECK (
    -- Partners can only update the response field
    (SELECT jsonb_path_query_first(to_jsonb(NEW), '$.response') IS NOT NULL)
  );

CREATE POLICY "Admins can modify all ratings" 
  ON ratings FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'ADMIN'
    )
  );

-- Create functions for auth hooks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'CLIENT');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
