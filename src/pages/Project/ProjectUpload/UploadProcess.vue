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
                <th width="25%">相機位置</th>
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

                    <a
                      v-if="file.uploadStatus === uploadStatus.uploadError"
                      @click="
                        showInfoModal = true;
                        uploadErrorType = 'other-error';
                        uploadErrorOtherText = file.errorMessage;
                      "
                      class="link text-danger text-underline"
                      >檢視錯誤</a
                    >
                    <a
                      v-if="file.uploadStatus === uploadStatus.success"
                      class="link text-green text-underline"
                      :href="
                        `/project/${projectId}/study-areas/${file.studyAreaId}`
                      "
                      >查看</a
                    >
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
                    <i class="icon icon-upload-success" /> 系統已收到檔案
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

    <info-modal
      v-if="!!showInfoModal"
      :open="!!showInfoModal"
      @close="showInfoModal = false"
    >
      <div v-if="uploadErrorType === 'file-error'">
        <div class="image">
          <img
            src="/assets/upinfo/file-error.png"
            width="221"
            srcset="/assets/upinfo/file-error@2x.png"
          />
        </div>
        <h1 class="text-green">
          上傳檔案內容與計畫設定不符
        </h1>
        <p class="text-gray">
          請確認資料檔案時間範圍、樣區、相機位置等資訊，是否符合計畫設定。
        </p>
      </div>
      <div v-else-if="uploadErrorType === 'column-error'">
        <div class="image">
          <img
            src="/assets/upinfo/column-error.png"
            width="221"
            srcset="/assets/upinfo/column-error@2x.png"
          />
        </div>
        <h1 class="text-green">
          資料欄位不合系統規定
        </h1>
        <p class="text-gray">
          請檢查資料欄位之名稱、格式及順序，是否符合欄位規範。詳細欄位規範請參考<a>欄位規範說明</a>。
        </p>
      </div>
      <div v-else-if="uploadErrorType === 'data-error'">
        <div class="image">
          <img
            src="/assets/upinfo/data-error.png"
            width="221"
            srcset="/assets/upinfo/data-error@2x.png"
          />
        </div>
        <h1 class="text-green">
          資料檔案與影像檔不對應
        </h1>
        <p class="text-gray">
          請檢查壓縮檔中的資料檔案與影像檔案是否為對應之檔案。詳細檔案規範請參考
          <a>上傳格式說明</a>。
        </p>
      </div>
      <div v-else-if="uploadErrorType === 'other-error'">
        <div class="image">
          <img
            src="/assets/common/error-img.png"
            width="221"
            srcset="/assets/common/error-img@2x.png"
          />
        </div>
        <h1 class="text-green">
          {{ uploadErrorOtherText }}
        </h1>
        <p class="text-gray"></p>
      </div>
    </info-modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import filesize from 'filesize';

import { uploadFileByCameraLocation } from '@/service';
import InfoModal from '@/components/Modal/InfoModal.vue';
import uploadStatus from '@/constant/uploadStatus.js';
const studyAreas = createNamespacedHelpers('studyAreas');

/* TODO(moogoo) 需確認錯誤訊息 (API 回傳跟前端顯示文字的對應)

  - Line: 69 要改uploadErrorType
  - need uploadSession 的 id ?

  ref: API (upload-session-error-type.js)

  lostExifTime: 'lost-exif-time', // 無法從 exif 中取得時間資訊
  inconsistentQuantity: 'inconsistent-quantity', // 圖片數量與 csv 的資料數量不一致
  imagesAndCsvNotMatch: 'images-and-csv-not-match', // 圖片與 csv 的資料不一致
  permissionDenied: 'permission-denied', // 沒有權限
  others: 'others', // 其他錯誤

  cjk: to merge and use /src/service/modules/upload.js

*/
export default {
  components: {
    InfoModal,
  },
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
      showInfoModal: false,
      uploadErrorType: '',
      uploadErrorOtherText: '',
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
            let retData = await uploadFileByCameraLocation(
              file.cameraLocationId,
              file,
              this.currentFetchController.signal,
            );
            if (retData.message) {
              this.setFileType(
                index,
                uploadStatus.uploadError,
                retData.message,
              );
            } else {
              this.setFileType(index, uploadStatus.success);
            }
          } catch (error) {
            if (file.uploadStatus !== uploadStatus.cancel) {
              // 不是主動取消才要改變狀態
              this.setFileType(index, uploadStatus.uploadError, error);
            }
          }
        }
      }
    },
    doCancel(targetIdx) {
      this.setFileType(targetIdx, uploadStatus.cancel);
      this.currentFetchController.abort();
    },
    setFileType(targetIdx, status, errorMessage) {
      this.$emit(
        'change',
        this.fileList.map((file, idx) => {
          if (idx === Number(targetIdx)) {
            file.uploadStatus = status;
            if (errorMessage) {
              file.errorMessage = errorMessage;
            }
          }
          return file;
        }),
      );
    },
    setFileErrorMessage(targetIdx, errorMessage) {
      this.$emit(
        'change',
        this.fileList.map((file, idx) => {
          if (idx === Number(targetIdx)) {
            file.errorMessage = errorMessage;
          }
          return file;
        }),
      );
    },
  },
};
</script>
