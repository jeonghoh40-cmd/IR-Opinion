const express = require('express');
const router = express.Router();
const { db } = require('../db');

// 전체 목록 조회 (최신순)
router.get('/', async (req, res) => {
  try {
    await db.read();
    const sorted = [...db.data.opinions].sort((a, b) => b.id - a.id);
    res.json({ success: true, data: sorted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 단일 조회
router.get('/:id', async (req, res) => {
  try {
    await db.read();
    const op = db.data.opinions.find((o) => o.id === Number(req.params.id));
    if (!op) return res.status(404).json({ success: false, message: '의견을 찾을 수 없습니다.' });
    res.json({ success: true, data: op });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 등록
router.post('/', async (req, res) => {
  const { company_name, stock_code, opinion_type, target_price, current_price, analyst, content } = req.body;

  if (!company_name || !stock_code || !opinion_type || !content) {
    return res.status(400).json({ success: false, message: '필수 항목 누락 (회사명, 종목코드, 투자의견, 내용)' });
  }
  if (!['Buy', 'Hold', 'Sell'].includes(opinion_type)) {
    return res.status(400).json({ success: false, message: '투자의견은 Buy / Hold / Sell 중 하나여야 합니다.' });
  }

  try {
    await db.read();
    const newOp = {
      id: db.data.nextId++,
      company_name,
      stock_code,
      opinion_type,
      target_price: target_price ? Number(target_price) : null,
      current_price: current_price ? Number(current_price) : null,
      analyst: analyst || null,
      content,
      created_at: new Date().toISOString(),
    };
    db.data.opinions.push(newOp);
    await db.write();
    res.status(201).json({ success: true, data: newOp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 삭제
router.delete('/:id', async (req, res) => {
  try {
    await db.read();
    const idx = db.data.opinions.findIndex((o) => o.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: '의견을 찾을 수 없습니다.' });
    db.data.opinions.splice(idx, 1);
    await db.write();
    res.json({ success: true, message: '삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
