<template>
  <div>
    <h1>計畫管理-編輯設定</h1>
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
    <div class="action">
      <div @click="handleClickCancel" class="btn btn-default">
        取消
      </div>
      <button
        type="submit"
        @click.stop.prevent="doSubmit()"
        class="btn btn-orange"
      >
        儲存設定
      </button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import idx from 'idx';

import CameraTestTime from './CameraTestTime.vue';
import DataFields from './DataFields.vue';
import DataFieldsTemplate from './DataFieldsTemplate.vue';

const dataFields = createNamespacedHelpers('dataFields');
const projects = createNamespacedHelpers('projects');

export default {
  components: {
    DataFields,
    DataFieldsTemplate,
    CameraTestTime,
  },
  data() {
    return {
      dailyTestTime: undefined,
      tempDataFields: [],
    };
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
      this.$router.push({ path: `/project/${this.projectId}` });
    },
    async requestField(payload) {
      await this.postDataFields({
        ...payload,
        project: this.projectId,
      });
    },
    async doSubmit() {
      this.setLoading(true);
      await this.putProject({
        id: this.projectId,
        body: {
          ...this.projectDetail,
          dailyTestTime: this.dailyTestTime,
          dataFields: this.tempDataFields,
        },
      });
      this.setLoading(false);
    },
  },
};
</script>
