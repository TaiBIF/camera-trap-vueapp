<template>
  <div
    class="container"
    v-infinite-scroll="loadMoreProjects"
    infinite-scroll-disabled="disableLoadMoreProjects"
    infinite-scroll-distance="800"
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
              依 {{ sortedBy }} 排序
            </a>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a
                class="dropdown-item"
                @click="
                  sortByField('startTime', -1);
                  sortedBy = '資料起始時間';
                "
                >依資料起始時間排序 (新→舊)</a
              >
              <a
                class="dropdown-item"
                @click="
                  sortByField('funder', 1);
                  sortedBy = '委託單位';
                "
                >依委託單位筆畫排序</a
              >
              <a
                class="dropdown-item"
                @click="
                  sortByField('title', 1);
                  sortedBy = '計畫名稱';
                "
                >依計畫名稱筆畫排序</a
              >
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

export default {
  directives: { infiniteScroll },
  data() {
    return {
      sortedBy: '條件',
      busy: false,
    };
  },
  mounted() {
    this.getProjects({
      index: 0,
      size: PROJECT_PAGE,
    });
  },
  computed: {
    ...projects.mapState(['projects', 'projectsTotal']),
    disableLoadMoreProjects() {
      return this.busy || this.projectsTotal === this.projects.length;
    },
  },
  methods: {
    ...projects.mapActions(['getProjects']),
    sortByField(fieldName, dir) {
      this.projects.sort((prjA, prjB) => {
        if (dir > 0) {
          return prjA[fieldName] > prjB[fieldName] ? 1 : -1;
        } else {
          return prjA[fieldName] < prjB[fieldName] ? 1 : -1;
        }
      });
    },
    async loadMoreProjects() {
      this.busy = true;

      await this.getProjects({
        index: this.projects.length / PROJECT_PAGE,
        size: PROJECT_PAGE,
      });

      this.busy = false;
    },
  },
};
</script>
