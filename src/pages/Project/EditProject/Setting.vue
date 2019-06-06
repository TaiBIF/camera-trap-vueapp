<template>
  <div>
    <DataFields
      :dataFields="dataFields"
      :tempDataFields="tempDataFields"
      @change="tempDataFields = $event"
      @request="requestField"
    />
    <DataFieldsTemplate />
    <CameraTestTime
      v-if="dailyTestTime !== undefined"
      :dailyTestTime="dailyTestTime"
      @change="dailyTestTime = $event"
    />
    <ActionBtns
      @cancel="handleClickCancel"
      @submit="doSubmit"
      :status="status"
      :error="error"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import idx from 'idx';

import ActionBtns from '@/components/ActionBtns/ActionBtns.vue';
import CameraTestTime from './CameraTestTime.vue';
import DataFields from './DataFields.vue';
import DataFieldsTemplate from './DataFieldsTemplate.vue';

const dataFields = createNamespacedHelpers('dataFields');
const projects = createNamespacedHelpers('projects');

export default {
  data() {
    return {
      dailyTestTime: undefined,
      tempDataFields: [],
      status: undefined,
      error: undefined,
    };
  },
  components: {
    DataFields,
    DataFieldsTemplate,
    CameraTestTime,
    ActionBtns,
  },
  props: {
    setLoading: Function,
  },
  mounted() {
    this.getDataFields();
    this.setData();
  },
  watch: {
    projectDetail: function() {
      this.setData();
    },
  },
  computed: {
    ...dataFields.mapGetters(['dataFields']),
    ...projects.mapGetters(['projectDetail', 'projectDataFields']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...dataFields.mapActions(['getDataFields', 'postDataFields']),
    ...projects.mapActions(['putProject']),
    setData() {
      this.dailyTestTime = idx(this.projectDetail, _ => _.dailyTestTime);
      this.tempDataFields = this.projectDataFields;
    },
    handleClickCancel() {
      this.$router.push({
        name: 'projectInfo',
        params: {
          projectId: this.projectId,
        },
      });
    },
    async requestField(payload) {
      await this.postDataFields({
        ...payload,
        project: this.projectId,
      });
    },
    async doSubmit() {
      this.setLoading(true);
      this.status = 200;
      this.error = undefined;
      await this.putProject({
        id: this.projectId,
        body: {
          ...this.projectDetail,
          dailyTestTime: this.dailyTestTime,
          dataFields: this.tempDataFields,
        },
      }).catch(e => {
        this.error = e;
      });
      this.setLoading(false);
      /*
      Disable auto redirect step function
      */
      // if (!this.error) {
      //   this.$router.push({
      //     name: 'projectCameraLocation',
      //     params: {
      //       projectId: this.projectId,
      //     },
      //   });
      // }
    },
  },
};
</script>
