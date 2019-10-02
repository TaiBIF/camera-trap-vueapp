<template>
  <div class="list-project-camera">
    <div>
      <el-table :data="projectCameraListData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="camera-detail">
              <el-row>
                <el-col :span="5" :offset="1">
                  <span class="camera-detail-title"><b>相機預設值</b></span>
                </el-col>
                <el-col :span="18">
                  <el-row>
                    <el-col :span="3">電池類型</el-col>
                    <el-col :span="5">{{
                      props.row.batteryType || '&nbsp;'
                    }}</el-col>
                    <el-col :span="3">光強度</el-col>
                    <el-col :span="5">{{
                      props.row.brightness || '&nbsp;'
                    }}</el-col>
                    <el-col :span="3">影片長度</el-col>
                    <el-col :span="5">{{
                      props.row.videoLength
                        ? props.row.videoLength + '分鐘'
                        : '&nbsp;'
                    }}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">敏感度</el-col>
                    <el-col :span="5">{{
                      props.row.sensitivity || '&nbsp;'
                    }}</el-col>
                    <el-col :span="3">連拍張數</el-col>
                    <el-col :span="5">{{
                      props.row.continuousShots
                        ? props.row.continuousShots + '張'
                        : '&nbsp;'
                    }}</el-col>
                    <el-col :span="3">感應距離</el-col>
                    <el-col :span="5">{{
                      props.row.sensingDistance
                        ? props.row.sensingDistance + '公尺'
                        : '&nbsp;'
                    }}</el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="自訂相機編號" prop="nickname"></el-table-column>
        <el-table-column label="相機序號" prop="sn"></el-table-column>
        <el-table-column label="廠商維護編號" prop="vn"></el-table-column>
        <el-table-column
          label="相機財產編號"
          prop="propertyNumber"
        ></el-table-column>
        <el-table-column label="廠牌" prop="manufacturer"></el-table-column>
        <el-table-column label="型號" prop="model"></el-table-column>
        <el-table-column label="狀態" prop="state"
          ><template slot-scope="props">
            {{ stateString[props.row.state] }}
            <div class="project-camera-delete">
              <i
                class="el-icon-delete"
                @click="openCheckModal(props.row.id, props.row.name)"
              ></i></div
          ></template>
        </el-table-column>
      </el-table>
      <check-delete-project-camera-modal
        :open="showCheckModal"
        :projectCameraName="chooseProjectCameraName"
        @checkDeleteProjectCamera="checkDeleteProjectCamera"
        @close="closeCheckModal"
      />
    </div>
  </div>
</template>

<script>
import CheckDeleteProjectCameraModal from './CheckDeleteProjectCameraModal.vue';

export default {
  name: 'ListProjectCamera',
  props: {
    projectCameraListData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CheckDeleteProjectCameraModal,
  },

  data() {
    return {
      showCheckModal: false,
      chooseProjectCameraId: '',
      chooseProjectCameraName: '',
      stateString: {
        active: '使用中',
        suspended: '停用中',
        service: '維修中',
        removed: '已撤除',
      },
    };
  },
  methods: {
    openCheckModal(id, name) {
      this.chooseProjectCameraId = id;
      this.chooseProjectCameraName = name;
      this.showCheckModal = true;
    },
    closeCheckModal() {
      this.showCheckModal = false;
    },
    checkDeleteProjectCamera() {
      this.$emit('deleteProjectCamera', this.chooseProjectCameraId);
      this.showCheckModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.list-project-camera {
  min-height: 335px;
}
.camera-detail {
  border-style: solid;
  border-width: 2px;
  border-color: #979797;
  padding: 5px;
  line-height: 40px;
}
.camera-detail-title {
  font-size: 16px;
}
.camera-detail-content {
  font-size: 0;
  .label {
    width: 90px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }
}
.project-camera-delete {
  float: right;
}
</style>
