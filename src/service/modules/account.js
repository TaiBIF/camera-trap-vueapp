import fetchWrap from '@/utils/fetch';

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-config
const login = async () => {
  const res = await fetchWrap({
    url: '/config',
    method: 'GET',
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-logout
const logout = async () => {
  const res = await fetchWrap({
    url: '/logout',
    method: 'POST',
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-me
const getMe = async () => {
  const res = await fetchWrap({
    url: '/me',
    method: 'GET',
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-me
const putMe = async ({ name, email }) => {
  const res = await fetchWrap({
    url: '/me',
    method: 'PUT',
    body: {
      name,
      email,
    },
  });
  return res;
};

export { login, logout, getMe, putMe };
