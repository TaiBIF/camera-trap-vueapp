import fetchWrap from '@/utils/fetch';

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-project-areas
const getProjectAreas = async () => {
  const res = await fetchWrap({
    url: '/project-areas',
    method: 'GET',
  });
  return res;
};

export { getProjectAreas };
