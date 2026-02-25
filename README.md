# IR Opinion

IR(투자의견) 입력 및 조회 웹 애플리케이션

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| DB | SQLite (better-sqlite3) |
| 배포 | Vercel (프론트) + Railway (백엔드) |

## 로컬 실행

### 1. 백엔드

```bash
cd backend
npm install
npm run dev
# http://localhost:3001
```

### 2. 프론트엔드

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

1. [Railway](https://railway.app) 접속 후 GitHub 저장소 연결
2. Root Directory: `backend`
3. Start Command: `npm start`
4. 환경변수: `PORT=3001`, `NODE_ENV=production`
5. **중요**: Volumes 탭에서 `/app/data` 경로로 Persistent Disk 추가 (SQLite 영속성)

### 프론트엔드 → Vercel

1. [Vercel](https://vercel.com) 접속 후 GitHub 저장소 연결
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. 환경변수: `VITE_API_URL=https://your-railway-url.up.railway.app`
