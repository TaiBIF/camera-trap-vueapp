<template>
  <div class="edit-project-camera">
    <div class="project-camera-sidebar">
      <div
        v-for="(projectCamera, index) in editProjectCameraList"
        :key="projectCamera.id"
      >
        <div
          v-text="projectCamera.displayName"
          class="project-camera-sidebar-item pl-5"
          :class="{ 'is-active': selectProjectCameraIndex === index }"
          @click="chooseProjectCamera(projectCamera.id, index)"
        ></div>
      </div>
    </div>
    <form class="form edit-project-camera-context">
      <div class="form-group row">
        <label class="col-4">自訂相機編號：</label>
        <div class="col-6">
          <input
            type="text"
            placeholder="請為相機設定編號"
            class="form-control"
            v-model="nickname"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4">電池類型：</label>
        <div class="col-6">
          <div class="select">
            <v-select
              v-model="batteryType"
              :options="batteryTypeOptions"
              placeholder="請選擇電池類型"
            ></v-select>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4">LED 補光強度：</label>
        <div class="col-6">
          <div class="select">
            <v-select
              v-model="brightness"
              :options="brightnessOptions"
              placeholder="請選擇LED 補光強度"
            ></v-select>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4">敏感度：</label>
        <div class="col-6">
          <div class="select">
            <v-select
              v-model="sensitivity"
              :options="sensitivityOptions"
              placeholder="請選擇敏感度"
            ></v-select>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4">影片長度：</label>
        <div class="col-6">
          <input
            type="text"
            placeholder="請輸入影片長度"
            class="form-control"
            v-model="videoLength"
          />
        </div>
        <span>秒</span>
      </div>
      <div class="form-group row">
        <label class="col-4">連拍張數：</label>
        <div class="col-6">
          <input
            type="text"
            placeholder="請輸入連拍張數"
            class="form-control"
            v-model="continuousShots"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4">感應距離：</label>
        <div class="col-6">
          <input
            type="text"
            placeholder="請輸入感應距離"
            class="form-control"
            v-model="sensingDistance"
          />
        </div>
        <span>公尺</span>
      </div>
    </form>
  </div>
</template>

<script>
import idx from 'idx';
import vSelect from 'vue-select';

const batteryTypeOptions = ['鹼性電池', '鋰電池', '鎳氫電池(充電電池)'];
const brightnessOptions = ['關', '自動', '高', '中', '低'];
const sensitivityOptions = ['自動', '高', '中', '低', '無法判定'];

export default {
  name: 'EditProjectCamera',
  props: {
    projectCameraListData: {
      type: Array,
      default: () => [],
    },
    setEditProjectCameraList: { type: Function },
  },
  components: {
    vSelect,
  },
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      editProjectCameraList: [],
      selectProjectCameraId: '',
      selectProjectCameraIndex: '',
      nickname: '',
      batteryType: '',
      brightness: '',
      sensitivity: '',
      videoLength: '',
      continuousShots: '',
      sensingDistance: '',
      batteryTypeOptions,
      brightnessOptions,
      sensitivityOptions,
    };
  },
  mounted() {
    this.editProjectCameraList = Array.from(this.projectCameraListData);
    this.selectProjectCameraId = idx(this.editProjectCameraList[0], _ => _.id);
    this.selectProjectCameraIndex = 0;
    this.nickname = idx(this.editProjectCameraList[0], _ => _.nickname);
    this.batteryType = idx(this.editProjectCameraList[0], _ => _.batteryType);
    this.brightness = idx(this.editProjectCameraList[0], _ => _.brightness);
    this.sensitivity = idx(this.editProjectCameraList[0], _ => _.sensitivity);
    this.videoLength = idx(this.editProjectCameraList[0], _ => _.videoLength);
    this.continuousShots = idx(
      this.editProjectCameraList[0],
      _ => _.continuousShots,
    );
    this.sensingDistance = idx(
      this.editProjectCameraList[0],
      _ => _.sensingDistance,
    );
  },
  watch: {
    selectProjectCameraIndex: function() {
      this.nickname = idx(
        this.editProjectCameraList[this.selectProjectCameraIndex],
        _ => _.nickname,
      );
      this.batteryType = idx(
        this.editProjectCameraList[this.selectProjectCameraIndex],
        _ => _.batteryType,
      );
      this.brightness = idx(
        this.editProjectCameraList[this.selectProjectCameraIndex],
        _ => _.brightness,
      );
      this.sensitivity = idx(
        this.editProjectCameraList[this.selectProjectCameraIndex],
        _ => _.sensitivity,
      );
      this.videoLength = idx(
        this.editProjectCameraList[this.selectProjectCameraIndex],
        _ => _.videoLength,
      );
      this.continuousShots = idx(
        this.editProjectCameraList[this.selectProjectCameraIndex],
        _ => _.continuousShots,
      );
      this.sensingDistance = idx(
        this.editProjectCameraList[this.selectProjectCameraIndex],
        _ => _.sensingDistance,
      );
    },
    nickname: function(value) {
      this.updateEditProjectCameraList('nickname', value);
    },
    batteryType: function(value) {
      this.updateEditProjectCameraList('batteryType', value);
    },
    brightness: function(value) {
      this.updateEditProjectCameraList('brightness', value);
    },
    sensitivity: function(value) {
      this.updateEditProjectCameraList('sensitivity', value);
    },
    videoLength: function(value) {
      this.updateEditProjectCameraList('videoLength', value);
    },
    continuousShots: function(value) {
      this.updateEditProjectCameraList('continuousShots', value);
    },
    sensingDistance: function(value) {
      this.updateEditProjectCameraList('sensingDistance', value);
    },
  },
  methods: {
    chooseProjectCamera(id, index) {
      this.selectProjectCameraId = id;
      this.selectProjectCameraIndex = index;
    },
    updateEditProjectCameraList(key, value) {
      const newEditProjectCameraList = Array.from(this.editProjectCameraList);
      const currentProjectCamera =
        newEditProjectCameraList[this.selectProjectCameraIndex];
      const newProjectCamera = Object.assign({}, currentProjectCamera, {
        [key]: value,
      });
      newEditProjectCameraList.splice(
        this.selectProjectCameraIndex,
        1,
        newProjectCamera,
      );

      this.setEditProjectCameraList(newEditProjectCameraList);
      this.editProjectCameraList = newEditProjectCameraList;
    },
  },
};
</script>

<style lang="scss" scoped></style>
