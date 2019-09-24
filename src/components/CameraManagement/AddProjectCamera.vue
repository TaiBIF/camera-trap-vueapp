<template>
  <div class="add-project-camera">
    <div class="camera-filter">篩選條件</div>
    <div class="camera-list">
      <el-table
        :data="cameraListData"
        :row-class-name="selectedStyle"
        @row-click="handleCurrentChange"
      >
        <el-table-column prop="name" label="相機編號"></el-table-column>
        <el-table-column prop="sn" label="相機序號"></el-table-column>
        <el-table-column prop="vn" label="廠商維護編號"> </el-table-column>
        <el-table-column prop="manufacturer" label="廠牌"> </el-table-column>
        <el-table-column prop="model" label="型號"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddProjectCamera',
  props: {
    cameraListData: {
      type: Array,
      default: () => [],
    },
    addProjectCameraList: {
      type: Array,
      default: () => [],
    },
    setAddProjectCameraList: { type: Function },
  },
  methods: {
    handleCurrentChange(row) {
      const new_addProjectCameraList = Array.from(this.addProjectCameraList);
      const index = new_addProjectCameraList.indexOf(row);
      if (index !== -1) new_addProjectCameraList.splice(index, 1);
      else new_addProjectCameraList.push(row);
      this.setAddProjectCameraList(new_addProjectCameraList);
    },
    selectedStyle({ row }) {
      const index = this.addProjectCameraList.indexOf(row);
      if (index !== -1) return 'add-project-selected';
    },
  },
};
</script>

<style lang="scss" scoped></style>
