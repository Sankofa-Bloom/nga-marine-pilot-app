
-- First create the has_role function that's needed for RLS policies
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text = _role
  )
$$;

-- Create time_entries table for tracking clock-in/out
CREATE TABLE public.time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  clock_in TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  clock_out TIMESTAMP WITH TIME ZONE NULL,
  clock_in_location JSONB NOT NULL, -- {latitude, longitude, address}
  clock_out_location JSONB NULL,
  status TEXT NOT NULL DEFAULT 'clocked-in' CHECK (status IN ('clocked-in', 'clocked-out')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create allowed_locations table for admin to manage login locations
CREATE TABLE public.allowed_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER NOT NULL DEFAULT 100, -- allowed radius in meters
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_location_permissions table to assign users to specific locations
CREATE TABLE public.user_location_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  location_id UUID REFERENCES public.allowed_locations NULL, -- NULL means can clock in from anywhere
  can_clock_in_anywhere BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, location_id)
);

-- Create location_access_requests table for users to request access from new locations
CREATE TABLE public.location_access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  requested_location JSONB NOT NULL, -- {latitude, longitude, address}
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE NULL
);

-- Enable RLS on all tables
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowed_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_location_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_access_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for time_entries
CREATE POLICY "Users can view their own time entries" 
  ON public.time_entries 
  FOR SELECT 
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Users can create their own time entries" 
  ON public.time_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time entries" 
  ON public.time_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for allowed_locations
CREATE POLICY "Everyone can view active locations" 
  ON public.allowed_locations 
  FOR SELECT 
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage locations" 
  ON public.allowed_locations 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policies for user_location_permissions
CREATE POLICY "Users can view their own permissions" 
  ON public.user_location_permissions 
  FOR SELECT 
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Only admins can manage user permissions" 
  ON public.user_location_permissions 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policies for location_access_requests
CREATE POLICY "Users can view their own requests and admins can view all" 
  ON public.location_access_requests 
  FOR SELECT 
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Users can create access requests" 
  ON public.location_access_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update requests" 
  ON public.location_access_requests 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for time tracking
ALTER TABLE public.time_entries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.time_entries;

-- Insert some default locations
INSERT INTO public.allowed_locations (name, address, latitude, longitude, radius_meters) VALUES
('Head Office', 'Main Office Building, Downtown', 4.0611, 9.2667, 50),
('Port Terminal A', 'Douala Port Terminal A', 4.0732, 9.7076, 100),
('Vessel MV Ocean Star', 'Docked at Terminal B', 4.0715, 9.7058, 25);
