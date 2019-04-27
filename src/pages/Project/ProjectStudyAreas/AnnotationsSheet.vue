<template>
  <div class="sheet">
    <!-- header -->
    <div class="sheet-header">
      <div class="row">
        <div class="col-10 no-padding-right">
          <small class="text-gray">共 {{ annotationsTotal }} 筆資料</small>
        </div>

        <div class="col-2 text-right no-padding-left">
          <a
            class="btn btn-icon"
            v-tooltip.top="'影像檢視'"
            :class="{ active: galleryShow }"
            @click="galleryShow = !galleryShow"
          >
            <i class="icon-gallery"></i>
          </a>
          <div class="divider"></div>
          <a
            class="btn btn-icon"
            v-tooltip.top="'版本紀錄'"
            :class="{ active: historyShow }"
            @click="historyShow = !historyShow"
          >
            <i class="icon-time-machine"></i>
          </a>
        </div>
      </div>
    </div>
    <!-- handsontable -->
    <hot-table
      id="sheeta"
      licenseKey="non-commercial-and-evaluation"
      language="zh-TW"
      :settings="HandsontableSetting"
    />
    <!-- Pagination -->
    <div class="sheet-footer">
      <div class="float-left">
        <small class="text-gray">單頁顯示</small>
        <small class="select">
          <select name="" id="" class="form-control" v-model="pageSize">
            <option :key="opt" :value="opt" v-for="opt in [10, 50, 100, 500]">{{
              opt
            }}</option>
          </select>
        </small>
        <small class="text-gray">筆資料，您正在檢視：</small>
      </div>
      <span>{{
        `第 ${Math.min(currentDataRange.begin, currentDataRange.end)} - ${
          currentDataRange.end
        } 筆`
      }}</span>
      <div class="float-right">
        <div class="input-group pager">
          <div class="input-group-prepend">
            <button @click="currentPage--" :disabled="currentPage === 1">
              <i class="fa fa-caret-left"></i>
            </button>
          </div>
          <input
            disabled
            type="text"
            class="form-control"
            :value="`${Math.min(currentPage, totalPage)}/${totalPage}`"
          />
          <div class="input-group-append">
            <button
              @click="currentPage++"
              :disabled="currentPage + 1 > totalPage"
            >
              <i class="fa fa-caret-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue';
import { createNamespacedHelpers } from 'vuex';

const annotations = createNamespacedHelpers('annotations');

export default {
  components: {
    HotTable,
  },
  data() {
    return {
      galleryShow: true,
      historyShow: true,
      currentPage: 1, //目前在第幾頁
      pageSize: 50, //一頁顯示的筆數
      HandsontableSetting: {
        height: 500,
        rowHeaders: true,
        colHeaders: [
          // 'URL',
          '<span style="color: red;">*</span>相機位置名稱',
          '架設日期',
          '<span style="color: red;">*</span>經度 (X)',
          '<span style="color: red;">*</span>緯度 (Y)',
          '海拔 (公尺)',
          '植被',
          '土地覆蓋類型',
        ],
        columns: [
          {
            data: 'name',
            type: 'text',
          },
          {
            data: 'settingTime',
            type: 'date',
            dateFormat: 'YYYY-MM-DD',
          },
          {
            data: 'longitude',
            type: 'numeric',
            validator: (value, callback) => {
              // 不能為空字串, 輸入只能是數字, 輸入要大於等於 0
              callback(value !== '' && !isNaN(Math.sign(value)) && value >= 0);
            },
          },
          {
            data: 'latitude',
            type: 'numeric',
            validator: (value, callback) => {
              // 不能為空字串, 輸入只能是數字, 輸入要大於等於 0
              callback(value !== '' && !isNaN(Math.sign(value)) && value >= 0);
            },
          },
          {
            data: 'altitude',
            type: 'numeric',
          },
          {
            data: 'vegetation',
            type: 'text',
          },
          {
            data: 'landCover',
            type: 'text',
          },
        ],
        data: [{ name: 'abc' }],
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.setSheetHeight();
      window.onresize = () => this.setSheetHeight();
    }, 500);
  },
  watch: {
    currentPage: function() {
      this.$emit('changePage', {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
    },
    pageSize: function() {
      this.$emit('changePage', {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
    },
    annotations: function(val) {
      this.HandsontableSetting.data = val;
    },
  },
  computed: {
    ...annotations.mapState(['annotationsTotal']),
    ...annotations.mapGetters(['annotations']),
    //計算目前筆數範圍
    currentDataRange() {
      const { currentPage, pageSize, annotationsTotal } = this;
      return {
        begin: (currentPage - 1) * pageSize + 1,
        end: Math.min(currentPage * pageSize, annotationsTotal),
      };
    },
    //計算最多總頁數
    totalPage() {
      return Math.ceil(this.annotationsTotal / this.pageSize);
    },
  },
  methods: {
    setSheetHeight() {
      const sheetHeight =
        window.innerHeight -
        document.querySelector('header').clientHeight -
        document.querySelector('.search-container').clientHeight -
        document.querySelector('.sheet-footer').clientHeight -
        document.querySelector('.sheet-header').clientHeight;

      this.HandsontableSetting.height = sheetHeight;
    },
  },
};
</script>
