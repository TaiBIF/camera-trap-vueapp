<template>
  <div
    class="container project-overview"
    v-infinite-scroll="loadMoreProjects"
    infinite-scroll-disabled="disableLoadMoreProjects"
    infinite-scroll-distance="300"
  >
    <h1 class="heading">計畫總覽</h1>
    <div class="project-overview-content">
      <div class="collapse-filter" @click="collapseFilter = !collapseFilter">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div :class="collapseFilter ? 'is-open' : 'is-close'">
        <div class="filter">
          <div class="filter-title">
            篩選條件
            <span
              class="btn btn-sm btn-black-border float-right"
              @click="getProjectRequest(0)"
              >篩選</span
            >
          </div>
          <hr />
          <div class="filter-option-type" v-show="isLogin">
            <div class="filter-option-type-header">
              計畫類型
            </div>
            <div v-for="(option, index) in projectTypeOption" :key="index">
              <i
                class="el-icon-check"
                v-show="selectedFilters.projectType === option.name"
              />
              <span
                :id="option.name"
                class="filter-option"
                @click="selectSingleFilter('projectType', $event)"
              >
                {{ option.name }}
              </span>
              <span class="float-right"> ({{ option.count }}) </span>
            </div>
          </div>
          <hr v-show="isLogin" />
          <div class="filter-option-type">
            <div class="filter-option-type-header">
              物種
              <span class="float-right" @click="clearFilter('species')"
                >清除 －</span
              >
            </div>
            <div v-for="(option, index) in speciesOption" :key="index">
              <i
                class="el-icon-check"
                v-show="selectedFilters.species === option.id"
              />
              <span
                :id="option.id"
                class="filter-option"
                @click="selectSingleFilter('species', $event)"
              >
                {{ option.name }}
              </span>
              <span class="float-right"> ({{ option.count }}) </span>
            </div>
          </div>
          <hr />
          <div class="filter-option-type">
            <div class="filter-option-type-header">
              區域
              <span class="float-right" @click="clearFilter('county')"
                >清除 －</span
              >
            </div>
            <div v-for="(area, index) in areaOption" :key="index">
              <!-- 區域 -->
              <span
                :id="area.name"
                class="filter-option"
                @click="selectedArea = area.name"
              >
                {{ area.name }}
              </span>
              <span class="float-right"> ({{ area.count }}) </span>
              <!-- 縣市 -->
              <div
                v-show="area.count !== 0 && selectedArea === area.name"
                class="ml-3"
              >
                <div>
                  <i
                    class="el-icon-check"
                    v-show="selectedFilters.county === area.name"
                  />
                  <span
                    :id="area.name"
                    class="filter-option"
                    @click="selectSingleFilter('county', $event)"
                  >
                    全部
                  </span>
                  <span class="float-right"> ({{ area.count }}) </span>
                </div>
                <div v-for="(county, index) in area.county" :key="index">
                  <i
                    class="el-icon-check"
                    v-show="selectedFilters.county === county.name"
                  />
                  <span
                    :id="county.name"
                    class="filter-option"
                    @click="selectSingleFilter('county', $event)"
                  >
                    {{ county.name }}
                  </span>
                  <span class="float-right"> ({{ county.count }}) </span>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="filter-option-type">
            <div class="filter-option-type-header">
              資料時間
              <span class="float-right" @click="clearFilter('datetime')"
                >清除 －</span
              >
            </div>
            <div class="filter-datetime">
              <el-slider
                v-model="selectedFilters.datetime"
                range
                :show-tooltip="false"
                :max="MaxDateTime"
              >
              </el-slider>
              <div class="filter-datetime-text">
                <span>{{
                  formatDatetime(this.selectedFilters.datetime[0])
                }}</span
                >至<span>{{
                  formatDatetime(this.selectedFilters.datetime[1])
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 100%">
        <div v-if="projects.length === 0">
          <div class="empty-content">
            <img
              src="/assets/common/empty-project.png"
              width="212px"
              srcset="/assets/common/empty-project@2x.png"
            />
            <h1 class="empty">您目前沒有任何計畫</h1>
            <router-link to="create" class="btn btn-orange"
              >新增計畫</router-link
            >
          </div>
        </div>
        <div v-else>
          <!-- Controlbar -->
          <div class="row">
            <div class="col-8">
              <span class="filter-label">
                {{ selectedFilters.projectType }}
              </span>
              <span
                class="filter-label deleteable"
                v-for="(label, index) in selectedFiltersLabel"
                :key="index"
                @click="clearFilter(label.type)"
              >
                {{ label.value }}
                <i class="el-icon-close"></i>
              </span>
            </div>
            <div class="col-4 text-right">
              <router-link to="/project/create" class="btn btn-orange">
                新增計畫
              </router-link>
            </div>
          </div>
          <div class="row">
            <div class="col-8">
              <div class="dropdown">
                <a
                  class="btn btn-link pl-0 dropdown-toggle"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  依 {{ SORTED_BY_ENUM[sortedBy] }} 排序
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a
                    class="dropdown-item"
                    :key="key"
                    v-for="(item, key) in SORTED_BY_ENUM"
                    @click="sortedBy = key"
                  >
                    {{ item }}
                  </a>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div
                class="display_type float-right"
                @click="displayByGrid = !displayByGrid"
              >
                <!-- <span v-show="displayByGrid"> -->
                <span v-show="false">
                  <i class="el-icon-s-grid" /> 格狀顯示
                </span>
                <!-- <span v-show="!displayByGrid"> -->
                <span v-show="false">
                  <i class="el-icon-s-unfold" /> 條狀顯示
                </span>
              </div>
            </div>
          </div>
          <!-- Cards -->
          <div v-show="displayByGrid" class="three cards">
            <router-link
              class="card"
              :to="proj.id"
              :key="proj.id"
              v-for="proj in projects"
            >
              <div class="image">
                <img :src="proj.coverImageFile && proj.coverImageFile.url" />
                <div class="badget" v-if="proj.members">
                  <i class="fa fa-user"></i>{{ proj.members.length }}
                </div>
              </div>
              <div class="content">
                <h3 class="card-heading">{{ proj.title }}</h3>
                <div class="row description">
                  <div class="col-6">
                    <small class="text-gray label">資料起始年份</small>
                    <span class="text-green">{{
                      proj.startTime.split('-')[0]
                    }}</span>
                  </div>
                  <div class="col-6">
                    <small class="text-gray label">委託單位</small>
                    <span class="text-green">{{ proj.funder }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <!-- List -->
          <div v-show="!displayByGrid" class="mx-3">
            <el-row class="project-item-title">
              <el-col :span="8">計劃名稱</el-col>
              <el-col :span="4">資料起始年份</el-col>
              <el-col :span="4">委託單位</el-col>
              <el-col :span="3">樣區數量</el-col>
              <el-col :span="3">相機位置數</el-col>
              <el-col :span="2">資料量</el-col>
            </el-row>
            <router-link v-for="proj in projects" :key="proj.id" :to="proj.id">
              <el-row class="project-item-content">
                <el-col :span="8">{{ proj.title }}</el-col>
                <el-col :span="4">{{ proj.startTime.split('-')[0] }}</el-col>
                <el-col :span="4">{{ proj.funder }}</el-col>
                <el-col :span="3">{{ proj.totalStudyArea }}</el-col>
                <el-col :span="3">{{ proj.totalLcameraLocation }}</el-col>
                <el-col :span="2">{{ proj.totalData }}</el-col>
              </el-row>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import infiniteScroll from 'vue-infinite-scroll';

const projects = createNamespacedHelpers('projects');
const account = createNamespacedHelpers('account');
const config = createNamespacedHelpers('config');

const PROJECT_PAGE = 12;
const SORTED_BY_ENUM = {
  '-oldestAnnotationTime': '依資料起始時間排序 (新→舊)',
  '-latestAnnotationTime': '依最後更新時間排序 (新→舊)',
  funder: '依委託單位筆畫排序',
  title: '依計畫名稱筆畫排序',
};
const projectTypeOption = [
  { name: '我的計畫', count: 0 },
  { name: '公開計畫', count: 1500 },
];
const speciesOption = [];
const areaOption = [
  {
    name: '北部',
    count: 0,
    county: [
      // { name: '台北市', count: 100 },
      // { name: '新北市', count: 95 },
      // { name: '基隆市', count: 5 },
    ],
  },
  {
    name: '中部',
    count: 0,
    county: [],
  },
  {
    name: '南部',
    count: 0,
    county: [],
  },
  {
    name: '東部',
    count: 0,
    county: [],
  },
];

const currentDate = new Date();
const MaxDateTime =
  (currentDate.getFullYear() - 2000) * 12 + currentDate.getMonth() + 1;

export default {
  directives: { infiniteScroll },
  data() {
    return {
      SORTED_BY_ENUM,
      sortedBy: '-oldestAnnotationTime',
      busy: false,
      displayByGrid: false,
      projectTypeOption,
      speciesOption,
      areaOption,
      selectedArea: '',
      selectedFilters: {
        projectType: '我的計畫',
        species: '',
        county: '',
        datetime: [0, MaxDateTime],
      },
      selectedFiltersLabel: [],
      MaxDateTime,
      collapseFilter: true,
    };
  },
  mounted() {
    // this.getProjectAreasOrientationTotal()
    this.getSpeciesTypeAndCountRequest();
    this.getProjectAreasRequest();
    this.getPublicProjectsRequest();
    this.getProjectRequest();
    this.initProjectAndPublicProjectTotalCount();
  },
  watch: {
    sortedBy() {
      this.getProjectRequest();
      this.getPublicProjectsRequest();
    },
    selectedFilters: {
      handler() {
        this.selectedFiltersLabel = Object.keys(this.selectedFilters).reduce(
          (pre, key) => {
            if (key === 'datetime') {
              const startDatetime = this.selectedFilters[key][0];
              const endDatetime = this.selectedFilters[key][1];
              // 資料時間非初始值才顯示
              if (!(startDatetime === 0 && endDatetime === MaxDateTime))
                return [
                  ...pre,
                  {
                    type: key,
                    value: `${this.formatDatetime(
                      startDatetime,
                    )}-${this.formatDatetime(endDatetime)}`,
                  },
                ];
            } else if (
              key !== 'projectType' &&
              this.selectedFilters[key] !== ''
            ) {
              return [...pre, { type: key, value: this.selectedFilters[key] }];
            }
            return pre;
          },
          [],
        );
      },
      deep: true,
    },
  },
  computed: {
    ...account.mapGetters(['userName', 'isLogin', 'species']),
    ...projects.mapState(['projects', 'projectsTotal', 'projectsPublicTotal']),
    ...config.mapGetters(['projectAreas', 'projectAreasOrientationTotal']),
    disableLoadMoreProjects() {
      return this.busy || this.projectsTotal === this.projects.length;
    },
  },
  methods: {
    ...projects.mapActions(['getProjects', 'getPublicProjects']),
    ...account.mapActions(['loadSpecies']),
    ...config.mapActions([
      'getProjectAreas',
      'getProjectAreasOrientationTotal',
    ]),
    async initProjectAndPublicProjectTotalCount() {
      projectTypeOption[1].count = this.projectsTotal;
      projectTypeOption[0].count = this.projectsPublicTotal;
    },
    async getProjectRequest(index = 0) {
      this.busy = true;
      await this.getProjects({
        index,
        size: PROJECT_PAGE,
        sort: this.sortedBy,
        projectType: this.selectedFilters.projectType,
        species: this.selectedFilters.species || undefined,
        county: this.selectedFilters.county || undefined,
        startDate: this.formatDatetime(
          this.selectedFilters.datetime[0],
        ).replace('/', '-'),
        endDate: this.formatDatetime(this.selectedFilters.datetime[1]).replace(
          '/',
          '-',
        ),
      });
      this.busy = false;
    },
    async getPublicProjectsRequest(index = 0) {
      this.busy = true;
      await this.getPublicProjects({
        index,
        size: PROJECT_PAGE,
        sort: this.sortedBy,
        projectType: this.selectedFilters.projectType,
        species: this.selectedFilters.species || undefined,
        county: this.selectedFilters.county || undefined,
        startDate: this.formatDatetime(
          this.selectedFilters.datetime[0],
        ).replace('/', '-'),
        endDate: this.formatDatetime(this.selectedFilters.datetime[1]).replace(
          '/',
          '-',
        ),
      });
      this.busy = false;
    },
    async getSpeciesTypeAndCountRequest() {
      await this.loadSpecies();
      this.species.map(specie => {
        speciesOption.push({
          id: specie.id,
          name: specie.title,
          count: specie.dataCount,
        });
      });
    },
    async getProjectAreasRequest() {
      await this.getProjectAreas();
      await this.getProjectAreasOrientationTotal();
      areaOption[0].count = this.projectAreasOrientationTotal.north;
      areaOption[1].count = this.projectAreasOrientationTotal.west;
      areaOption[2].count = this.projectAreasOrientationTotal.south;
      areaOption[3].count = this.projectAreasOrientationTotal.east;
      this.projectAreas.map(projectArea => {
        // switch(projectArea.title){
        //     case '台北市':
        //         break;
        //     case '新北市':
        //         break;
        //         ...
        // }
        if (projectArea.type) {
          if (projectArea.type === 'north') {
            areaOption[0].county.push({
              id: projectArea.id,
              name: projectArea.title,
              count: projectArea.dataCount,
              type: 'north',
            });
          } else if (projectArea.type === 'south') {
            areaOption[2].county.push({
              id: projectArea.id,
              name: projectArea.title,
              count: projectArea.dataCount,
              type: 'south',
            });
          } else if (projectArea.type === 'east') {
            areaOption[3].county.push({
              id: projectArea.id,
              name: projectArea.title,
              count: projectArea.dataCount,
              type: 'east',
            });
          } else if (projectArea.type === 'west') {
            areaOption[1].county.push({
              id: projectArea.id,
              name: projectArea.title,
              count: projectArea.dataCount,
              type: 'west',
            });
          }
        }
      });
    },
    loadMoreProjects() {
      this.getProjectRequest(this.projects.length / PROJECT_PAGE);
    },
    selectSingleFilter(key, event) {
      this.selectedFilters[key] = event.currentTarget.id;
      // if (key === 'projectType' && event.currentTarget.id === '我的計畫')
      //   this.getProjectRequest();
      // else if (key === 'projectType' && event.currentTarget.id === '公開計畫')
      //   this.getPublicProjectsRequest();

      if (this.selectedFilters.projectType === '我的計畫') {
        this.getProjectRequest();
      } else if (this.selectedFilters.projectType === '公開計畫') {
        this.getPublicProjectsRequest();
      }
    },
    clearFilter(type) {
      if (type === 'datetime') this.selectedFilters[type] = [0, MaxDateTime];
      else this.selectedFilters[type] = '';
    },
    formatDatetime(value) {
      const year = Math.floor(value / 12);
      let month = (value % 12) + 1;
      if (month < 10) month = `0${month}`;
      return `${2000 + year}/${month}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter {
  background-color: white;
  width: 240px;
  border: none;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.285892);
}
.is-open {
  display: block;
}
.is-close {
  display: none;
}
</style>
