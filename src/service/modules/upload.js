import moment from 'moment';
import queryString from 'query-string';

import fetchWrap, { fetchUpload } from '@/utils/fetch';

const getAnnotationQuery = file => {
  let annotationType = '';

  if (file.type === 'text/csv') {
    annotationType = 'annotation-csv';
  } else if (file.type === 'application/zip') {
    annotationType = 'annotation-zip';
  } else if ('image/jpeg,image/png'.includes(file.type)) {
    annotationType = 'annotation-image';
  } else if (
    'video/quicktime,video/mp4,video/mpeg,video/avi'.includes(file.type)
  ) {
    annotationType = 'annotation-video';
  }

  if (annotationType === '') {
    throw 'no annotation-type (not support)';
  }

  return {
    type: annotationType,
    lastModified:
      annotationType === 'annotation-video'
        ? moment(file.lastModified).toISOString()
        : undefined,
  };
};

const uploadIssueAttachment = async file => {
  const formData = new FormData();
  formData.append('file', file);

  const url = `/api/v1/files?type=issue-attachment`;
  const data = await fetchUpload({
    url,
    method: 'POST',
    body: formData,
  });
  return data;
};

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

const uploadFileByCameraLocation = async (cameraLocationId, file, signal) => {
  const formData = new FormData();
  formData.append('file', file);

  const query = queryString.stringify({
    cameraLocation: cameraLocationId,
    ...getAnnotationQuery(file),
  });

  const url = `/api/v1/files?${query}`;
  const data = await fetchUpload({
    url,
    body: formData,
    signal,
  });
  return data;
};

const uploadFileByAnnotation = async (annotationId, file, signal) => {
  const formData = new FormData();
  formData.append('file', file);

  const query = queryString.stringify(getAnnotationQuery(file));

  const url = `/api/v1/annotations/${annotationId}/file?${query}`;
  const data = await fetchUpload({
    url,
    body: formData,
    signal,
  });
  return data;
};

/**
 * https://cameratraptw.docs.apiary.io/#/reference/issues/create-an-issue/create-an-issue/200?mc=reference%2Fissues%2Fcreate-an-issue%2Fcreate-an-issue%2F200
 * @param {string} type 問題回報 issue, 意見反饋 suggestion
 * @param {array} categories
 *  系統操作 system, 帳號相關 account, 計畫管理 project-management, 檔案上傳 file-upload,
 *  資料編輯 data-edit, 篩選及下載 search-and-download, 其他問題 others
 * @param {string} description 問題描述
 * @param {string} attachmentFile 附件檔案上傳id
 */
const createIssue = async ({
  type,
  categories,
  description,
  email,
  attachmentFile,
}) => {
  const body = {
    type,
    categories,
    description,
    email,
  };
  if (attachmentFile) {
    body.attachmentFile = attachmentFile;
  }

  const data = await fetchWrap({
    url: '/api/v1/issues',
    method: 'POST',
    body,
  });
  return data;
};

export {
  uploadIssueAttachment,
  uploadCoverImage,
  uploadFileByCameraLocation,
  uploadFileByAnnotation,
  createIssue,
};
