<template>
  <div v-if="!!project">
    <form class="form form-horizontal">
      <div class="panel">
        <div class="panel-heading">
          <h4>創用CC授權許可</h4>
        </div>
        <div class="panel-body">
          <p>
            授權計畫內的詮釋資料、鑑定資訊與影像資訊讓其他遵守授權條款的用戶不必向您詢問許可，即能合法使用其中資料。「Camera
            Trap 監測資料管理平台」使用您的創用 CC
            授權內容，來與像是全球生物多樣性資訊機構（GBIF），一個專門編輯發佈全球生物多樣化訊息之國際政府間組織如此般的資料合作者共享內容。
            了解<a href="http://creativecommons.tw/" target="_blank"
              >創用 CC 授權內容</a
            >。
          </p>
          <div class="form-group">
            <label for="">詮釋資料：</label>
            <div>
              <div class="radio">
                <input
                  type="radio"
                  id="for-data-1"
                  v-model="project.interpretiveDataLicense"
                  value="cc0"
                  :checked="project.interpretiveDataLicense === 'cc0'"
                />
                <label for="for-data-1">
                  <img
                    src="/assets/common/cc-0.png"
                    height="40px"
                    srcset="/assets/common/cc-0@2x.png"
                  />
                  <span class="text">無著作權 (CC0)</span>
                </label>
              </div>
              <div class="radio">
                <input
                  type="radio"
                  id="for-data-2"
                  v-model="project.interpretiveDataLicense"
                  value="by"
                  :checked="project.interpretiveDataLicense === 'by'"
                />
                <label for="for-data-2">
                  <img
                    src="/assets/common/cc-1.png"
                    height="40px"
                    srcset="/assets/common/cc-1@2x.png"
                  />
                  <span class="text">姓名標示</span>
                </label>
              </div>
              <div class="radio">
                <input
                  type="radio"
                  id="for-data-3"
                  v-model="project.interpretiveDataLicense"
                  value="by-nc"
                  :checked="project.interpretiveDataLicense === 'by-nc'"
                />
                <label for="for-data-3">
                  <img
                    src="/assets/common/cc-2.png"
                    height="40px"
                    srcset="/assets/common/cc-2@2x.png"
                  />
                  <span class="text">姓名標示-非商業性</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="">鑑定資訊：</label>
            <div>
              <div class="radio">
                <input
                  type="radio"
                  id="for-info-1"
                  v-model="project.identificationInformationLicense"
                  value="by"
                  :checked="project.identificationInformationLicense === 'by'"
                />
                <label for="for-info-1">
                  <img
                    src="/assets/common/cc-1.png"
                    height="40px"
                    srcset="/assets/common/cc-1@2x.png"
                  />
                  <span class="text">姓名標示</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="">影像資料：</label>
            <div>
              <div class="radio">
                <input
                  type="radio"
                  id="for-img-1"
                  v-model="project.videoMaterialLicense"
                  value="cc0"
                  :checked="project.videoMaterialLicense === 'cc0'"
                />
                <label for="for-img-1">
                  <img
                    src="/assets/common/cc-0.png"
                    height="40px"
                    srcset="/assets/common/cc-0@2x.png"
                  />
                  <span class="text">無著作權 (CC0)</span>
                </label>
              </div>
              <div class="radio">
                <input
                  type="radio"
                  id="for-img-2"
                  v-model="project.videoMaterialLicense"
                  value="by"
                  :checked="project.videoMaterialLicense === 'by'"
                />
                <label for="for-img-2">
                  <img
                    src="/assets/common/cc-1.png"
                    height="40px"
                    srcset="/assets/common/cc-1@2x.png"
                  />
                  <span class="text">姓名標示</span>
                </label>
              </div>
              <div class="radio">
                <input
                  type="radio"
                  id="for-img-3"
                  v-model="project.videoMaterialLicense"
                  value="by-nc"
                  :checked="project.videoMaterialLicense === 'by-nc'"
                />
                <label for="for-img-3">
                  <img
                    src="/assets/common/cc-2.png"
                    height="40px"
                    srcset="/assets/common/cc-2@2x.png"
                  />
                  <span class="text">姓名標示-非商業性</span>
                </label>
              </div>
            </div>
          </div>
          <hr />
          <div class="form-group row">
            <label for="" class="pl-3 required">公開日期：</label>
            <div class="d-inline-block pl-3">
              <div
                class="input-group"
                :class="{ 'is-invalid': !project.publishTime }"
              >
                <date-picker
                  :format="'YYYY-MM-DD'"
                  :first-day-of-week="1"
                  :value="formatTime(project.publishTime)"
                  @change="setProjectTime('publishTime', $event)"
                />
                <div class="input-group-append">
                  <i class="icon icon-calendar"></i>
                </div>
              </div>
              <span v-show="!project.publishTime" class="invalid-feedback">
                公開日期不能留空
              </span>
            </div>
            <div class="col-12 pt-2">
              <small class="text-gray">
                計畫內的詮釋資料將會直接公開，鑑定資訊、影像資料的<span
                  :class="{ warning: isOverPublicLimit }"
                  >公開日期之上限為計畫起始時間的5年後。</span
                >
              </small>
            </div>
          </div>
        </div>
      </div>
      <ActionBtns
        @cancel="handleClickCancel"
        @submit="doDone"
        :status="status"
        :error="error"
        :disabledSubmit="isOverPublicLimit || !project.publishTime"
        :submitBtnContext="doneBtnText"
      />
    </form>
  </div>
</template>

<script>
import ActionBtns from '@/components/ActionBtns/ActionBtns.vue';
import DatePicker from 'vue2-datepicker';
import moment from 'moment';

export default {
  props: {
    project: Object,
    status: {
      type: Number,
      default: undefined,
    },
    error: Object,
    doneBtnText: {
      type: String,
      default: '儲存設定',
    },
  },
  components: {
    DatePicker,
    ActionBtns,
  },
  computed: {
    projectId: function() {
      return this.$route.params.projectId;
    },
    isOverPublicLimit: function() {
      return (
        moment(this.project.startTime).add(5, 'years') <
        moment(this.project.publishTime)
      );
    },
  },
  methods: {
    formatTime(v) {
      return moment(v).format('YYYY-MM-DD');
    },
    setProjectTime(key, t) {
      this.changeProps(key, moment(t).toISOString());
    },
    changeProps(key, value) {
      this.$emit('change', Object.assign({}, this.project, { [key]: value }));
    },
    handleClickCancel() {
      if (this.projectId) {
        this.$router.push({
          name: 'projectInfo',
          params: {
            projectId: this.projectId,
          },
        });
      } else {
        this.$router.push({ name: 'projectOverview' });
      }
    },
    doDone() {
      if (!this.isOverPublicLimit && this.project.publishTime) {
        this.$emit('done');
      }
    },
  },
};
</script>
