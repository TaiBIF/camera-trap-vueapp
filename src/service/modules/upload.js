import { fetchUpload } from '@/utils/fetch';

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
