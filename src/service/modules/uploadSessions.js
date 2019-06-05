import fetchWrap from '@/utils/fetch';

const getUploadSessions = async () => {
  const res = await fetchWrap({
    url: '/api/v1/me/upload-sessions',
    method: 'GET',
  });
  return res;
};

// Overwrite the upload session
const overwriteUploadSession = async (
  uploadSessionId,
  id,
  state,
  project,
  cameraLocation,
  file,
  createTime,
) => {
  const url = `/api/v1/me/upload-sessions/${uploadSessionId}/_overwrite`;
  const res = await fetchWrap({
    url,
    method: 'POST',
    body: {
      id,
      state,
      project,
      cameraLocation,
      file,
      createTime,
    },
  });
  return res;
};

// Cancel the upload session
const cancelUploadSession = async (
  uploadSessionId,
  id,
  state,
  project,
  cameraLocation,
  file,
  createTime,
) => {
  const url = `/api/v1/me/upload-sessions/${uploadSessionId}/_cancel`;
  const res = await fetchWrap({
    url,
    method: 'POST',
    body: {
      id,
      state,
      project,
      cameraLocation,
      file,
      createTime,
    },
  });
  return res;
};

export { getUploadSessions, overwriteUploadSession, cancelUploadSession };
