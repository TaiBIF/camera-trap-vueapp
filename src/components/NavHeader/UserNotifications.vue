<template>
  <div
    id="notification-container"
    class="dropdown-menu dropdown-menu-right"
    aria-labelledby="notification"
  >
    <div class="notification-head">
      <div>最近 20 筆通知</div>
      <button
        :class="haveUnreadNotification && 'active'"
        @click="readAllNotifications"
      >
        我都知道了
      </button>
    </div>
    <div
      class="dropdown-item notification-item"
      v-for="(notification, id) in notifications"
      :key="`notification-${id}`"
    >
      <!-- 申請欄位通知 -->
      <div v-if="notification.type === 'data-field-application'">
        <div class="notification-item-content">
          <div class="notification-item-date">
            {{ dateFormatYYYYMMDDHHmmss(notification.createTime) }}
          </div>
          <div class="notification-item-message">
            {{ notification.sender.name }} 於計劃
            <!-- TODO: project name and id for link -->
            <router-link :to="`/project/${notification.xxx}`">
              XXX
            </router-link>
            中向您申請新增欄位：{{ notification.dataField.title }}
          </div>
        </div>
        <div class="notification-item-link">
          <!-- TODO: 需要有一個 endpoint 送 _approved, _reject, _cancel 操作 -->
          <a href="#">檢視 ></a>
        </div>
      </div>
      <!-- 通過申請欄位 -->
      <div v-else-if="notification.type === 'data-field-approved'">
        <div class="notification-item-content">
          <div class="notification-item-date">
            {{ dateFormatYYYYMMDDHHmmss(notification.createTime) }}
          </div>
          <div class="notification-item-message">
            <!-- TODO: project name, id-->
            系統管理員已通過您於計劃
            <router-link :to="`/project/${notification.xxx}/edit/setting`"
              >XXX</router-link
            >
            的欄位申請：XXX
          </div>
        </div>
      </div>
      <!-- 上傳及時通知：failure -->
      <div v-else-if="notification.type === 'upload-failure'">
        <div class="notification-item-content">
          <div class="notification-item-date">
            {{ dateFormatYYYYMMDDHHmmss(notification.createTime) }} 你上傳了
          </div>
          <div class="notification-item-message">
            <span>{{ notification.uploadSession.project.title }}</span>
            <span v-if="notification.uploadSession.studyArea.parentTitle"
              >{{ notification.uploadSession.studyArea.parentTitle }} －
            </span>
            <span>{{ notification.uploadSession.studyArea.title }}</span>
            <br />
            <span>{{ notification.uploadSession.cameraLocation.name }}</span>
            <span>{{
              dateFormatYYYYMMDDHHmmss(
                notification.uploadSession.cameraLocation.settingTime,
              )
            }}</span>
          </div>
        </div>
        <div class="notification-item-link">
          <div>上傳失敗</div>
          <router-link to="/upload-history">檢視錯誤 ></router-link>
        </div>
      </div>
      <!-- 上傳及時通知：success -->
      <div v-else-if="notification.type === 'upload-success'">
        <div class="notification-item-content">
          <div class="notification-item-date">
            {{ dateFormatYYYYMMDDHHmmss(notification.createTime) }} 你上傳了
          </div>
          <div class="notification-item-message">
            <!-- TODO: link: 使用上傳資料範圍為篩選條件 -->
            <router-link
              :to="
                `/proejct/${notification.uploadSession.project.id}/study-area/${
                  notification.uploadSession.studyArea.id
                }`
              "
            >
              <span>{{ notification.uploadSession.project.title }}</span>
              <span v-if="notification.uploadSession.studyArea.parentTitle"
                >{{ notification.uploadSession.studyArea.parentTitle }} －
              </span>
              <span>{{ notification.uploadSession.studyArea.title }}</span>
              <br />
              <span>{{ notification.uploadSession.cameraLocation.name }}</span>
              <span>{{
                dateFormatYYYYMMDDHHmmss(
                  notification.uploadSession.cameraLocation.settingTime,
                )
              }}</span></router-link
            >
          </div>
        </div>
        <div class="notification-item-link">
          <div>上傳成功</div>
        </div>
      </div>
      <div v-else-if="notification.type === 'new-issue'">
        <div class="notification-item-content">
          <div class="notification-item-date">
            {{ dateFormatYYYYMMDDHHmmss(notification.createTime) }}
          </div>
          <div class="notification-item-message">
            <!-- TODO: projectId, name -->
            XXX 於計劃 <router-link to="/xxx">XXX</router-link> 中提出問題回報
          </div>
        </div>
        <div class="notification-item-link">
          <!-- TODO: 連到 github (repo未開) -->
          <a href="#">檢視問題 ></a>
        </div>
      </div>
      <div v-else-if="notification.type === 'wait-for-overwrite'">
        <div class="notification-item-content">
          <div class="notification-item-date">
            {{ dateFormatYYYYMMDDHHmmss(notification.createTime) }}
          </div>
          <div class="notification-item-message">
            <!-- TODO: 待確認顯示內容 & 點擊行為 -->
            TBD
          </div>
        </div>
      </div>
      <div v-else-if="notification.type === 'system'">
        <div class="notification-item-content">
          <div class="notification-item-date">
            {{ dateFormatYYYYMMDDHHmmss(notification.createTime) }}
          </div>
          <div class="notification-item-message">
            <!-- TODO: 待確認顯示內容 & 點擊行為 -->
            TBD
          </div>
        </div>
      </div>
      <!-- TODO: 相機異常回報 -->
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper';

const notifications = createNamespacedHelpers('notifications');

export default {
  name: 'user-notifications',
  props: {
    notifications: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    haveUnreadNotification: function() {
      return (
        this.notifications &&
        this.notifications.length > 0 &&
        this.notifications.some(({ isRead }) => !isRead)
      );
    },
  },
  methods: {
    ...notifications.mapActions(['reaAllNotifications']),
    dateFormatYYYYMMDDHHmmss(dateString) {
      return dateFormatYYYYMMDDHHmmss(dateString);
    },
    readAllNotifications() {
      this.reaAllNotifications();
    },
  },
};
</script>

<style lang="scss" scoped>
.notification-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  color: #8b8b8b;

  & > button {
    border: 0px;
    background-color: transparent;
    font-size: 16px;
    padding: 0;
    color: #8b8b8b;

    &.active {
      color: black;
      cursor: pointer;
    }
  }
}
.notification-item {
  padding: 15px !important; // overwrite bootstrap
  a {
    color: #2a7f60 !important; // overwrite bootstrap
    text-decoration: none;
    cursor: pointer;
  }
  & {
    box-shadow: 0px -1px 0 0 #e1e3e5;
  }

  & > div {
    display: flex;
    min-width: 100%;
    max-width: 100%;
  }

  &-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  &-link {
    min-width: 120px;
    max-width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }

  &-date {
    color: #8b8b8b;
    margin-bottom: 5px;
  }
  &-message {
    white-space: normal;

    span {
      padding-right: 5px;
    }
  }
}
</style>
