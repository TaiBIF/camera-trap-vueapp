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
              <tr v-for="file in fileList" :key="file.upload.uuid">
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
                  <!-- <div class="float-right">
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
                  </div> -->
                  <div
                    v-if="file.uploadStatus === uploadStatus.waiting"
                    style="color: #AAAAAA"
                  >
                    等待上傳
                  </div>
                  <div v-if="file.uploadStatus === uploadStatus.uploading">
                    上傳中
                  </div>
                  <div v-if="file.uploadStatus === uploadStatus.success">
                    <i class="icon icon-upload-success"></i> 上傳成功
                  </div>
                  <div v-if="file.uploadStatus === uploadStatus.uploadError">
                    <i class="icon icon-upload-fail"></i> 上傳失敗
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
        this.setFileType(index, uploadStatus.uploading);
        const file = this.fileList[index];
        try {
          await uploadAnnotation(file.cameraLocationId, file);
          this.setFileType(index, uploadStatus.success);
        } catch (error) {
          this.setFileType(index, uploadStatus.uploadError);
        }
      }
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
