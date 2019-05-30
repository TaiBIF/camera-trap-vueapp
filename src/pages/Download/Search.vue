<template>
  <div class="container">
    <h1 class="text-green">資料篩選與下載</h1>
    <div class="tab" :class="{ loading: isLoading }">
      <ul class="nav-tab">
        <li class="tab-item" :class="{ active: currentTab === 'search' }">
          <a role="button" @click="currentTab = 'search'">資料篩選</a>
        </li>
        <li class="tab-item" :class="{ active: currentTab === 'calculate' }">
          <a role="button" @click="currentTab = 'calculate'">資料計算</a>
        </li>
      </ul>
      <div class="tab-content">
        <div
          id="search"
          class="tab-pane"
          :class="{ active: currentTab === 'search' }"
        >
          <form
            action=""
            class="form"
            @submit.stop.prevent="submitSearchForm()"
          >
            <h5>資料來源</h5>
            <div
              class="gray-block"
              v-for="(item, index) in form.items"
              :key="`data-form-${index}`"
            >
              <div class="form-content">
                <div class="row">
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">計畫名稱：</label>
                      <v-select
                        :options="projectOptions"
                        v-model="item.selected.project"
                        :on-change="
                          generateHandlerForProjectSelectorChange(index)
                        "
                        placeholder="請選擇計畫名稱"
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">樣區：</label>
                      <v-select
                        :disabled="!item.options.studyAreas.length"
                        :options="item.options.studyAreas"
                        v-model="item.selected.studyArea"
                        :on-change="
                          generateHandlerForStudyAreaSelectorChange(index)
                        "
                        placeholder="請選擇樣區"
                      />
                    </div>
                  </div>
                  <div class="col-3">
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
                  <div class="col-3">
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
              <div class="form-action">
                <a v-if="index > 0" @click="removeFormItem(index)">
                  <span class="icon-remove"></span
                ></a>
              </div>
            </div>
            <div class="row">
              <div class="col-12 text-right">
                <a class="text-green btn pr-0" @click="addFormItem()">
                  <span class="icon"><i class="icon-add-green"></i></span>
                  <span class="text">新增資料來源</span>
                </a>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <label>物種：</label>
                  <v-select
                    :options="speciesOptions"
                    :disabled="!speciesOptions.length"
                    v-model="form.selectedSpecies"
                    multiple
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label>資料起始時間：</label>
                  <div class="input-group-inline">
                    <div class="input-group">
                      <date-picker
                        v-model="form.startDate"
                        placeholder="2001-01-01"
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
                        format=""
                      ></vue-timepicker>
                    </div>
                  </div>
                </div>
              </div>
              <span class="align-self-center">到</span>
              <div class="col-4">
                <div class="form-group">
                  <label>資料結束時間：</label>
                  <div class="input-group-inline">
                    <div class="input-group">
                      <date-picker
                        v-model="form.endDate"
                        placeholder="2018-12-31"
                        format="YYYY-MM-DD"
                        :first-day-of-week="1"
                      />
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2">
                      <vue-timepicker
                        v-model="form.endTime"
                        format=""
                      ></vue-timepicker>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <hr />
                <a class="link" @click="isAdvanceSearch = !isAdvanceSearch">
                  <span class="text mr-2">進階篩選</span>
                  <span class="icon">
                    <i
                      :class="
                        isAdvanceSearch
                          ? 'icon-chevron-up'
                          : 'icon-chevron-down'
                      "
                    ></i>
                  </span>
                </a>
              </div>
            </div>
            <div id="adv-block" v-if="isAdvanceSearch">
              <div class="row">
                <div
                  v-for="(dataField, index) in dataFields"
                  :key="dataField.id"
                  :class="{
                    'col-2': dataField.widgetType === 'select',
                    'col-4': dataField.widgetType === 'text',
                    'd-none': dataField.widgetType === 'time',
                  }"
                >
                  <div
                    v-if="dataField.widgetType === 'select'"
                    class="form-group"
                  >
                    <label>{{ dataField.title }}：</label>
                    <v-select
                      v-model="form.fieldValues[index]"
                      :options="convertDataFieldOptions(dataField.options)"
                      :placeholder="`請選擇${dataField.title}`"
                    />
                  </div>
                  <div
                    v-if="dataField.widgetType === 'text'"
                    class="form-group"
                  >
                    <label>
                      <span class="text">{{ dataField.title }}：</span>
                      <span class="icon">
                        <i class="icon-info mt-1"></i>
                      </span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="form.fieldValues[index]"
                      :placeholder="`請選擇${dataField.title}`"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-4">
                  <div class="form-group">
                    <label>拍攝時段：</label>
                    <div class="input-group-inline">
                      <div class="input-group">
                        <vue-timepicker v-model="form.timeRangeStart" />
                      </div>
                      <div class="text px-2">到</div>
                      <div class="input-group">
                        <vue-timepicker v-model="form.timeRangeEnd" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 text-right action">
              <button type="reset" class="btn btn-green-border">
                清空選項
              </button>
              <button
                :disabled="!form.items[0].selected.cameraLocation"
                type="submit"
                class="btn btn-orange"
              >
                篩選
              </button>
            </div>
          </form>
        </div>

        <div class="tab-pane" :class="{ active: currentTab === 'calculate' }">
          <form class="form" @submit.stop.prevent="submitCalculateForm()">
            <div class="green-block">
              <div class="row">
                <div class="col-6 offset-3">
                  <div class="form-group row mb-0">
                    <label class="col-3 text-right required">計算項目：</label>
                    <div class="col-9">
                      <v-select
                        v-model="form.selectedCalculateType"
                        :options="[
                          { label: '有效照片與目擊事件', value: 'oi' },
                          { label: '初測延遲', value: 'ltd' },
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <h5 class="mb-3">
              基本欄位
              <span class="text-gray">
                ( 請選擇單一相機位置及物種進行計算 )
              </span>
            </h5>
            <div class="gray-block">
              <div class="form-content">
                <div class="row">
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">計畫名稱：</label>
                      <v-select
                        v-model="form.items[0].selected.project"
                        :options="projectOptions"
                        placeholder="請選擇計畫名稱"
                        :on-change="generateHandlerForProjectSelectorChange(0)"
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">樣區：</label>
                      <v-select
                        :disabled="!form.items[0].options.studyAreas.length"
                        :options="form.items[0].options.studyAreas"
                        :on-change="
                          generateHandlerForStudyAreaSelectorChange(0)
                        "
                        v-model="form.items[0].selected.studyArea"
                        placeholder="請選擇樣區"
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label>子樣區：</label>
                      <v-select
                        :disabled="!form.items[0].options.subStudyAreas.length"
                        :options="form.items[0].options.subStudyAreas"
                        :on-change="
                          generateHandlerForSubStudyAreaSelectorChange(0)
                        "
                        v-model="form.items[0].selected.subStudyArea"
                        placeholder="請選擇子樣區"
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">相機位置：</label>
                      <v-select
                        :disabled="
                          !form.items[0].options.cameraLocations.length
                        "
                        v-model="form.items[0].selected.cameraLocation"
                        :options="form.items[0].options.cameraLocations"
                        placeholder="請選擇相機位置"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label class="required">物種：</label>
                  <v-select
                    :disabled="!projectSpeciesOptions.length"
                    :options="projectSpeciesOptions"
                    v-model="form.selectedSpecies[0]"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label>資料起始時間：</label>
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
                      <vue-timepicker v-model="form.startTime" />
                    </div>
                  </div>
                </div>
              </div>
              <span class="align-self-center">到</span>
              <div class="col-4">
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
                      <vue-timepicker v-model="form.endTime" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr />
            <h5>計算條件</h5>
            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <label class="required">有效時間判定間隔：</label>
                  <v-select
                    v-model="form.selectedValidTimeInterval"
                    :options="timeIntervalOptions"
                    placeholder="請選擇有效時間判定間隔"
                  ></v-select>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label class="required">目擊事件判斷間隔：</label>
                  <v-select
                    v-model="form.selectedEventTimeInterval"
                    :options="timeIntervalOptions"
                    placeholder="請選擇目擊事件判斷間隔"
                  ></v-select>
                </div>
              </div>
            </div>

            <div class="col-12 text-right action">
              <button type="reset" class="btn btn-green-border">
                清空選項
              </button>
              <button
                :disabled="
                  !form.items[0].selected.cameraLocation ||
                    !form.selectedSpecies[0]
                "
                type="submit"
                class="btn btn-orange"
              >
                計算
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { getLanguage } from '@/utils/i18n';
import { getProjectSpecies } from '@/service';
import datePicker from 'vue2-datepicker';
import vSelect from 'vue-select';
import vueTimepicker from 'vue2-timepicker';

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
    ...projects.mapState(['projects', 'projectSpecies']),
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
    projectSpeciesOptions() {
      return this.projectSpecies.map(x => ({
        label: x.title[getLanguage()],
        value: x.id,
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
        species.forEach(species => {
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
