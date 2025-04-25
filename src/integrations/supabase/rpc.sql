
-- Function to count participants for an event
CREATE OR REPLACE FUNCTION public.count_event_participants(event_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  participant_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO participant_count
  FROM event_participants
  WHERE event_id = $1;
  
  RETURN participant_count;
END;
$$;

-- Function to check if a user has joined an event
CREATE OR REPLACE FUNCTION public.check_event_participation(p_event_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  has_joined BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM event_participants
    WHERE event_id = p_event_id AND user_id = p_user_id
  ) INTO has_joined;
  
  RETURN has_joined;
END;
$$;

-- Function to join an event
CREATE OR REPLACE FUNCTION public.join_event(p_event_id UUID, p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO event_participants (event_id, user_id, joined_at)
  VALUES (p_event_id, p_user_id, now())
  ON CONFLICT (event_id, user_id) DO NOTHING;
END;
$$;

-- Function to leave an event
CREATE OR REPLACE FUNCTION public.leave_event(p_event_id UUID, p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM event_participants
  WHERE event_id = p_event_id AND user_id = p_user_id;
END;
$$;
