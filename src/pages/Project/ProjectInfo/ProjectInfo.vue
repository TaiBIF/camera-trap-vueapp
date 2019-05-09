<template>
  <div class="maintain">
    <div class="container">
      <div class="panel panel-project">
        <div class="panel-body">
          <div class="row">
            <div class="col-8">
              <div class="row">
                <div class="col-9">
                  <h1 class="heading mt-0">
                    {{ projectDetail.title }}
                  </h1>
                </div>
                <div class="col-3 text-right" v-if="showManageLink">
                  <router-link
                    :to="{
                      name: 'projectBasic',
                      params: {
                        projectId,
                      },
                    }"
                    class="float-right btn btn-green-border btn-sm"
                  >
                    <i class="fa fa-pencil-alt mr-2"></i>
                    <span class="text">計畫管理</span></router-link
                  >
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-4 col-md-3 text-gray">委辦單位</div>
                <div class="col-sm-8 col-md-9">{{ projectDetail.funder }}</div>
              </div>
              <div class="row mb-2">
                <div class="col-sm-4 col-md-3 text-gray">計畫編號</div>
                <div class="col-sm-8 col-md-9">
                  {{ projectDetail.code }}
                </div>
              </div>
              <div
                class="row mb-2"
                v-if="!!projectDetail.principalInvestigator"
              >
                <div class="col-sm-4 col-md-3 text-gray">計畫主持人</div>
                <div class="col-sm-8 col-md-9">
                  {{ projectDetail.principalInvestigator }}
                </div>
              </div>
              <div class="row mb-2" v-if="!!projectTimeRange">
                <div class="col-sm-4 col-md-3 text-gray">計畫時間</div>
                <div class="col-sm-8 col-md-9">
                  {{ projectTimeRange }}
                </div>
              </div>
              <div class="row" v-if="!!projectAreas">
                <div class="col-sm-4 col-md-3 text-gray">計畫地區</div>
                <div class="col-sm-8 col-md-9">
                  {{ projectAreas }}
                </div>
              </div>
            </div>
            <div class="col-4 text-center pt-5 divider">
              <router-link
                :to="{
                  name: 'projectUpload',
                  params: {
                    projectId,
                  },
                }"
                class="btn btn-orange"
              >
                <i class="fa fa-upload mr-2"></i>
                <span class="text">檔案上傳</span></router-link
              >
              <p class="text-gray">
                欄位格式請參考
                <a
                  class="link text-underline text-green"
                  :href="downloadCsvLink"
                  target="_blank"
                  >範本下載</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="panel tab-panel">
        <div class="panel-header">
          <ul class="nav-tab">
            <li :class="{ active: $route.name === 'projectVideo' }">
              <router-link :to="`/project/${projectId}/info/video/all/receive`">
                影像回收/辨識狀況
              </router-link>
            </li>
            <li :class="{ active: $route.name === 'projectSpecies' }">
              <router-link :to="`/project/${projectId}/info/species`">
                已辨識物種
              </router-link>
            </li>
          </ul>
        </div>
        <div class="panel-body">
          <div class="tab-panel">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { dateFormatYYYYMMDD } from '@/utils/dateHelper';
import { isAllowManageProject } from '@/utils/roles';

const projects = createNamespacedHelpers('projects');
const account = createNamespacedHelpers('account');

export default {
  name: 'project-info',
  data() {
    return {
      currentTab: 0,
    };
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
    ...account.mapGetters(['userId', 'isAdministrator']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    projectTimeRange: function() {
      const { startTime, endTime } = this.projectDetail;
      if (startTime && endTime) {
        return `${dateFormatYYYYMMDD(startTime)} ~ ${dateFormatYYYYMMDD(
          endTime,
        )}`;
      }
      return '';
    },
    projectAreas: function() {
      const areas = this.projectDetail.areas || [];
      return areas.map(({ title }) => title).join('、');
    },
    showManageLink() {
      if (this.isAdministrator) {
        return true;
      }
      const members = this.projectDetail.members || [];
      const projectMember = members.find(({ user }) => user.id === this.userId);
      if (!projectMember) {
        return false;
      }
      return isAllowManageProject(projectMember.role);
    },
    downloadCsvLink() {
      return `${process.env.VUE_APP_API_URL}/api/v1/projects/${
        this.projectId
      }/example.csv`;
    },
  },
};
</script>
