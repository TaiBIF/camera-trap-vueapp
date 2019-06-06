<template>
  <div v-if="!!project">
    <form class="form form-horizontal">
      <div class="panel">
        <div class="panel-heading">
          <h4>計畫基本資訊</h4>
        </div>
        <div class="panel-body">
          <div class="form-group row">
            <label for="project-title" class="col-2 required">計畫名稱：</label>
            <div class="col-4">
              <input
                type="text"
                placeholder="請輸入計畫名稱"
                id="project-title"
                name="project_title"
                class="form-control"
                v-validate="'required'"
                v-model="project.title"
                :class="{ 'is-invalid': errors.has('project_title') }"
              />
              <span
                v-show="errors.has('project_title')"
                class="invalid-feedback"
              >
                計畫名稱不能留空
              </span>
            </div>
          </div>
          <div class="form-group row">
            <label for="project-shortTitle" class="col-2 required"
              >計畫簡稱：</label
            >
            <div class="col-4">
              <input
                type="text"
                id="project-shortTitle"
                name="project_shortTitle"
                placeholder="請輸入計畫簡稱 (限4字)"
                class="form-control"
                v-validate="'required|max:4'"
                v-model="project.shortTitle"
                :class="{ 'is-invalid': errors.has('project_shortTitle') }"
              />
              <span
                v-show="errors.has('project_shortTitle')"
                class="invalid-feedback"
              >
                計畫簡稱不能留空並且最多限 4 字
              </span>
            </div>
            <div class="col-6 pl-0">
              <span
                class="btn btn-text px-0"
                v-tooltip.right="{
                  content:
                    '計畫簡稱為做日後系統顯示之用，您可以輸入任何有助你辨別計畫的文字',
                }"
              >
                <i class="fa fa-info-circle text-green"></i>
              </span>
            </div>
          </div>
          <div class="form-group row">
            <label for="project-funder" class="col-2 required"
              >委辦單位：</label
            >
            <div class="col-4">
              <input
                type="text"
                id="project-funder"
                name="project_funder"
                v-model="project.funder"
                placeholder="請輸入委辦單位"
                class="form-control"
                v-validate="'required'"
                :class="{ 'is-invalid': errors.has('project_funder') }"
              />
              <span
                v-show="errors.has('project_funder')"
                class="invalid-feedback"
              >
                委辦單位不能留空
              </span>
            </div>
          </div>
          <div class="form-group row">
            <label for="project-code" class="col-2 required">計畫編號：</label>
            <div class="col-4">
              <input
                type="text"
                id="project-code"
                name="project_code"
                v-validate="'required'"
                v-model="project.code"
                placeholder="請輸入計畫編號"
                class="form-control"
                :class="{ 'is-invalid': errors.has('project_code') }"
              />
              <span
                v-show="errors.has('project_code')"
                class="invalid-feedback"
              >
                計畫編號不能留空
              </span>
            </div>
          </div>
          <div class="form-group row">
            <label for="project-name" class="col-2 required"
              >計畫主持人：</label
            >
            <div class="col-4">
              <input
                type="text"
                id="principal-investigator"
                name="principalInvestigator"
                v-validate="'required'"
                v-model="project.principalInvestigator"
                placeholder="請輸入計畫主持人"
                class="form-control"
                :class="{ 'is-invalid': errors.has('principalInvestigator') }"
              />
              <span
                v-show="errors.has('principalInvestigator')"
                class="invalid-feedback"
              >
                計畫主持人不能留空
              </span>
            </div>
          </div>
          <div class="form-group row">
            <label for="project-name" class="col-2 required">計畫時間：</label>
            <div class="col-4">
              <div
                class="input-group-wrapper"
                :class="{
                  'is-invalid':
                    errors.has('project_start') || errors.has('project_end'),
                }"
              >
                <div
                  class="input-group"
                  :class="{ 'is-invalid': errors.has('project_start') }"
                >
                  <date-picker
                    :format="'YYYY-MM-DD'"
                    :first-day-of-week="1"
                    :value="formatTime(project.startTime)"
                    @change="setProjectTime('startTime', $event)"
                  />
                  <div class="input-group-append">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
                <div class="input-text">到</div>
                <div
                  class="input-group"
                  :class="{ 'is-invalid': errors.has('project_end') }"
                >
                  <date-picker
                    :not-before="project.startTime"
                    :format="'YYYY-MM-DD'"
                    :first-day-of-week="1"
                    :value="formatTime(project.endTime)"
                    @change="setProjectTime('endTime', $event)"
                  ></date-picker>
                  <div class="input-group-append">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
                <input
                  type="hidden"
                  id="project_start"
                  name="project_start"
                  v-validate="'required'"
                  v-model="project.startTime"
                />
                <input
                  type="hidden"
                  id="project_end"
                  name="project_end"
                  v-validate="'required'"
                  v-model="project.endTime"
                />
              </div>
              <span
                v-show="
                  errors.has('project_start') || errors.has('project_end')
                "
                class="invalid-feedback"
              >
                計畫時間不能留空
              </span>
            </div>
          </div>
          <div class="form-group row">
            <label for="project-name" class="col-2">計畫地區：</label>
            <div class="col-4">
              <div class="select">
                <v-select
                  v-model="project.areas"
                  :options="areas"
                  label="title"
                  multiple
                ></v-select>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="project-name" class="col-2">計畫摘要：</label>
            <div class="col-6">
              <textarea
                v-model="project.description"
                class="form-control"
                placeholder="請簡單描述計畫目的"
              ></textarea>
            </div>
          </div>
          <div class="form-group row">
            <label for="project-name" class="col-2">備註：</label>
            <div class="col-6">
              <textarea
                v-model="project.note"
                class="form-control"
                placeholder="您可以輸入任何補註資料"
              ></textarea>
            </div>
          </div>
          <div class="form-group row">
            <label for="project-name" class="col-2">計畫封面：</label>
            <div class="col-4">
              <input type="hidden" v-model="project.cover" />
              <label class="btn btn-default btn-upload">
                <input type="file" id="upload" @change="uploadCover" />
                <span class="text">選擇檔案</span>
              </label>
              <div class="note">
                <small class="text-gray">
                  您可以為計畫添加封面，理想尺寸是 373 x 180 像素 (.jpg, .png)
                  ，檔案上限為 2 MB。
                </small>
              </div>
              <div class="preview" v-if="isUploadTypeError">
                請使用 jpg 或 png 檔
              </div>
              <div class="preview" v-else-if="isUploadSizeError">
                檔案上限為 2 MB
              </div>
              <div class="preview" v-else-if="previewImg !== null">
                <div class="image">
                  <img :src="previewImg.src" />
                </div>
                <div class="content">
                  {{ previewImg.name }}
                </div>
                <div class="action">
                  <div class="btn btn-text" @click="removePreview()">
                    <i class="fa fa-times"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ActionBtns
        @cancel="handleClickCancel"
        @submit="doDone"
        :status="status"
        :error="error"
        :submitBtnContext="doneBtnText"
      />
    </form>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import moment from 'moment';
import vSelect from 'vue-select';

import { uploadCoverImage } from '@/service';
import ActionBtns from '@/components/ActionBtns/ActionBtns.vue';

export default {
  data() {
    return {
      previewImg: null,
    };
  },
  components: {
    vSelect,
    DatePicker,
    ActionBtns,
  },
  props: {
    project: Object,
    areas: {
      type: Array,
      default: () => [],
    },
    status: {
      type: Number,
      default: undefined,
    },
    error: {
      type: Object,
      default: undefined,
    },
    doneBtnText: {
      type: String,
      default: '儲存設定',
    },
  },
  computed: {
    projectId: function() {
      return this.$route.params.projectId;
    },
    isUploadTypeError() {
      if (!this.previewImg) {
        return false;
      }
      if (
        this.previewImg.type === 'image/jpeg' ||
        this.previewImg.type === 'image/png'
      ) {
        return false;
      }
      return true;
    },
    isUploadSizeError() {
      if (!this.previewImg) {
        return false;
      }
      if (this.previewImg.fileSizeMb < 2) {
        return false;
      }
      return true;
    },
  },
  methods: {
    handleClickCancel() {
      if (this.projectId) {
        this.$router.push({
          name: 'projectInfo',
          params: {
            projectId: this.projectId,
          },
        });
      } else {
        this.$router.push({ name: 'projectOverview' });
      }
    },
    async uploadCover(e) {
      if (e.target.files && e.target.files[0]) {
        let reader = new FileReader();
        const file = e.target.files[0];

        reader.onload = e => {
          this.previewImg = {
            src: e.target.result,
            name: file.name,
            type: file.type,
            file: file,
            fileSizeMb: file.size / 1024 / 1024,
          };
        };

        reader.readAsDataURL(file);
      }

      const data = await uploadCoverImage(e.target.files[0]);
      this.changeProps('coverImageFile', data.id);
    },
    removePreview() {
      this.previewImg = null;
      this.changeProps('coverImageFile', undefined);
    },
    formatTime(v) {
      return moment(v).format('YYYY-MM-DD');
    },
    setProjectTime(key, t) {
      this.changeProps(key, moment(t).toISOString());
    },
    changeProps(key, value) {
      this.$emit('change', Object.assign({}, this.project, { [key]: value }));
    },
    doDone() {
      if (this.isUploadTypeError || this.isUploadSizeError) {
        return false;
      }
      this.$validator.validateAll().then(result => {
        if (result) this.$emit('done');
        else return false;
      });
    },
  },
};
</script>
