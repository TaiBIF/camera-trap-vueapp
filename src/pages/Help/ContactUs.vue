<template>
  <div class="container">
    <h1 class="text-green">聯絡我們</h1>
    <p class="mb-0">
      對於 Camera Trap
      的使用有任何問題或回饋嗎？請描述您遇到的狀況，我們會盡快與您聯絡！
    </p>
    <div class="form-group form-group-inline">
      <label class="mr-2">您要回報的類型：</label>
      <div class="radio radio-inline mb-0">
        <input
          type="radio"
          name="reply_type"
          id="reply-type-1"
          v-model="reportType"
          value="issue"
        />
        <label for="reply-type-1">問題回報</label>
      </div>
      <div class="radio radio-inline mb-0">
        <input
          type="radio"
          name="reply_type"
          id="reply-type-2"
          v-model="reportType"
          value="suggestion"
        />
        <label for="reply-type-2">意見反饋</label>
      </div>
    </div>
    <div v-if="reportType === ''">
      <router-link to="/help/faq" class="btn btn-green-border">
        返回常見問題
      </router-link>
    </div>
    <ContactUsForm
      v-if="reportType !== ''"
      :type="reportType"
      :errorMessage="errorMessage"
      @cancel="handleCancel"
      @submit="handleSubmit"
    />
    <SuccessModal :open="showSuccessModal" @close="handleCloseSuccessModal" />
  </div>
</template>

<script>
import { createIssue, uploadFile } from '@/service';
import ContactUsForm from '@/components/ContactUsForm/ContactUsForm';
import SuccessModal from '@/components/Modal/SuccessModal';
import idx from 'idx';

const categoryMap = {
  系統操作: 'system',
  帳號相關: 'account',
  計畫管理: 'project-management',
  檔案上傳: 'file-upload',
  資料編輯: 'data-edit',
  篩選及下載: 'search-and-download',
  其他問題: 'others',
};
export default {
  name: 'Contact',
  components: {
    ContactUsForm,
    SuccessModal,
  },
  data() {
    return {
      reportType: '',
      showSuccessModal: false,
      errorMessage: '',
    };
  },
  methods: {
    handleCancel() {
      this.reportType = '';
      this.errorMessage = '';
    },
    async handleSubmit({ reportContentType, description, email, uploadFiles }) {
      this.errorMessage = '';

      const type = this.reportType;
      const categories = reportContentType.map(type => categoryMap[type]);
      const issueParams = {
        type,
        categories,
        description,
        email,
      };
      if (uploadFiles.length > 0) {
        const promises = [];
        uploadFiles.forEach(({ file }) => {
          const formData = new FormData();
          formData.append('file', file);
          promises.push(uploadFile('issue-attachment', formData));
        });
        const results = await Promise.all(promises);
        if (idx(results, _ => _[0].id)) {
          issueParams.attachmentFile = results[0].id;
          // TODO: apply upload mutilple file
          // issueParams.attachmentFiles = results.map(({id}) => id);
        } else {
          const message = idx(results, _ => _[0].message) || '';
          this.errorMessage = `檔案上傳失敗，請再試一次。 ${message}`;
        }
      }
      if (!this.errorMessage) {
        const res = await createIssue(issueParams).catch(({ message }) => {
          this.errorMessage = `傳送失敗，請再試一次。 ${message || ''}`;
        });

        if (res) this.showSuccessModal = true;
      }
    },
    handleCloseSuccessModal() {
      this.showSuccessModal = false;
      this.reportType = '';
    },
  },
};
</script>
