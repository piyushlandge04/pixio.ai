-- Add index on user_id for faster history queries
CREATE INDEX IF NOT EXISTS idx_flyer_history_user_id ON public.flyer_history(user_id);

-- Add index on created_at for better ordering performance
CREATE INDEX IF NOT EXISTS idx_flyer_history_created_at ON public.flyer_history(created_at DESC);