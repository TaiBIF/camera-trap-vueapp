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
                <div
                  class="col-3 text-right"
                  v-if="showManageLink"
                  style="white-space: nowrap;"
                >
                  <router-link
                    :to="{
                      name: 'projectBasic',
                      params: {
                        projectId,
                      },
                    }"
                    class="float-right btn btn-green-border"
                  >
                    <i class="fa fa-pencil-alt mr-2"></i>
                    <span class="text" style="white-space: nowrap;"
                      >計畫管理</span
                    ></router-link
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
              <div class="row">
                <div class="col-sm-4 col-md-3 text-gray">
                  Darwin Core Archive
                </div>
                <div class="col-sm-8 col-md-9" v-if="!isPrepareDwCA">
                  <a
                    v-if="projectDetail.dwc"
                    class="link text-underline text-green"
                    :href="downloadDwCALink"
                    target="_blank"
                  >
                    最新版本: {{ dwcLatestTime }} 下載
                  </a>
                  <br v-if="projectDetail.dwc" />
                  <a
                    class="link text-underline text-green"
                    @click="prepareDwCA()"
                    target="_blank"
                  >
                    產生新版
                  </a>
                </div>
                <div class="col-sm-8 col-md-9" v-if="isPrepareDwCA">
                  產生完畢後將另發通知
                </div>
              </div>
              <div class="row">
                <div class="col-sm-4 col-md-3 text-gray">
                  相機樣點運作集缺失比例
                </div>
                <div class="col-sm-8 col-md-9">
                  <router-link
                    :to="{
                      name: 'projectOversight',
                      params: {
                        projectId,
                      },
                    }"
                    class=""
                  >
                    <span class="text" style="white-space: nowrap;"
                      >查看</span
                    ></router-link
                  >
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
            <li :class="{ active: $route.name === 'projectMedia' }">
              <router-link
                :to="`/project/${projectId}/info/media/all/retrieved`"
              >
                影像回收/辨識狀況
              </router-link>
            </li>
            <li :class="{ active: $route.name === 'projectSpecies' }">
              <router-link :to="`/project/${projectId}/info/species/all`">
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
import fetchWrap from '@/utils/fetch';
import moment from 'moment';

const projects = createNamespacedHelpers('projects');
const account = createNamespacedHelpers('account');

export default {
  name: 'project-info',
  data() {
    return {
      currentTab: 0,
      isPrepareDwCA: false,
    };
  },
  computed: {
    ...projects.mapGetters(['projectDetail', 'isProjectManager']),
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
      return this.isAdministrator || this.isProjectManager(this.userId);
    },
    downloadCsvLink() {
      return `${process.env.VUE_APP_API_URL}/api/v1/projects/${
        this.projectId
      }/example.csv`;
    },
    downloadDwCALink() {
      return `${process.env.VUE_APP_API_URL}/api/v1/projects/${
        this.projectId
      }/dwca`;
    },
    dwcLatestTime() {
      return moment(this.projectDetail.dwc).format('YYYY-MM-DD hh:mm:ss');
    },
  },
  methods: {
    prepareDwCA() {
      fetchWrap({
        method: 'POST',
        url: `/api/v1/projects/${this.projectId}/dwca`,
      });
      this.isPrepareDwCA = true;
    },
  },
};
</script>
