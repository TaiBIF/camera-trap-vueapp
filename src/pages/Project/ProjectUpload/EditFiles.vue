<template>
  <div class="col-12 px-0">
    <h1 class="text-green">檔案上傳</h1>
    <div class="row">
      <div
        class="col-9"
        :class="{ 'col-12': isUploading, 'pr-0': !isUploading }"
      >
        <vue-dropzone
          id="dropzone"
          style="display: inline-block"
          :include-styling="false"
          :options="{
            url: 'localhost',
            acceptedFiles: uploadAccept,
            autoProcessQueue: false,
            previewsContainer: false,
          }"
          :useCustomSlot="true"
          @vdropzone-files-added="addFiles($event)"
        >
          <label class="btn btn-upload">
            <span class="icon">
              <i class="icon-add-green" />
            </span>
            <span class="text">新增上傳檔案</span>
          </label>
        </vue-dropzone>

        <div class="message is-alert" v-if="overTotalLimited">
          <div class="alert-box float-left">!</div>
          <div class="text">
            全部上傳的檔案已超過上限 5GB，建議您可以分次上傳
          </div>
        </div>

        <div class="float-right" v-if="!isUploading">
          <div class="checkbox checkbox-inline mb-0 mt-2">
            <input
              type="checkbox"
              name="select-all"
              id="select-all"
              value="1"
              :checked="selectedFileList.length === fileList.length"
              @change="selectAll"
            />
            <label for="select-all">全選檔案</label>
          </div>
          <span v-if="selectedFileList.length > 0">
            <span> | </span>
            <span class="btn btn-text text-gray">
              <span class="icon">
                <i class="icon-trash" />
              </span>
              <span
                class="text"
                v-if="selectedFileList.length === fileList.length"
                @click="removeFiles"
              >
                移除全部檔案
              </span>
              <span v-else class="text" @click="removeFiles">
                移除選取的檔案
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>

    <div class="upload-list-container">
      <div class="row mx-0">
        <div class="col-9 px-0" :class="{ 'col-12': isUploading }">
          <table class="table" id="upload-list">
            <thead>
              <tr>
                <th :width="!isUploading ? '40%' : '25%'">檔案名稱</th>
                <th>檔案大小</th>
                <th>樣區</th>
                <th width="25%">樣點</th>
                <th width="25%" v-if="isUploading">上傳進度</th>
              </tr>
            </thead>
            <tbody>
              <tr
                :class="{
                  'is-selected': selectedFileList.includes(file.upload.uuid),
                }"
                v-for="file in fileList"
                :key="file.upload.uuid"
                @click="selectRow(file.upload.uuid)"
              >
                <td>
                  <span
                    class="icon"
                    v-if="'image/jpeg,image/png'.includes(file.type)"
                    ><i class="icon-photo"></i
                  ></span>
                  <span class="icon" v-if="file.type === 'text/csv'"
                    ><i class="icon-csv"></i
                  ></span>
                  <span class="icon" v-if="file.type === 'application/zip'"
                    ><i class="icon-zip"></i
                  ></span>
                  <span class="icon" v-if="file.type === 'folder'"
                    ><i class="icon-folder"></i
                  ></span>
                  <span class="text">{{ file.name }}</span>
                </td>
                <td>
                  {{ formatFilesize(file.size) }}
                  <span v-if="overSingleLimited(file.size)">
                    <span class="alert-box">!</span>
                    <span style="color: #D80C37">超過上限 2GB</span>
                  </span>
                </td>
                <td>{{ studyAreaTitle(file.studyAreaId) }}</td>
                <td>
                  <span class="text">{{ file.cameraLocationName }}</span>
                  <span class="action">
                    <a class="del icon">
                      <i
                        class="icon-trash"
                        @click="removeFile(file.upload.uuid)"
                      />
                    </a>
                  </span>
                </td>
                <!-- <td v-if="isUploading">
                  <div class="float-right">
                    <a
                      v-if="file.state === 0 || file.state === 1"
                      class="link text-underline text-muted"
                      >取消</a
                    >

                    <a
                      v-if="file.state === -1"
                      class="link text-danger text-underline"
                      >錯誤：{{ file.errorMessage }}</a
                    >
                    <a
                      v-if="file.state === 1 || file.state === 2"
                      :href="
                        `/index.html#/project/${$route.params.projectId}/site/${
                          fileList[f_id].site
                        }/${fileList[f_id].subsite}?camera=${
                          fileList[f_id].fullCameraLocationMd5
                        }&upload_session_id=${uploadSessions[f_id]}`
                      "
                      class="link text-green text-underline"
                      >查看</a
                    >
                  </div>
                  <div
                    :id="`upload-progress-${f_id}`"
                    class="upload-progress"
                    :class="{ 'd-none': file.state == 2 || file.state == -1 }"
                  ></div>
                  <div v-if="file.state === -1">
                    <i class="icon icon-upload-fail"></i> 上傳失敗
                  </div>
                  <div v-if="file.state === 2">
                    <i class="icon icon-upload-success"></i> 上傳完成
                  </div>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-3" v-if="!isUploading">
          <p class="text-center" v-if="!selectedFileList.length > 0">
            請選擇並編輯上傳檔案
          </p>
          <form class="form" v-else>
            <p class="text-center">
              選擇並編輯上傳檔案 ({{ selectedFileList.length }} /
              {{ fileList.length }})
            </p>
            <div class="form-group">
              <label class="required">樣區：</label>
              <v-select
                :options="siteOptions"
                label="title"
                v-model="currentSite"
                @input="setStudyArea"
                placeholder="請選擇檔案所屬樣區"
              />
            </div>
            <div class="form-group" v-if="subSiteOptions.length > 0">
              <label class="required">子樣區：</label>
              <v-select
                :options="subSiteOptions"
                label="title"
                @input="setStudyArea"
                placeholder="請選擇檔案所屬子樣區"
                resetOnOptionsChange
              />
            </div>
            <div v-if="doFetch">
              <div class="form-group" v-if="cameraOptions.length > 0">
                <label class="required">相機位置：</label>
                <v-select
                  :options="cameraOptions"
                  label="name"
                  @input="setCamera"
                  placeholder="請選擇檔案所屬相機位置"
                  resetOnOptionsChange
                />
              </div>
              <div v-else>
                此樣區尚無相機位置，
                <router-link
                  :to="{
                    name: 'projectCameraLocation',
                    params: {
                      projectId: $route.params.projectId,
                    },
                  }"
                  >建立一個新的？</router-link
                >
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="action text-center">
      <p class="text-orange">請為每個檔案都編輯「樣區」和「相機位置」</p>
      <button class="btn btn-orange" :disabled="!canUpload">
        <span class="icon"><i class="icon-upload"></i></span>
        <span class="text"
          >開始上傳 <span v-if="canUpload">({{ fileList.length }})</span></span
        >
      </button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import VueDropzone from 'vue2-dropzone';
import filesize from 'filesize';
import idx from 'idx';
import vSelect from 'vue-select';
import * as R from 'ramda';

import uploadAccept from '@/constant/uploadAccept.js';

const studyAreas = createNamespacedHelpers('studyAreas');
const TOTAL_LIMITED = 1024 * 1024 * 1024 * 5; // 5g
const SINGLE_LIMITED = 1024 * 1024 * 1024 * 2; // 2g

export default {
  components: {
    vSelect,
    VueDropzone,
  },
  props: {
    isUploading: {
      type: Boolean,
      default: false,
    },
    fileList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      uploadAccept,
      selectedFileList: [], // 對應 fileList 的 _.upload.uuid
      currentSite: undefined,
      doFetch: false, // 紀錄是否有請求取得相機位置用來判斷是沒有相機位置還是還沒送請求
    };
  },
  watch: {
    selectedFileList: function() {
      this.currentSite = undefined;
    },
    currentSite: function() {
      this.resetCameraLocations();
      this.doFetch = false;
    },
  },
  computed: {
    ...studyAreas.mapGetters([
      'studyAreas',
      'cameraLocations',
      'studyAreaTitle',
    ]),
    projectId: function() {
      return this.$route.params.projectId;
    },
    siteOptions() {
      return this.studyAreas;
    },
    subSiteOptions() {
      return idx(this.currentSite, _ => _.children) || [];
    },
    cameraOptions() {
      return this.cameraLocations;
    },
    canUpload() {
      return this.fileList.every(file => file.cameraLocationId);
    },
    overTotalLimited() {
      return (
        this.fileList.reduce((pre, current) => {
          pre += current.size;
          return pre;
        }, 0) > TOTAL_LIMITED
      );
    },
  },
  methods: {
    ...studyAreas.mapActions(['getProjectCameraLocations']),
    ...studyAreas.mapMutations(['resetCameraLocations']),
    overSingleLimited(size) {
      return size > SINGLE_LIMITED;
    },
    selectAll(e) {
      this.selectedFileList = e.target.checked
        ? this.fileList.map(v => v.upload.uuid)
        : [];
    },
    removeFiles() {
      // 刪除所有選取的檔案
      this.$emit(
        'change',
        this.fileList.filter(
          ({ upload: { uuid } }) => !this.selectedFileList.includes(uuid),
        ),
      );
      this.selectedFileList = [];
    },
    removeFile(targetId) {
      // 刪除指定檔案
      this.$emit(
        'change',
        this.fileList.filter(({ upload: { uuid } }) => uuid !== targetId),
      );
    },
    selectRow(uuid) {
      const idx = this.selectedFileList.indexOf(uuid);
      if (idx !== -1) {
        this.selectedFileList.splice(idx, 1);
      } else {
        this.selectedFileList.push(uuid);
      }
    },
    async setStudyArea(val) {
      // 當前選擇的樣區有以下情況就要去取得相機位置
      // 1. val.children.length === 0，這表示樣區只有一層
      // 2. val.children.length === undefined，這表示已經是子樣區了
      if (!idx(val, _ => _.children.length)) {
        await this.getProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: val.id,
        });
        this.doFetch = true;
      }
    },
    setCamera(val) {
      this.$emit(
        'change',
        this.fileList.map(file => {
          if (this.selectedFileList.includes(file.upload.uuid)) {
            file.studyAreaId = val.studyArea;
            file.cameraLocationId = val.id;
            file.cameraLocationName = val.name;
          }

          return file;
        }),
      );
    },
    formatFilesize(size) {
      return filesize(size);
    },
    addFiles(files) {
      this.$emit('change', R.concat(this.fileList, [...files]));
    },
  },
};
</script>
