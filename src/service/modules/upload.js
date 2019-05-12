import fetchWrap, { fetchUpload } from '@/utils/fetch';

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

export { uploadFile, createIssue };
