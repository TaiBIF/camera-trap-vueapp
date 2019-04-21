<template>
  <div class="modal fade page-login" :class="{ in: open, loading: isLoading }">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <a @click="$emit('close')" role="button" class="close float-right">
            <i class="fa fa-times"></i>
          </a>
        </div>
        <div class="modal-body">
          <h1 class="heading mt-0">登入</h1>
          <p>請使用您的 ORCID 帳號登入Camera Trap 監測資料管理平台：</p>
          <div class="mt-5 mb-3">
            <div class="btn btn-block btn-gray" @click="doLogin">
              <span class="text">
                使用 ORCID 帳號登入
              </span>
            </div>
          </div>
          <div class="text-gray">
            還沒有帳號？
            <a
              href="https://orcid.org/register"
              class="text-green"
              target="_blank"
            >
              前往
              <i class="icon align-baseline icon-orcid-text"></i> 網頁註冊
            </a>
          </div>
          <hr class="mt-5" />
          <div class="text-center">
            當您登入系統，即代表您同意我們的
            <a href="/article.html#/privacy-policy" class="text-green"
              >隱私權保護政策</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/service';

export default {
  name: 'LoginModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    doLogin() {
      this.isLoading = true;
      login()
        .then(({ oauthUrl }) => {
          this.isLoading = false;
          if (oauthUrl) {
            window.location = oauthUrl;
          }
        })
        .catch(err => {
          this.loading = false;
          console.error('login fail: ', err);
        });
    },
  },
};
</script>
