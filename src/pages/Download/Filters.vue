﻿<template>
  <div class="panel-content">
    <form class="search-columns">
      <div class="row">
        <div class="form-group col-4">
          <label>物種</label>
          <v-select
            :options="speciesOptions"
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
            <label class="required">行程 </label>
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
      <div class="col-12 text-right action">
        <button
          type="reset"
          class="btn btn-green-border"
          v-on:click="clearForm"
        >
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
      speciesOptions: [
        {
          label: '野豬',
          value: '5f2a72f5d3b2180063a64e4b',
        },
        {
          label: '山羌',
          value: '5f2a72f5d3b2180063a64e46',
        },
        {
          label: '測試',
          value: '5f2a72f5d3b2180063a64e42',
        },
        {
          label: '獼猴',
          value: '5f2a72f5d3b2180063a64e48',
        },
        {
          label: '白鼻心',
          value: '5f2a72f5d3b2180063a64e4d',
        },
      ],
      startDate: '2001-01-01',
      endDate: '2025-01-01',
      startTime: { HH: '00', mm: '00' },
      endTime: { HH: '23', mm: '59' },
      params: {
        startDateTime: '2001-01-01',
        endDateTime: '2025-01-01',
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
    //console.log(species);
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
    clearForm() {
      this.params = {
        startDateTime: '2001-01-01',
        endDateTime: '2025-01-01',
        species: [],
        projects: [this.defaultSeleted()],
        others: {},
      };
      this.form = {
        selectedValidTimeInterval: { label: '2 分鐘', value: 2 * 60 * 1000 },
        selectedEventTimeInterval: { label: '2 分鐘', value: 2 * 60 * 1000 },
        items: [{ ...this.defaultEmptyProjectGroup() }],
        fieldValues: [],
      };
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
          trips: ['test', 'oops'],
        },
      };
    },
  },
};
</script>
