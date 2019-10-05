<template>
  <div class="container" v-bind:class="{ loading: isLoading }">
    <h1 class="text-green">上傳紀錄</h1>
    <table class="table history">
      <thead>
        <tr>
          <th class="nowrap" width="180px">上傳時間</th>
          <th class="nowrap">檔案名稱</th>
          <th class="nowrap" width="120px">所屬計畫</th>
          <th class="nowrap">樣區</th>
          <th class="nowrap">相機位置</th>
          <th class="nowrap">上傳結果</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in uploadSessions.items" :key="`${row.id}`">
          <td>{{ dateFormatYYYYMMDDHHmmss(row.createTime) }}</td>
          <td>
            <span class="icon" v-if="row.file.type === 'annotation-image'">
              <i class="icon-photo"></i>
            </span>
            <span class="icon" v-if="row.file.type === 'annotation-csv'">
              <i class="icon-csv"></i>
            </span>
            <span class="icon" v-if="row.file.type === 'annotation-zip'">
              <i class="icon-zip"></i>
            </span>
            <span
              class="icon"
              v-if="
                [
                  'annotation-csv',
                  'annotation-zip',
                  'annotation-image',
                ].indexOf(row.file.type) < 0
              "
            >
              <i class="icon-folder"></i>
            </span>
            <span class="text"
              >{{ row.file.originalFilename }}<br />FileId:
              {{ row.file.id }}</span
            >
          </td>
          <td>
            {{ row.project ? row.project.shortTitle : '計畫已不存在' }}
          </td>
          <td>
            {{
              row.cameraLocation
                ? row.cameraLocation.studyArea.title['zh-TW']
                : '相機位置已不存在'
            }}
          </td>
          <td>
            {{
              row.cameraLocation ? row.cameraLocation.name : '相機位置已不存在'
            }}
          </td>
          <td style="white-space: nowrap;">
            <div v-if="row.state === 'success'" class="float-left">
              <span class="icon"><i class="icon-upload-success"></i></span>
              <span class="text">上傳成功</span>
            </div>
            <div v-if="row.state === 'processing'" class="float-left">
              <span class="icon"></span>
              <span class="text">處理中</span>
            </div>
            <div v-if="row.state === 'failure'" class="float-left">
              <span class="icon"><i class="icon-upload-fail"></i></span>
              <span class="text">上傳失敗</span>
            </div>
            <div v-if="row.state === 'wait-for-review'" class="float-left">
              <span class="icon"
                ><i
                  class="fas fa-exclamation-circle"
                  style="font-size: 24px; color: #f1c40f;"
                ></i
              ></span>
              <span class="text">資料有重覆，您要？</span>
            </div>
            <div v-if="row.state === 'cancel'" class="float-left">
              <span class="icon"><i class="icon-upload-success"></i></span>
              <span class="text">取消上傳</span>
            </div>
          </td>
          <td>
            <div
              v-if="
                (row.state === 'success' || row.state === 'cancel') &&
                  row.file.type !== 'annotation-csv'
              "
            >
              <a
                v-if="row.project"
                :href="
                  `/project/${row.project.id}/study-areas/${
                    row.cameraLocation.studyArea.id
                  }`
                "
                class="link"
                target="_blank"
              >
                查看
              </a>
            </div>
            <div
              v-if="
                (row.state === 'success' || row.state === 'cancel') &&
                  row.file.type === 'annotation-csv'
              "
            >
              <a
                :href="`/project/${row.project.id}/upload`"
                class="link"
                target="_blank"
              >
                補上傳影像檔
              </a>
            </div>
            <div v-if="row.state === 'failure'">
              <a
                class="link"
                @click="
                  showInfoModal = true;
                  errorType = row.errorType;
                  errorMessage = row.errorMessage;
                "
              >
                檢視錯誤</a
              >
            </div>
            <div
              v-if="row.state === 'wait-for-review'"
              style="white-space: nowrap;"
            >
              <a class="link" @click.prevent="overwriteUploadSession(row.id)">
                覆蓋
              </a>
              |
              <a class="link" @click.prevent="cancelUploadSession(row.id)"
                >取消
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="col-12 pt-3">
      <router-view :setLoading="setLoading" />
    </div>

    <info-modal
      v-if="!!showInfoModal"
      :open="!!showInfoModal"
      @close="showInfoModal = false"
    >
      <img
        src="/assets/common/error-img.png"
        width="221"
        srcset="/assets/common/error-img@2x.png"
      />
      <h1 class="text-green">
        上傳錯誤訊息
      </h1>
      <p class="text-gray">
        <span v-if="errorType === 'lost-exif-time'">
          無法從 exif 中取得時間資訊
        </span>
        <span v-else-if="errorType === 'inconsistent-quantity'">
          圖片數量與 csv 的資料數量不一致
        </span>
        <span v-else-if="errorType === 'images-and-csv-not-match'">
          圖片與 csv 的資料不一致
        </span>
        <span v-else-if="errorType === 'permission-denied'">
          沒有權限
        </span>
        <span v-else-if="errorType === 'missing-fields-study-area'">
          缺少樣區或子樣區欄位
        </span>
        <span v-else-if="errorType === 'missing-fields-camera-location'">
          有多筆相機位置
        </span>
        <span v-else-if="errorType === 'missing-fields'">
          缺少欄位: {{ errorMessage }}
        </span>
        <span v-else-if="errorType === 'others'">
          其他錯誤
        </span>
      </p></info-modal
    >
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper.js';
import InfoModal from '@/components/Modal/InfoModal.vue';

const uploadSessions = createNamespacedHelpers('uploadSessions');

export default {
  components: {
    InfoModal,
  },
  data() {
    return {
      showInfoModal: false,
      errorType: '',
      errorMessage: '',
      error: undefined,
      isLoading: false,
    };
  },
  mounted() {
    this.getUploadSessions();
  },
  computed: {
    ...uploadSessions.mapState(['uploadSessions']),
  },
  methods: {
    ...uploadSessions.mapActions([
      'getUploadSessions',
      'postUploadSessionOverwritten',
      'postUploadSessionCancelled',
    ]),
    dateFormatYYYYMMDDHHmmss(dateString) {
      return dateFormatYYYYMMDDHHmmss(dateString);
    },
    async overwriteUploadSession(id) {
      this.setLoading(true);
      try {
        await this.postUploadSessionOverwritten({ id });
        this.getUploadSessions();
      } catch (e) {
        this.error = e;
      }
      this.setLoading(false);
    },
    async cancelUploadSession(id) {
      this.setLoading(true);
      try {
        await this.postUploadSessionCancelled({ id });
        this.getUploadSessions();
      } catch (e) {
        this.error = e;
      }
      this.setLoading(false);
    },
    setLoading(v) {
      this.isLoading = v;
    },
  },
};
</script>

<style lang="scss" scoped>
table.history th.nowrap {
  white-space: nowrap;
}
a.link:hover {
  text-decoration: underline;
}
</style>
