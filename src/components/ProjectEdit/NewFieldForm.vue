<template>
  <div class="modal fade in">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">申請新增欄位</h4>
        </div>
        <div class="modal-body">
          <p>
            為了幫助後續的資料使用，Camera Trap
            平台統一計畫內的欄位規則，讓所有用戶都能參照相同規則填入資訊。若預設欄位中沒有您需要的欄位項目，請您填入以下資訊並送出申請，本平台會盡快審核再通知您。
          </p>
          <form class="form form-horizontal">
            <div class="form-group row">
              <label for="label" class="col-3 px-0 text-right required"
                >欄位名稱：</label
              >
              <div class="col-8">
                <input
                  id="label"
                  type="text"
                  v-model="form.title"
                  class="form-control"
                  placeholder="請填寫欄位名稱"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="columnType" class="col-3 px-0 text-right required"
                >欄位形式：</label
              >
              <div class="col-8">
                <v-select
                  id="columnType"
                  :clearable="false"
                  v-model="form.widgetType"
                  :options="options"
                  @input="switchType"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="format" class="col-3 px-0 text-right required"
                >輸入格式：</label
              >
              <div class="col-8 input-group-inline" v-if="form.widgetType">
                <input
                  v-if="form.widgetType.value === 'text'"
                  id="format"
                  class="form-control"
                  v-model="form.description"
                  placeholder="請填寫輸入格式"
                />
                <input
                  v-if="form.widgetType.value === 'time'"
                  id="format"
                  class="form-control"
                  v-model="form.description"
                  disabled
                />
                <v-select
                  v-if="form.widgetType.value === 'select'"
                  id="format"
                  class="full-width-select hide-autocomplete"
                  :class="isSelectOptionsMissing ? 'is-invalid' : ''"
                  v-model="form.options"
                  :options="[]"
                  multiple
                  taggable
                  ref="select"
                />
              </div>
              <div class="col-1 pl-0">
                <span
                  v-if="
                    form.widgetType.value === 'text' ||
                      form.widgetType.value === 'time'
                  "
                  class="btn btn-text px-0"
                  v-tooltip.right="{
                    content: '您可以規範此欄位的內容格式，以供後續使用者參考',
                  }"
                >
                  <i class="icon-info"></i>
                </span>
                <span
                  v-if="form.widgetType.value === 'select'"
                  class="btn btn-text px-0"
                  v-tooltip.right="{
                    content:
                      '請鍵入下拉選單選項，選項內容鍵入完畢後請按下enter鍵，繼續輸入下個選項',
                  }"
                >
                  <i class="icon-info"></i>
                </span>
              </div>
            </div>
            <div class="form-group row">
              <label for="note" class="col-3 px-0 text-right">備註：</label>
              <div class="col-8 input-group-inline">
                <textarea
                  id="note"
                  v-model="form.note"
                  cols="30"
                  rows="3"
                  class="form-control"
                  placeholder="請輸入備註內容"
                ></textarea>
              </div>
              <div class="col-1 pl-0">
                <span
                  class="btn btn-text px-0"
                  v-tooltip.right="{
                    content:
                      '您可以簡易的向管理員說明此次新增的需求，或任何需要補充說明的內容，作為管理員審核參考',
                  }"
                >
                  <i class="icon-info"></i>
                </span>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer text-right">
          <div
            class="error-message inline float-left"
            v-if="isSelectOptionsMissing"
          >
            <span class="alert-box"></span>
            <span class="text">您尚未建立選單項目</span>
          </div>
          <a @click="$emit('close')" class="btn btn-default">取消</a>
          <button
            @click="submit()"
            class="btn btn-orange"
            :disabled="!canSubmit"
          >
            送出申請
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select';

import DataFieldEnum from '@/constant/DataFieldEnum.js';

export default {
  components: {
    vSelect,
  },
  data() {
    return {
      error: false,
      form: {
        title: '',
        description: '',
        widgetType: {
          value: '',
        },
        options: null,
        note: '',
      },
    };
  },
  computed: {
    options() {
      return Object.entries(DataFieldEnum).map(([value, label]) => ({
        value,
        label,
      }));
    },
    isSelectOptionsMissing() {
      return (
        this.form.widgetType.value === 'select' &&
        this.form.options.length === 0
      );
    },
    canSubmit() {
      return (
        !this.isSelectOptionsMissing &&
        !!this.form.title &&
        !!this.form.widgetType.value &&
        (this.form.widgetType.value === 'select'
          ? !!this.form.options
          : !!this.form.description)
      );
    },
  },
  watch: {
    // re-focus to select after click enter
    'form.options': function() {
      if (this.form.widgetType.value === 'select' && this.$refs.select) {
        this.$refs.select.$el.querySelector('input').focus();
      }
    },
  },
  methods: {
    switchType() {
      this.form.options = undefined;
      this.form.description = undefined;

      switch (this.form.widgetType.value) {
        case 'text':
          this.form.description = '';
          break;
        case 'select':
          this.form.options = [];
          break;
        case 'time':
          this.form.description = 'YYYY-MM-DD hh:mm';
          break;
        default:
          this.form.options = undefined;
      }
    },
    submit() {
      this.$emit('submit', {
        title: this.form.title,
        widgetType: this.form.widgetType.value,
        note: this.form.note,
        ...(this.form.widgetType.value === 'select'
          ? { options: this.form.options }
          : { description: this.form.description }),
      });
    },
  },
};
</script>
