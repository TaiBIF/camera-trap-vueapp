<template>
  <div class="container">
    <h1 class="text-green">資料篩選與下載</h1>
    <!-- Tabs -->
    <div class="tab" v-bind:class="{ loading: isCalcFormAggregating }">
      <!-- Nav Tabs -->
      <ul class="nav-tab">
        <li class="tab-item" :class="{ active: currentTab == 0 }">
          <a role="button" @click="currentTab = 0">資料篩選</a>
        </li>
        <li class="tab-item" :class="{ active: currentTab == 1 }">
          <a role="button" @click="currentTab = 1">資料計算</a>
        </li>
      </ul>
      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Content: Data Filter -->
        <div id="search" class="tab-pane" :class="{ active: currentTab == 0 }">
          <form action="" class="form" @submit.stop.prevent="submitSearch()">
            <h5>資料來源</h5>
            <div class="gray-block">
              <div class="form-content">
                <div class="row">
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">計畫名稱：</label>
                      <v-select
                        v-model="form.projectId"
                        :options="projectOptions"
                        :placeholder="'請選擇計畫名稱'"
                        resetOnOptionsChange
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">樣區：</label>
                      <v-select
                        v-model="form.parentArea"
                        :options="parentAreaOptions"
                        :placeholder="'請選擇樣區'"
                        resetOnOptionsChange
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">子樣區：</label>
                      <v-select
                        v-model="form.childArea"
                        :options="childAreaOptions"
                        :placeholder="'請選擇子樣區'"
                        resetOnOptionsChange
                      />
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">相機位置：</label>
                      <v-select
                        v-model="form.camera"
                        :options="cameraOptions"
                        :placeholder="'請選擇相機位置'"
                        resetOnOptionsChange
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-action">
                <a>
                  <span class="icon-remove"></span>
                </a>
              </div>
            </div>
            <div class="row">
              <div class="col-12 text-right">
                <a class="text-green btn pr-0" @click="addFormData()">
                  <span class="icon"><i class="icon-add-green"></i></span>
                  <span class="text">新增資料來源</span>
                </a>
              </div>
            </div>
            <div>
              <div class="col-12">
                <div class="form-group">
                  <label class="required">物種：</label>
                  <v-select
                    v-model="calcFormOptions.species"
                    :options="speciesOptions"
                    multiple
                  ></v-select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { equals } from 'ramda';
import { getProjectCameraLocations } from '@/service';
import vSelect from 'vue-select';

const projects = createNamespacedHelpers('projects');
const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  name: 'Search',
  components: { vSelect },
  data() {
    return {
      currentTab: 0,
      isCalcFormAggregating: false,
      form: {
        data: [],
        projectId: '',
        parentArea: '',
        childArea: '',
        cameraLocations: '',
        camera: '',
        species: {
          type: Array,
          default: () => [],
        },
      },
      cameraOptions: [],
      calcForm: {
        type: { label: '有效照片與目擊事件', value: 'basic-calculation' },
        project: {
          value: '',
          label: '',
        },
        site: '',
        subSite: 'NULL',
        species: '',
        fromDate: '',
        fromTime: {
          HH: '00',
          mm: '00',
        },
        toDate: '',
        toTime: {
          HH: '00',
          mm: '00',
        },
        effectiveTimeInterval: 30,
        camera: [],
      },
    };
  },
  mounted() {
    this.getProjects();
    this.getProjectStudyAreas(this.form.projectId);
    this.fetchProjectCameraLocations();
  },
  watch: {
    open: function(open) {
      // load default select area, camera base on current route
      if (open) {
        if (this.selectedStudyAreaId && this.selectedStudyAreaId !== 'all') {
          this.areaOptions.some(option => {
            if (option.value === this.selectedStudyAreaId) {
              this.form.parentArea = option;
              return true;
            }
            const area = option.children.find(
              ({ value }) => value === this.selectedStudyAreaId,
            );
            if (area) {
              this.form.parentArea = option;
              setTimeout(() => {
                // move to next tick to wait options ready
                this.form.childArea = area;
              }, 0);
              return true;
            }
          });
        }
        if (this.cameraLocations && this.cameraLocations.length > 0) {
          this.cameraOptions = this.cameraLocations.map(({ id, name }) => ({
            value: id,
            label: name,
          }));
        }
        if (this.selectedCameraId) {
          this.cameraOptions.some(option => {
            if (option.value === this.selectedCameraId) {
              setTimeout(() => {
                // move to next tick to wait options ready
                this.form.camera = option;
              }, 0);
              return true;
            }
          });
        }
      }
    },
    selectedStudyAreaId() {
      this.fetchProjectCameraLocations();
    },
    'form.parentArea': function(area) {
      if (area && area.children && area.children.length === 0) {
        this.fetchCameraLocations(area.value);
      }
    },
    'form.childArea': function(area) {
      if (area) {
        this.fetchCameraLocations(area.value);
      }
    },
  },
  computed: {
    ...projects.mapState(['projects']),
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),

    calcFormOptions() {
      const { project } = this.calcForm;
      const { speciesList } = project;

      return {
        species: speciesList,
      };
    },
    projectId: function() {
      return this.form.projectId;
    },
    projectOptions() {
      return this.projects.map(({ title, id }) => ({
        label: title,
        value: id,
      }));
    },
    selectedStudyAreaId: function() {
      return this.form.selectedStudyAreaId;
    },
    selectedCameraId: function() {
      return this.form.selectedCameraId;
    },
    areaOptions() {
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
    parentAreaOptions() {
      return this.areaOptions;
    },
    childAreaOptions() {
      return this.form.parentArea ? this.form.parentArea.children : [];
    },
    projectCameraOptions: function() {
      /*
      All camera locations of projects.
      The first item of the result if for form.data[0]. The second item of the result if for form.data[1].
      @returns {Array<{Array<{label: 'string', value: 'string'}>}>}
      */
      return this.form.data.map(data => {
        return this.getProjectCameraOptions(
          data.project && data.project.value,
          data.site && data.site.value,
          data.subSite && data.subSite.value,
        );
      });
    },
    projectSpecOptions: function() {
      /*
      All species of all projects.
      @returns {Array<{label: 'string', value: 'string'}>}
      */
      const species = new Set();
      this.Projects.forEach(project => {
        (project.speciesList || []).forEach(spec => {
          species.add(spec);
        });
      });
      return Array.from(species).map(spec => {
        return {
          label: spec,
          value: spec,
        };
      });
    },
    isFormRequiredMissing() {
      if (!this.form.parentArea || !this.form.camera) {
        return true;
      }
      if (
        this.form.parentArea &&
        this.form.parentArea.children.length > 0 &&
        !this.form.childAreaId
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...projects.mapActions(['getProjects']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
    ]),
    async fetchCameraLocations(areaId) {
      const { items } = await getProjectCameraLocations(this.projectId, areaId);
      if (items) {
        const newOptions = items.map(({ id, name }) => ({
          value: id,
          label: name,
        }));
        // only change options when camera is different, to prevent current selected camera be reset
        if (!equals(this.cameraOptions, newOptions)) {
          this.cameraOptions = newOptions;
        }
      }
    },
    fetchProjectCameraLocations() {
      if (this.selectedStudyAreaId && this.selectedStudyAreaId !== 'all') {
        this.getProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: this.selectedStudyAreaId,
        });
      }
    },
    getProjectCameraOptions(projectId, site, subSite) {
      /*
      Get camera locations of the project.
      @param projectId {string}
      @param site {string}
      @param subSite {string}
      @returns {Array<{label: 'string', value: 'string'}}>}
       */
      for (let index = 0; index < this.Projects.length; index += 1) {
        const project = this.Projects[index];
        if (project._id === projectId) {
          const locations = new Set();
          project.cameraLocations.forEach(cameraLocation => {
            if (
              cameraLocation.site === site &&
              cameraLocation.subSite === subSite
            ) {
              locations.add(cameraLocation.cameraLocation);
            }
          });
          return Array.from(locations).map(location => {
            return {
              label: location,
              value: location,
            };
          });
        }
      }
      return [];
    },
    submit() {
      const { camera } = this.form;
      this.$emit('submit', {
        cameraLocation: camera.value,
      });
    },
  },
};
</script>
