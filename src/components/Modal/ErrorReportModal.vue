<template>
  <div class="modal fade" :class="{ in: open }">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">相機異常回報</h4>
        </div>
        <div class="modal-body">
          <form class="form form-horizontal">
            <div class="form-group row">
              <label class="col-3 px-0 text-right required">樣區：</label>
              <div class="col-9">
                <v-select
                  v-model="form.parentArea"
                  :options="parentAreaOptions"
                />
              </div>
            </div>
            <div
              v-if="childAreaOptions && childAreaOptions.length > 0"
              class="form-group row"
            >
              <label class="col-3 px-0 text-right required">子樣區：</label>
              <div class="col-9">
                <v-select
                  v-model="form.childArea"
                  :options="childAreaOptions"
                  resetOnOptionsChange
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-3 px-0 text-right required">相機位置：</label>
              <div class="col-9">
                <v-select
                  v-model="form.camera"
                  :options="cameraOptions"
                  resetOnOptionsChange
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-3 px-0 text-right required"
                >異常資料時間：</label
              >
              <div class="col-9 dateInputGroup">
                <date-picker
                  v-model="form.startAt"
                  :placeholder="'2018-09-20'"
                  :format="'YYYY-MM-DD'"
                  :first-day-of-week="1"
                ></date-picker>
                <span>到</span>
                <date-picker
                  v-model="form.endAt"
                  :placeholder="'2018-09-20'"
                  :format="'YYYY-MM-DD'"
                  :first-day-of-week="1"
                ></date-picker>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-3 px-0 text-right required">異常狀況：</label>
              <div class="col-9">
                <v-select
                  v-model="form.abnormalType"
                  :options="abnormalTypes"
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-3 px-0 text-right">備註：</label>
              <div class="col-9">
                <textarea v-model="form.note" class="form-control"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer text-right">
          <a @click="$emit('close')" class="btn btn-default">取消</a>
          <button
            @click="submit()"
            class="btn btn-orange"
            :disabled="isFormRequiredMissing"
          >
            回報異常資料
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { getProjectCameraLocations } from '@/service';
import DatePicker from 'vue2-datepicker';
import isEqual from 'lodash.isequal';
import vSelect from 'vue-select';

const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  name: 'ErrorReportModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DatePicker,
    vSelect,
  },
  data() {
    return {
      form: {
        parentArea: '',
        childArea: '',
        camera: '',
        startAt: '',
        endAt: '',
        abnormalType: '',
        note: '',
      },
      abnormalTypes: [
        '相機故障（空拍過多',
        '相機故障 (沒有影像)',
        '相機失竊',
        '相機電量耗損過快',
        '其他',
      ],
      cameraOptions: [], // put cameraOptions at data because it need to be reloaded when selectedArea change
    };
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
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    selectedStudyAreaId: function() {
      return this.$route.params.selectedStudyAreaId || 'all';
    },
    selectedCameraId: function() {
      return this.$route.params.selectedCameraId;
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
    isFormRequiredMissing() {
      if (
        !this.form.parentArea ||
        !this.form.camera ||
        !this.form.startAt ||
        !this.form.endAt ||
        !this.form.abnormalType
      ) {
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
    async fetchCameraLocations(areaId) {
      const { items } = await getProjectCameraLocations(this.projectId, areaId);
      if (items) {
        const newOptions = items.map(({ id, name }) => ({
          value: id,
          label: name,
        }));

        // only change options when camera is different, to prevent current selected camera be reset
        if (!isEqual(this.cameraOptions, newOptions)) {
          this.cameraOptions = newOptions;
        }
      }
    },
    submit() {
      this.$emit('submit', this.form);
    },
  },
};
</script>
<style lang="scss" scoped>
.dateInputGroup {
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > span {
    padding: 0 10px;
  }
}
</style>
