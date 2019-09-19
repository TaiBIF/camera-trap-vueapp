<template>
  <div class="project-camera-list">
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
                    <el-col :span="5">{{ props.row.batteryType }}</el-col>
                    <el-col :span="3">光強度</el-col>
                    <el-col :span="5">{{ props.row.brightness }}</el-col>
                    <el-col :span="3">影片長度</el-col>
                    <el-col :span="5">{{ props.row.videoLength }}分鐘</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">敏感度</el-col>
                    <el-col :span="5">{{ props.row.sensitivity }}</el-col>
                    <el-col :span="3">連拍張數</el-col>
                    <el-col :span="5">{{ props.row.continuousShots }}張</el-col>
                    <el-col :span="3">感應距離</el-col>
                    <el-col :span="5">{{ props.row.distance }}公尺</el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="自訂相機編號" prop="name"></el-table-column>
        <el-table-column label="相機序號" prop="sn"></el-table-column>
        <el-table-column label="廠商維護編號" prop="vn"></el-table-column>
        <el-table-column
          label="相機財產編號"
          prop="propertyNumber"
        ></el-table-column>
        <el-table-column label="廠牌" prop="manufacturer"></el-table-column>
        <el-table-column label="型號" prop="model"></el-table-column>
        <el-table-column label="狀態" prop="state"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: '自訂相機編號',
    dataIndex: 'name',
  },
  {
    title: '相機序號',
    dataIndex: 'sn',
  },
  {
    title: '廠商維護編號',
    dataIndex: 'vn',
  },
  {
    title: '相機財產編號',
    dataIndex: 'propertyNumber',
  },
  {
    title: '廠牌',
    dataIndex: 'manufacturer',
  },
  {
    title: '型號',
    dataIndex: 'model',
  },
  {
    title: '狀態',
    dataIndex: 'state',
  },
];

export default {
  name: 'project-camera-list',
  props: {
    projectCameraListData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      columns,
    };
  },
};
</script>

<style lang="scss" scoped>
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
</style>
