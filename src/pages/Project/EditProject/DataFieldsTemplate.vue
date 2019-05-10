<template>
  <div class="panel mb-3">
    <div class="panel-heading">
      <h4>範本下載</h4>
    </div>
    <div class="panel-body">
      <p>
        為了統一計畫內的欄位規則，您可以提供範本給計畫成員，範本會根據「欄位設定」之項目自動產生相應的範本。
      </p>
      <p>
        您可以透過下載來預覽範本：
        <a class="btn btn-default" :href="downloadCsvLink" target="_blank">
          <i class="fa fa-download"></i>
          下載範本
        </a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    projectId: function() {
      return this.$route.params.projectId;
    },
    downloadCsvLink() {
      return `${process.env.VUE_APP_API_URL}/api/v1/projects/${
        this.projectId
      }/example.csv`;
    },
  },
};
</script>
