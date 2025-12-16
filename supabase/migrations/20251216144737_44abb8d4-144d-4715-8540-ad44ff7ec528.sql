-- First, make email nullable in profiles table
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;

-- Update the handle_new_user function to handle phone signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.phone),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Phone User')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;