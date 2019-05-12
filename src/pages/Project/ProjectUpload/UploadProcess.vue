<template>
  <div class="col-12 px-0">
    <h1 class="text-green">檔案上傳</h1>

    <div class="upload-list-container">
      <div class="row mx-0">
        <div class="col-12 px-0">
          <table class="table" id="upload-list">
            <thead>
              <tr>
                <th width="25%">檔案名稱</th>
                <th>檔案大小</th>
                <th>樣區</th>
                <th width="25%">樣點</th>
                <th width="25%">上傳進度</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(file, idx) in fileList" :key="file.upload.uuid">
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
                <td>
                  <div class="float-right">
                    <a
                      v-if="
                        file.uploadStatus === uploadStatus.waiting ||
                          file.uploadStatus === uploadStatus.uploading
                      "
                      class="link text-underline text-muted"
                      @click="doCancel(idx)"
                    >
                      取消
                    </a>

                    <!-- <a
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
                    > -->
                  </div>
                  <div
                    v-if="file.uploadStatus === uploadStatus.waiting"
                    style="color: #AAAAAA"
                  >
                    <i
                      class="icon far fa-circle"
                      style="color: #AAAAAA"
                    />等待上傳
                  </div>
                  <div v-if="file.uploadStatus === uploadStatus.uploading">
                    <i
                      class="text-green icon fas fa-circle-notch fa-spin"
                      style="font-size: 25px"
                    />上傳中
                  </div>
                  <div v-if="file.uploadStatus === uploadStatus.success">
                    <i class="icon icon-upload-success" /> 上傳成功
                  </div>
                  <div v-if="file.uploadStatus === uploadStatus.uploadError">
                    <i class="icon icon-upload-fail" /> 上傳失敗
                  </div>
                  <div v-if="file.uploadStatus === uploadStatus.cancel">
                    已取消上傳
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import filesize from 'filesize';

import { uploadAnnotation } from '@/service';
import uploadStatus from '@/constant/uploadStatus.js';

const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  props: {
    fileList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      uploadStatus,
      currentFetchController: undefined,
    };
  },
  mounted() {
    this.doUpload();
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreaTitle']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    formatFilesize(size) {
      return filesize(size);
    },
    async doUpload() {
      for (const index in this.fileList) {
        const file = this.fileList[index];
        if (file.uploadStatus !== uploadStatus.cancel) {
          this.setFileType(index, uploadStatus.uploading);
          try {
            this.currentFetchController = new AbortController();
            await uploadAnnotation(
              file.cameraLocationId,
              file,
              this.currentFetchController.signal,
            );
            this.setFileType(index, uploadStatus.success);
          } catch (error) {
            if (file.uploadStatus !== uploadStatus.cancel) {
              // 不是主動取消才要改變狀態
              this.setFileType(index, uploadStatus.uploadError);
            }
          }
        }
      }
    },
    doCancel(targetIdx) {
      this.setFileType(targetIdx, uploadStatus.cancel);
      this.currentFetchController.abort();
    },
    setFileType(targetIdx, status) {
      this.$emit(
        'change',
        this.fileList.map((file, idx) => {
          if (idx === Number(targetIdx)) {
            file.uploadStatus = status;
          }
          return file;
        }),
      );
    },
  },
};
</script>
