<template>
  <div>
    <header>
      <nav class="navbar navbar-expand-sm">
        <router-link to="/" role="button" class="navbar-brand"
          >Camara Capture</router-link
        >
        <button
          v-if="!isLogin"
          class="navbar-toggler collapsed"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          v-if="!isLogin"
          class="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <div class="navbar-nav justify-content-md-end subnav">
            <div class="nav-item dropdown help">
              <a
                class="nav-link dropdown-toggle"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                >幫助</a
              >
              <div class="dropdown-menu dropdown-menu-right">
                <router-link to="/help/faq" class="dropdown-item"
                  >常見問題</router-link
                >
                <router-link to="/help/contact-us" class="dropdown-item"
                  >聯絡我們</router-link
                >
                <router-link to="/help/privacy" class="dropdown-item"
                  >隱私權政策</router-link
                >
              </div>
            </div>
            <div class="divider"></div>
            <div class="nav-item ml-3">
              <a @click="loginModalOpen = true" class="btn btn-orange">登入</a>
            </div>
          </div>
        </div>
        <div class="collapse navbar-collapse" v-if="isLogin">
          <ul class="navbar-nav main-nav">
            <li class="nav-item">
              <router-link
                class="nav-link"
                :class="isProjectPath ? 'active' : ''"
                role="button"
                to="/project/overview"
                >計畫總覽
                <span class="sr-only" v-if="isProjectPath">(current)</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                :class="isDownloadPath ? 'active' : ''"
                role="button"
                to="/download/search"
                >篩選及下載
                <span class="sr-only" v-if="isDownloadPath">(current)</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                :class="isHistoryPath ? 'active' : ''"
                role="button"
                to="/upload-history"
                >上傳紀錄
                <span class="sr-only" v-if="isHistoryPath">(current)</span>
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                >幫助</a
              >
              <div class="dropdown-menu dropdown-menu-right">
                <router-link to="/help/faq" class="dropdown-item"
                  >常見問題</router-link
                >
                <router-link to="/help/contact-us" class="dropdown-item"
                  >聯絡我們</router-link
                >
                <router-link to="/help/privacy" class="dropdown-item"
                  >隱私權政策</router-link
                >
              </div>
            </li>
            <li class="divider"></li>
          </ul>
          <div class="navbar-nav subnav">
            <div class="divider"></div>
            <div
              class="nav-item dropdown notification"
              :class="haveUnreadNotification && 'withUnread'"
            >
              <a
                class="nav-item nav-link dropdown-toggle"
                id="notification"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fa fa-bell"></i>
              </a>
              <user-notifications :notifications="notifications" />
            </div>
            <div class="divider"></div>
            <div class="nav-item dropdown">
              <a
                class="nav-item nav-link dropdown-toggle"
                id="navbarDropdownMenuLink"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {{ userName }}
              </a>
              <div
                class="dropdown-menu dropdown-menu-right"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <router-link class="dropdown-item" to="/setting"
                  >設定</router-link
                >
                <a class="dropdown-item" href="#" @click="doLogout()">登出</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <login-modal :open="loginModalOpen" @close="loginModalOpen = false" />
    </header>
    <system-announcement
      v-if="systemAnnouncements && systemAnnouncements.length > 0"
      :message="systemAnnouncements[0].message"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import LoginModal from '@/components/Modal/LoginModal';
import SystemAnnouncement from '@/components/NavHeader/SystemAnnouncement';
import UserNotifications from '@/components/NavHeader/UserNotifications';

const account = createNamespacedHelpers('account');
const notifications = createNamespacedHelpers('notifications');

export default {
  name: 'NavHeader',
  components: { LoginModal, SystemAnnouncement, UserNotifications },
  mounted() {
    this.loadSystemAnnouncements();
    this.loadNotifications();
  },
  data() {
    return {
      loginModalOpen: false,
      pathname: this.$route.name,
    };
  },
  computed: {
    ...account.mapGetters(['userName', 'isLogin']),
    ...notifications.mapGetters(['systemAnnouncements', 'notifications']),
    isProjectPath: function() {
      return this.$route && /^\/project/.test(this.$route.path);
    },
    isDownloadPath: function() {
      return this.$route && /^\/download/.test(this.$route.path);
    },
    isHistoryPath: function() {
      return this.$route && /^\/upload-history/.test(this.$route.path);
    },
    haveUnreadNotification: function() {
      return (
        this.notifications &&
        this.notifications.length > 0 &&
        this.notifications.some(({ isRead }) => !isRead)
      );
    },
  },
  methods: {
    ...account.mapActions(['doLogout']),
    ...notifications.mapActions([
      'loadSystemAnnouncements',
      'loadNotifications',
    ]),
  },
  watch: {
    isLogin: function(newValue, oldValue) {
      if (oldValue && !newValue) {
        this.$router.push({ name: 'intro' });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
header {
  top: 0;
  left: 0;
}
</style>
