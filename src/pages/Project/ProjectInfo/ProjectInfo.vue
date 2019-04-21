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
                  @click="downloadExampleCsv"
                  >範本下載</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel tab-panel">
        TBD
      </div>
    </div>

    <ul>
      <li>
        <router-link
          :to="{
            name: 'projectStudyAreasView',
            params: {
              projectId,
              studyAreaId: '5cacb8d89c37591f7dcb7d', // TODO: adapt API
            },
          }"
          >樣區資訊</router-link
        >
      </li>
      <li></li>
    </ul>
    <br />
    <p>當前計畫詳細資訊</p>
    <ul>
      <li :key="field.id" v-for="field in projectDetail.dataFields">
        {{ field.description }}
      </li>
    </ul>
    <br />
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
  },
  methods: {
    downloadExampleCsv() {
      // TODO: apply download csv function after API ready
    },
  },
};
</script>
