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
                v-model="tripCamerasDetail[index].cameraMemoryCardNumber"
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
                    v-model="startActiveTime"
                    format="HH:mm"
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
                    v-model="endActiveTime"
                    format="HH:mm"
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
import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper.js';
import DatePicker from 'vue2-datepicker';
import VueTimepicker from 'vue2-timepicker';
import moment from 'moment';
import vSelect from 'vue-select';

const batteryTypeOptions = ['鹼性電池', '充電電池'];
const brightnessOptions = ['自動'];
const sensitivityOptions = ['自動'];
const stateOptions = ['active'];

const getDateAndTime = (day, time, second = 0, millisecond = 0) => {
  return moment(day)
    .hour(time.HH)
    .minute(time.mm)
    .second(second)
    .millisecond(millisecond);
};

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
      startActiveTime: { HH: '00', mm: '00' },
      endActiveTime: { HH: '00', mm: '00' },
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

      const nextTripCamerasDetail = this.editProjectTripBasic.studyAreas[
        this.selectedStudyAreaIndex
      ].cameraLocations[this.selectedCameraLocationIndex].projectCameras;

      this.cmaeraLocationEvenOptions = ['設置'];

      if (nextTripCamerasDetail && nextTripCamerasDetail.length > 0) {
        this.tripCamerasDetail = nextTripCamerasDetail;

        if (
          this.projectTrip.projectCameras &&
          this.projectTrip.projectCameras.length === 1
        ) {
          if (
            nextTripCamerasDetail[0].startActiveDate &&
            nextTripCamerasDetail[0].startActiveDate !== 'Invalid date'
          ) {
            this.startActiveTime = {
              HH: moment(nextTripCamerasDetail[0].startActiveDate).format('HH'),
              mm: moment(nextTripCamerasDetail[0].startActiveDate).format('mm'),
            };
          } else this.startActiveTime = { HH: '00', mm: '00' };

          if (
            nextTripCamerasDetail[0].endActiveDate &&
            nextTripCamerasDetail[0].endActiveDate !== 'Invalid date'
          ) {
            this.endActiveTime = {
              HH: moment(nextTripCamerasDetail[0].endActiveDate).format('HH'),
              mm: moment(nextTripCamerasDetail[0].endActiveDate).format('mm'),
            };
          } else this.endActiveTime = { HH: '00', mm: '00' };
        }

        if (this.editProjectTripBasic.id)
          this.cmaeraLocationEvenOptions = ['設置', '替換'];
      } else {
        this.tripCamerasDetail = [{}, {}];
        this.startActiveTime = { HH: '00', mm: '00' };
        this.endActiveTime = { HH: '00', mm: '00' };
      }
    },
    async setEditProjectTripReduest() {
      if (this.selectedCameraLocationIndex !== null) {
        let currentProjectTrip = Object.assign({}, this.projectTrip);
        if (currentProjectTrip.projectCameras !== undefined) {
          const projectCameras = currentProjectTrip.projectCameras.map(
            (value, index) => {
              let startActiveDate = {};
              let endActiveDate = {};

              if (
                this.tripCamerasDetail[index].startActiveDate &&
                this.tripCamerasDetail[index].startActiveDate !== 'Invalid date'
              ) {
                const startActiveDateAndTime = getDateAndTime(
                  this.tripCamerasDetail[index].startActiveDate,
                  this.startActiveTime,
                );
                startActiveDate = {
                  startActiveDate: dateFormatYYYYMMDDHHmmss(
                    startActiveDateAndTime,
                  ),
                };
              } else delete this.tripCamerasDetail[index].startActiveDate;

              if (
                this.tripCamerasDetail[index].endActiveDate &&
                this.tripCamerasDetail[index].endActiveDate !== 'Invalid date'
              ) {
                const endActiveDateAndTime = getDateAndTime(
                  this.tripCamerasDetail[index].endActiveDate,
                  this.endActiveTime,
                );
                endActiveDate = {
                  endActiveDate: dateFormatYYYYMMDDHHmmss(endActiveDateAndTime),
                };
              } else delete this.tripCamerasDetail[index].endActiveDate;

              const currentTripCamera = Object.assign(
                {},
                this.tripCamerasDetail[index],
                startActiveDate,
                endActiveDate,
              );

              return { cameraSn: value, ...currentTripCamera };
            },
          );
          currentProjectTrip.projectCameras = projectCameras;
        }

        if (Object.keys(currentProjectTrip).length > 0) {
          this.editProjectTripBasic.studyAreas[
            this.selectedStudyAreaIndex
          ].cameraLocations[this.selectedCameraLocationIndex] = {
            ...currentProjectTrip,
          };
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
