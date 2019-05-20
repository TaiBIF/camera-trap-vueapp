import fetchWrap from '@/utils/fetch';

const getUploadSessions = async () => {
  const res = await fetchWrap({
    url: '/api/v1/me/upload-sessions',
    method: 'GET',
  });
  return res;
};

export { getUploadSessions };
