<template>
  <div class="list-project-trip">
    <div>
      <el-table :data="projectTripsDataFilter" stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row :gutter="10">
              <el-col :span="4">
                <div class="trip-detail">
                  <h5>樣區</h5>
                  <div class="project-trip-sidebar">
                    <div
                      v-for="studyArea in props.row.studyAreas"
                      :key="studyArea.studyArea"
                    >
                      <div
                        v-text="studyArea.title"
                        class="project-trip-sidebar-item"
                        :class="{
                          'is-active':
                            selectedTrip[props.row.sn] &&
                            selectedTrip[props.row.sn].studyArea.studyArea ===
                              studyArea.studyArea,
                        }"
                        @click="selectStudyArea(props.row.sn, studyArea)"
                      ></div>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="trip-detail">
                  <h5>
                    相機位置{{
                      selectedTrip[props.row.sn] &&
                      selectedTrip[props.row.sn].studyArea.title
                        ? '-' + selectedTrip[props.row.sn].studyArea.title
                        : ''
                    }}
                  </h5>
                  <div
                    style="padding: 0 20px;"
                    v-show="
                      selectedTrip[props.row.sn] &&
                        selectedTrip[props.row.sn].studyArea.title
                    "
                  >
                    <el-table
                      :data="
                        selectedTrip[props.row.sn] &&
                          selectedTrip[props.row.sn].studyArea.cameraLocations
                      "
                      :row-class-name="selectedCameraLocationStyle"
                      @row-click="selectCameraLocation($event, props.row.sn)"
                      style="width: 100%"
                    >
                      <el-table-column label="位置" prop="title" />
                      <el-table-column label="事件" prop="cameraLocationEvent">
                        <template slot-scope="props">
                          <div :title="props.row.cameraLocationEvent">
                            {{
                              cmaeraLocationEvenString[
                                props.row.cameraLocationEvent
                              ] || ''
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="註記" width="120">
                        <template slot-scope="props">
                          <div :title="props.row.cameraLocationMark">
                            {{ props.row.cameraLocationMark }}
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="trip-detail">
                  <h5>
                    相機資訊{{
                      selectedTrip[props.row.sn] &&
                      selectedTrip[props.row.sn].cameraLocation.title
                        ? '-' + selectedTrip[props.row.sn].cameraLocation.title
                        : ''
                    }}
                  </h5>
                  <div
                    style="padding: 0 20px;"
                    v-show="
                      selectedTrip[props.row.sn] &&
                        selectedTrip[props.row.sn].studyArea.title
                    "
                    class="trip-camera-detail"
                  >
                    <el-table
                      :data="
                        selectedTrip[props.row.sn] &&
                          selectedTrip[props.row.sn].cameraLocation
                            .projectCameras
                      "
                      style="width: 100%"
                    >
                      <el-table-column type="expand" width="30">
                        <template slot-scope="tripCamera">
                          <el-row>
                            <el-col :span="12">
                              <div class="mb-1 camera-setting-title">
                                相機設定
                              </div>
                              <div
                                v-for="(cameraSettingKey,
                                index) in cameraSettingKeys"
                                :key="index"
                              >
                                <el-row>
                                  <el-col :span="12">
                                    <span>
                                      {{ cameraSettingKey.keyName }}
                                    </span>
                                  </el-col>
                                  <el-col :span="12">
                                    <span>
                                      {{ tripCamera.row[cameraSettingKey.key] }}
                                      {{
                                        tripCamera.row[cameraSettingKey.key]
                                          ? cameraSettingKey.unit || ''
                                          : ''
                                      }}
                                    </span>
                                  </el-col>
                                </el-row>
                              </div>
                            </el-col>
                            <el-col :span="12">
                              <div class="mb-1 camera-setting-title">
                                拍攝設定
                              </div>
                              <div
                                v-for="(shotSettingKey,
                                index) in shotSettingKeys"
                                :key="index"
                              >
                                <el-row>
                                  <el-col :span="12">
                                    <span>
                                      {{ shotSettingKey.keyName }}
                                    </span>
                                  </el-col>
                                  <el-col :span="12">
                                    <span>
                                      {{ tripCamera.row[shotSettingKey.key] }}
                                      {{
                                        tripCamera.row[shotSettingKey.key]
                                          ? shotSettingKey.unit || ''
                                          : ''
                                      }}
                                    </span>
                                  </el-col>
                                </el-row>
                              </div>
                            </el-col>
                          </el-row>
                        </template>
                      </el-table-column>
                      <el-table-column label="相機編號" prop="cameraSn" />
                      <el-table-column label="相機狀態" width="80">
                        <template slot-scope="tripCamera">
                          <div
                            :title="
                              cameraStateString[tripCamera.row.cameraState] ||
                                ''
                            "
                          >
                            {{
                              cameraStateString[tripCamera.row.cameraState] ||
                                ''
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="註記" prop="cameraMark">
                        <template slot-scope="tripCamera">
                          <div :title="tripCamera.row.cameraMark">
                            {{ tripCamera.row.cameraMark }}
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="float-right mt-3">
              <button
                class="btn btn-green-border mr-3"
                @click="openCheckModal(props.row.sn, props.row.id)"
              >
                刪除行程
              </button>
              <button
                class="btn btn-orange"
                @click="editProjectTrip(props.row)"
              >
                更改行程
              </button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="行程編號"
          prop="sn"
          width="120"
        ></el-table-column>
        <el-table-column label="日期" width="120">
          <template slot-scope="props">
            {{ formatDate(props.row.date) }}
          </template>
        </el-table-column>
        <el-table-column
          label="人員"
          prop="member"
          width="120"
        ></el-table-column>
        <el-table-column label="樣區">
          <template slot-scope="props">
            <div class="study-area-row">
              {{
                props.row.studyAreas.reduce((pre, curr) => {
                  if (pre === '') return curr.title;
                  else return pre + '、' + curr.title;
                }, '')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="行程註記" prop="mark"
          ><template slot-scope="props">
            <div :title="props.row.mark" class="float-left" style="width: 80%">
              {{ props.row.mark }}
            </div>
            <div class="float-right">
              <i
                class="el-icon-delete"
                @click="openCheckModal(props.row.sn, props.row.id)"
              ></i></div
          ></template>
        </el-table-column>
      </el-table>
      <double-check-modal-with-style
        :open="showCheckModal"
        :title="`您確定要刪除${selectedProjectTripSn}嗎？`"
        @summit="checkDeleteProjectTrip"
        @close="closeCheckModal"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import DoubleCheckModalWithStyle from '@/components/Modal/DoubleCheckModalWithStyle.vue';

const cameraSettingKeys = [
  {
    keyName: '記憶卡檔案數',
    key: 'cameraMemoryCardNumber',
  },
  {
    keyName: '電池類型',
    key: 'cameraBatteryType',
  },
  {
    keyName: '電池電量',
    key: 'cameraBatteryRemainingCapacity',
  },
];
const shotSettingKeys = [
  {
    keyName: 'LED 補光強度',
    key: 'cameraBrightness',
  },
  {
    keyName: '敏感度',
    key: 'cameraSensitivity',
  },
  {
    keyName: '影片長度',
    key: 'cameraVideoLength',
    unit: '分鐘',
  },
  {
    keyName: '連拍張數',
    key: 'cameraContinuousShots',
    unit: '張',
  },
  {
    keyName: '相機方位',
    key: 'cameraPosition',
    unit: '度',
  },
  {
    keyName: '相機俯角',
    key: 'cameraDepressionAngle',
    unit: '度',
  },
  {
    keyName: '感應距離',
    key: 'cameraSensingDistance',
    unit: '公尺',
  },
];

export default {
  name: 'ListProjectTrip',
  props: {
    projectId: {
      type: String,
    },
    searchTrip: {
      type: String,
    },
    projectTripsData: {
      type: Array,
      default: () => [],
    },
    cmaeraLocationEvenString: {
      type: Object,
    },
    cameraStateString: {
      type: Object,
    },
  },
  components: {
    DoubleCheckModalWithStyle,
  },
  data() {
    return {
      showCheckModal: false,
      selectedProjectTripSn: '',
      selectedProjectTripId: '',
      selectedTrip: {},
      cameraSettingKeys,
      shotSettingKeys,
      projectTripsDataFilter: [],
    };
  },
  mounted() {
    this.projectTripsDataFilter = this.projectTripsData;
  },
  watch: {
    projectTripsData: function() {
      this.projectTripsDataFilter = this.projectTripsData;
    },
    searchTrip: function() {
      this.projectTripsDataFilter = this.projectTripsData.filter(data => {
        return (
          !this.searchTrip ||
          (data.sn &&
            data.sn.toLowerCase().includes(this.searchTrip.toLowerCase())) ||
          (data.date &&
            this.formatDate(data.date)
              .toLowerCase()
              .includes(this.searchTrip.toLowerCase())) ||
          (data.member &&
            data.member
              .toLowerCase()
              .includes(this.searchTrip.toLowerCase())) ||
          (data.studyAreas &&
            data.studyAreas.some(studyArea => {
              return studyArea.title
                .toLowerCase()
                .includes(this.searchTrip.toLowerCase());
            })) ||
          (data.mark &&
            data.mark.toLowerCase().includes(this.searchTrip.toLowerCase()))
        );
      });
    },
  },
  methods: {
    openCheckModal(sn, id) {
      this.selectedProjectTripSn = sn;
      this.selectedProjectTripId = id;
      this.showCheckModal = true;
    },
    closeCheckModal() {
      this.showCheckModal = false;
    },
    checkDeleteProjectTrip() {
      this.$emit('deleteProjectTrip', {
        projectId: this.projectId,
        tripId: this.selectedProjectTripId,
      });
      this.showCheckModal = false;
    },
    formatDate(date) {
      return moment(date).format('YYYY/MM/DD');
    },
    selectStudyArea(sn, studyArea) {
      this.selectedTrip = {
        ...this.selectedTrip,
        [sn]: {
          studyArea,
          cameraLocation: {},
        },
      };
    },
    selectCameraLocation(cameraLocation, sn) {
      const currentTrip = { ...this.selectedTrip[sn], cameraLocation };
      this.selectedTrip = {
        ...this.selectedTrip,
        [sn]: currentTrip,
      };
    },
    selectedCameraLocationStyle({ row }) {
      let result = '';
      Object.values(this.selectedTrip).some(({ cameraLocation }) => {
        if (cameraLocation._id === row._id) {
          result = 'is-active';
          return true;
        }
      });
      return result;
    },
    editProjectTrip(currentTrip) {
      this.$emit('openEditProjectTripBasic', currentTrip);
    },
  },
};
</script>
