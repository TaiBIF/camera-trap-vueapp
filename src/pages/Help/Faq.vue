<template>
  <div class="container page-article">
    <div class="row">
      <div class="col-2">
        <h1 class="text-green">常見問題</h1>
        <!-- 判斷 current tab -->
        <ul class="contact-list">
          <li :class="current == 0 ? 'active' : ''" @click="current = 0">
            <a>系統操作</a>
          </li>
          <li :class="current == 1 ? 'active' : ''" @click="current = 1">
            <a>帳號相關</a>
          </li>
          <li :class="current == 2 ? 'active' : ''" @click="current = 2">
            <a>計畫管理</a>
          </li>
          <!--
          <li
            :class="current==3 ? 'active' : ''"
            @click="current=3"
          >
            <a>檔案上傳</a>
          </li>
          <li
            :class="current==4 ? 'active' : ''"
            @click="current=4"
          >
            <a>資料編輯</a>
          </li>
          <li
            :class="current==5 ? 'active' : ''"
            @click="current=5"
          >
            <a>篩選及下載</a>
          </li>
          -->
        </ul>
        <div class="action text-center">
          <div class="mb-2">
            <small class="text-gray">仍需要協助嗎？</small>
          </div>
          <router-link to="/help/contact-us" class="btn btn-default">
            聯絡我們
          </router-link>
        </div>
      </div>
      <div class="col-10">
        <div class="panel panel-default mt-3">
          <div class="panel-heading">
            <h4>{{ faqList[current].name }}</h4>
          </div>
          <div class="panel-body p-0">
            <div class="accordion">
              <!-- Render QA list -->
              <div
                class="accordion-item"
                v-for="(accord, idx) in faqList[current].list"
                :key="`accord-${idx}`"
                :class="collapse == idx ? 'is-open' : ''"
              >
                <!-- Toggle collapse -->
                <div
                  class="accordion-heading"
                  @click="collapse = collapse == idx ? null : idx"
                >
                  <div class="icon">
                    <i class="icon-chevron-down"></i>
                  </div>
                  <h5>{{ accord.title }}</h5>
                </div>
                <div class="accordion-body" v-html="accord.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// FAQ 架構
const faq = [
  {
    name: '系統操作',
    list: [
      {
        title: '計畫管理員的權限？',
        content: '<p>相當於計畫主持人</p>',
      },
      /*
      {
        title: '如何更改權限？',
        content: '',
      },
      {
        title: '如何更改帳號設定？',
        content: '',
      },
      */
      {
        title: '為何無法順利登入？',
        content:
          '<p>可能原因：<br/> 瀏覽器不支援，請使用Google Chrome 或 Firefox。<br/> 瀏覽器版本未更新至最新版。</p>',
      },
      {
        title: '系統操作說明文件',
        content:
          '<a href="https://camera-trap-static.s3.ap-northeast-1.amazonaws.com/自動相機系統操作說明.pdf" target="_blank">自動相機系統操作說明文件</a>',
      },
      {
        title: '系統操作影片下載',
        content:
          '<ul><li><a href="https://camera-trap-static.s3-ap-northeast-1.amazonaws.com/video/1)%E7%B3%BB%E7%B5%B1%E8%A8%BB%E5%86%8A_%E7%99%BB%E5%85%A5%2B%E8%A8%88%E7%95%AB%E7%B8%BD%E8%A6%BD%EF%BC%8B%E5%B8%B3%E8%99%9F%E8%A8%AD%E5%AE%9A.mov" target="_blank">1) 系統註冊_登入+計畫總覽＋帳號設定</a></li><li><a href="https://camera-trap-static.s3-ap-northeast-1.amazonaws.com/video/2)%E6%96%B0%E5%A2%9E%E8%A8%88%E7%95%AB.mov" target="_blank">2) 新增計畫</a></li><li><a href="https://camera-trap-static.s3-ap-northeast-1.amazonaws.com/video/3)%E8%A8%88%E7%95%AB%E7%AE%A1%E7%90%861-+%E7%B7%A8%E8%BC%AF%E8%A8%AD%E5%AE%9A%2B%E7%9B%B8%E6%A9%9F%E4%BD%8D%E7%BD%AE%E7%AE%A1%E7%90%86.mov" target="_blank">3) 計畫管理1- 編輯設定+相機位置管理</a></li><li><a href="https://camera-trap-static.s3-ap-northeast-1.amazonaws.com/video/4)%E8%A8%88%E7%95%AB%E7%AE%A1%E7%90%862-+%E7%9B%B8%E6%A9%9F%E7%AE%A1%E7%90%86.mov" target="_blank">4) 計畫管理2- 相機管理</a></li><li><a href="https://camera-trap-static.s3-ap-northeast-1.amazonaws.com/video/5)%E8%A8%88%E7%95%AB%E7%AE%A1%E7%90%863-+%E8%A1%8C%E7%A8%8B%E7%AE%A1%E7%90%86.mov" target="_blank">5) 計畫管理3- 行程管理</a></li><li><a href="https://camera-trap-static.s3-ap-northeast-1.amazonaws.com/video/6)%E8%A8%88%E7%95%AB%E7%AE%A1%E7%90%864-+%E5%8A%A0%E5%85%A5%E8%A8%88%E7%95%AB%E6%88%90%E5%93%A1.mov" target="_blank">6) 計畫管理4- 加入計畫成員</a></li><li><a href="https://camera-trap-static.s3-ap-northeast-1.amazonaws.com/video/7)%E4%B8%8A%E5%82%B3%E6%AA%94%E6%A1%88.mov" target="_blank">7) 上傳檔案</a></li><li><a href="https://camera-trap-static.s3-ap-northeast-1.amazonaws.com/video/8)%E8%B3%87%E6%96%99%E7%B7%A8%E8%BC%AF.mov" target="_blank">8) 資料編輯</a></li><li><a href="https://camera-trap-static.s3-ap-northeast-1.amazonaws.com/video/9)%E8%A8%88%E7%95%AB%E9%A6%96%E9%A0%81%E7%80%8F%E8%A6%BD-+%E5%BD%B1%E5%83%8F%E5%9B%9E%E6%94%B6%2B%E7%89%A9%E7%A8%AE%E8%BE%A8%E8%AD%98%E6%A6%82%E6%B3%81%2BDarwin+Core%E4%B8%8B%E8%BC%89.mov" target="_blank">9) 計畫首頁瀏覽- 影像回收+物種辨識概況+Darwin Core下載</a></li><li><a href="https://camera-trap-static.s3-ap-northeast-1.amazonaws.com/video/10)%E7%AF%A9%E9%81%B8%E5%8F%8A%E8%A8%88%E7%AE%97.mov" target="_blank">10) 篩選及計算</a></li></ul>',
      },
    ],
  },
  {
    name: '帳號相關',
    list: [
      {
        title: '有那幾種登入方式？',
        content:
          '本平台僅能透過 ORCiD 帳號進行登入，若尚未註冊請先至 ORCiD 官網申請帳號。ORCiD 可使用 Google 或 Facebook 認證。',
      },
    ],
  },
  {
    name: '計畫管理',
    list: [
      {
        title: '新增計畫需要填寫哪些基本資訊？',
        content:
          '下列為必填之選項，可於新增計畫前先行檢視：<br/> 計畫名稱<br/> 計畫簡稱 (限4字)<br/> 委辦單位<br/> 計畫編號<br/> 主持人<br/> 計畫執行時間<br/> 創用CC授權許可 (分別針對詮釋資料、鑑定資訊、影像資料作授權，了解創用 CC 授權內容)<br/>計畫資料公開日期',
      },
    ],
  },
  /*
  {
    name: '檔案上傳',
    list: [
      {
        title: '',
        content: '',
      },
    ],
  },
  {
    name: '資料編輯',
    list: [
      {
        title: '',
        content: '',
      },
    ],
  },
  {
    name: '篩選及下載',
    list: [
      {
        title: '',
        content: '',
      },
    ],
  },
  */
];

export default {
  name: 'FAQ',
  data() {
    return {
      current: 0,
      collapse: 0,
      faqList: faq,
    };
  },
  watch: {
    current: 'changeSection',
  },
  methods: {
    changeSection() {
      this.collapse = 0;
    },
  },
};
</script>
