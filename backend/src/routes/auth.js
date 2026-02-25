const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../db');

// 로그인
router.post('/login', async (req, res) => {
  const { reviewer_id, password } = req.body;
  if (!reviewer_id || !password) {
    return res.status(400).json({ success: false, message: '심사역과 암호를 입력해주세요.' });
  }

  const { data, error } = await supabase
    .from('reviewers')
    .select('id, name, password_hash')
    .eq('id', reviewer_id)
    .single();

  if (error || !data) {
    return res.status(404).json({ success: false, message: '심사역을 찾을 수 없습니다.' });
  }

  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid) {
    return res.status(401).json({ success: false, message: '암호가 올바르지 않습니다.' });
  }

  res.json({ success: true, data: { id: data.id, name: data.name } });
});

// 암호 변경
router.post('/change-password', async (req, res) => {
  const { reviewer_id, current_password, new_password } = req.body;

  if (!reviewer_id || !current_password || !new_password) {
    return res.status(400).json({ success: false, message: '모든 항목을 입력해주세요.' });
  }
  if (new_password.length < 4) {
    return res.status(400).json({ success: false, message: '새 암호는 4자 이상이어야 합니다.' });
  }

  const { data, error } = await supabase
    .from('reviewers')
    .select('id, name, password_hash')
    .eq('id', reviewer_id)
    .single();

  if (error || !data) {
    return res.status(404).json({ success: false, message: '심사역을 찾을 수 없습니다.' });
  }

  const valid = await bcrypt.compare(current_password, data.password_hash);
  if (!valid) {
    return res.status(401).json({ success: false, message: '현재 암호가 올바르지 않습니다.' });
  }

  const newHash = await bcrypt.hash(new_password, 10);
  const { error: updateError } = await supabase
    .from('reviewers')
    .update({ password_hash: newHash })
    .eq('id', reviewer_id);

  if (updateError) {
    return res.status(500).json({ success: false, message: '암호 변경에 실패했습니다.' });
  }

  res.json({ success: true, message: '암호가 변경되었습니다.' });
});

module.exports = router;
