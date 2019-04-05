import { fetchUpload } from '@/utils/fetch';

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-files
const uploadFile = async (type, body) => {
  const url = `/api/v1/files?type=${type}`;
  const data = await fetchUpload({
    url,
    method: 'POST',
    body,
  });
  return data;
};

export { uploadFile };
