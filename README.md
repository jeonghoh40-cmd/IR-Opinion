# IR Opinion

IR(투자의견) 입력 및 조회 웹 애플리케이션

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| DB | Supabase (PostgreSQL) |
| 배포 | Vercel (프론트) + Railway (백엔드) |

## 로컬 실행

### 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) → 프로젝트 생성
2. **SQL Editor** → `supabase/schema.sql` 내용 붙여넣기 → Run
3. **Settings → API** 에서 `URL`과 `anon/public key` 복사

### 2. 백엔드 환경변수 설정

```bash
cd backend
cp .env.example .env
# .env 파일에 SUPABASE_URL, SUPABASE_KEY 입력
```

### 3. 백엔드 실행

```bash
cd backend
npm install
npm run dev
# http://localhost:3001
```

### 4. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

## API 엔드포인트

| Method | URL | 설명 |
|--------|-----|------|
| GET | /api/opinions | 전체 의견 목록 |
| GET | /api/opinions/:id | 단일 의견 조회 |
| POST | /api/opinions | 의견 등록 |
| DELETE | /api/opinions/:id | 의견 삭제 |

## 배포 가이드

### 백엔드 → Railway

1. [railway.app](https://railway.app) → GitHub 저장소 연결
2. Root Directory: `backend`
3. **Variables** 탭에서 환경변수 추가:
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_KEY=eyJ...
   FRONTEND_URL=https://ir-opinion.vercel.app
   NODE_ENV=production
   ```
4. 배포 완료 후 도메인 메모

### 프론트엔드 → Vercel

1. [vercel.com](https://vercel.com) → GitHub 저장소 연결
2. Root Directory: `frontend`
3. 환경변수: `VITE_API_URL=https://[Railway URL]`
