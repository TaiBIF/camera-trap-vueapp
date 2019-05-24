<template>
  <div class="container">
    <div class="search-container">
      <div class="col-12 pt-2">
        <router-link to="/download/search">
          <small class="text-gray">
            <i class="fa fa-chevron-left"></i> 返回資料篩選及計算
          </small>
        </router-link>
        <div>
          <div class="float-right">
            <a
              class="btn btn-green-border btn-sm"
              :href="exportUrl"
              v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'"
            >
              <span class="icon"><i class="icon-download-green"></i></span>
              <span class="text">下載篩選結果</span>
            </a>
          </div>
          <h3 class="text-green mb-2 mt-2">資料篩選結果</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generateUrl } from '@/utils/fetch';
import queryString from 'query-string';

export default {
  data() {
    return {};
  },
  computed: {
    exportUrl() {
      return generateUrl(
        `/api/v1/annotations.csv?${queryString.stringify(this.$route.query)}`,
      );
    },
  },
  methods: {},
};
</script>
