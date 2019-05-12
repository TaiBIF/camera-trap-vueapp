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

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-me
const putMe = async ({ name, email, hotkeys }) => {
  const res = await fetchWrap({
    url: '/api/v1/me',
    method: 'PUT',
    body: {
      name,
      email,
      hotkeys,
    },
  });
  return res;
};

// https://cameratraptw.docs.apiary.io/#/reference/species/system-species/get-all-species/200?mc=reference%2Fspecies%2Fsystem-species%2Fget-all-species%2F200
const getAllSpecies = async () => {
  const res = await fetchWrap({
    url: '/api/v1/species',
    method: 'GET',
  });
  return res;
};

export { login, logout, getMe, putMe, getAllSpecies };
