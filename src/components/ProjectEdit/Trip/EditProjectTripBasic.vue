<template>
  <div class="edit-project-trip-basic">
    <div class="edit-project-trip-basic-content">
      <form class="form">
        <div class="form-group row">
          <label class="col-4 required">行程編號：</label>
          <div class="col-6">
            <input
              type="text"
              placeholder="請輸入行程編號"
              class="form-control"
              v-model="projectTrip.sn"
              id="project_trip_sn"
              name="project_trip_sn"
              v-validate="'required'"
              :class="{ 'is-invalid': errors.has('project_trip_sn') }"
            />
            <span
              v-show="errors.has('project_trip_sn')"
              class="invalid-feedback"
            >
              行程編號不能留空
            </span>
          </div>
        </div>
        <div class="form-group row">
          <label for="project-name" class="col-4 required">計畫時間：</label>
          <div class="col-6">
            <div
              class="input-group"
              :class="{ 'is-invalid': errors.has('project_trip_date') }"
            >
              <date-picker
                :format="'YYYY-MM-DD'"
                :first-day-of-week="1"
                placeholder="19/07/02"
                :value="projectTripDate"
                @change="setProjectTripTime($event)"
              />
              <input
                type="hidden"
                id="project_trip_date"
                name="project_trip_date"
                v-validate="'required'"
                v-model="projectTripDate"
              />
            </div>
            <span
              v-show="errors.has('project_trip_date')"
              class="invalid-feedback"
            >
              計畫時間不能留空
            </span>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-4 required">行程人員：</label>
          <div class="col-6">
            <input
              type="text"
              id="project_trip_member"
              name="project_trip_member"
              :class="{ 'is-invalid': errors.has('project_trip_member') }"
              v-validate="'required'"
              placeholder="請輸入行程人員"
              class="form-control"
              v-model="projectTrip.member"
            />
            <span
              v-show="errors.has('project_trip_member')"
              class="invalid-feedback"
            >
              行程人員不能留空
            </span>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-4">行程樣區：</label>
          <div class="col-6">
            <div class="select">
              <v-select
                v-model="projectTrip.studyAreas"
                :options="studyAreasOptions"
                placeholder="請選擇多個樣區"
                multiple
                @change="selectStudyAreas"
                :closeOnSelect="false"
              ></v-select>
            </div>
          </div>
        </div>
        <div
          class="edit-project-trip-basic-cameraLocations"
          v-show="showNextStep"
        >
          <div
            class="form-group row"
            v-for="{ label, value } in projectTrip.studyAreas"
            :key="value"
          >
            <label class="col-4">{{ label }}相機位置：</label>
            <div class="col-6">
              <div class="select">
                <v-select
                  v-model="projectTripCameraLocations[value]"
                  :options="cameraLocationsOptions[value]"
                  placeholder="請選擇多個相機位置"
                  multiple
                  @change="selectCameraLocations(label, value)"
                  :closeOnSelect="false"
                ></v-select>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">行程註記：</label>
            <div class="col-6">
              <input
                type="text"
                placeholder="請輸入行程註記"
                class="form-control"
                v-model="projectTrip.mark"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="float-right mt-3">
      <button
        class="btn btn-green-border mr-3"
        @click="closeEditProjectTripBasic"
      >
        取消
      </button>
      <button class="btn btn-orange" @click="setEditProjectTripReduest">
        {{ showNextStep ? '下一步' : '完成' }}
      </button>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import moment from 'moment';
import vSelect from 'vue-select';

export default {
  name: 'EditProjectTripBasic',
  components: {
    vSelect,
    DatePicker,
  },
  props: {
    projectId: {
      type: String,
    },
    projectStudyAreas: {
      type: Array,
      default: () => [],
    },
    cameraLocations: {
      type: Array,
      default: () => [],
    },
    getProjectCameraLocations: {
      type: Function,
    },
    closeEditProjectTripBasic: {
      type: Function,
    },
    openEditProjectTripCamera: {
      type: Function,
    },
    addProjectTripRequest: {
      type: Function,
    },
    setEditProjectTrip: {
      type: Function,
    },
    editProjectTripData: {
      type: Object,
      default: () => {},
    },
  },
  data: function() {
    return {
      projectTrip: {},
      projectTripDate: '',
      projectTripCameraLocations: {},
      studyAreasOptions: [],
      cameraLocationsOptions: {},
      showNextStep: false,
    };
  },
  mounted() {
    this.studyAreasOptions = this.projectStudyAreas.map(({ id, title }) => ({
      label: title,
      value: id,
    }));

    let studyAreas = [];

    if (this.editProjectTripData.studyAreas) {
      studyAreas = this.editProjectTripData.studyAreas.map(
        ({ title, studyArea }) => ({ label: title, value: studyArea }),
      );
    }

    this.projectTrip = Object.assign({}, this.editProjectTripData, {
      studyAreas,
    });
    this.projectTripDate = this.editProjectTripData.date || '';

    let projectTripCameraLocations = {};
    if (this.editProjectTripData.studyAreas) {
      this.editProjectTripData.studyAreas.map(studyArea => {
        let cameraLocations = studyArea.cameraLocations.map(
          ({ title, cameraLocation }) => ({
            label: title,
            value: cameraLocation,
          }),
        );
        projectTripCameraLocations[studyArea.studyArea] = cameraLocations;
      });
    }

    this.projectTripCameraLocations = projectTripCameraLocations;
  },
  methods: {
    formatTime(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    setProjectTripTime(date) {
      this.projectTripDate = date ? this.formatTime(date) : date;
    },
    async selectStudyAreas() {
      this.showNextStep =
        this.projectTrip.studyAreas && this.projectTrip.studyAreas.length;

      this.projectTrip.studyAreas.map(async ({ value }) => {
        if (!this.cameraLocationsOptions[value]) {
          await this.getProjectCameraLocations({
            projectId: this.projectId,
            studyAreaId: value,
          });

          const cameraLocationsOption = this.cameraLocations.map(
            ({ name, id }) => ({
              label: name,
              value: id,
            }),
          );

          this.$set(this.cameraLocationsOptions, value, cameraLocationsOption);
        }
      });
    },
    selectCameraLocations(studyAreaTitle, studyAreaId) {
      this.projectTripCameraLocations[
        studyAreaId
      ].studyAreaTitle = studyAreaTitle;
    },
    setEditProjectTripReduest() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let studyAreas = [];
          if (this.projectTrip.studyAreas) {
            studyAreas = this.projectTrip.studyAreas.map(({ label, value }) => {
              let cameraLocations = [];
              if (this.projectTripCameraLocations[value]) {
                cameraLocations = this.projectTripCameraLocations[value].map(
                  cameraLocation => {
                    return {
                      cameraLocation: cameraLocation.value,
                      title: cameraLocation.label,
                    };
                  },
                );
              }

              return {
                studyArea: value,
                title: label,
                cameraLocations,
              };
            });
          }

          const { sn, member, mark } = this.projectTrip;
          const body = {
            sn,
            member,
            mark,
            studyAreas,
            date: this.projectTripDate,
          };

          this.setEditProjectTrip(body);
          this.closeEditProjectTripBasic();

          if (this.showNextStep) this.goEditProjectTripCamera(body);
          else this.addProjectTripRequest(false);
        }
      });
    },
    goEditProjectTripCamera(body) {
      this.setEditProjectTrip(body);
      this.openEditProjectTripCamera();
    },
  },
};
</script>
