// Define all response messages for end-user
const getResponseMessage = status => {
  switch (status) {
    case '400':
      return { code: 400, msg: '操作失敗，資料內容有誤。' };
    case '401':
      return { code: 401, msg: '操作失敗，請先登入。' };
    case '403':
      return { code: 403, msg: '操作失敗，您的帳號無權限操作此步驟' };
    case '200':
      return { code: 200, msg: '設定儲存成功' };
    default:
      return { code: null, msg: '操作失敗，請再試一次' };
  }
};

export default getResponseMessage;
