<template>
  <div>
    <h1>計畫管理-相機位置管理</h1>
    <p v-if="errorMessage" :style="{ color: 'red' }">
      錯誤訊息: {{ errorMessage }}
    </p>
    <div id="split-view">
      <ul>
        <li :key="area.id" v-for="area in studyAreas">
          <p
            @click="currentstudyAreaId = area.id"
            :style="[
              currentstudyAreaId === area.id
                ? { color: 'red' }
                : { color: 'black' },
            ]"
          >
            {{ `${area.title} / ${area.id}` }}
          </p>
          <ul>
            <li
              :key="area.id"
              @click="currentstudyAreaId = area.id"
              v-for="area in area.children"
            >
              <p
                @click="currentstudyAreaId = area.id"
                :style="[
                  currentstudyAreaId === area.id
                    ? { color: 'red' }
                    : { color: 'black' },
                ]"
              >
                {{ `${area.title} / ${area.id}` }}
              </p>
            </li>
            <li>
              <label>新增: </label
              ><input
                type="text"
                @change="addStudyArea($event.target.value, area.id)"
              />
            </li>
          </ul>
        </li>
        <li>
          <label>新增: </label
          ><input type="text" @change="addStudyArea($event.target.value)" />
        </li>
      </ul>
      <div>
        <p>id: {{ currentstudyAreaId }}</p>
        <ul>
          <li :key="loc.id" v-for="loc in cameraLocations">
            {{ `${loc.name} / ${loc.vegetation} / ${loc.settingTime}` }}
          </li>
        </ul>
        <div
          :style="[
            {
              margin: '1rem',
              border: '1px green solid',
            },
          ]"
        >
          <label>相機位置名稱</label>
          <input type="text" v-model="newCameraLocation.name" />
          <br />
          <label>架設日期</label>
          <input type="date" v-model="newCameraLocation.settingTime" />
          <br />
          <label>緯度 (WGS84) </label>
          <input type="text" v-model="newCameraLocation.latitude" />
          <br />
          <label>經度 (WGS84) </label>
          <input type="text" v-model="newCameraLocation.longitude" />
          <br />
          <label>海拔（公尺） </label>
          <input type="text" v-model="newCameraLocation.altitude" />
          <br />
          <label>植被</label>
          <input type="text" v-model="newCameraLocation.vegetation" />
          <br />
          <label>土地覆蓋類型 </label>
          <input type="text" v-model="newCameraLocation.landCover" />
          <button @click="addCameraLocation" :disabled="!currentstudyAreaId">
            新增
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';

const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  data: function() {
    return {
      errorMessage: undefined,
      currentstudyAreaId: '',
      newCameraLocation: {},
    };
  },
  watch: {
    currentstudyAreaId: function(val) {
      this.getProjectCameraLocations({
        projectId: this.projectId,
        studyAreaId: val,
      });
    },
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreas']),
    ...studyAreas.mapState(['cameraLocations']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...studyAreas.mapActions([
      'postProjectStudyAreas',
      'getProjectCameraLocations',
      'postProjectCameraLocations',
    ]),
    async addStudyArea(title, parent) {
      try {
        await this.postProjectStudyAreas({
          id: this.projectId,
          area: { title, parent },
        });
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
    },
    async addCameraLocation() {
      try {
        await this.postProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: this.currentstudyAreaId,
          cameraLocation: {
            ...this.newCameraLocation,
            settingTime: moment(
              this.newCameraLocation.settingTime,
            ).toISOString(),
          },
        });
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#split-view {
  display: flex;
  & > ul:nth-child(1) {
    border-right: 1px red solid;
    padding-right: 1rem;
  }
}
</style>
