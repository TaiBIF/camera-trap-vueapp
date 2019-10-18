<template>
  <div class="sheet">
    <!-- header -->
    <div class="sheet-header">
      <div class="row">
        <div class="col-10 no-padding-right">
          <small class="text-gray">共 {{ annotationsTotal }} 筆資料</small>
          <div class="divider"></div>
        </div>
      </div>
    </div>
    <!-- handsontable -->
    <hot-table
      v-if="annotationsTotal"
      ref="sheet"
      id="sheet"
      licenseKey="non-commercial-and-evaluation"
      language="zh-TW"
      :settings="HandsontableSetting"
    />
    <!-- Pagination -->
    <div class="sheet-footer" v-if="annotationsTotal">
      <div class="float-left">
        <small class="text-gray">單頁顯示</small>
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
import { getLanguage } from '@/utils/i18n';

export default {
  components: {
    HotTable,
  },
  props: {
    dataFields: {
      type: Array,
      required: true,
    },
    annotations: {
      type: Array,
      default: () => {
        return [];
      },
      required: true,
    },
    annotationsTotal: {
      type: Number,
      default: 0,
      required: true,
    },
    currentAnnotationIdx: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      lang: getLanguage(),
      currentPage: 1, //目前在第幾頁
      pageSize: 500, //一頁顯示的筆數
      currentMouseButton: -1,
      HandsontableSetting: {
        height: 500,
        width: '100%',
        autoColumnSize: true,
        outsideClickDeselects: false,
        rowHeaders: true,
        colHeaders: [],
        columns: [],
        data: this.annotations,
        stretchH: 'all',
      },
    };
  },
  mounted() {
    this.setSheetHeader();
    this.setSheetColumn();
  },
  watch: {
    currentPage: function() {
      this.$emit('changePage', this.currentPage);
      this.continuousStartRow = undefined;
    },
    pageSize: function() {
      this.currentPage = 1;
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
    currentDataRange() {
      const { currentPage, pageSize, annotationsTotal } = this;
      return {
        begin: (currentPage - 1) * pageSize + 1,
        end: Math.min(currentPage * pageSize, annotationsTotal),
      };
    },
    totalPage() {
      return Math.ceil(this.annotationsTotal / this.pageSize);
    },
  },
  methods: {
    resetPagination(page = 0) {
      this.currentPage = page + 1;
    },
    setSheetHeader() {
      this.HandsontableSetting.colHeaders = [
        '樣區',
        '相機位置',
        '檔名',
        '時間',
        '物種',
        ...this.dataFields.map(v => v.title[this.lang]),
      ];
    },
    setSheetColumn() {
      const lang = getLanguage();
      this.HandsontableSetting.columns = [
        {
          data: 'studyArea',
          readOnly: true,
          renderer: function(instance, td, row, col, prop, value) {
            td.innerHTML = value.title[lang];
            return td;
          },
        },
        {
          data: 'cameraLocation',
          readOnly: true,
          renderer: function(instance, td, row, col, prop, value) {
            td.innerHTML = value.name;
            return td;
          },
        },
        {
          data: 'filename',
          readOnly: true,
        },
        {
          data: 'time',
          readOnly: true,
        },
        {
          data: 'species',
          renderer: function(instance, td, row, col, prop, value) {
            td.innerHTML = value[lang] || '';
            return td;
          },
        },
        ...this.dataFields.map(v => ({
          data: v.id,
          renderer: function(instance, td, row, col, prop, value) {
            td.innerHTML = value || '';
            return td;
          },
        })),
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.handsontable {
  td {
    white-space: nowrap;
  }
}

.sheet-footer {
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  padding: 0 20px;

  .pager {
    margin: 8px 20px 0 0;
    .input-group-prepend,
    .input-group-append {
      button {
        background: #fff;
        border: 1px solid #e1e3e5;
      }
    }

    input.form-control {
      font-size: 13px;
      width: 80px;
      height: 24px;
      text-align: center;
      outline: 0;
      &:focus {
        outline: 0;
        border-color: #6b6a6b;
      }
    }
  }
}
</style>
