import fetchWrap from '@/utils/fetch';

const getUploadSessions = async () => {
  const res = await fetchWrap({
    url: '/api/v1/me/upload-sessions',
    method: 'GET',
  });
  return res;
};

// Overwrite the upload session
const postUploadSession = async (uploadSessionId, body) => {
  const url = `/api/v1/me/upload-sessions/${uploadSessionId}/_overwrite`;
  const res = await fetchWrap({
    url,
    method: 'POST',
    body,
  });
  return res;
};

// Cancel the upload session
const cancelUploadSession = async (uploadSessionId, body) => {
  const url = `/api/v1/me/upload-sessions/${uploadSessionId}/_cancel`;
  const res = await fetchWrap({
    url,
    method: 'POST',
    body,
  });
  return res;
};

export { getUploadSessions, postUploadSession, cancelUploadSession };
