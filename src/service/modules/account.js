import fetchWrap from '@/utils/fetch';

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-config
const login = async () => {
  const res = await fetchWrap({
    url: '/api/v1/config',
    method: 'GET',
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-logout
const logout = async () => {
  const res = await fetchWrap({
    url: '/api/v1/logout',
    method: 'POST',
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-me
const getMe = async () => {
  const res = await fetchWrap({
    url: '/api/v1/me',
    method: 'GET',
  });
  return res;
};

export { login, logout, getMe };
