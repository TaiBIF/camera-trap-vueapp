<template>
  <div class="container">
    <router-link to="/download">
      <small class="text-gray">
        <i class="fa fa-chevron-left"></i> 返回資料篩選及計算
      </small>
    </router-link>

    <h1 class="text-green">資料計算結果</h1>

    <div class="panel panel-project">
      <div class="float-right">
        <a
          class="btn btn-green-border btn-sm"
          v-tooltip.bottom="'將計算結果輸出為 CSV 檔並下載'"
        >
          <span class="icon"><i class="icon-download-green"></i></span>
          下載計算結果
        </a>
        <button class="btn btn-orange btn-sm ml-2" @click="submitCalculate">
          計算
        </button>
      </div>

      <div class="panel-body">
        <form class="form-horizontal">
          <div class="row">
            <div class="col-12">
              <h6 class="text-gray mt-3">資料來源</h6>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="form-group">
                <label>計畫名稱：</label>
                <v-select
                  v-model="currentProject"
                  :options="projectOptions"
                  :placeholder="'請選擇計畫名稱'"
                />
              </div>
              <div class="row">
                <div class="col-4">
                  <div class="form-group">
                    <label>樣區：</label>
                    <v-select
                      v-model="currentStudyArea"
                      :options="studyAreaOptions"
                      :placeholder="'請選擇樣區名稱'"
                    />
                  </div>
                </div>
                <!--div class="col-4">
                  <div class="form-group">
                    <label>子樣區：</label>
                  </div>
                </div-->
                <div class="col-4">
                  <div class="form-group">
                    <label>相機位置：</label>
                    <v-select
                      v-model="currentCameraLocation"
                      :options="cameraOptions"
                      :placeholder="'請選相機位置'"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-4 divider">
              <div class="form-group">
                <label>物種：</label>
                <v-select
                  v-model="species"
                  :options="speciesOptions"
                  :placeholder="'請選擇物種'"
                />
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label>資料啟始時間：</label>
                    <div class="input-group-inline">
                      <div class="input-group">
                        <date-picker
                          v-model="startDate"
                          :placeholder="'2018-09-20'"
                          :format="'YYYY-MM-DD'"
                          :first-day-of-week="1"
                        />
                        <div class="input-group-append">
                          <i class="icon icon-calendar"></i>
                        </div>
                      </div>
                      <div class="input-group ml-2">
                        <vue-timepicker v-model="startTime" format="HH:mm" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label>資料結束時間：</label>
                    <div class="input-group-inline">
                      <div class="input-group">
                        <date-picker
                          v-model="endDate"
                          :placeholder="'2018-09-20'"
                          :format="'YYYY-MM-DD'"
                          :first-day-of-week="1"
                        />
                        <div class="input-group-append">
                          <i class="icon icon-calendar"></i>
                        </div>
                      </div>
                      <div class="input-group ml-2">
                        <vue-timepicker v-model="endTime" format="HH:mm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-4 divider">
              <div class="form-group">
                <label>有效照片判定間隔：</label>
                <v-select
                  v-model="validTimeInterval"
                  :options="[2, 5, 10, 30, 60]"
                  :placeholder="'請選擇有效時間判定間隔'"
                ></v-select>
              </div>
              <div class="form-group">
                <label>目擊事件判定間隔：</label>
                <v-select
                  v-model="eventTimeInterval"
                  :options="[2, 5, 10, 30, 60]"
                  :placeholder="'請選擇目擊事件判斷間隔'"
                ></v-select>
              </div>
            </div>
          </div>
        </form>
      </div>
      <!-- end panel-body -->
    </div>
    <!-- end panel -->
    <div class="sheet-container">
      <CalculationSheet ref="sheet" :calculatorData="calculator" />
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { getProjectCameraLocations } from '@/service';
import CalculationSheet from './CalculationSheet';
import DatePicker from 'vue2-datepicker';
import VueTimepicker from 'vue2-timepicker';
import moment from 'moment';
import vSelect from 'vue-select';

const projects = createNamespacedHelpers('projects');
const studyAreas = createNamespacedHelpers('studyAreas');
const calculator = createNamespacedHelpers('calculator');

const getTime = (day, time) => {
  return moment(day)
    .hour(time.HH)
    .minute(time.mm);
};

export default {
  components: {
    vSelect,
    DatePicker,
    VueTimepicker,
    CalculationSheet,
  },
  data: function() {
    return {
      isLoading: true,
      currentStudyArea: undefined,
      currentProject: undefined,
      currentCameraLocation: undefined,
      species: undefined,
      startDate: '',
      startTime: {
        HH: '10',
        mm: '00',
      },
      endDate: '',
      endTime: {
        HH: '10',
        mm: '00',
      },
      validTimeInterval: undefined,
      eventTimeInterval: undefined,
    };
  },
  mounted() {
    this.getProjects();
  },
  methods: {
    ...projects.mapActions(['getProjects', 'getProjectSpecies']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
    ]),
    ...calculator.mapActions(['getCalculateOI', 'getCalculateLTD']),
    handleStudyAreaChange() {
      this.studyAreas.getProjectCameraLocations();
    },
    async submitCalculate() {
      this.isLoading = true;
      await this.getCalculateOI({
        cameraLocation: this.currentCameraLocation.value,
        startTime: getTime(this.startDate, this.startTime).toISOString(),
        endTime: getTime(this.endDate, this.endTime).toISOString(),
        species: this.species.value,
        validTimeInterval: this.validTimeInterval,
        eventTimeInterval: this.eventTimeInterval,
      });
      this.isLoading = false;
    },
  },
  watch: {
    currentStudyArea: function() {
      this.getProjectCameraLocations({
        projectId: this.currentProject.value,
        studyAreaId: this.currentStudyArea.value,
      });
    },
    currentProject: function() {
      this.getProjectStudyAreas(this.currentProject.value);
      this.getProjectSpecies(this.currentProject.value);
    },
  },
  computed: {
    ...projects.mapState(['projects', 'projectSpecies']),
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    ...calculator.mapState(['calculator']),
    projectOptions() {
      return this.projects.map(({ title, id }) => ({
        label: title,
        value: id,
      }));
    },
    studyAreaOptions() {
      return this.studyAreas.map(({ title, id, children }) => ({
        label: title,
        value: id,
        children: !children
          ? []
          : children.map(({ title, id }) => ({
              label: title,
              value: id,
            })),
      }));
    },
    speciesOptions() {
      return this.projectSpecies.map(({ title, id }) => ({
        label: title['zh-TW'],
        value: id,
      }));
    },
    cameraOptions() {
      return this.cameraLocations.map(({ name, id }) => ({
        label: name,
        value: id,
      }));
    },
  },
};
</script>
