<template>
  <div>
    <p v-if="errorMessage" :style="{ color: 'red' }">
      錯誤訊息: {{ errorMessage }}
    </p>
    <div class="panel">
      <div class="panel-heading">
        <h4>相機位置管理</h4>
      </div>
      <div class="panel-body camera-editor">
        <div class="sidebar" style="width: 300px">
          <study-area-sidebar
            :studyAreas="studyAreas"
            :projectId="projectId"
            :currentStudyAreaId="currentStudyAreaId"
            :isEditMode="true"
            @selectArea="selectStudyArea"
            @addArea="addStudyArea"
          />
        </div>
        <div class="maintain p-0">
          <div class="empty-result" v-if="studyAreas.length === 0">
            <img
              src="/assets/common/empty-site.png"
              width="174"
              srcset="/assets/common/empty-site@2x.png"
            />
            <h5 class="text-gray">您還沒新增任何樣區</h5>
          </div>
          <div
            class="empty-result"
            v-else-if="currentStudyAreaId === undefined"
          >
            <img
              src="/assets/common/empty-site.png"
              width="174"
              srcset="/assets/common/empty-site@2x.png"
            />
            <h5 class="text-gray">請選擇樣區</h5>
          </div>
          <div class="sheet-view show" v-else>
            <div class="control p-2">
              <div class="row">
                <div class="col-12 text-right">
                  <div class="form-group-inline">
                    <label for="">座標大地基準：</label>
                    WGS84
                    <span class="icon-note">
                      <i class="icon-info"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="sheet-container">
              <hot-table
                id="sheet"
                licenseKey="non-commercial-and-evaluation"
                language="zh-TW"
                :settings="HandsontableSetting"
              ></hot-table>
              <a class="text-green btn btn-link" @click="addNewCameraLoation">
                <span class="icon"><i class="icon-add-green"></i></span>
                <span class="text">新增相機位置</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action">
      <div @click="handleClickCancel" class="btn btn-default">取消</div>
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
import { HotTable } from '@handsontable/vue';
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';

import { dateFormatYYYYMMDD } from '@/utils/dateHelper';
import { getProjectCameraLocationsByName } from '@/service';
import StudyAreaSidebar from '@/components/StudyAreaSidebar/StudyAreaSidebar.vue';

const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  components: {
    StudyAreaSidebar,
    HotTable,
  },
  data: function() {
    return {
      errorMessage: undefined,
      currentStudyAreaId: undefined,
      currentCameraLocationId: undefined,
      newCameraLocation: {},
      editCameraLocation: {},
      HandsontableSetting: {
        rowHeaders: true,
        colHeaders: [
          // 'URL',
          '<span style="color: red;">*</span>相機位置名稱',
          '架設日期',
          '<span style="color: red;">*</span>經度 (X)',
          '<span style="color: red;">*</span>緯度 (Y)',
          '海拔 (公尺)',
          '植被',
          '土地覆蓋類型',
        ],
        columns: [
          {
            data: 'name',
            type: 'text',
            validator: async function(value, callback) {
              if (!value) {
                callback(false); // 不能為空字串
              } else {
                const rowData = this.instance.getSourceDataAtRow(this.row);
                const data = await getProjectCameraLocationsByName(
                  rowData.projectId,
                  value,
                );
                callback(
                  data.total === 0 ||
                    (data.total === 1 && data.items[0].id === rowData.id),
                ); // 同一計畫底下相機位置名稱不可重複，但如果是修改自己本來的名字則是可以的
              }
            },
          },
          {
            data: 'settingTime',
            type: 'date',
            dateFormat: 'YYYY-MM-DD',
          },
          {
            data: 'longitude',
            type: 'numeric',
            validator: (value, callback) => {
              // 不能為空字串, 輸入只能是數字, 輸入要大於等於 0
              callback(value !== '' && !isNaN(Math.sign(value)) && value >= 0);
            },
          },
          {
            data: 'latitude',
            type: 'numeric',
            validator: (value, callback) => {
              // 不能為空字串, 輸入只能是數字, 輸入要大於等於 0
              callback(value !== '' && !isNaN(Math.sign(value)) && value >= 0);
            },
          },
          {
            data: 'altitude',
            type: 'numeric',
          },
          {
            data: 'vegetation',
            type: 'text',
          },
          {
            data: 'landCoverType',
            type: 'text',
          },
        ],
        contextMenu: [
          'cut',
          'copy',
          {
            name: '貼上 請使用鍵盤 ctrl+v 或 cmd+v',
            disabled: true,
          },
          '---------',
          'undo',
          'redo',
          '---------',
          {
            name: '複製一列並貼上',
            disabled: function() {
              return (
                // 選擇多格 or 同時選擇多個範圍(例如拖拉範圍選擇)
                // 這兩種情況會造成複製不只一列
                this.getSelected().length !== 1 ||
                this.getSelected()[0][0] !== this.getSelected()[0][2]
              );
            },
            callback: (key, selection) => {
              const copyTarget = {
                ...this.$data.HandsontableSetting.data[selection[0].start.row],
                id: undefined,
              };
              this.$data.HandsontableSetting.data.splice(
                selection[0].start.row,
                0,
                copyTarget,
              );
            },
          },
          {
            name: '刪除相機位置',
            disabled: function() {
              return (
                // 選擇多格不能刪除相機，會造成不知道要怎要刪除
                this.getSelected().length !== 1
              );
            },
            callback: (key, selection) => {
              this.$data.HandsontableSetting.data.splice(
                selection[0].start.row,
                selection[0].end.row - selection[0].start.row + 1,
              );
            },
          },
        ],
        data: [],
      },
    };
  },
  props: {
    setLoading: Function,
  },
  watch: {
    currentStudyAreaId: function(val) {
      this.currentCameraLocationId = '';
      this.getProjectCameraLocations({
        projectId: this.projectId,
        studyAreaId: val,
      });
    },
    currentCameraLocationId: function(val) {
      const obj = this.cameraLocations.find(v => v.id === val);
      Object.assign(this.editCameraLocation, obj);
      this.editCameraLocation.settingTime = moment(
        this.editCameraLocation.settingTime,
      ).format('YYYY-MM-DD');
    },
    cameraLocations: function(val) {
      this.HandsontableSetting.data = val.map(v => ({
        projectId: this.projectId, // name 的 validator 會使用到
        ...v,
        ...(v.settingTime
          ? { settingTime: dateFormatYYYYMMDD(v.settingTime) }
          : undefined),
      }));
    },
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreas']),
    ...studyAreas.mapState(['cameraLocations']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...studyAreas.mapActions([
      'postProjectStudyAreas',
      'getProjectCameraLocations',
      'modifyProjectCameraLocations',
    ]),
    selectStudyArea(id) {
      this.currentStudyAreaId = id;
    },
    handleClickCancel() {
      this.$router.push({ path: `/project/${this.projectId}` });
    },
    async addStudyArea(title, parent) {
      this.setLoading(true);
      try {
        await this.postProjectStudyAreas({
          id: this.projectId,
          area: { title, parent },
        });
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
      this.setLoading(false);
    },
    addNewCameraLoation() {
      this.HandsontableSetting.data.push({
        projectId: this.projectId, // name 的 validator 會使用到
        studyArea: this.currentStudyAreaId,
      });
    },
    async doSubmit() {
      try {
        await this.modifyProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: this.currentStudyAreaId,
          payload: this.HandsontableSetting.data.map(v => ({
            ...v,
            ...(v.settingTime
              ? { settingTime: moment(v.settingTime).toISOString() }
              : undefined),
          })),
        });
        this.errorMessage = '';
        this.$router.push({
          path: `/project/${this.projectId}/edit/member`,
        });
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#split-view {
  display: flex;
  & > ul:nth-child(1) {
    border-right: 1px red solid;
    padding-right: 1rem;
  }
}
</style>
