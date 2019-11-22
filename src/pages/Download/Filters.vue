<template>
  <div class="panel-content">
    <form class="search-columns">
      <div class="row">
        <div class="form-group col-4">
          <label>物種</label>
          <v-select
            :options="speciesOptions"
            :disabled="!speciesOptions.length"
            v-model="params.species"
            multiple
          />
        </div>
        <div class="form-group col-4">
          <label>資料起始時間</label>
          <div class="input-group">
            <div class="input-group-inline">
              <date-picker
                v-model="startDate"
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
                v-model="startTime"
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
                  v-model="endDate"
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
                  v-model="endTime"
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
              v-model="params.projects[index].project"
              v-on:input="changeProject(index)"
            />
          </div>
          <div class="form-group col-4">
            <label class="required">行程</label>
            <v-select
              :disabled="!item.options.trips.length"
              :options="item.options.trips"
              v-model="params.projects[index].trips"
            />
          </div>
        </div>

        <div class="row">
          <div class="form-group col-8">
            <label class="required">樣區</label>
            <v-select
              :disabled="!item.options.studyAreas.length"
              :options="item.options.studyAreas"
              v-model="params.projects[index].studyAreas"
              v-on:input="changeStudyArea(index)"
              multiple
            />
          </div>
          <div class="col-4">
            <div class="form-group">
              <label class="required">相機位置：</label>
              <v-select
                :disabled="!item.options.cameraLocations.length"
                :options="item.options.cameraLocations"
                v-model="params.projects[index].cameraLocations"
                multiple
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 text-right">
        <a class="text-green btn pr-0" @click="addFormItem()">
          <span class="icon"><i class="icon-add-green"></i></span>
          <span class="text">新增資料來源</span>
        </a>
      </div>
      <hr />
      <label>其他條件</label>
      <div class="row">
        <div
          class="form-group col-3"
          v-for="(dataField, index) in dataFields.filter(
            d => d.widgetType === 'select',
          )"
          :key="index"
        >
          <label v-text="dataField.title[lang]"></label>
          <v-select
            v-model="params.others[dataField.id]"
            :reduce="x => x.value"
            :options="
              dataField.options.map(x => ({
                value: x.id,
                label: x[lang] || '',
              }))
            "
          />
        </div>

        <div class="col-3">
          <div class="form-group">
            <label class="required">備註</label>
            <input type="text" v-model="params.note" class="form-control" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <label>拍攝時段</label>
            <div class="input-group">
              <div class="input-group-inline">
                <vue-timepicker
                  v-model="form.timeRangeStart"
                  input-class="form-control"
                />
              </div>
              <div class="text px-2">到</div>
              <div class="input-group-inline">
                <vue-timepicker v-model="form.timeRangeEnd" />
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
          type="submit"
          v-on:click.prevent="$emit('filter', params)"
          class="btn btn-orange"
        >
          篩選
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { fetchSpecies, getProjectStudyAreas } from '@/service';
import { getLanguage } from '@/utils/i18n';
import datePicker from 'vue2-datepicker';
import fetchWrap from '@/utils/fetch';
import moment from 'moment';
import queryString from 'query-string';
import vSelect from 'vue-select';
import vueTimepicker from 'vue2-timepicker';
import 'vue-select/dist/vue-select.css';

const projects = createNamespacedHelpers('projects');

export default {
  props: {
    dataFields: {
      type: Array,
      required: true,
    },
  },
  computed: {
    startDateTime() {
      if (!this.startDate) {
        return '';
      }

      return moment(this.startDate)
        .set('hour', this.startTime.HH)
        .set('minute', this.startTime.mm)
        .toISOString();
    },
    endDateTime() {
      if (!this.endDate) {
        return '';
      }

      return moment(this.endDate)
        .set('hour', this.endTime.HH)
        .set('minute', this.endTime.mm)
        .toISOString();
    },
    ...projects.mapState(['projects']),
    projectOptions() {
      return this.projects.map(project => ({
        label: project.title,
        value: project.id,
      }));
    },
  },
  data: function() {
    return {
      lang: getLanguage(),
      speciesOptions: [],
      projectSpeciesOptions: [],
      startDate: '',
      endDate: '',
      startTime: { HH: '00', mm: '00' },
      endTime: { HH: '23', mm: '59' },
      params: {
        startDateTime: '',
        endDateTime: '',
        species: [],
        projects: [this.defaultSeleted()],
        others: {},
      },
      form: {
        selectedValidTimeInterval: { label: '2 分鐘', value: 2 * 60 * 1000 },
        selectedEventTimeInterval: { label: '2 分鐘', value: 2 * 60 * 1000 },
        items: [{ ...this.defaultEmptyProjectGroup() }],
        fieldValues: [],
      },
    };
  },

  components: { vSelect, vueTimepicker, datePicker },
  watch: {
    startDateTime(value) {
      this.params.startDateTime = value;
    },
    endDateTime(value) {
      this.params.endDateTime = value;
    },
  },
  beforeMount: async function() {
    // species options
    const species = await fetchSpecies();
    species.items.forEach(x => {
      this.speciesOptions.push({
        label: x.title[getLanguage()],
        value: x.id,
      });
    });
  },
  mounted() {},
  methods: {
    async changeProject(index) {
      const { options } = this.form.items[index];
      const selected = this.params.projects[index];
      selected.studyAreas = [];
      selected.cameraLocations = [];
      const studyAreas = await getProjectStudyAreas(selected.project.value);
      options.studyAreas = [];
      studyAreas.forEach(x => {
        if (!x.children.length) {
          options.studyAreas.push({
            label: x.title[getLanguage()],
            value: x.id,
            children: x.children,
          });
        } else {
          x.children.forEach(subArea => {
            options.studyAreas.push({
              label: `${x.title[getLanguage()]} - ${
                subArea.title[getLanguage()]
              }`,
              value: x.id,
              children: x.children,
            });
          });
        }
      });
    },
    async changeStudyArea(index) {
      const { options } = this.form.items[index];
      const selected = this.params.projects[index];

      if (!selected.studyAreas.length) {
        return;
      }

      // refresh camera locations
      const { value: projectId } = selected.project;
      const studyAreaIds = selected.studyAreas.map(s => s.value);
      const query = {
        projectId: projectId,
        'studyAreaIds[]': studyAreaIds,
      };

      const { items: cameralocations = [] } = await fetchWrap({
        method: 'GET',
        url: `/api/v1/camera-locations?${queryString.stringify(query)}`,
      });

      options.cameraLocations = cameralocations.map(x => ({
        label: x.name,
        value: x.id,
      }));
    },
    addFormItem() {
      this.params.projects.push({ ...this.defaultSeleted() });
      this.form.items.push({ ...this.defaultEmptyProjectGroup() });
    },
    defaultSeleted() {
      return {
        project: null,
        trips: [],
        studyAreas: [],
        cameraLocations: [],
      };
    },
    defaultEmptyProjectGroup() {
      return {
        options: {
          studyAreas: [],
          cameraLocations: [],
          trips: [],
        },
      };
    },
  },
};
</script>
