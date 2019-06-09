import fetchWrap from '@/utils/fetch';

const getUploadSessions = async () => {
  const res = await fetchWrap({
    url: '/api/v1/me/upload-sessions',
    method: 'GET',
  });
  return res;
};

// Overwrite the upload session
const postUploadSessionOverwritten = async (id, body) => {
  const res = await fetchWrap({
    url: `/api/v1/me/upload-sessions/${id}/_overwrite`,
    method: 'POST',
    body,
  });
  return res;
};

// Cancel the upload session
const postUploadSessionCancelled = async (id, body) => {
  const res = await fetchWrap({
    url: `/api/v1/me/upload-sessions/${id}/_cancel`,
    method: 'POST',
    body,
  });
  return res;
};

export {
  getUploadSessions,
  postUploadSessionOverwritten,
  postUploadSessionCancelled,
};
