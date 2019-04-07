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
          value="bug_report"
        />
        <label for="reply-type-1">問題回報</label>
      </div>
      <div class="radio radio-inline mb-0">
        <input
          type="radio"
          name="reply_type"
          id="reply-type-2"
          v-model="reportType"
          value="feedback"
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
      @cancel="handleCancel"
      @submit="handleSubmit"
    />
    <SuccessModal :open="showSuccessModal" @close="handleCloseSuccessModal" />
  </div>
</template>

<script>
// import { uploadFile } from '@/service';
// import { submitContactForm } from '../../../service/api';
import ContactUsForm from '@/components/ContactUsForm/ContactUsForm';
import SuccessModal from '@/components/Modal/SuccessModal';

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
    };
  },
  methods: {
    handleCancel() {
      this.reportType = '';
    },
    handleSubmit(form) {
      console.log('--- handleSubmit:', form);
      // TODO: apply file upload and contact us API
      // if (this.uploadFiles.length > 0) {
      //   const reportType =
      //     this.form.reportType === '問題回報' ? 'bug_report' : 'feedback';
      //   const timestamp = Date.now();
      //   const attachments = [];
      //   const promises = [];
      //   this.uploadFiles.forEach(({ file, type }, index) => {
      //     const ext = type.replace(/.*\//, '');
      //     const fileName = `${reportType}_${timestamp}_${index + 1}.${ext}`;
      //     attachments.push(
      //       `https://s3-ap-northeast-1.amazonaws.com/camera-trap/user_report_images/${fileName}`,
      //     );
      //     promises.push(
      //       uploadContactUsAttach({
      //         file,
      //         fileName,
      //       }),
      //     );
      //   });
      //   Promise.all(promises).then(() => {
      //     submitContactForm({
      //       ...this.form,
      //       attachments,
      //     }).then(({ ret }) => {
      //       if (ret.ok === 1) {
      //         this.showSuccessModal = true;
      //       }
      //     });
      //   });
      // } else {
      //   submitContactForm(this.form).then(({ ret }) => {
      //     if (ret.ok === 1) {
      //       this.showSuccessModal = true;
      //     }
      //   });
      // }
    },
    handleCloseSuccessModal() {
      this.showSuccessModal = false;
      this.reportType = '';
    },
  },
};
</script>
