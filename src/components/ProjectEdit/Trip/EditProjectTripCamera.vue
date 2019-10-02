<template>
  <div class="edit-project-trip-camera">
    <div class="edit-project-trip-camera-container">
      <div class="edit-project-trip-camera-sidebar">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item
            v-for="(studyArea,
            studyAreaIndex) in editProjectTripBasic.studyAreas"
            :title="studyArea.title"
            :name="studyAreaIndex"
            :key="studyAreaIndex"
            v-show="
              studyArea.cameraLocations && studyArea.cameraLocations.length > 0
            "
          >
            <div
              class="edit-project-trip-camera-sidebar-item"
              v-for="(cameraLocation,
              cameraLocationIndex) in studyArea.cameraLocations"
              :key="cameraLocationIndex"
              @click="selectCameraLocation(studyAreaIndex, cameraLocationIndex)"
              :class="{
                'is-active':
                  selectedStudyAreaIndex === studyAreaIndex &&
                  selectedCameraLocationIndex === cameraLocationIndex,
              }"
            >
              <span :id="cameraLocation._id">{{ cameraLocation.title }}</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <form
        class="form edit-project-trip-camera-content"
        v-show="selectedCameraLocationIndex !== null"
      >
        <div class="form-group row">
          <label class="col-4">相機位置事件：</label>
          <div class="col-6">
            <div class="select">
              <v-select
                v-model="projectTrip.cameraLocationEven"
                :options="cmaeraLocationEvenOptions"
                placeholder="請選擇相機位置事件"
                @change="changeLimit"
              ></v-select>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-4">相機位置註記：</label>
          <div class="col-6">
            <input
              type="text"
              placeholder="請輸入相機位置註記"
              class="form-control"
              v-model="projectTrip.cameraLocationMark"
            />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-4">相機編號：</label>
          <div class="col-6">
            <div class="select">
              <v-select
                v-model="projectTrip.projectCameras"
                :options="projectCameraOptions"
                placeholder="請選擇相機編號"
                :closeOnSelect="false"
                multiple
                :noDrop="projectCameraNoDrop"
                @change="checkProjectCameraNoDrop"
              ></v-select>
            </div>
          </div>
        </div>
        <div
          class="trip-camera-detail"
          :class="{
            half:
              projectTrip.projectCameras &&
              projectTrip.projectCameras.length > 1,
          }"
          v-show="
            projectTrip.projectCameras && projectTrip.projectCameras.length > 0
          "
          v-for="(tripcamera, index) in projectTrip.projectCameras"
          :key="index"
        >
          <div class="trip-camera-detail-title">
            {{ projectTrip.projectCameras ? tripcamera : '' }}
            <hr />
          </div>
          <div class="form-group row">
            <label class="col-4">相機狀態:</label>
            <div class="col-6">
              <v-select
                v-model="tripCamerasDetail[index].cameraState"
                :options="stateOptions"
                placeholder="請選擇相機狀態"
                @change="changeLimit"
              ></v-select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">相機註記:</label>
            <div class="col-6">
              <input
                v-model="tripCamerasDetail[index].cameraMark"
                type="text"
                placeholder="請輸入相機註記"
                class="form-control"
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">記憶卡檔案數:</label>
            <div class="col-6">
              <input
                v-model="tripCamerasDetail[index].memoryCardNumber"
                type="text"
                placeholder="請輸入檔案數量"
                class="form-control"
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">電池類型:</label>
            <div class="col-6">
              <v-select
                v-model="tripCamerasDetail[index].cameraBatteryType"
                :options="batteryTypeOptions"
                placeholder="請選擇電池類型"
                @change="changeLimit"
              ></v-select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">電池剩餘電量:</label>
            <div class="col-6">
              <input
                v-model="
                  tripCamerasDetail[index].cameraBatteryRemainingCapacity
                "
                type="text"
                placeholder="請輸入電池剩餘電量"
                class="form-control"
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">光強度:</label>
            <div class="col-6">
              <v-select
                v-model="tripCamerasDetail[index].cameraBrightness"
                :options="brightnessOptions"
                placeholder="請選擇光強度"
                @change="changeLimit"
              ></v-select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">敏感度:</label>
            <div class="col-6">
              <v-select
                v-model="tripCamerasDetail[index].cameraSensitivity"
                :options="sensitivityOptions"
                placeholder="請選擇敏感度"
                @change="changeLimit"
              ></v-select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">影片長度:</label>
            <div class="col-6">
              <input
                v-model="tripCamerasDetail[index].cameraVideoLength"
                type="text"
                placeholder="請輸入影片長度"
                class="form-control"
              />
            </div>
            <span>分鐘</span>
          </div>
          <div class="form-group row">
            <label class="col-4">連拍張數:</label>
            <div class="col-6">
              <input
                v-model="tripCamerasDetail[index].cameraContinuousShots"
                type="text"
                placeholder="請輸入連拍張數"
                class="form-control"
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">相機方位:</label>
            <div class="col-6">
              <input
                v-model="tripCamerasDetail[index].cameraPosition"
                type="text"
                placeholder="請輸入相機方位"
                class="form-control"
              />
            </div>
            <span>度</span>
          </div>
          <div class="form-group row">
            <label class="col-4">相機俯角:</label>
            <div class="col-6">
              <input
                v-model="tripCamerasDetail[index].cameraDepressionAngle"
                type="text"
                placeholder="請輸入相機俯角"
                class="form-control"
              />
            </div>
            <span>度</span>
          </div>
          <div class="form-group row">
            <label class="col-4">感應距離:</label>
            <div class="col-6">
              <input
                v-model="tripCamerasDetail[index].cameraSensingDistance"
                type="text"
                placeholder="請輸入感應距離"
                class="form-control"
              />
            </div>
            <span>公尺</span>
          </div>
          <div
            v-show="
              projectTrip.projectCameras &&
                projectTrip.projectCameras.length === 1
            "
            class="trip-camera-detail-active-date"
          >
            <div class="form-group row">
              <label class="col-4">有效開始工作時間:</label>
              <div class="col-4">
                <date-picker
                  v-model="tripCamerasDetail[index].startActiveDate"
                  :format="'YYYY-MM-DD'"
                  :first-day-of-week="1"
                  placeholder="有效開始工作時間"
                />
              </div>
              <div class="col-2">
                <div class="input-group">
                  <vue-timepicker
                    v-model="tripCamerasDetail[index].startActiveTime"
                    hide-clear-button
                  ></vue-timepicker>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-4">有效結束工作時間:</label>
              <div class="col-4">
                <date-picker
                  v-model="tripCamerasDetail[index].endActiveDate"
                  :format="'YYYY-MM-DD'"
                  :first-day-of-week="1"
                  placeholder="有效結束工作時間"
                />
              </div>
              <div class="col-2">
                <div class="input-group">
                  <vue-timepicker
                    v-model="tripCamerasDetail[index].endActiveTime"
                    hide-clear-button
                  ></vue-timepicker>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import VueTimepicker from 'vue2-timepicker';
import vSelect from 'vue-select';

const batteryTypeOptions = ['鹼性電池', '充電電池'];
const brightnessOptions = ['自動'];
const sensitivityOptions = ['自動'];
const stateOptions = ['active'];

export default {
  name: 'EditProjectTripCamera',
  components: {
    vSelect,
    DatePicker,
    VueTimepicker,
  },
  props: {
    editProjectTripData: {
      type: Object,
      default: () => {},
    },
    projectCameras: {
      type: Array,
      default: () => [],
    },
    getProjectCameras: {
      type: Function,
    },
    projectId: {
      type: String,
    },
    setEditProjectTrip: {
      type: Function,
    },
  },
  data: function() {
    return {
      activeName: '',
      projectTrip: {},
      tripCamerasDetail: [{}, {}],
      cmaeraLocationEvenOptions: [],
      batteryTypeOptions,
      brightnessOptions,
      sensitivityOptions,
      stateOptions,
      projectCameraOptions: [],
      selectedStudyAreaIndex: null,
      selectedCameraLocationIndex: null,
      editProjectTripBasic: {},
      projectCameraLimit: 1,
      projectCameraNoDrop: false,
      endActiveDate: '',
    };
  },
  async mounted() {
    this.editProjectTripBasic = Object.assign({}, this.editProjectTripData);
    if (
      this.editProjectTripData.projectCameras &&
      this.editProjectTripData.projectCameras.length > 0
    ) {
      this.cmaeraLocationEvenOptions = ['設置', '替換'];
    } else this.cmaeraLocationEvenOptions = ['設置'];

    this.projectTrip.cameraLocationEven = this.cmaeraLocationEvenOptions[0];

    await this.getProjectCameras({ projectId: this.projectId });
    this.projectCameraOptions = this.projectCameras.map(({ sn }) => sn);
    this.$parent.$on(
      'setEditProjectTripReduest',
      this.setEditProjectTripReduest,
    );
  },
  methods: {
    async selectCameraLocation(studyAreaIndex, cameraLocationIndex) {
      await this.setEditProjectTripReduest();

      this.selectedStudyAreaIndex = studyAreaIndex;
      this.selectedCameraLocationIndex = cameraLocationIndex;

      const nextProjectTrip = this.editProjectTripBasic.studyAreas[
        this.selectedStudyAreaIndex
      ].cameraLocations[this.selectedCameraLocationIndex];
      const projectCameras = nextProjectTrip.projectCameras
        ? {
            projectCameras: nextProjectTrip.projectCameras.map(
              ({ cameraSn }) => cameraSn,
            ),
          }
        : {};
      this.projectTrip = Object.assign({}, nextProjectTrip, projectCameras);

      this.tripCamerasDetail = this.editProjectTripBasic.studyAreas[
        this.selectedStudyAreaIndex
      ].cameraLocations[this.selectedCameraLocationIndex].projectCameras || [
        {},
        {},
      ];
    },
    async setEditProjectTripReduest() {
      if (this.selectedCameraLocationIndex !== null) {
        let currentProjectTrip = Object.assign({}, this.projectTrip);
        if (currentProjectTrip.projectCameras !== undefined) {
          const projectCameras = currentProjectTrip.projectCameras.map(
            (value, index) => {
              const startActiveDate =
                this.tripCamerasDetail[index].startActiveDate ||
                '' + ' ' + this.tripCamerasDetail[index].startActiveTime ||
                '';
              const endActiveDate =
                this.tripCamerasDetail[index].endActiveDate ||
                '' + ' ' + this.tripCamerasDetail[index].endActiveTime ||
                '';
              const currentTripCamera = Object.assign(
                {},
                this.tripCamerasDetail[index],
                { startActiveDate },
                { endActiveDate },
              );
              return { cameraSn: value, ...currentTripCamera };
            },
          );
          currentProjectTrip.projectCameras = projectCameras;
        }

        if (Object.keys(currentProjectTrip).length > 0) {
          Object.assign(
            this.editProjectTripBasic.studyAreas[this.selectedStudyAreaIndex]
              .cameraLocations[this.selectedCameraLocationIndex],
            currentProjectTrip,
          );
        }

        this.setEditProjectTrip(this.editProjectTripBasic);
      }
    },
    changeLimit(value) {
      this.projectCameraLimit =
        value === this.cmaeraLocationEvenOptions[1] ? 2 : 1;

      if (this.projectTrip.projectCameras && this.projectCameraLimit === 1)
        this.projectTrip.projectCameras.splice(1, 1);

      this.checkProjectCameraNoDrop();
    },
    checkProjectCameraNoDrop() {
      this.projectCameraNoDrop =
        this.projectTrip.projectCameras &&
        this.projectTrip.projectCameras.length >= this.projectCameraLimit;
    },
    setProjectTripActiveDate(date, type) {
      this[type] = date;
    },
  },
};
</script>

<style lang="scss" scoped></style>
