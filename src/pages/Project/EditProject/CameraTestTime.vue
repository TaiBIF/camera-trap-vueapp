<template>
  <div class="panel">
    <div class="panel-heading">
      <h4>相機異常檢測</h4>
    </div>
    <div class="panel-body">
      <p>
        設定「每日測試照片拍攝時間」可幫助您檢查相機是否出現異常狀況。
        若上傳的檔案無每日固定時間拍攝的影像， 則會通知您此相機出現異常狀況，
        並且本設定對您未來計算相機的工作天數有所幫助。
      </p>
      <div class="row">
        <label class="col-3">每日測試照片拍攝時間：</label>
        <div class="col-9">
          <div class="radio radio-inline">
            <input
              type="radio"
              id="camera-time-1"
              v-model="isEnableCameraTest"
              :value="false"
              @click="disableCameraTest"
            />
            <label for="camera-time-1">無設定</label>
          </div>
          <div class="radio radio-inline">
            <input
              type="radio"
              id="camera-time-2"
              v-model="isEnableCameraTest"
              :value="true"
            />
            <label for="camera-time-2">
              已設定，時間為每日
            </label>
          </div>
          <vue-timepicker
            hide-clear-button
            v-if="isEnableCameraTest"
            :value="dailyTime"
            @change="onChangeTime"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueTimepicker from 'vue2-timepicker';
import moment from 'moment';

export default {
  data: function() {
    return {
      isEnableCameraTest: this.dailyTestTime !== '',
    };
  },
  props: {
    dailyTestTime: String,
  },
  components: {
    VueTimepicker,
  },
  computed: {
    dailyTime: function() {
      return {
        HH: moment(this.dailyTestTime || '00:00:00', 'HH:mm:ss').format('HH'),
        mm: moment(this.dailyTestTime || '00:00:00', 'HH:mm:ss').format('mm'),
      };
    },
  },
  methods: {
    onChangeTime({ data: { HH, mm, ss } }) {
      setTimeout(() => {
        // 等到 isEnableCameraTest 被修改後才觸發
        if (
          this.isEnableCameraTest &&
          !isNaN(HH) &&
          !isNaN(mm) &&
          !isNaN(ss) &&
          this.dailyTestTime !== `${HH}:${mm}:${ss}`
        ) {
          this.isEnableCameraTest = true;
          this.$emit('change', `${HH}:${mm}:${ss}`);
        }
      }, 0);
    },
    disableCameraTest() {
      this.$emit('change', ``);
    },
  },
};
</script>
