const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const fs = require('fs');

// Railway persistent disk: /app/data, 로컬: ./data
const dataDir = process.env.DB_DIR || path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'ir_opinions.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, { opinions: [], nextId: 1 });

// 초기화 (읽기)
async function initDb() {
  await db.read();
  // 파일이 없었다면 기본값 적용
  db.data ||= { opinions: [], nextId: 1 };
  await db.write();
}

module.exports = { db, initDb };
