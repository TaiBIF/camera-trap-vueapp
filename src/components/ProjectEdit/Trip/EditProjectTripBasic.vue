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
          <label for="project-name" class="col-4 required">行程時間：</label>
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
              行程時間不能留空
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
          v-show="
            this.projectTrip.studyAreas && this.projectTrip.studyAreas.length
          "
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
    <div class="edit-project-trip-basic-footer float-right mt-3 mb-3">
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
    <double-check-modal-with-style
      :open="showCheckStudyAreasModal"
      title="您確定不填入行程樣區嗎？"
      description="不填寫行程內的樣區資料，往後將無法依據行程篩選資料．"
      @summit="checkAddProjectTripRequest"
      @close="closeCheckStudyAreasModal"
    />
    <double-check-modal-with-style
      :open="showCheckCameraLocationsModal"
      title="您確定不填入相機位置嗎？"
      description="不填寫樣區內的相機位置資料，往後將無法依據行程篩選資料．"
      @summit="checkGoEditProjectTripCamera"
      @close="closeCheckCameraLocationsModal"
    />
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import DoubleCheckModalWithStyle from '@/components/Modal/DoubleCheckModalWithStyle.vue';
import moment from 'moment';
import vSelect from 'vue-select';

export default {
  name: 'EditProjectTripBasic',
  components: {
    vSelect,
    DatePicker,
    DoubleCheckModalWithStyle,
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
    addEditProjectTripRequest: {
      type: Function,
    },
    setEditProjectTripData: {
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
      showCheckStudyAreasModal: false,
      showCheckCameraLocationsModal: false,
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
      this.checkShowNextStep();

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
      this.checkShowNextStep();
    },
    checkShowNextStep() {
      this.showNextStep =
        this.projectTrip.studyAreas &&
        this.projectTrip.studyAreas.length &&
        Object.values(this.projectTripCameraLocations).reduce(
          (previous, current) => previous || (current && current.length > 0),
          false,
        );
    },
    setEditProjectTripReduest() {
      this.$validator.validateAll().then(result => {
        let emptyCameraLocation = false;
        if (result) {
          let studyAreas = [];
          if (this.projectTrip.studyAreas) {
            studyAreas = this.projectTrip.studyAreas.map(({ label, value }) => {
              let cameraLocations = [];
              if (this.projectTripCameraLocations[value]) {
                cameraLocations = this.projectTripCameraLocations[value].map(
                  cameraLocation => {
                    let cameraLocationEvent = undefined;
                    let cameraLocationMark = undefined;
                    let projectCameras = undefined;
                    if (
                      this.editProjectTripData.id &&
                      this.editProjectTripData.studyAreas
                    ) {
                      this.editProjectTripData.studyAreas.some(
                        studyAreaData => {
                          if (
                            studyAreaData.studyArea === value &&
                            studyAreaData.cameraLocations
                          ) {
                            studyAreaData.cameraLocations.some(
                              cameraLocationData => {
                                if (
                                  cameraLocationData.cameraLocation ===
                                  cameraLocation.value
                                ) {
                                  cameraLocationEvent =
                                    cameraLocationData.cameraLocationEvent;
                                  cameraLocationMark =
                                    cameraLocationData.cameraLocationMark;
                                  if (
                                    cameraLocationData.projectCameras &&
                                    cameraLocationData.projectCameras.length > 0
                                  )
                                    projectCameras =
                                      cameraLocationData.projectCameras;

                                  return true;
                                }
                              },
                            );
                          }
                          if (projectCameras) {
                            return true;
                          }
                        },
                      );
                    }
                    return {
                      cameraLocation: cameraLocation.value,
                      title: cameraLocation.label,
                      cameraLocationEvent: cameraLocationEvent || '',
                      cameraLocationMark: cameraLocationMark || '',
                      projectCameras: projectCameras || [],
                    };
                  },
                );
              }

              if (cameraLocations.length === 0) emptyCameraLocation = true;

              return {
                studyArea: value,
                title: label,
                cameraLocations,
              };
            });
          }

          const { sn, member, mark } = this.projectTrip;
          let body = {
            sn,
            member,
            mark,
            studyAreas,
            date: this.projectTripDate,
          };
          if (this.editProjectTripData.id)
            body = { id: this.editProjectTripData.id, ...body };

          this.setEditProjectTripData(body);

          if (this.showNextStep) {
            if (emptyCameraLocation) this.openCheckCameraLocationsModal();
            else {
              this.closeEditProjectTripBasic();
              this.openEditProjectTripCamera();
            }
          } else {
            if (studyAreas.length > 0) this.openCheckCameraLocationsModal();
            else this.openCheckStudyAreasModal();
          }
        }
      });
    },
    openCheckStudyAreasModal() {
      this.showCheckStudyAreasModal = true;
    },
    closeCheckStudyAreasModal() {
      this.showCheckStudyAreasModal = false;
    },
    openCheckCameraLocationsModal() {
      this.showCheckCameraLocationsModal = true;
    },
    closeCheckCameraLocationsModal() {
      this.showCheckCameraLocationsModal = false;
    },
    checkAddProjectTripRequest() {
      this.addEditProjectTripRequest(true);
      this.closeCheckStudyAreasModal();
      this.closeEditProjectTripBasic();
    },
    checkGoEditProjectTripCamera() {
      if (this.showNextStep) this.openEditProjectTripCamera();
      else this.addEditProjectTripRequest(true);

      this.closeCheckCameraLocationsModal();
      this.closeEditProjectTripBasic();
    },
  },
};
</script>
