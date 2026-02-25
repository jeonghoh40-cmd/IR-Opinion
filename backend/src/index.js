require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: Vercel 도메인 + 로컬 개발 허용
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS 차단: ${origin}`));
    }
  },
}));

app.use(express.json());

// 헬스 체크
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API 라우트
app.use('/api/auth', require('./routes/auth'));
app.use('/api/opinions', require('./routes/opinions'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/reviewers', require('./routes/reviewers'));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: '엔드포인트를 찾을 수 없습니다.' }));

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
});

app.listen(PORT, () => {
  console.log(`IR Opinion API 서버 실행 중: http://localhost:${PORT}`);
});
