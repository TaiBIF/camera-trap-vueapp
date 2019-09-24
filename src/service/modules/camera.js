import fetchWrap from '@/utils/fetch';

const getCameras = async () =>
  await fetchWrap({
    url: `/api/v1/cameras`,
    method: 'GET',
  });

export { getCameras };
