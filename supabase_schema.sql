-- magic_users 테이블 생성
CREATE TABLE public.magic_users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text UNIQUE NOT NULL,
    email text,
    age integer,
    gender text,
    tier text DEFAULT 'Free',
    credits integer DEFAULT 3,
    character text DEFAULT 'stella',
    character_name text,
    created_at timestamp with time zone DEFAULT now()
);

-- RLS (Row Level Security) 설정 - 개발 편의를 위해 일단 모두 허용 (실제 운영시 조정 필요)
ALTER TABLE public.magic_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access for now" ON public.magic_users FOR ALL USING (true) WITH CHECK (true);

-- magic_stories 테이블 생성 (선택 사항 - 나중에 스토리 저장용)
CREATE TABLE public.magic_stories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.magic_users(id),
    title text,
    content text,
    image_url text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.magic_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to stories" ON public.magic_stories FOR ALL USING (true) WITH CHECK (true);
