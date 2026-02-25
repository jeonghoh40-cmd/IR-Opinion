const express = require('express');
const router = express.Router();
const supabase = require('../db');

// 전체 목록 조회 (최신순)
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('opinions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data });
});

// 단일 조회
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('opinions')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ success: false, message: '의견을 찾을 수 없습니다.' });
  res.json({ success: true, data });
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

  const { data, error } = await supabase
    .from('opinions')
    .insert([{
      company_name,
      stock_code,
      opinion_type,
      target_price: target_price ? Number(target_price) : null,
      current_price: current_price ? Number(current_price) : null,
      analyst: analyst || null,
      content,
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.status(201).json({ success: true, data });
});

// 삭제
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('opinions')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, message: '삭제되었습니다.' });
});

module.exports = router;
