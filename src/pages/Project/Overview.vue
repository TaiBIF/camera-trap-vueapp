<template>
  <div
    class="container project-overview"
    v-infinite-scroll="loadMoreProjects"
    infinite-scroll-disabled="disableLoadMoreProjects"
    infinite-scroll-distance="300"
  >
    <h1 class="heading">計畫總覽</h1>
    <div class="project-overview-content">
      <div class="filter" style="background-color: white">
        <div class="filter-title">篩選條件</div>
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
              v-show="selectedFilters.species === option.name"
            />
            <span
              :id="option.name"
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
              <span>{{ formatDatetime(this.selectedFilters.datetime[0]) }}</span
              >至<span>{{
                formatDatetime(this.selectedFilters.datetime[1])
              }}</span>
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
            <div class="offset-8 col-4 text-right">
              <router-link to="/project/create" class="btn btn-orange"
                >上傳計畫</router-link
              >
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
                <span v-show="displayByGrid">
                  <i class="el-icon-s-grid" /> 格狀顯示
                </span>
                <span v-show="!displayByGrid">
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
          <div v-show="!displayByGrid">
            <div class="row project-item-title">
              <div class="col-4">計劃名稱</div>
              <div class="col-2">資料起始年份</div>
              <div class="col-2">委託單位</div>
              <div class="col-1">樣區數量</div>
              <div class="col-2">相機位置數</div>
              <div class="col-1">資料量</div>
            </div>
            <router-link
              class="row project-item-content"
              v-for="proj in projects"
              :key="proj.id"
              :to="proj.id"
            >
              <div class="col-4">{{ proj.title }}</div>
              <div class="col-2">{{ proj.startTime.split('-')[0] }}</div>
              <div class="col-2">{{ proj.funder }}</div>
              <div class="col-1">58</div>
              <div class="col-2">1200</div>
              <div class="col-1">400,000</div>
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
const PROJECT_PAGE = 12;
const SORTED_BY_ENUM = {
  '-oldestAnnotationTime': '依資料起始時間排序 (新→舊)',
  '-latestAnnotationTime': '依最後更新時間排序 (新→舊)',
  funder: '依委託單位筆畫排序',
  title: '依計畫名稱筆畫排序',
};
const speciesOption = [
  { name: '山羌', count: 200 },
  { name: '山羊', count: 150 },
  { name: '台灣獼猴', count: 80 },
];
const areaOption = [
  {
    name: '北部',
    count: 200,
    county: [
      { name: '台北市', count: 100 },
      { name: '新北市', count: 95 },
      { name: '基隆市', count: 5 },
    ],
  },
  {
    name: '中部',
    count: 50,
    county: [{ name: '台中市', count: 20 }, { name: '彰化縣', count: 30 }],
  },
  {
    name: '南部',
    count: 0,
    county: [],
  },
  {
    name: '東部',
    count: 100,
    county: [{ name: '花蓮縣', count: 50 }, { name: '台東市', count: 50 }],
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
      displayByGrid: true,
      speciesOption,
      areaOption,
      selectedArea: '',
      selectedFilters: {
        species: '',
        county: '',
        datetime: [0, MaxDateTime],
      },
      MaxDateTime,
    };
  },
  mounted() {
    this.getProjectRequest();
  },
  watch: {
    sortedBy() {
      this.getProjectRequest();
    },
  },
  computed: {
    ...projects.mapState(['projects', 'projectsTotal']),
    disableLoadMoreProjects() {
      return this.busy || this.projectsTotal === this.projects.length;
    },
  },
  methods: {
    ...projects.mapActions(['getProjects']),
    async getProjectRequest(index = 0) {
      this.busy = true;
      await this.getProjects({
        index,
        size: PROJECT_PAGE,
        sort: this.sortedBy,
      });
      this.busy = false;
    },
    loadMoreProjects() {
      this.getProjectRequest(this.projects.length / PROJECT_PAGE);
    },
    selectSingleFilter(key, event) {
      this.selectedFilters[key] = event.currentTarget.id;
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
