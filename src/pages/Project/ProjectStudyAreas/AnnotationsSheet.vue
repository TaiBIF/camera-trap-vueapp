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
            @click="$emit('galleryShow', !galleryShow)"
          >
            <i class="icon-gallery"></i>
          </a>
          <div class="divider"></div>
          <a
            class="btn btn-icon"
            v-tooltip.top="'版本紀錄'"
            :class="{ active: historyShow }"
            @click="$emit('historyShow', !historyShow)"
          >
            <i class="icon-time-machine"></i>
          </a>
        </div>
      </div>
    </div>
    <!-- handsontable -->
    <hot-table
      ref="sheet"
      id="sheet"
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
import * as R from 'ramda';

import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper.js';
import { getLanguage } from '@/utils/i18n';
import SpeciesTooltip, { failures } from '@/constant/SpeciesTooltip.js';

import 'handsontable-key-value';

const annotations = createNamespacedHelpers('annotations');
const projects = createNamespacedHelpers('projects');
const dataFields = createNamespacedHelpers('dataFields');
const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  components: {
    HotTable,
  },
  props: {
    isEdit: {
      type: Boolean,
      required: true,
    },
    galleryShow: {
      type: Boolean,
      required: true,
    },
    historyShow: {
      type: Boolean,
      required: true,
    },
    currentAnnotationIdx: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      currentPage: 1, //目前在第幾頁
      pageSize: 50, //一頁顯示的筆數
      HandsontableSetting: {
        height: 500,
        outsideClickDeselects: false,
        rowHeaders: true,
        colHeaders: [],
        columns: [],
        data: [],
        afterSelectionEnd: this.changeAnnotationIdx,
        afterChange: this.changeAnnotation,
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.setSheetHeight();
      this.setSheetHeader();
      this.setSheetColumn();
      window.onresize = () => this.setSheetHeight();
    }, 500);
  },
  watch: {
    isEdit: function() {
      this.setSheetHeight();
      this.setSheetColumn();
    },
    currentPage: function() {
      this.$emit('changePage', {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
    },
    pageSize: function() {
      this.currentPage = 1;
      this.$emit('changePage', {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
    },
    annotations: function(val) {
      this.HandsontableSetting.data = val.map(v => ({
        id: v.id,
        studyArea: v.studyArea,
        cameraLocation: v.cameraLocation,
        filename: v.filename,
        time: v.time,
        species: v.species.title,
        ...v.fields.reduce((pre, current) => {
          pre[current.dataField] = current.value;
          return pre;
        }, {}),
      }));
    },
    currentAnnotationIdx: function(val) {
      // 改變時要修改選擇 row，例如右側影像檢視切換成下一張時
      const { hotInstance } = this.$refs.sheet;
      const selected = hotInstance.getSelected();

      // 如果外部設定的不是目前表單所選擇的則要改變選擇的 row
      if (!!selected && selected[0][2] !== val) {
        hotInstance.selectRows(val);
      }
    },
    projectDataFields: function() {
      this.setSheetHeader();
      this.setSheetColumn();
    },
  },
  computed: {
    ...annotations.mapState(['annotationsTotal']),
    ...annotations.mapGetters(['annotations']),
    ...dataFields.mapGetters(['dataFields']),
    ...projects.mapGetters(['projectDataFields', 'projectSpecies']),
    ...studyAreas.mapState(['cameraLocations']),
    ...studyAreas.mapGetters(['studyAreaTitle']),
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
    ...annotations.mapActions(['setAnnotations']),
    setSheetHeight() {
      const sheetHeight =
        window.innerHeight -
        document.querySelector('header').clientHeight -
        document.querySelector('.search-container').clientHeight -
        document.querySelector('.sheet-footer').clientHeight -
        document.querySelector('.sheet-header').clientHeight;

      this.HandsontableSetting.height = sheetHeight;
    },
    changeAnnotationIdx(row, column, row2) {
      this.$emit('currentAnnotationIdx', row2);
    },
    setSpeciesTooltip(instance, td, row, col, prop, title) {
      const resetTd = td => {
        td.innerHTML = '';
        delete td.dataset.tooltip;
        td.className = '';
      };

      resetTd(td); // td 會共用，所以每次都要重置

      if (title) {
        // sp 有多種取得來源
        // 1. 一般呈現使用 annotations
        // 2. 如果有編輯則使用 projectSpecies
        // 3. 使用者自己輸入的物種名稱，全新不存在於計畫預設物種
        const sp = this.annotations[row].species.title
          ? this.annotations[row].species // #1 來源
          : R.find(R.propEq('title', title), this.projectSpecies); // #2 來源

        if (sp) {
          // 如果 sp 存在才要用一般方式判斷
          td.innerHTML = sp.title;

          if (sp.code) {
            // 如果有 code 則要顯示物種提示
            td.dataset.tooltip = SpeciesTooltip[sp.code];
          } else if (this.annotations[row].failures.length > 0) {
            // 如果有錯誤則要顯示錯誤提示
            if (this.annotations[row].failures.includes('new-species')) {
              td.dataset.tooltip = failures['new-species'];
            }
            td.innerHTML += '<span class="alert-box">!</span>';
            td.className = 'htInvalid';
          }
        } else {
          // 如果 sp 不存在則表示是 #3 來源，則不須任何判斷直接顯示物種 title
          td.innerHTML = title;
        }
      }

      return td;
    },
    // 除了必填的 header 以外還會有其他不同的自定義欄位
    setSheetHeader() {
      this.HandsontableSetting.colHeaders = this.projectDataFields.map(
        v => v.title,
      );
    },
    // 設定每個 column 要如何顯示
    setSheetColumn() {
      const defaultColumn = [
        {
          data: 'studyArea',
          readOnly: true,
          renderer: (instance, td, row, col, prop, value) => {
            td.innerHTML = this.studyAreaTitle(value);
            return td;
          },
        },
        {
          data: 'cameraLocation',
          readOnly: true,
          renderer: (instance, td, row, col, prop, value) => {
            td.innerHTML = R.find(
              R.propEq('id', value),
              this.cameraLocations,
            ).name;
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
          renderer: (instance, td, row, col, prop, value) => {
            td.innerHTML = dateFormatYYYYMMDDHHmmss(value);
            return td;
          },
        },
        {
          data: 'species',
          readOnly: !this.isEdit,
          renderer: this.setSpeciesTooltip,
          ...(this.isEdit
            ? {
                type: 'autocomplete',
                source: this.projectSpecies.map(({ title }) => title),
                strict: false,
                trimDropdown: false,
              }
            : {}),
        },
      ];

      const CustomizationColumn = this.projectDataFields
        .slice(defaultColumn.length)
        .map(v => {
          let obj = {};
          switch (v.widgetType) {
            case 'text':
              obj = {
                renderer: (instance, td, row, col, prop, value) => {
                  td.innerHTML = value || '';
                  return td;
                },
              };
              break;
            case 'time':
              obj = {
                renderer: (instance, td, row, col, prop, value) => {
                  td.innerHTML = value ? dateFormatYYYYMMDDHHmmss(value) : '';
                  return td;
                },
              };
              break;
            case 'select':
              obj = {
                type: 'key-value',
                filter: false,
                source: v.options.map(v => ({
                  id: v.id,
                  value: v[getLanguage()],
                })),
                keyProperty: 'id',
                valueProperty: 'value',
              };
              break;
          }
          return {
            data: v.id,
            readOnly: !this.isEdit,
            ...obj,
          };
        });

      this.HandsontableSetting.columns = [
        ...defaultColumn,
        ...CustomizationColumn,
      ];
    },
    changeAnnotation(changes) {
      if (!!changes && this.isEdit === true) {
        changes.forEach(({ 0: row, 1: prop, 3: newVal }) => {
          let annotation = {
            fields: R.clone(this.annotations[row].fields),
            speciesTitle:
              prop === 'species' ? newVal : this.annotations[row].species.title,
          };

          if (prop !== 'species') {
            const targetIdx = R.findIndex(R.propEq('dataField', prop))(
              annotation.fields,
            );

            if (targetIdx === -1) {
              // 不存在就新增
              annotation.fields.push({
                dataField: prop,
                value: newVal,
              });
            } else {
              // 存在則修改
              annotation.fields[targetIdx].value = newVal;
            }
          }

          // fields 內的資料如果 value 不存在要過濾，不然後端會錯誤
          annotation.fields = annotation.fields.filter(v => !!v.value);

          this.setAnnotations({
            annotationId: this.annotations[row].id,
            body: annotation,
          });
        });
      }
    },
  },
};
</script>
