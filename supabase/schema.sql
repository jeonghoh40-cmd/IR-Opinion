-- IR Opinion 테이블
-- Supabase → SQL Editor 에 붙여넣고 실행

CREATE TABLE IF NOT EXISTS opinions (
  id          BIGSERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  stock_code   TEXT NOT NULL,
  opinion_type TEXT NOT NULL CHECK (opinion_type IN ('Buy', 'Hold', 'Sell')),
  target_price  INTEGER,
  current_price INTEGER,
  analyst      TEXT,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- RLS(Row Level Security) 비활성화 — 공개 앱이므로 전체 허용
ALTER TABLE opinions DISABLE ROW LEVEL SECURITY;
