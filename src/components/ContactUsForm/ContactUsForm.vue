<template>
  <div class="container">
    <form action="" class="form">
      <div class="panel panel-default mb-3">
        <div class="panel-heading">
          <h4 v-if="type === 'issue'">問題回報</h4>
          <h4 v-if="type === 'suggestion'">意見反饋</h4>
        </div>
        <div class="panel-body">
          <div class="form-group row">
            <label class="col-2 text-right required">問題類型：</label>
            <div class="col-10">
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-1"
                  value="系統操作"
                  v-model="reportContentType"
                />
                <label for="quest-type-1">系統操作</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-2"
                  value="帳號相關"
                  v-model="reportContentType"
                />
                <label for="quest-type-2">帳號相關</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-3"
                  value="計畫管理"
                  v-model="reportContentType"
                />
                <label for="quest-type-3">計畫管理</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-4"
                  value="檔案上傳"
                  v-model="reportContentType"
                />
                <label for="quest-type-4">檔案上傳</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-5"
                  value="資料編輯"
                  v-model="reportContentType"
                />
                <label for="quest-type-5">資料編輯</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-6"
                  value="篩選及計算"
                  v-model="reportContentType"
                />
                <label for="quest-type-6">篩選及計算</label>
              </div>
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  name=""
                  id="quest-type-7"
                  value="其他問題"
                  v-model="reportContentType"
                />
                <label for="quest-type-7">其他問題</label>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right required">問題描述：</label>
            <div class="col-10">
              <textarea
                v-if="type === 'issue'"
                v-model="description"
                cols="30"
                rows="5"
                class="form-control"
                placeholder="請詳述您的問題，我們將儘速與您聯繫"
              >
              </textarea>
              <textarea
                v-if="type === 'suggestion'"
                v-model="description"
                cols="30"
                rows="5"
                class="form-control"
                placeholder="和我們分享您的使用經驗，有哪些方面比較順利？有哪些地方需要改進？"
              >
              </textarea>
            </div>
            <div v-if="type === 'issue'" class="col-10 offset-2 text-gray">
              <small>
                <p>
                  建議您在問題回報中提供以下資訊，讓我們能更精確的為您提供幫助。
                </p>
                <ul>
                  <li>明確且詳細的問題說明</li>
                  <li>重現問題狀況的確切步驟</li>
                  <li>出現問題的螢幕截圖或影片連結 (建議)</li>
                  <li>您認為可能對找出和解決問題有幫助的所有其他資訊</li>
                </ul>
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right required">您的電子郵件：</label>
            <div class="col-10">
              <input
                type="email"
                v-model="email"
                class="form-control"
                placeholder="請輸入您的電子郵件"
              />
              <div v-if="!isEmailValid" class="error">email 格式不符</div>
              <div class="note">
                <small class="text-gray">
                  我們將透過電子郵件與您聯繫此問題的相關事宜，您的電子郵件不會被分享，或用於任何其他用途。
                </small>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right">附件：</label>
            <div class="col-5">
              <label class="btn btn-upload" v-if="isLogin">
                <input
                  type="file"
                  name="upload"
                  id="upload"
                  @change="previewFile($event)"
                />
                <span class="text">添加附加檔案</span>
              </label>
              <label v-else>
                <span class="text text-gray">請先登入系統以上傳附加檔案</span>
              </label>
              <div class="note">
                <small class="text-gray">
                  附加螢幕截圖、資料、圖片或影片檔案<br />
                  (.csv, .tsv, .tab, .txt, .xls, .xlsx, .jpg, .png, .mp4, .avi,
                  .mov, .mpg, .mpeg) ，檔案容量上限為 20 MB
                </small>
              </div>
              <div class="preview" v-if="isUploadTypeError">
                不支援此檔案類型
              </div>
              <div class="preview" v-else-if="isUploadSizeError">
                檔案上限為 20 MB
              </div>
              <div
                class="preview"
                v-else-if="uploadFiles.length > 0"
                v-for="(uploadFile, index) in uploadFiles"
                :key="index"
              >
                <div class="image">
                  <img :src="uploadFile.src" />
                </div>
                <div class="content">
                  {{ uploadFile.name }}
                </div>
                <div class="action">
                  <div class="btn btn-text" @click="removeFile(index)">
                    X
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="error" v-show="!!errorMessage">{{ errorMessage }}</div>
      <div class="action">
        <button type="reset" class="btn btn-green-border" @click="handleCancel">
          取消
        </button>
        <button
          type="button"
          class="btn btn-orange"
          @click="handleSubmit"
          :disabled="!isRequiredInputFill || !isEmailValid"
        >
          確認送出
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const account = createNamespacedHelpers('account');
const supportUploadExtension = [
  'text/csv',
  'text/tab-separated-values',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/x-msvideo',
  'video/quicktime',
  'audio/mpeg',
];
const maxUploadFileSizeMb = 20;

export default {
  name: 'ContactUsForm',
  props: {
    type: {
      type: String,
      validator: val => ['issue', 'suggestion'].includes(val),
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      reportContentType: [],
      description: '',
      email: '',
      uploadFiles: [],
      isUploadTypeError: false,
      isUploadSizeError: false,
    };
  },
  computed: {
    ...account.mapGetters(['isLogin']),
    isRequiredInputFill: function() {
      const { reportContentType, description, email } = this;

      return reportContentType.length > 0 && !!description && !!email;
    },
    isEmailValid: function() {
      if (!this.email) return true;

      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(this.email);
    },
  },
  methods: {
    removeFile(index) {
      this.uploadFiles.splice(index, 1);
    },
    previewFile(e) {
      this.isUploadTypeError = false;
      this.isUploadSizeError = false;
      let input = e.target;

      if (e.target.files && input.files[0]) {
        let reader = new FileReader();
        const file = input.files[0];
        if (!supportUploadExtension.includes(file.type)) {
          this.isUploadTypeError = true;
          this.uploadFiles = [];
        } else if (file.size / 1024 / 1024 > maxUploadFileSizeMb) {
          this.isUploadSizeError = true;
          this.uploadFiles = [];
        } else {
          reader.onload = e => {
            this.uploadFiles.push({
              src: e.target.result,
              name: file.name,
              type: file.type,
              file: file,
            });
          };

          reader.readAsDataURL(file);
        }
      }
    },
    handleCancel() {
      this.reportContentType = [];
      this.description = '';
      this.email = '';
      this.uploadFiles = [];
      this.$emit('cancel');
    },
    handleSubmit() {
      this.$emit('submit', {
        reportContentType: this.reportContentType,
        description: this.description,
        email: this.email,
        uploadFiles: this.uploadFiles,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.error {
  color: #d80c37;
}
</style>
