import { fetchUpload } from '@/utils/fetch';

const uploadCoverImage = async file => {
  const formData = new FormData();
  formData.append('file', file);

  const url = `/api/v1/files?type=project-cover-image`;
  const data = await fetchUpload({
    url,
    method: 'POST',
    body: formData,
  });
  return data;
};

export { uploadCoverImage };
