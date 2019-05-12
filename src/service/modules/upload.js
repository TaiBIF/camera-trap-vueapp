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

const uploadAnnotation = async (cameraLocationId, file, signal) => {
  const formData = new FormData();
  formData.append('file', file);

  const url = `/api/v1/files?type=project-cover-image&cameraLocation=${cameraLocationId}`;
  const data = await fetchUpload({
    url,
    body: formData,
    signal,
  });
  return data;
};

export { uploadCoverImage, uploadAnnotation };
