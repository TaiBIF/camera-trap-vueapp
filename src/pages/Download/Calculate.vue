<template>
  <div class="container-fluid" :class="{ loading: isLoading }">
    <router-link to="/download">
      <small class="text-gray">
        <i class="fa fa-chevron-left"></i> 返回資料篩選及計算
      </small>
    </router-link>

    <h1 class="text-green">資料計算結果</h1>

    <div class="panel panel-project">
      <div class="float-right">
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
                  v-model="form.selectedProject"
                  :options="projectOptions"
                  placeholder="請選擇計畫名稱"
                />
              </div>
              <div class="row">
                <div class="col-4">
                  <div class="form-group">
                    <label>樣區：</label>
                    <v-select
                      v-model="form.selectedStudyArea"
                      :options="studyAreaOptions"
                      :disabled="!studyAreaOptions.length"
                      placeholder="請選擇樣區名稱"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="form-group">
                    <label>子樣區：</label>
                    <v-select
                      v-model="form.selectedSubStudyArea"
                      :options="subStudyAreaOptions"
                      :disabled="!subStudyAreaOptions.length"
                      placeholder="請選擇樣區名稱"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="form-group">
                    <label>相機位置：</label>
                    <v-select
                      v-model="form.selectedCameraLocation"
                      :options="cameraOptions"
                      :disabled="!cameraOptions.length"
                      placeholder="請選相機位置"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-4 divider">
              <div class="form-group">
                <label>物種：</label>
                <v-select
                  v-model="form.selectedSpecies"
                  :options="speciesOptions"
                  placeholder="請選擇物種"
                />
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label>資料啟始時間：</label>
                    <div class="input-group-inline">
                      <div class="input-group">
                        <date-picker
                          v-model="form.startDate"
                          placeholder="2018-09-20"
                          format="YYYY-MM-DD"
                          :first-day-of-week="1"
                        />
                        <div class="input-group-append">
                          <i class="icon icon-calendar"></i>
                        </div>
                      </div>
                      <div class="input-group ml-2">
                        <vue-timepicker
                          v-model="form.startTime"
                          format="HH:mm"
                        />
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
                          v-model="form.endDate"
                          placeholder="2018-09-20"
                          format="YYYY-MM-DD"
                          :first-day-of-week="1"
                        />
                        <div class="input-group-append">
                          <i class="icon icon-calendar"></i>
                        </div>
                      </div>
                      <div class="input-group ml-2">
                        <vue-timepicker v-model="form.endTime" format="HH:mm" />
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
                  v-model="form.selectedValidTimeInterval"
                  :options="timeIntervalOptions"
                  placeholder="請選擇有效時間判定間隔"
                ></v-select>
              </div>
              <div class="form-group">
                <label>目擊事件判定間隔：</label>
                <v-select
                  v-model="form.selectedEventTimeInterval"
                  :options="timeIntervalOptions"
                  placeholder="請選擇目擊事件判斷間隔"
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
      <CalculationSheet
        ref="sheet"
        :calculatorData="calculator"
        :calculateType="calculateType"
      />
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { getCameraLocation } from '@/service';
import { getLanguage } from '@/utils/i18n';
import CalculationSheet from './CalculationSheet';
import DatePicker from 'vue2-datepicker';
import VueTimepicker from 'vue2-timepicker';
import moment from 'moment';
import vSelect from 'vue-select';

const projects = createNamespacedHelpers('projects');
const studyAreas = createNamespacedHelpers('studyAreas');
const calculator = createNamespacedHelpers('calculator');

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
      isInitial: true,
      timeIntervalOptions: [
        { label: '2 分鐘', value: 2 * 60 * 1000 },
        { label: '5 分鐘', value: 5 * 60 * 1000 },
        { label: '10 分鐘', value: 10 * 60 * 1000 },
        { label: '30 分鐘', value: 30 * 60 * 1000 },
        { label: '60 分鐘', value: 60 * 60 * 1000 },
      ],
      calculateType: this.$route.query.calculateType || 'oi',
      form: {
        selectedProject: null,
        selectedStudyArea: null,
        selectedSubStudyArea: null,
        selectedCameraLocation: null,
        selectedSpecies: null,
        startDate: (() => {
          if (this.$route.query.startTime) {
            return moment(this.$route.query.startTime).format('YYYY-MM-DD');
          }
          return '';
        })(),
        startTime: (() => {
          if (this.$route.query.startTime) {
            const date = moment(this.$route.query.startTime);
            return { HH: date.format('HH'), mm: date.format('mm') };
          }
          return { HH: '00', mm: '00' };
        })(),
        endDate: (() => {
          if (this.$route.query.endTime) {
            return moment(this.$route.query.endTime).format('YYYY-MM-DD');
          }
        })(),
        endTime: (() => {
          if (this.$route.query.endTime) {
            const date = moment(this.$route.query.endTime);
            return { HH: date.format('HH'), mm: date.format('mm') };
          }
          return { HH: '23', mm: '59' };
        })(),
        selectedValidTimeInterval: (() => {
          if (this.$route.query.validTimeInterval) {
            return {
              label: `${+this.$route.query.validTimeInterval / 60 / 1000} 分鐘`,
              value: +this.$route.query.validTimeInterval,
            };
          }
        })(),
        selectedEventTimeInterval: (() => {
          if (this.$route.query.eventTimeInterval) {
            return {
              label: `${+this.$route.query.eventTimeInterval / 60 / 1000} 分鐘`,
              value: +this.$route.query.eventTimeInterval,
            };
          }
        })(),
      },
    };
  },
  async mounted() {
    const tasks = [this.fetchInitialFormData()];
    if (this.$route.query.calculateType === 'ltd') {
      tasks.push(this.getCalculateLTD(this.$route.query));
    } else {
      tasks.push(this.getCalculateOI(this.$route.query));
    }
    await Promise.all(tasks);

    this.isLoading = false;
    setTimeout(() => {
      this.isInitial = false;
    });
  },
  methods: {
    ...projects.mapActions(['getAllProjects', 'getProjectSpecies']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
    ]),
    ...calculator.mapActions(['getCalculateOI', 'getCalculateLTD']),

    async fetchInitialFormData() {
      const [cameraLocation] = await Promise.all([
        getCameraLocation(this.$route.query.cameraLocation),
        this.getAllProjects({ size: 100, sort: 'title' }),
      ]);
      this.form.selectedProject = {
        label: cameraLocation.project.title,
        value: cameraLocation.project.id,
      };
      this.form.selectedCameraLocation = {
        label: cameraLocation.name,
        value: cameraLocation.id,
      };
      await Promise.all([
        this.getProjectSpecies(cameraLocation.project.id),
        this.getProjectStudyAreas(cameraLocation.project.id),
        this.getProjectCameraLocations({
          projectId: cameraLocation.project.id,
          studyAreaId: cameraLocation.studyArea.parent
            ? cameraLocation.studyArea.parent.id
            : cameraLocation.studyArea.id,
        }),
      ]);
      const species = this.projectSpecies.find(
        x => x.id === this.$route.query.species,
      );
      this.form.selectedSpecies = {
        label: species.title[getLanguage()],
        value: species.id,
      };
      if (cameraLocation.studyArea.parent) {
        // Set the parent and the child study area.
        const parent = this.studyAreas.find(
          x => x.id === cameraLocation.studyArea.parent.id,
        );
        const child = parent.children.find(
          x => x.id === cameraLocation.studyArea.id,
        );
        this.form.selectedStudyArea = {
          label: parent.title,
          value: parent.id,
        };
        this.form.selectedSubStudyArea = {
          label: child.title,
          value: child.id,
        };
      } else {
        const parent = this.studyAreas.find(
          x => x.id === cameraLocation.studyArea.id,
        );
        this.form.selectedStudyArea = {
          label: parent.title,
          value: parent.id,
        };
      }
    },
    async submitCalculate() {
      // todo: redo again!!!!!
      this.isLoading = true;
      this.isInitial = true;

      const query = {
        calculateType: this.$route.query.calculateType,
        cameraLocation: this.form.selectedCameraLocation.value,
        species: this.form.selectedSpecies.value,
        validTimeInterval: this.form.selectedValidTimeInterval.value,
        eventTimeInterval: this.form.selectedEventTimeInterval.value,
      };
      if (this.form.startDate) {
        const time = new Date(this.form.startDate);
        time.setHours(+this.form.startTime.HH);
        time.setMinutes(+this.form.startTime.mm);
        query.startTime = time.toISOString();
      }
      if (this.form.endDate) {
        const time = new Date(this.form.endDate);
        time.setHours(+this.form.endTime.HH);
        time.setMinutes(+this.form.endTime.mm);
        query.endTime = time.toISOString();
      }
      this.$router.push({ path: '/download/calculate', query });

      const tasks = [this.fetchInitialFormData()];
      if (this.$route.query.calculateType === 'ltd') {
        tasks.push(this.getCalculateLTD(this.$route.query));
      } else {
        tasks.push(this.getCalculateOI(this.$route.query));
      }
      await Promise.all(tasks);
      this.isLoading = false;
      setTimeout(() => {
        this.isInitial = false;
      });
    },
  },
  watch: {
    'form.selectedProject': function() {
      if (this.isInitial) {
        return;
      }
      this.getProjectStudyAreas(this.form.selectedProject.value);
      this.getProjectSpecies(this.form.selectedProject.value);
      this.form.selectedSpecies = null;
    },
    'form.selectedStudyArea': function() {
      if (this.isInitial) {
        return;
      }
      this.getProjectCameraLocations({
        projectId: this.form.selectedProject.value,
        studyAreaId: this.form.selectedStudyArea.value,
      });
      this.form.selectedSubStudyArea = null;
      this.form.selectedCameraLocation = null;
    },
    'form.selectedSubStudyArea': function() {
      if (this.isInitial) {
        return;
      }
      this.getProjectCameraLocations({
        projectId: this.form.selectedProject.value,
        studyAreaId: this.form.selectedSubStudyArea.value,
      });
      this.form.selectedCameraLocation = null;
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
      return this.studyAreas.map(({ title, id }) => ({
        label: title,
        value: id,
      }));
    },
    subStudyAreaOptions() {
      if (!this.form.selectedSubStudyArea) {
        return [];
      }
      const studyArea = this.studyAreas.find(
        x => x.id === this.form.selectedSubStudyArea.value,
      );
      if (!studyArea) {
        return [];
      }
      return studyArea.children.map(({ title, id }) => ({
        label: title,
        value: id,
      }));
    },
    speciesOptions() {
      return this.projectSpecies.map(({ title, id }) => ({
        label: title[getLanguage()],
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
