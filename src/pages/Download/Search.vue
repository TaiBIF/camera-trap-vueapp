<template>
  <div class="container">
    <h1 class="text-green">資料篩選與下載</h1>
    <div :class="{ loading: isLoading, panel: true }">
      <div class="panel-content">
        <form class="search-columns">
          <div class="row">
            <div class="form-group col-4">
              <label>物種</label>
              <v-select
                :options="speciesOptions"
                :disabled="!speciesOptions.length"
                v-model="form.selectedSpecies"
                multiple
              />
            </div>
            <div class="form-group col-4">
              <label>資料起始時間</label>
              <div class="input-group">
                <div class="input-group-inline">
                  <date-picker
                    v-model="form.startDate"
                    placeholder="2001-01-01"
                    format="YYYY-MM-DD"
                    :first-day-of-week="1"
                    :input-class="'form-control filter-input'"
                  />
                  <div class="input-group-append">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
                &nbsp;&nbsp;
                <div class="input-group-inline">
                  <vue-timepicker
                    v-model="form.startTime"
                    format=""
                    input-class="form-control"
                  ></vue-timepicker>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="form-group">
                <label>資料結束時間</label>
                <div class="input-group">
                  <div class="input-group-inline">
                    <date-picker
                      v-model="form.endDate"
                      placeholder="2018-12-31"
                      format="YYYY-MM-DD"
                      :first-day-of-week="1"
                      :input-class="'form-control filter-input'"
                    />
                    <div class="input-group-append">
                      <i class="icon icon-calendar"></i>
                    </div>
                  </div>
                  &nbsp;&nbsp;
                  <div class="input-group-inline">
                    <vue-timepicker
                      v-model="form.endTime"
                      format=""
                      input-class="form-control"
                    ></vue-timepicker>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-for="(item, index) in form.items" :key="`data-form-${index}`">
            <div class="row">
              <div class="form-group col-8">
                <label class="required">計畫名稱：</label>
                <v-select
                  :options="projectOptions"
                  v-model="item.selected.project"
                  :on-change="generateHandlerForProjectSelectorChange(index)"
                  placeholder="請選擇計畫名稱"
                />
              </div>
              <div class="form-group col-4">
                <label class="required">行程</label>
                <v-select
                  :disabled="!item.options.trips.length"
                  :options="item.options.trips"
                  v-model="item.selected.sttripsudyArea"
                  placeholder="請選擇行程"
                />
              </div>
            </div>

            <div class="row">
              <div class="form-group col-4">
                <label class="required">樣區：</label>
                <v-select
                  :disabled="!item.options.studyAreas.length"
                  :options="item.options.studyAreas"
                  v-model="item.selected.studyArea"
                  :on-change="generateHandlerForStudyAreaSelectorChange(index)"
                  placeholder="請選擇樣區"
                />
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label>子樣區：</label>
                  <v-select
                    :disabled="!item.options.subStudyAreas.length"
                    :options="item.options.subStudyAreas"
                    v-model="item.selected.subStudyArea"
                    :on-change="
                      generateHandlerForSubStudyAreaSelectorChange(index)
                    "
                    placeholder="請選擇子樣區"
                  />
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label class="required">相機位置：</label>
                  <v-select
                    :disabled="!item.options.cameraLocations.length"
                    :options="item.options.cameraLocations"
                    v-model="item.selected.cameraLocation"
                    placeholder="請選擇相機位置"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { getLanguage } from '@/utils/i18n';
import { getProjectSpecies } from '@/service';
import datePicker from 'vue2-datepicker';
import idx from 'idx';
import vSelect from 'vue-select';
import vueTimepicker from 'vue2-timepicker';
import 'vue2-timepicker/dist/VueTimepicker.css';

const dataFields = createNamespacedHelpers('dataFields');
const projects = createNamespacedHelpers('projects');
const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  name: 'Search',
  components: { vSelect, vueTimepicker, datePicker },
  data() {
    return {
      isLoading: true,
      currentTab: 'search', // "search" | "calculate"
      isAdvanceSearch: false,
      timeIntervalOptions: [
        { label: '2 分鐘', value: 2 * 60 * 1000 },
        { label: '5 分鐘', value: 5 * 60 * 1000 },
        { label: '10 分鐘', value: 10 * 60 * 1000 },
        { label: '30 分鐘', value: 30 * 60 * 1000 },
        { label: '60 分鐘', value: 60 * 60 * 1000 },
      ],
      projectSpeciesOptions: [], // for the calculate {Array<{label: 'string', value: 'string'}>}
      speciesOptions: [], // {Array<{label: 'string', value: 'string'}>}
      form: {
        selectedCalculateType: { label: '有效照片與目擊事件', value: 'oi' },
        selectedSpecies: [],
        selectedValidTimeInterval: { label: '2 分鐘', value: 2 * 60 * 1000 },
        selectedEventTimeInterval: { label: '2 分鐘', value: 2 * 60 * 1000 },
        items: [
          {
            selected: {
              project: null,
              studyArea: null,
              subStudyArea: null,
              cameraLocation: null,
            },
            options: {
              studyAreas: [],
              subStudyAreas: [],
              cameraLocations: [],
              trips: [],
            },
            studyAreas: [], // All study areas of the selected project.
            cameraLocations: [], // All camera locations of the selected study area.
          },
        ],
        startDate: '',
        startTime: { HH: '00', mm: '00' },
        endDate: '',
        endTime: { HH: '23', mm: '59' },
        fieldValues: [],
        timeRangeStart: { HH: '00', mm: '00' },
        timeRangeEnd: { HH: '23', mm: '59' },
      },
    };
  },
  computed: {
    ...dataFields.mapGetters(['dataFields']),
    ...projects.mapState(['projects']),
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),

    projectOptions() {
      /*
      All projects.
      @returns {Array<{label: 'string', value: 'string'}>}
      */
      return this.projects.map(project => ({
        label: project.title,
        value: project.id,
      }));
    },
  },
  methods: {
    ...dataFields.mapActions(['getAllDataFields']),
    ...projects.mapActions(['getAllProjects']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getAllProjectCameraLocations',
    ]),

    convertDataFieldOptions(options) {
      /*
      @param options {Array<{id: "string", zh-TW: "label">}
      */
      return options.map(x => ({
        label: x[getLanguage()],
        value: x.id,
      }));
    },
    generateHandlerForProjectSelectorChange(index) {
      return () => {
        this.form.items[index].selected.studyArea = null;
        this.form.items[index].selected.subStudyArea = null;
        this.form.items[index].selected.cameraLocation = null;
        this.fetchFormOptions(index, 'project');
      };
    },
    generateHandlerForStudyAreaSelectorChange(index) {
      return () => {
        this.form.items[index].selected.subStudyArea = null;
        this.form.items[index].selected.cameraLocation = null;
        this.fetchFormOptions(index, 'studyArea');
      };
    },
    generateHandlerForSubStudyAreaSelectorChange(index) {
      return () => {
        this.form.items[index].selected.cameraLocation = null;
        this.fetchFormOptions(index, 'subStudyArea');
      };
    },
    async fetchFormOptions(index, changed) {
      /*
      @param changed {String} "project" | "studyArea" | "subStudyArea"
       */
      const form = this.form.items[index];
      if (changed === 'project') {
        const projectIds = new Set();
        this.form.items.forEach(form => {
          projectIds.add(form.selected.project.value);
        });
        const tasks = Array.from(projectIds).map(projectId =>
          getProjectSpecies(projectId),
        );
        tasks.unshift(this.getProjectStudyAreas(form.selected.project.value));
        // eslint-disable-next-line no-unused-vars
        const [_, ...species] = await Promise.all(tasks);
        this.speciesOptions = [];
        species.forEach((species, index) => {
          if (index === 0) {
            this.projectSpeciesOptions = species.items.map(x => ({
              label: x.title[getLanguage()],
              value: x.id,
            }));
          }
          species.items.forEach(x => {
            if (!this.speciesOptions.find(y => y.value === x.id)) {
              this.speciesOptions.push({
                label: x.title[getLanguage()],
                value: x.id,
              });
            }
          });
        });
        form.studyAreas = this.studyAreas;
        form.options.studyAreas = form.studyAreas.map(x => ({
          label: x.title,
          value: x.id,
        }));
      } else if (changed === 'studyArea') {
        if (!form.selected.studyArea) {
          return;
        }

        const parent = form.studyAreas.find(
          x => x.id === form.selected.studyArea.value,
        );
        form.options.subStudyAreas = parent.children.map(x => ({
          label: x.title,
          value: x.id,
        }));
        await this.getAllProjectCameraLocations({
          projectId: form.selected.project.value,
          studyAreaId: form.selected.studyArea.value,
        });
        form.cameraLocations = this.cameraLocations;
        form.options.cameraLocations = form.cameraLocations.map(x => ({
          label: x.name,
          value: x.id,
        }));
      } else if (changed === 'subStudyArea') {
        if (!form.selected.subStudyArea) {
          return;
        }

        await this.getAllProjectCameraLocations({
          projectId: form.selected.project.value,
          studyAreaId: form.selected.subStudyArea
            ? form.selected.subStudyArea.value
            : form.selected.studyArea.value,
        });
        form.cameraLocations = this.cameraLocations;
        form.options.cameraLocations = form.cameraLocations.map(x => ({
          label: x.name,
          value: x.id,
        }));
      }
    },
    addFormItem() {
      /*
      The user click the new data source button.
       */
      this.form.items.push({
        selected: {
          project: null,
          studyArea: null,
          subStudyArea: null,
          cameraLocation: null,
        },
        options: {
          studyAreas: [],
          subStudyAreas: [],
          cameraLocations: [],
        },
        studyAreas: [],
        cameraLocations: [],
      });
    },
    removeFormItem(index) {
      this.form.items.splice(index, 1);
    },
    submitSearchForm() {
      const query = {
        cameraLocations: this.form.items.map(
          x => x.selected.cameraLocation.value,
        ),
        species: this.form.selectedSpecies.map(x => x.value),
        // 補上 projectId, studyAreaId 讓之後頁面可以從 api 取得資訊
        projectId: idx(this.form.items, _ => _[0].selected.project.value),
        studyAreaId: idx(this.form.items, _ => _[0].selected.studyArea.value),
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
      if (this.form.fieldValues.length) {
        const fields = {};
        this.dataFields.forEach((dataField, index) => {
          if (this.form.fieldValues[index]) {
            switch (dataField.widgetType) {
              case 'select':
                fields[dataField.id] = this.form.fieldValues[index].value;
                break;
              case 'text':
                fields[dataField.id] = this.form.fieldValues[index];
                break;
            }
          }
        });
        query.fields = JSON.stringify(fields);
      }
      if (this.form.timeRangeStart && this.form.timeRangeEnd) {
        const startTime = new Date(
          1970,
          0,
          1,
          +this.form.timeRangeStart.HH,
          +this.form.timeRangeStart.mm,
        );
        const endTime = new Date(
          1970,
          0,
          1,
          +this.form.timeRangeEnd.HH,
          +this.form.timeRangeEnd.mm,
        );
        query.timeRangeStart = startTime.getTime();
        query.timeRangeEnd = endTime.getTime() + 59999;
      }
      this.$router.push({ path: '/download/results', query });
    },
    submitCalculateForm() {
      const query = {
        calculateType: this.form.selectedCalculateType.value,
        cameraLocation: this.form.items[0].selected.cameraLocation.value,
        species: this.form.selectedSpecies[0].value,
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
    },
  },
  async mounted() {
    try {
      await Promise.all([
        this.getAllProjects({ size: 100, sort: 'title' }),
        this.getAllDataFields({ filter: 'custom' }),
      ]);
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      throw error;
    }
  },
};
</script>

<style lang="scss">
.search-columns {
  padding: 30px;
  input.filter-input {
    height: 32px !important;
  }

  .mx-datepicker {
    width: 100%;
    display: inline-block;
  }
}
</style>
