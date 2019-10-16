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
                v-model="projectTrip.cameraLocationEvent"
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
            half: tripCameraDetailHalf,
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
                :options="cameraStateOptions"
                placeholder="請選擇相機狀態"
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
              <span v-if="tripCameraDetailHalf && index == 0"
                >{{ tripCamerasDetail[index].cameraBatteryType }}
              </span>
              <v-select
                v-else
                v-model="tripCamerasDetail[index].cameraBatteryType"
                :options="batteryTypeOptions"
                placeholder="請選擇電池類型"
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
              <span v-if="tripCameraDetailHalf && index == 0"
                >{{ tripCamerasDetail[index].cameraBrightness }}
              </span>
              <v-select
                v-else
                v-model="tripCamerasDetail[index].cameraBrightness"
                :options="brightnessOptions"
                placeholder="請選擇光強度"
              ></v-select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">敏感度:</label>
            <div class="col-6">
              <span v-if="tripCameraDetailHalf && index == 0"
                >{{ tripCamerasDetail[index].cameraSensitivity }}
              </span>
              <v-select
                v-else
                v-model="tripCamerasDetail[index].cameraSensitivity"
                :options="sensitivityOptions"
                placeholder="請選擇敏感度"
              ></v-select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">影片長度:</label>
            <span v-if="tripCameraDetailHalf && index == 0"
              >{{ tripCamerasDetail[index].cameraVideoLength }}
            </span>
            <div v-else class="col-6">
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
            <span v-if="tripCameraDetailHalf && index == 0"
              >{{ tripCamerasDetail[index].cameraContinuousShots }}
            </span>
            <div v-else class="col-6">
              <input
                v-model="tripCamerasDetail[index].cameraContinuousShots"
                type="text"
                placeholder="請輸入連拍張數"
                class="form-control"
              />
            </div>
            <span>張</span>
          </div>
          <div class="form-group row">
            <label class="col-4">相機方位:</label>
            <span v-if="tripCameraDetailHalf && index == 0"
              >{{ tripCamerasDetail[index].cameraPosition }}
            </span>
            <div v-else class="col-6">
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
            <span v-if="tripCameraDetailHalf && index == 0"
              >{{ tripCamerasDetail[index].cameraDepressionAngle }}
            </span>
            <div v-else class="col-6">
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
            <span v-if="tripCameraDetailHalf && index == 0"
              >{{ tripCamerasDetail[index].cameraSensingDistance }}
            </span>
            <div v-else class="col-6">
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
    setEditProjectTripData: {
      type: Function,
    },
    cmaeraLocationEvenString: {
      type: Object,
    },
    cameraStateString: {
      type: Object,
    },
  },
  data: function() {
    return {
      activeName: '',
      projectTrip: {},
      tripCamerasDetail: [{}, {}],
      tripCamerasDetailOld: [],
      startActiveTime: { HH: '00', mm: '00' },
      endActiveTime: { HH: '00', mm: '00' },
      cmaeraLocationEvenOptionsAll: [],
      cameraStateOptionsAll: [],
      cmaeraLocationEvenOptions: [],
      cameraStateOptions: [],
      batteryTypeOptions,
      brightnessOptions,
      sensitivityOptions,
      projectCameraOptions: [],
      selectedStudyAreaIndex: null,
      selectedCameraLocationIndex: null,
      editProjectTripBasic: {},
      projectCameraLimit: 1,
      projectCameraNoDrop: false,
      endActiveDate: '',
      tripCameraDetailHalf: false,
    };
  },
  async mounted() {
    this.editProjectTripBasic = Object.assign({}, this.editProjectTripData);
    // 所有相機位置事件選項，對照顯示文字(label)及值(value)
    this.cmaeraLocationEvenOptionsAll = Object.keys(
      this.cmaeraLocationEvenString,
    ).map(value => ({ label: this.cmaeraLocationEvenString[value], value }));
    // 所有相機狀態選項，對照顯示文字(label)及值(value)
    this.cameraStateOptionsAll = Object.keys(this.cameraStateString).map(
      value => ({ label: this.cameraStateString[value], value }),
    );

    // 預設選項只有 事件: 設置 狀態: 正常
    this.cmaeraLocationEvenOptions = [this.cmaeraLocationEvenOptionsAll[0]];
    this.cameraStateOptions = [this.cameraStateOptionsAll[0]];

    await this.getProjectCameras({ projectId: this.projectId });
    this.projectCameraOptions = this.projectCameras.map(({ sn }) => sn);
    this.$parent.$on(
      'setEditProjectTripReduest',
      this.setEditProjectTripReduest,
    );
  },
  watch: {
    'projectTrip.projectCameras': function() {
      this.tripCameraDetailHalf =
        this.projectTrip.projectCameras &&
        this.projectTrip.projectCameras.length > 1;
    },
  },
  methods: {
    async selectCameraLocation(studyAreaIndex, cameraLocationIndex) {
      await this.setEditProjectTripReduest();

      this.selectedStudyAreaIndex = studyAreaIndex;
      this.selectedCameraLocationIndex = cameraLocationIndex;

      const nextProjectTrip = this.editProjectTripBasic.studyAreas[
        this.selectedStudyAreaIndex
      ].cameraLocations[this.selectedCameraLocationIndex];

      // 從資料轉換成表單用格式 相機位置事件
      const cameraLocationEvent = nextProjectTrip.cameraLocationEvent
        ? {
            label: this.cmaeraLocationEvenString[
              nextProjectTrip.cameraLocationEvent
            ],
            value: nextProjectTrip.cameraLocationEvent,
          }
        : undefined;

      let projectCameras = [];
      let nextTripCameraDetail = {};
      let nextTripCamerasDetail = [];
      this.tripCamerasDetailOld = [];

      if (
        nextProjectTrip.projectCameras &&
        nextProjectTrip.projectCameras.length > 0
      ) {
        nextTripCameraDetail =
          nextProjectTrip.projectCameras[
            nextProjectTrip.projectCameras.length - 1
          ];
        // 從資料轉換成表單用格式 相機狀態
        let cameraState = nextTripCameraDetail.cameraState
          ? {
              cameraState: {
                label: this.cameraStateString[nextTripCameraDetail.cameraState],
                value: nextTripCameraDetail.cameraState,
              },
            }
          : {};
        nextTripCamerasDetail = [{ ...nextTripCameraDetail, ...cameraState }];

        // 從資料轉換成表單用格式 相機編號
        projectCameras = [nextTripCamerasDetail[0].cameraSn];

        if (
          !nextProjectTrip.projectCameras[
            nextProjectTrip.projectCameras.length - 1
          ]._id
        ) {
          nextTripCameraDetail =
            nextProjectTrip.projectCameras[
              nextProjectTrip.projectCameras.length - 2
            ];
          // 從資料轉換成表單用格式 相機狀態
          cameraState = nextTripCameraDetail.cameraState
            ? {
                cameraState: {
                  label: this.cameraStateString[
                    nextTripCameraDetail.cameraState
                  ],
                  value: nextTripCameraDetail.cameraState,
                },
              }
            : {};
          nextTripCamerasDetail = [
            { ...nextTripCameraDetail, ...cameraState },
            ...nextTripCamerasDetail,
          ];

          // 從資料轉換成表單用格式 相機編號
          projectCameras = [
            nextTripCamerasDetail[0].cameraSn,
            ...projectCameras,
          ];
        }

        // 保留舊的行程相機
        const tripCamerasDetailOldCount =
          nextProjectTrip.projectCameras.length - projectCameras.length;
        if (tripCamerasDetailOldCount > 0) {
          this.tripCamerasDetailOld = nextProjectTrip.projectCameras.slice(
            0,
            tripCamerasDetailOldCount,
          );
        }
      }

      this.projectTrip = {
        ...nextProjectTrip,
        cameraLocationEvent,
        projectCameras,
      };

      if (nextTripCamerasDetail && nextTripCamerasDetail.length > 0) {
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

        this.tripCamerasDetail = nextTripCamerasDetail;
        if (this.tripCamerasDetail.length === 1) {
          this.tripCamerasDetail[1] = {};
        }

        this.cmaeraLocationEvenOptions = [...this.cmaeraLocationEvenOptionsAll];
        this.cameraStateOptions = [...this.cameraStateOptionsAll];
      } else {
        this.tripCamerasDetail = [{}, {}];
        this.startActiveTime = { HH: '00', mm: '00' };
        this.endActiveTime = { HH: '00', mm: '00' };

        this.cmaeraLocationEvenOptions = [this.cmaeraLocationEvenOptionsAll[0]];
        this.cameraStateOptions = [this.cameraStateOptionsAll[0]];
      }

      this.changeLimit();
    },
    async setEditProjectTripReduest() {
      if (this.selectedCameraLocationIndex !== null) {
        let currentProjectTrip = Object.assign({}, this.projectTrip);
        if (currentProjectTrip.projectCameras !== undefined) {
          // 從表單用格式轉換成資料 相機位置事件
          let cameraLocationEvent = {};
          if (this.projectTrip.cameraLocationEvent)
            cameraLocationEvent = this.projectTrip.cameraLocationEvent.value;
          // 從表單用格式轉換成資料 相機編號
          const projectCameras = currentProjectTrip.projectCameras.map(
            (value, index) => {
              let cameraState = {};
              let startActiveDate = {};
              let endActiveDate = {};

              if (this.tripCamerasDetail[index].cameraState) {
                // 從表單用格式轉換成資料 相機狀態
                cameraState = {
                  cameraState: this.tripCamerasDetail[index].cameraState.value,
                };
              }

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
                cameraState,
                startActiveDate,
                endActiveDate,
              );

              return { cameraSn: value, ...currentTripCamera };
            },
          );
          currentProjectTrip = {
            ...currentProjectTrip,
            cameraLocationEvent,
            projectCameras: [...this.tripCamerasDetailOld, ...projectCameras],
          };
        }

        if (Object.keys(currentProjectTrip).length > 0) {
          this.editProjectTripBasic.studyAreas[
            this.selectedStudyAreaIndex
          ].cameraLocations[this.selectedCameraLocationIndex] = {
            ...currentProjectTrip,
          };
        }
        this.setEditProjectTripData(this.editProjectTripBasic);
      }
    },
    changeLimit() {
      this.projectCameraLimit =
        this.projectTrip.cameraLocationEvent &&
        this.projectTrip.cameraLocationEvent.value ==
          this.cmaeraLocationEvenOptionsAll[1].value
          ? 2
          : 1;

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
