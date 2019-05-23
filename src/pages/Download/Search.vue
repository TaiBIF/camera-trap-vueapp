<template>
  <div class="container">
    <h1 class="text-green">資料篩選與下載</h1>
    <div class="tab" v-bind:class="{ loading: isLoading }">
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
                        :placeholder="'2001-01-01'"
                        :format="'YYYY-MM-DD'"
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
                        :placeholder="'2018-12-31'"
                        :format="'YYYY-MM-DD'"
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

            <div class="col-12 text-right action">
              <button type="reset" class="btn btn-green-border">
                清空選項
              </button>
              <button type="submit" class="btn btn-orange">篩選</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import datePicker from 'vue2-datepicker';
import vSelect from 'vue-select';
import vueTimepicker from 'vue2-timepicker';

const account = createNamespacedHelpers('account');
const projects = createNamespacedHelpers('projects');
const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  name: 'Search',
  components: { vSelect, vueTimepicker, datePicker },
  data() {
    return {
      isLoading: true,
      currentTab: 'search', // "search" | "calculate"
      form: {
        selectedSpecies: [],
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
      },
    };
  },
  computed: {
    ...account.mapGetters(['species']),
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
    speciesOptions() {
      /*
      @returns {Array<{label: 'string', value: 'string'}>}
      */
      return this.species.map(x => ({
        label: x.title,
        value: x.id,
      }));
    },
  },
  methods: {
    ...account.mapActions(['loadSpecies']),
    ...projects.mapActions(['getAllProjects']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
    ]),

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
        await this.getProjectStudyAreas(form.selected.project.value);
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
        await this.getProjectCameraLocations({
          projectId: form.selected.project.value,
          studyAreaId: form.selected.studyArea.value,
        });
        form.cameraLocations = this.cameraLocations;
        form.options.cameraLocations = form.cameraLocations.map(x => ({
          label: x.name,
          value: x.id,
        }));
      } else if (changed === 'subStudyArea') {
        await this.getProjectCameraLocations({
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
    submitSearchForm() {},
  },
  async mounted() {
    await Promise.all([
      this.getAllProjects({ size: 100, sort: 'title' }),
      this.loadSpecies(),
    ]);
    this.isLoading = false;
  },
};
</script>
