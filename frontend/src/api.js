// 배포 환경에서는 VITE_API_URL 환경변수 사용, 로컬은 vite proxy로 /api 그대로 사용
const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || '요청 실패');
  return json.data;
}

export const api = {
  getAll: () => request('/opinions'),
  getOne: (id) => request(`/opinions/${id}`),
  create: (body) => request('/opinions', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id) => request(`/opinions/${id}`, { method: 'DELETE' }),
  getCompanies: () => request('/companies'),
  getReviewers: () => request('/reviewers'),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  changePassword: (body) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),
};
