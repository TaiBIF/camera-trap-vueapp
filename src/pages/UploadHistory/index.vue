<template>
  <div class="container">
    <h1 class="text-green">上傳紀錄</h1>
    <table class="table history">
      <thead>
        <tr>
          <th width="180px">上傳時間</th>
          <th>檔案名稱</th>
          <th width="120px">所屬計畫</th>
          <th>樣區</th>
          <th>相機位置</th>
          <th>上傳結果</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in uploadSessions.items" :key="`trow-${row.id}`">
          <td>{{ dateFormatYYYYMMDDHHmmss(row.createTime) }}</td>
          <td>
            <span class="icon" e v-if="row.file.type === 'annotation-image'">
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
            <span class="text">{{ row.file.filename }}</span>
          </td>
          <td>{{ row.project.shortTitle }}</td>
          <td>{{ row.cameraLocation.studyArea.title['zh-TW'] }}</td>
          <td>{{ row.cameraLocation.name }}</td>
          <td class="text-right">
            <div v-if="row.state == 'success'" class="float-left">
              <span class="icon"><i class="icon-upload-success"></i></span>
              <span class="text">上傳成功</span>
            </div>
            <div v-if="row.state == 'processing'" class="float-left">
              <span class="icon"></span>
              <span class="text">上傳中</span>
            </div>
            <div v-if="row.state == 'failure'" class="float-left">
              <span class="icon"><i class="icon-upload-fail"></i></span>
              <a
                @click="
                  showUploadSessionsErrorModal = true;
                  errorType = row.errorType;
                "
                class="text-danger text-underline"
              >
                檢視錯誤</a
              >
            </div>

            <div v-if="row.state == 'success'" class="float-left">
              <a
                :href="`/project/${row.project.id}/upload`"
                class="link text-underline mr-2"
                target="_blank"
              >
                補上傳影像檔
              </a>
            </div>
            <div v-if="row.state == 'success'" class="float-left">
              <a
                :href="
                  `/project/${row.project.id}/study-areas/${
                    row.cameraLocation.studyArea.id
                  }`
                "
                class="link text-underline mr-2"
                target="_blank"
              >
                查看
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <UploadSessionsErrorModal
      :open="showUploadSessionsErrorModal"
      @close="handleCloseUploadSessionsErrorModal"
      :errorType="errorType"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper.js';
import UploadSessionsErrorModal from '@/components/Modal/UploadSessionsErrorModal';

const uploadSessions = createNamespacedHelpers('uploadSessions');

export default {
  components: { UploadSessionsErrorModal },
  data() {
    return {
      showUploadSessionsErrorModal: false,
      errorType: '',
    };
  },
  mounted() {
    this.getUploadSessions();
  },
  computed: {
    ...uploadSessions.mapState(['uploadSessions']),
  },
  methods: {
    ...uploadSessions.mapActions(['getUploadSessions']),
    dateFormatYYYYMMDDHHmmss(dateString) {
      return dateFormatYYYYMMDDHHmmss(dateString);
    },
    handleCloseUploadSessionsErrorModal() {
      this.showUploadSessionsErrorModal = false;
    },
  },
};
</script>
