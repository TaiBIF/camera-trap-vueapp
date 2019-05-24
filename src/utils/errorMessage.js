// https://github.com/TaiBIF/camera-trap-api/wiki/Status-Code-and-Error-Code
// TODO: define error message
const getErrorMessage = status => {
  switch (status) {
    case '400':
      return '操作失敗，資料內容有誤。';
    case '401':
      return '操作失敗，請先登入。';
    case '403':
      return '操作失敗，您的帳號無權限操作此步驟';
    default:
      return '操作失敗，請再試一次';
  }
};

export default getErrorMessage;
