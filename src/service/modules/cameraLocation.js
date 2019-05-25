import fetchWrap from '@/utils/fetch';

const getCameraLocation = async id =>
  await fetchWrap({
    url: `/api/v1/camera-locations/${id}`,
    method: 'GET',
  });

export { getCameraLocation };
