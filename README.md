# camera-trap-vueapp

A proper implementation using Vue.js.

---

### lint 及 autoformat 規則

開發環境為 vscode 基本設定都加入在 `.vscode` 需安裝以下套件

- vetur
- prettier

### Develop

- run `npm run serve`

### Build

- run `npm run build`

### Folder Structure

```
|- assets             ... static files
|- components         ... common-use component
|- pages              ... page component for each route
|- router             ... vue-router
|- sass               ... style
|- service            ... api
|- store              ... vuex
|- utils              ... helper function
```

### Router

- path 與 header 連結對應
- path naming 採用 lower-case with dashes, component 採用 Camel-Case
- component naming 與 path 對應
- `1.1 登入(1.1.1, 1.1.3)`, `11.1 通知` 可整合在 header 中不需要獨立頁面

| Path            |              Children Path               |       Component       | Wireframe                                                                              |
| --------------- | :--------------------------------------: | :-------------------: | -------------------------------------------------------------------------------------- |
| /               |                                          |       Intro.vue       |
| /project        |                /overview                 |  ProjectOverview.vue  | 2.1 計畫總覽(2.1.1, 2.2.1)                                                             |
| /project        |                 /create                  |   ProjectCreate.vue   | 2.3 新增計畫(2.3.1, 2.3.2)                                                             |
| /project        |               /:projectId                |  ProjectProject.vue   | 2.4 計畫⾸頁(2.4 ~ 2.11, 9.1.1)                                                        |
| /project        |            /:projectId/basic             |   ProjectBasic.vue    | 3.1 計畫管理-基本資訊(3.1)                                                             |
| /project        |           /:projectId/setting            |  ProjectSetting.vue   | 3.2 計畫管理-編輯設定(3.2, 3.3.1, 9.1.2)                                               |
| /project        |            /:projectId/camera            |   ProjectCamera.vue   | 3.4 計畫管理-相機位置管理(3.4.1, 3.5)                                                  |
| /project        |            /:projectId/member            |   ProjectMember.vue   | 3.6 計畫管理-計畫成員(3.6)                                                             |
| /project        |           /:projectId/license            |  ProjectLicense.vue   | 3.7 計畫管理-創⽤ CC 授權(3.7.1)                                                       |
| /project        |   /:projectId/site/:siteId/:subsiteId    |    ProjectSite.vue    | 4.1 編輯資料(4.1.3, 4.2, 4.4.2 ~ 4.4.4, 4.14.1, 4.16.2, 4.17.1, 4.17.2,), 8.1 資料匯出 |
| /project        | /:projectId/site/:siteId/:subsiteId/edit |  ProjectSiteEdit.vue  | 4.3 編輯模式(4.3.2, 4.4.1, 4.6 ~ 4.13, 4.16.1, 4.17.3, 4.19, 4.20)                     |
| /project        |            /:projectId/upload            |   ProjectUpload.vue   | 5.1 檔案上傳(5.3.2, 5.3.3, 5.3.4, 5.4 ~ 5.8)                                           |
| /upload-history |                                          |   UploadHistory.vue   | 6.1 上傳紀錄(6.1.2, 6.2.1)                                                             |
| /download       |                 /search                  |  DownloadSearch.vue   | 7.1 資料搜尋(7.1.2 ~ 7.2.1)                                                            |
| /download       |                 /result                  |  DownloadResult.vue   | 7.2 搜尋結果(7.3.2, 7.3.3)                                                             |
| /download       |                /calculate                | DownloadCalculate.vue | 7.4 有效照片與⽬目擊事件(7.4.2, 7.4.3)                                                 |
| /setting        |                                          |      Setting.vue      | 10.1 帳號設定, 10.2 快速鍵設定(10.1.2)                                                 |
| /help           |                   /faq                   |      HelpFaq.vue      | 12.1 常⾒問題(12.1.2, 12.1.3, 12.1.4)                                                  |
| /help           |               /contact-us                |   HelpContactUs.vue   | 12.2 聯絡我們(12.2.2 ~ 12.2.5, 12.3)                                                   |
| /help           |                 /privacy                 |    HelpPrivacy.vue    | 12.4 隱私權注意事項(12.4.2)                                                            |

### Vuex
