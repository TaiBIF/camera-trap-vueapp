<template>
  <div class="container">
    <h1 class="text-green">設定</h1>
    <div class="panel panel-default mb-3">
      <div class="panel-heading">
        <h4>帳號設定</h4>
      </div>
      <div class="panel-body">
        <form action="" class="form">
          <div class="form-group row">
            <label class="required col-2 text-right">
              帳號連結：
            </label>
            <div class="col-6">
              <a class="btn btn-orcid">
                <span class="icon"><i class="icon-orcid"></i></span>
                <span class="text">已連結至ORCID 帳號</span>
              </a>
              <small class="note d-block text-gray">
                本帳號已連結您的 ORCID 帳號，若要修改帳號資訊或密碼，請連結至
                ORCID
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="required col-2 text-right" for="nameInput">
              使用者名稱：
            </label>
            <div class="col-6">
              <input
                type="text"
                class="form-control"
                id="nameInput"
                v-model="name"
              />
              <small class="note d-block text-gray">
                您對外公開的稱呼
              </small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right" for="emailInput">
              電子郵件：
            </label>
            <div class="col-6">
              <input
                type="email"
                class="form-control"
                id="emailInput"
                v-model="email"
              />
              <small class="note d-block text-gray">
                此電子郵件僅作通知及聯絡用途
              </small>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="action">
      <button class="btn btn-green-border" @click="handleCancel">
        取消
      </button>
      <button type="submit" class="btn btn-orange" @click="handleSubmit">
        儲存設定
      </button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const account = createNamespacedHelpers('account');

export default {
  name: 'Setting',
  data() {
    return {
      name: '',
      email: '',
    };
  },
  computed: {
    ...account.mapGetters(['userName', 'userEmail']),
  },
  methods: {
    ...account.mapActions(['updateProfile']),
    handleCancel() {
      this.$router.push('/');
    },
    handleSubmit() {
      if (this.name !== this.userName || this.email !== this.userEmail) {
        this.updateProfile({ name: this.name, email: this.email });
      }
    },
  },
  watch: {
    userName: function() {
      this.name = this.userName;
    },
    userEmail: function() {
      this.email = this.userEmail;
    },
  },
  mounted() {
    this.name = this.userName;
    this.email = this.userEmail;
  },
};
</script>
