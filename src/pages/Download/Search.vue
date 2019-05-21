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
                      <!-- <select v-model="selected">
                        <option
                          v-for="project in projects"
                          v-bind:value="project.id"
                          v-bind:key="project.id"
                          >{{ project.shorttitle }}</option
                        >
                      </select> -->
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
                      <!-- <v-select
                        v-model="data.subSite"
                        :options="projectSubSiteOptions[did]"
                        :on-change="
                          generateOnProjectSubSiteSelectorChangeHandler(did)
                        "
                        :placeholder="'請選擇子樣區'"
                      /> -->
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
                      <!-- <v-select
                        v-model="data.camera"
                        :options="projectCameraOptions[did]"
                        :placeholder="'請選擇相機位置'"
                      /> -->
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
import moment from 'moment';
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
      },
      cameraOptions: [],
    };
  },
  // data() {
  //   return {
  //     currentTab: 0,
  //     advSecOpen: true,
  //     isCalcFormAggregating: false,
  //     calcForm: {
  //       type: { label: '有效照片與目擊事件', value: 'basic-calculation' },
  //       project: {
  //         value: '',
  //         label: '',
  //       },
  //       site: '',
  //       subSite: 'NULL',
  //       species: '',
  //       fromDate: '',
  //       fromTime: {
  //         HH: '00',
  //         mm: '00',
  //       },
  //       toDate: '',
  //       toTime: {
  //         HH: '00',
  //         mm: '00',
  //       },
  //       effectiveTimeInterval: 30,
  //       camera: [],
  //     },
  //     form: {
  //       data: [
  //         {
  //           project: '',
  //           site: '',
  //           subSite: '',
  //           camera: '',
  //         },
  //       ],
  //       species: [],
  //       customFields: {},
  //       startAt: '',
  //       endAt: '',
  //       startTime: {
  //         HH: '00',
  //         mm: '00',
  //       },
  //       endTime: {
  //         HH: '23',
  //         mm: '59',
  //       },
  //       cameraStart: {
  //         HH: '00',
  //         mm: '00',
  //       },
  //       cameraEnd: {
  //         HH: '23',
  //         mm: '59',
  //       },
  //     },
  //   };
  // },
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
    'form.startAt': function() {
      this.swapDate();
    },
    'form.endAt': function() {
      this.swapDate();
    },
  },
  computed: {
    ...projects.mapState(['projects']),
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    projectOptions() {
      return this.projects.map(({ title, id }) => ({
        label: title,
        value: id,
      }));
    },
    // selectedStudyAreaId: function() {
    //   return this.$route.params.selectedStudyAreaId;
    // },
    // selectedCameraId: function() {
    //   return this.$route.params.selectedCameraId;
    // },
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
  // computed: {
  //   ...projects.mapGetters(['getProjects']),
  //   ...dataFields.mapGetters(['getDataFields']),
  //   // ...auth.mapGetters(['authCredentials']),

  //   calcFormOptions() {
  //     const { project } = this.calcForm;
  //     const { speciesList } = project;

  //     return {
  //       species: speciesList,
  //     };
  //   },

  //   projectOptions: function() {
  //     /*
  //     All projects.
  //     @returns {Array<{label: 'string', value: 'string'}>}
  //     */
  //     return this.Projects.map(project => {
  //       return {
  //         ...project,
  //         label: project.projectTitle,
  //         value: project._id,
  //       };
  //     });
  //   },
  //   projectSiteOptions: function() {
  //     /*
  //     All sites of projects.
  //     The first item of the result if for form.data[0]. The second item of the result if for form.data[1].
  //     @returns {Array<{Array<{label: 'string', value: 'string'}>}>}
  //     */
  //     const result = [];
  //     this.form.data.forEach(data => {
  //       result.push(
  //         this.getProjectSiteOptions(data.project && data.project.value),
  //       );
  //     });
  //     return result;
  //   },
  //   projectSubSiteOptions: function() {
  //     /*
  //     All sub-sites of projects.
  //     The first item of the result if for form.data[0]. The second item of the result if for form.data[1].
  //     @returns {Array<{Array<{label: 'string', value: 'string'}>}>}
  //     */
  //     return this.form.data.map(data => {
  //       return this.getProjectSubSiteOptions(
  //         data.project && data.project.value,
  //         data.site && data.site.value,
  //       );
  //     });
  //   },
  //   projectCameraOptions: function() {
  //     /*
  //     All camera locations of projects.
  //     The first item of the result if for form.data[0]. The second item of the result if for form.data[1].
  //     @returns {Array<{Array<{label: 'string', value: 'string'}>}>}
  //     */
  //     return this.form.data.map(data => {
  //       return this.getProjectCameraOptions(
  //         data.project && data.project.value,
  //         data.site && data.site.value,
  //         data.subSite && data.subSite.value,
  //       );
  //     });
  //   },
  //   projectSpecOptions: function() {
  //     /*
  //     All species of all projects.
  //     @returns {Array<{label: 'string', value: 'string'}>}
  //     */
  //     const species = new Set();
  //     this.Projects.forEach(project => {
  //       (project.speciesList || []).forEach(spec => {
  //         species.add(spec);
  //       });
  //     });
  //     return Array.from(species).map(spec => {
  //       return {
  //         label: spec,
  //         value: spec,
  //       };
  //     });
  //   },
  //   dataFields: function() {
  //     /*
  //     All data fields of projects.
  //     @returns {Array<{label: 'string', type: 'string', options: {Array<{label: 'string', value: 'string'}>}}|null>}
  //      */
  //     const dataFieldKeys = new Set();
  //     this.Projects.forEach(project => {
  //       (project.dataFieldEnabled || []).forEach(key => {
  //         dataFieldKeys.add(key);
  //       });
  //     });
  //     const result = [];
  //     Array.from(dataFieldKeys).map(key => {
  //       const dataField = this.findDataField(key);
  //       if (!dataField) {
  //         return;
  //       }
  //       result.push({
  //         key: key,
  //         label: dataField.label,
  //         type: dataField.widget_type,
  //         options: (dataField.widget_select_options || []).map(option => {
  //           return {
  //             label: option,
  //             value: option,
  //           };
  //         }),
  //       });
  //     });
  //     return result;
  //   },
  // },
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
    swapDate() {
      if (
        !!this.form.startAt &&
        !!this.form.endAt &&
        moment(this.form.startAt) > moment(this.form.endAt)
      ) {
        const tmp = this.form.startAt;
        this.form.startAt = this.form.endAt;
        this.form.endAt = tmp;
      }
    },
    submit() {
      const { camera } = this.form;
      this.$emit('submit', {
        cameraLocation: camera.value,
      });
    },
  },
  // methods: {
  //   ...projects.mapActions(['getProjects']),
  //   ...dataFields.mapActions(['getataFields']),
  //   getProject(projectId) {
  //     /*
  //     Get the project from this.Projects.
  //     @param projectId {string}
  //     @returns {Project|null}
  //      */
  //     for (let index = 0; index < this.Projects.length; index += 1) {
  //       const project = this.Projects[index];
  //       if (project._id === projectId) {
  //         return project;
  //       }
  //     }
  //     return null;
  //   },
  //   getProjectSiteOptions(projectId) {
  //     /*
  //     Get sites of the project.
  //     @param projectId {string}
  //     @returns {Array<{label: 'string', value: 'string'}}>}
  //      */
  //     const project = this.getProject(projectId);
  //     if (project) {
  //       const sites = new Set();
  //       project.cameraLocations.forEach(cameraLocation => {
  //         sites.add(cameraLocation.site);
  //       });
  //       return Array.from(sites).map(site => {
  //         return {
  //           label: site,
  //           value: site,
  //         };
  //       });
  //     }
  //     return [];
  //   },
  //   getProjectSubSiteOptions(projectId, site) {
  //     /*
  //     Get sub-sites of the project.
  //     @param projectId {string}
  //     @param site {string}
  //     @returns {Array<{label: 'string', value: 'string'}}>}
  //      */
  //     for (let index = 0; index < this.Projects.length; index += 1) {
  //       const project = this.Projects[index];
  //       if (project._id === projectId) {
  //         const subSites = new Set();
  //         project.cameraLocations.forEach(cameraLocation => {
  //           if (cameraLocation.site === site) {
  //             subSites.add(cameraLocation.subSite);
  //           }
  //         });
  //         return Array.from(subSites).map(subSite => {
  //           return {
  //             label: subSite,
  //             value: subSite,
  //           };
  //         });
  //       }
  //     }
  //     return [];
  //   },
  //   getProjectCameraOptions(projectId, site, subSite) {
  //     /*
  //     Get camera locations of the project.
  //     @param projectId {string}
  //     @param site {string}
  //     @param subSite {string}
  //     @returns {Array<{label: 'string', value: 'string'}}>}
  //      */
  //     for (let index = 0; index < this.Projects.length; index += 1) {
  //       const project = this.Projects[index];
  //       if (project._id === projectId) {
  //         const locations = new Set();
  //         project.cameraLocations.forEach(cameraLocation => {
  //           if (
  //             cameraLocation.site === site &&
  //             cameraLocation.subSite === subSite
  //           ) {
  //             locations.add(cameraLocation.cameraLocation);
  //           }
  //         });
  //         return Array.from(locations).map(location => {
  //           return {
  //             label: location,
  //             value: location,
  //           };
  //         });
  //       }
  //     }
  //     return [];
  //   },
  //   getProjectCameraMd5Options(projectId, site, subSite) {
  //     /*
  //     Get camera locations of the project.
  //     @param projectId {string}
  //     @param site {string}
  //     @param subSite {string}
  //     @returns {Array<{label: 'string', value: 'string'}}>}
  //      */
  //     for (let index = 0; index < this.Projects.length; index += 1) {
  //       const project = this.Projects[index];
  //       if (project._id === projectId) {
  //         const locations = {};
  //         project.cameraLocations.forEach(cameraLocation => {
  //           if (
  //             cameraLocation.site === site &&
  //             cameraLocation.subSite === subSite
  //           ) {
  //             locations[cameraLocation.cameraLocation] =
  //               cameraLocation.fullCameraLocationMd5;
  //           }
  //         });
  //         return Object.keys(locations).map(location => {
  //           return {
  //             label: location,
  //             value: locations[location],
  //           };
  //         });
  //       }
  //     }
  //     return [];
  //   },
  //   generateOnProjectSelectorChangeHandler(dataIndex) {
  //     const _this = this;
  //     if (dataIndex === undefined) {
  //       return function(value) {
  //         this.$emit('input', value);
  //         _this.calcForm.site = '';
  //         _this.calcForm.subSite = '';
  //         _this.calcForm.camera = '';
  //         _this.calcForm.fromDate = moment(
  //           _this.calcForm.project.earliestRecordTimestamp * 1000,
  //         ).format('YYYY-MM-DD');
  //         _this.calcForm.toDate = moment(
  //           _this.calcForm.project.latestRecordTimestamp * 1000,
  //         ).format('YYYY-MM-DD');
  //       };
  //     }
  //     return function(value) {
  //       this.$emit('input', value);
  //       _this.form.data[dataIndex].site = '';
  //       _this.form.data[dataIndex].subSite = '';
  //       _this.form.data[dataIndex].camera = '';
  //       _this.form.startAt = moment(
  //         Math.min(
  //           ..._this.form.data.map(
  //             d => d.project.earliestRecordTimestamp * 1000,
  //           ),
  //         ),
  //       ).format('YYYY-MM-DD');
  //       _this.form.endAt = moment(
  //         Math.max(
  //           ..._this.form.data.map(d => d.project.latestRecordTimestamp * 1000),
  //         ),
  //       ).format('YYYY-MM-DD');
  //     };
  //   },
  //   generateOnProjectSiteSelectorChangeHandler(dataIndex) {
  //     const _this = this;
  //     if (dataIndex === undefined) {
  //       return function(value) {
  //         this.$emit('input', value);
  //         _this.calcForm.subSite = '';
  //         _this.calcForm.camera = '';
  //       };
  //     }
  //     return function(value) {
  //       this.$emit('input', value);
  //       _this.form.data[dataIndex].subSite = '';
  //       _this.form.data[dataIndex].camera = '';
  //     };
  //   },
  //   generateOnProjectSubSiteSelectorChangeHandler(dataIndex) {
  //     const _this = this;
  //     if (dataIndex === undefined) {
  //       return function(value) {
  //         this.$emit('input', value);
  //         _this.calcForm.camera = '';
  //       };
  //     }
  //     return function(value) {
  //       this.$emit('input', value);
  //       _this.form.data[dataIndex].camera = '';
  //     };
  //   },
  //   findDataField(key) {
  //     /*
  //     Find the data field from dataFieldAvailable.
  //     @param key {string}
  //     @returns {DataFieldAvailable|null}
  //      */
  //     for (let index = 0; index < this.dataFieldAvailable.length; index += 1) {
  //       if (this.dataFieldAvailable[index].key === key) {
  //         return this.dataFieldAvailable[index];
  //       }
  //     }
  //     return null;
  //   },
  //   submitSearch() {
  //     const form = {
  //       data: this.form.data.map(data => {
  //         return {
  //           projectId: data.project ? data.project.value : '',
  //           site: data.site ? data.site.value : '',
  //           subSite: data.subSite ? data.subSite.value : '',
  //           camera: data.camera ? data.camera.value : '',
  //         };
  //       }),
  //       species: this.form.species.map(spec => {
  //         return spec.value;
  //       }),
  //       startAt: (() => {
  //         if (!this.form.startAt) {
  //           return this.form.startAt;
  //         }
  //         const time = new Date(this.form.startAt);
  //         time.setHours(+this.form.startTime.HH);
  //         time.setMinutes(+this.form.startTime.mm);
  //         return time;
  //       })(),
  //       endAt: (() => {
  //         if (!this.form.endAt) {
  //           return this.form.endAt;
  //         }
  //         const time = new Date(this.form.endAt);
  //         time.setHours(+this.form.endTime.HH);
  //         time.setMinutes(+this.form.endTime.mm);
  //         return time;
  //       })(),
  //       customFields: (() => {
  //         const result = {};
  //         for (const customFieldKey in this.form.customFields) {
  //           const customField = this.form.customFields[customFieldKey];
  //           if (customField && typeof customField === 'object') {
  //             result[customFieldKey] = customField.value;
  //           } else {
  //             result[customFieldKey] = customField;
  //           }
  //         }
  //         return result;
  //       })(),
  //       cameraStart: this.form.cameraStart,
  //       cameraEnd: this.form.cameraEnd,
  //     };
  //     this.$router.push({
  //       path: '/search',
  //       query: {
  //         form: JSON.stringify(form),
  //       },
  //     });
  //   },
  //   async submitCalculate() {
  //     this.isCalcFormAggregating = true;
  //     this.calcForm.idTokenHash = Object.values(
  //       this.authCredentials.params.Logins,
  //     )[0];
  //     this.$store.commit('CALC_FORM', this.calcForm);
  //     const res = await this.$store.dispatch('calcFormAggregate');
  //     this.isCalcFormAggregating = false;
  //     if (res.ret) {
  //       this.$router.push('/calculate');
  //     } else {
  //       // somehow show no results
  //       alert('no data!!');
  //     }
  //   },
  //   removeFormData(idx) {
  //     this.form.data.splice(idx, 1);
  //   },
  //   addFormData() {
  //     this.form.data.push({
  //       project: '',
  //       site: '',
  //       subSite: '',
  //       camera: '',
  //     });
  //   },
  // },
  // beforeMount() {
  //   this.getProjects();
  //   this.getDataFields();
  // },
};
</script>
