<template>
  <div
    class="container"
    v-infinite-scroll="loadMoreProjects"
    infinite-scroll-disabled="disableLoadMoreProjects"
    infinite-scroll-distance="300"
  >
    <h1 class="heading">計畫總覽</h1>
    <div v-if="projects.length === 0">
      <div class="empty-content">
        <img
          src="/assets/common/empty-project.png"
          width="212px"
          srcset="/assets/common/empty-project@2x.png"
        />
        <h1 class="empty">您目前沒有任何計畫</h1>
        <router-link to="create" class="btn btn-orange">新增計畫</router-link>
      </div>
    </div>
    <div v-else>
      <!-- Controlbar -->
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
        <div class="col-4 text-right">
          <router-link to="/project/create" class="btn btn-orange"
            >新增計畫</router-link
          >
        </div>
      </div>
      <!-- Cards -->
      <div class="three cards">
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
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import infiniteScroll from 'vue-infinite-scroll';

const projects = createNamespacedHelpers('projects');
const PROJECT_PAGE = 12;
const SORTED_BY_ENUM = {
  oldestAnnotationTime: '依資料起始時間排序 (新→舊)',
  latestAnnotationTime: '依最後更新時間排序 (新→舊)',
  funder: '依委託單位筆畫排序',
  title: '依計畫名稱筆畫排序',
};

export default {
  directives: { infiniteScroll },
  data() {
    return {
      SORTED_BY_ENUM,
      sortedBy: 'oldestAnnotationTime',
      busy: false,
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
  },
};
</script>
