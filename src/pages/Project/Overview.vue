<template>
  <div class="container project-overview">
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
              @click="selectByFilter()"
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
                v-show="selectedFilters.projectType.id === option.id"
              />
              <span
                :id="option.id"
                :name="option.name"
                class="filter-option"
                @click="
                  selectSingleFilter('projectType', option.id, option.name)
                "
              >
                {{ option.name }}
              </span>
              <!-- TODO: FIX ME UNTIL COUNT CORRECT -->
              <!-- <span class="float-right"> ({{ option.count }}) </span> -->
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
            <div
              v-for="(option, index) in speciesOptionForDisplay"
              :key="index"
            >
              <i
                class="el-icon-check"
                v-show="selectedFilters.species.id === option.id"
              />
              <span
                :id="option.id"
                :name="option.name"
                class="filter-option"
                @click="selectSingleFilter('species', option.id, option.name)"
              >
                {{ option.name }}
              </span>
              <span class="float-right"> ({{ option.count }}) </span>
            </div>
            <span @click="showAllSpeciesOption = !showAllSpeciesOption">
              <span v-if="showAllSpeciesOption">折疊</span>
              <span v-if="!showAllSpeciesOption">更多</span>
            </span>
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
                @click="selectAreaFilter('county', area.county, area.name)"
              >
                {{ area.name }}
              </span>
              <!-- TODO: FIX ME UNTIL COUNT CORRECT -->
              <!-- <span class="float-right"> ({{ area.count }}) </span> -->
              <!-- 縣市 -->
              <div v-show="selectedArea === area.name" class="ml-3">
                <div>
                  <i
                    class="el-icon-check"
                    v-show="selectedFilters.county.id === area.id"
                  />
                  <span
                    :id="area.id"
                    :name="area.name"
                    class="filter-option"
                    @click="selectAreaFilter('county', area.county, area.name)"
                  >
                    全部
                  </span>
                  <span class="float-right"> ({{ area.count }}) </span>
                </div>
                <div v-for="(county, index) in area.county" :key="index">
                  <i
                    class="el-icon-check"
                    v-show="selectedFilters.county.id === county.id"
                  />
                  <span
                    :id="county.id"
                    :name="county.name"
                    class="filter-option"
                    @click="
                      selectSingleFilter('county', county.id, county.name)
                    "
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
              計畫時間
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
        <div
          v-infinite-scroll="loadMoreProjects"
          infinite-scroll-disabled="disableLoadMoreProjects"
          infinite-scroll-distance="300"
        >
          <div v-if="currentProjects.length === 0">
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
          <div v-else class="123">
            <!-- Controlbar -->
            <div class="row">
              <div class="col-8">
                <span class="filter-label">
                  {{ selectedFilters.projectType.name }}
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
                  <div
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
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
                v-for="proj in currentProjects"
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
                <el-col :span="8">計畫名稱</el-col>
                <el-col :span="4">資料起始年份</el-col>
                <el-col :span="4">委託單位</el-col>
                <el-col :span="3">樣區數量</el-col>
                <el-col :span="3">相機位置數</el-col>
                <el-col :span="2">資料量</el-col>
              </el-row>
              <router-link
                v-for="proj in currentProjects"
                :key="proj.id"
                :to="proj.id"
              >
                <el-row class="project-item-content">
                  <el-col :span="8">{{ proj.title }}</el-col>
                  <el-col :span="4">{{ proj.startTime.split('-')[0] }}</el-col>
                  <el-col :span="4">{{ proj.funder || '&nbsp;' }}</el-col>
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
  { id: '我的計畫', name: '我的計畫', count: ' ' },
  { id: '公開計畫', name: '公開計畫', count: ' ' },
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
      showAllSpeciesOption: false,
      areaOption,
      selectedArea: '',
      selectedFilters: {
        projectType: { id: '我的計畫', name: '我的計畫' },
        species: { id: '', name: '' },
        county: { id: '', name: '' },
        datetime: [0, MaxDateTime],
      },
      selectedFiltersLabel: [],
      MaxDateTime,
      collapseFilter: true,
      currentProjects: [],
    };
  },
  async mounted() {
    // this.getProjectAreasOrientationTotal()
    await this.getProjectRequest();
    this.currentProjects = this.projects;
    await this.getSpeciesTypeAndCountRequest();
    await this.getProjectAreasRequest();
    await this.getPublicProjectsRequest();
    this.initProjectAndPublicProjectTotalCount();
  },
  watch: {
    async sortedBy() {
      if (this.selectedFilters.projectType.id === '我的計畫') {
        await this.getProjectRequest();
        this.currentProjects = this.projects;
      } else if (this.selectedFilters.projectType.id === '公開計畫') {
        await this.getPublicProjectsRequest();
        this.currentProjects = this.projects;
      }
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
              this.selectedFilters[key].name !== ''
            ) {
              return [
                ...pre,
                { type: key, value: this.selectedFilters[key].name },
              ];
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
      if (this.selectedFilters.projectType.id === '我的計畫') {
        return this.busy || this.projectsTotal <= this.currentProjects.length;
      } else {
        // 公開計畫
        return (
          this.busy || this.projectsPublicTotal <= this.currentProjects.length
        );
      }
    },
    speciesOptionForDisplay() {
      return this.showAllSpeciesOption
        ? this.speciesOption
        : this.speciesOption.slice(0, 10);
    },
  },
  methods: {
    ...projects.mapActions(['getProjects', 'getPublicProjects']),
    ...account.mapActions(['loadSpecies']),
    ...config.mapActions([
      'getProjectAreas',
      'getProjectAreasOrientationTotal',
    ]),
    initProjectAndPublicProjectTotalCount() {
      projectTypeOption[0].count = this.projectsTotal;
      projectTypeOption[1].count = this.projectsPublicTotal;
    },
    async getProjectRequest(index = 0) {
      this.busy = true;
      const filter = {
        index,
        size: PROJECT_PAGE,
        sort: this.sortedBy,
        projectType: this.selectedFilters.projectType.id,
        species: this.selectedFilters.species.id || undefined,
        startDate: this.formatDatetime(
          this.selectedFilters.datetime[0],
        ).replace('/', '-'),
        endDate: this.formatDatetime(this.selectedFilters.datetime[1]).replace(
          '/',
          '-',
        ),
      };

      if (Array.isArray(this.selectedFilters.county)) {
        const countys = this.selectedFilters.county.map(c => {
          return c.id;
        });
        Object.assign(filter, { county: countys });
      } else {
        Object.assign(filter, {
          county: this.selectedFilters.county.id || undefined,
        });
      }
      await this.getProjects(filter);
      setTimeout(() => {
        this.busy = false;
      }, 1000);
    },
    async getPublicProjectsRequest(index = 0) {
      this.busy = true;
      const filter = {
        index,
        size: PROJECT_PAGE,
        sort: this.sortedBy,
        projectType: this.selectedFilters.projectType.id,
        species: this.selectedFilters.species.id || undefined,
        county: this.selectedFilters.county.id || undefined,
        startDate: this.formatDatetime(
          this.selectedFilters.datetime[0],
        ).replace('/', '-'),
        endDate: this.formatDatetime(this.selectedFilters.datetime[1]).replace(
          '/',
          '-',
        ),
      };
      if (Array.isArray(this.selectedFilters.county)) {
        const countys = this.selectedFilters.county.map(c => {
          return c.id;
        });
        Object.assign(filter, { county: countys });
      } else {
        Object.assign(filter, {
          county: this.selectedFilters.county.id || undefined,
        });
      }
      await this.getPublicProjects(filter);
      setTimeout(() => {
        this.busy = false;
      }, 1000);
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
      areaOption[0].county = [];
      areaOption[1].county = [];
      areaOption[2].county = [];
      areaOption[3].county = [];
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
    async loadMoreProjects() {
      if (this.selectedFilters.projectType.id === '我的計畫') {
        await this.getProjectRequest(
          parseInt(this.projects.length / PROJECT_PAGE),
        );
        this.currentProjects = this.currentProjects.concat(this.projects);
      } else {
        // 公開計畫
        await this.getPublicProjectsRequest(
          parseInt(this.projects.length / PROJECT_PAGE),
        );
        this.currentProjects = this.currentProjects.concat(this.projects);
      }
    },
    async selectByFilter() {
      if (this.selectedFilters.projectType.id === '我的計畫') {
        await this.getProjectRequest();
        this.currentProjects = this.projects;
      } else if (this.selectedFilters.projectType.id === '公開計畫') {
        await this.getPublicProjectsRequest();
        this.currentProjects = this.projects;
      }
    },
    async selectSingleFilter(key, id, name) {
      this.selectedFilters[key] = { id, name };
      this.selectByFilter();
    },
    async selectAreaFilter(key, countys, name) {
      this.selectedArea = name;
      countys = countys.map(county => {
        return { id: county.id, name: county.name };
      });
      this.selectedFilters[key] = countys;
      this.selectByFilter();
    },
    clearFilter(type) {
      if (type === 'datetime') {
        this.selectedFilters[type] = [0, MaxDateTime];
      } else {
        this.selectedFilters[type] = { id: '', name: '' };
      }
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
