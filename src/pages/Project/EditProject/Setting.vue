<template>
  <div>
    <h1>計畫管理-編輯設定</h1>
    <DataFields />
    <Species />
    <DataFieldsTemplate />
    <CameraTestTime
      v-if="dailyTestTime !== undefined"
      :dailyTestTime="dailyTestTime"
      @change="dailyTestTime = $event"
    />
    <div class="action">
      <div @click="$router.back()" class="btn btn-default">返回</div>
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
import Species from './Species.vue';

const projects = createNamespacedHelpers('projects');

export default {
  components: {
    DataFields,
    Species,
    DataFieldsTemplate,
    CameraTestTime,
  },
  data() {
    return {
      dailyTestTime: undefined,
    };
  },
  props: {
    setLoading: Function,
  },
  mounted() {
    this.setData(this.projectDetail);
  },
  watch: {
    projectDetail: function(val) {
      this.setData(val);
    },
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...projects.mapActions(['putProjectDailyTestTime']),
    setData(detail) {
      this.dailyTestTime = idx(detail, _ => _.dailyTestTime);
    },
    async doSubmit() {
      this.setLoading(true);
      await this.putProjectDailyTestTime({
        id: this.projectId,
        dailyTestTime: this.dailyTestTime,
      });
      this.setLoading(false);
    },
  },
};
</script>
