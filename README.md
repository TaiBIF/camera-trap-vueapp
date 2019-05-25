# camera-trap-vueapp

A proper implementation using Vue.js.

---

### How to start

clone repo

```
git clone git@github.com:TaiBIF/camera-trap-vueapp.git
```

npm install

```
install packages
```

create `.env.local` file

```
VUE_APP_BASE_URL=http://localhost:8888
VUE_APP_API_URL=http://xxx
```

start local dev server

```
npm run serve
```

### lint 及 autoformat 規則

開發環境為 vscode 基本設定都加入在 `.vscode` 需安裝以下套件

- vetur
- prettier

### Develop

- run `npm run serve` to start local dev server
- run `npm run storybook` to check current components  
  reference: https://storybook.js.org/docs/guides/guide-vue/

### Build

- run `npm run build`

### Folder Structure

```
|- public               ... public file (e.g. html, image)
|- src/
  |- assets             ... static files
  |- components         ... common-use component
  |- constant           ... constants
  |- pages              ... page component for each route
  |- prose              ... markdown file to display static info (e.g. privacy policy)
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

| Path                                                   | Page Component                         | Wireframe                                                                |
| ------------------------------------------------------ | :------------------------------------- | ------------------------------------------------------------------------ |
| /                                                      | Intro.vue                              |
| /project/overview                                      | Project/Overview.vue                   | 2.1 計畫總覽(2.1.1, 2.2.1)                                               |
| /project/create                                        | Project/Create.vue                     | 2.3 新增計畫(2.3.1, 2.3.2)                                               |
| /project/:projectId/info/(video,species)/:areaId/:type | Project/ProjectInfo.vue                | 2.4 計畫⾸頁(2.4 ~ 2.11, 9.1.1)                                          |
| /project/:projectId/edit/basic                         | Project/EditProject/Basic.vue          | 3.1 計畫管理-基本資訊(3.1)                                               |
| /project/:projectId/edit/setting                       | Project/EditProject/Setting.vue        | 3.2 計畫管理-編輯設定(3.2, 3.3.1, 9.1.2)                                 |
| /project/:projectId/edit/camera-location               | Project/EditProject/CameraLocation.vue | 3.4 計畫管理-相機位置管理(3.4.1, 3.5)                                    |
| /project/:projectId/edit/member                        | Project/EditProject/Member.vue         | 3.6 計畫管理-計畫成員(3.6)                                               |
| /project/:projectId/edit/license                       | Project/EditProject/License.vue        | 3.7 計畫管理-創⽤ CC 授權(3.7.1)                                         |
| /project/:projectId/study-areas/:studyAreaId           | Project/ProjectStudyAreas              | 4.1 編輯資料(4.1.3, 4.2, 4.4.2 ~ 4.4.4, 4.14.1, 4.16.2, 4.17.1, 4.17.2,) |
| /project/:projectId/study-areas/:studyAreaId           | Project/ProjectStudyAreas              | 4.3 編輯模式(4.3.2, 4.4.1, 4.6 ~ 4.13, 4.16.1, 4.17.3, 4.19, 4.20)       |
| /project/:projectId/study-areas/:studyAreaId           | Project/ProjectStudyAreas              | 8.1 資料匯出                                                             |
| /project/:projectId/upload                             | Project/ProjectUpload                  | 5.1 檔案上傳(5.3.2, 5.3.3, 5.3.4, 5.4 ~ 5.8)                             |
| /upload-history                                        | UploadHistory.vue                      | 6.1 上傳紀錄(6.1.2, 6.2.1)                                               |
| /download/search                                       | Download/Search.vue                    | 7.1 資料搜尋(7.1.2 ~ 7.2.1)                                              |
| /download/result                                       | Download/Result.vue                    | 7.2 搜尋結果(7.3.2, 7.3.3)                                               |
| /download/calculate                                    | Download/Calculate.vue                 | 7.4 有效照片與⽬目擊事件(7.4.2, 7.4.3)                                   |
| /setting                                               | Setting.vue                            | 10.1 帳號設定, 10.2 快速鍵設定(10.1.2)                                   |
| /help/faq                                              | Help/Faq.vue                           | 12.1 常⾒問題(12.1.2, 12.1.3, 12.1.4)                                    |
| /help/contact-us                                       | Help/ContactUs.vue                     | 12.2 聯絡我們(12.2.2 ~ 12.2.5, 12.3)                                     |
| /help/privacy                                          | Help/Privacy.vue                       | 12.4 隱私權注意事項(12.4.2)                                              |

### Vuex
