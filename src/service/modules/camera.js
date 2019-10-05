import fetchWrap from '@/utils/fetch';

const getCameras = async (filters = '') =>
  await fetchWrap({
    url: `/api/v1/cameras${filters}`,
    method: 'GET',
  });

const getCameraType = async (type, filters = '') =>
  await fetchWrap({
    url: `/api/v1/cameras-${type}${filters}`,
    method: 'GET',
  });

export { getCameras, getCameraType };
