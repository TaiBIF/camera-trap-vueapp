import fetchWrap from '@/utils/fetch';

const getUploadSessions = async () => {
  return await fetchWrap({
    url: '/api/v1/me/upload-sessions',
    method: 'GET',
  });
};

// Upload sessions POST endpoints specify no request object.
// _overwrite http://bit.ly/2DMpjQR
// _cancel http://bit.ly/2IWj29k

// Overwrite the upload session
const postUploadSessionOverwritten = async id => {
  return await fetchWrap({
    url: `/api/v1/me/upload-sessions/${id}/_overwrite`,
    method: 'POST',
  });
};

// Cancel the upload session
const postUploadSessionCancelled = async id => {
  return await fetchWrap({
    url: `/api/v1/me/upload-sessions/${id}/_cancel`,
    method: 'POST',
  });
};

export {
  getUploadSessions,
  postUploadSessionOverwritten,
  postUploadSessionCancelled,
};
