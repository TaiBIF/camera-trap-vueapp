/**
 * https://github.com/TaiBIF/camera-trap-api/wiki/role-permission
 *
 * by account
 * https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-me
 * administrator (系統管理員)
 * general-account (一般使用者, 權限依計畫內 role 設定)
 *
 * by project
 * https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#payload-6
 * manager (計畫管理員)
 * researcher (計畫研究員)
 * executor (計畫執行者)
 */

const projectManagerRoles = ['manager'];

/**
 * @param {string} role
 * @return {bool}
 */
export const isAllowManageProject = role => {
  if (!role) {
    return false;
  }

  return projectManagerRoles.includes(role);
};

/**
 * @param {string} role
 * @return {bool}
 */
export const isAllowAddColumns = role => {
  if (!role) {
    return false;
  }

  return projectManagerRoles.includes(role);
};
