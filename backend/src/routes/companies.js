const express = require('express');
const router = express.Router();
const supabase = require('../db');

// 회사 목록
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name')
    .order('sort_order', { ascending: true });

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data });
});

module.exports = router;
