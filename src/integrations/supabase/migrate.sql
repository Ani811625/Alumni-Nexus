
-- Create the event_participants table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Add RLS policies for event_participants
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Users can view event participants
CREATE POLICY "Users can view event participants" 
ON public.event_participants FOR SELECT 
USING (true);

-- Users can only modify their own participation
CREATE POLICY "Users can add themselves to events" 
ON public.event_participants FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own participation
CREATE POLICY "Users can remove themselves from events" 
ON public.event_participants FOR DELETE 
USING (auth.uid() = user_id);
