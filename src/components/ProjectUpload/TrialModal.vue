<template>
  <div class="modal trial-modal fade" :class="{ in: open }">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <carousel
            :perPage="1"
            :value="currentPage"
            :paginationActiveColor="'#8AC731'"
          >
            <slide>
              <img
                src="/assets/upinfo/carousel-1.png"
                width="467"
                srcset="/assets/upinfo/carousel-1@2x.png"
              />
              <div class="caption">
                <p>
                  上傳之資料檔需至少涵蓋以下欄位：(1) 樣區 、(2)相機位置 、(3)
                  檔名 、(4) 時間、 (5) 物種
                </p>
                <small class="text-gray">
                  各計畫欄位規範請參考
                  <a
                    class="link text-underline text-green"
                    :href="downloadCsvSrc"
                    target="_blank"
                    >資料範本</a
                  >
                </small>
              </div>
            </slide>
            <slide>
              <img
                src="/assets/upinfo/carousel-2.png"
                width="467"
                srcset="/assets/upinfo/carousel-2@2x.png"
              />
              <div class="caption">
                <p align="left">
                  可上傳的檔案形式包含：
                  <ol>
                    <li>壓縮檔 (限zip格式）</li>
                      <ul><li>csv及其對應影像壓縮檔: zip檔內限一個csv及影像檔，不能含子資料夾，且該csv文件內筆數要與影像檔數量相同</li>
                          <li>影像壓縮檔</li></ul>
                    <li>單一檔案</li>
                      <ul><li>單一資料檔：限csv及excel格式</li>
                          <li>單一影像檔：限JPG、MP4、AVI格式</li></ul>
                  </ol>
                </p>

              </div>
            </slide>
            <slide>
              <img
                src="/assets/upinfo/carousel-3.png"
                width="467"
                srcset="/assets/upinfo/carousel-1@2x.png"
              />
              <div class="caption">
                <p>
                  請將每個上傳檔案大小限制於 2G
                  以內，單一次上傳中，檔案大小總合須小於 2G 。
                </p>
                <small class="text-gray">
                  若仍有其他問題請
                  <router-link to="/help/contact-us" class="link">
                    聯絡我們
                  </router-link>
                </small>
              </div>
            </slide>
          </carousel>
          <div class="action">
            <a @click="nextSlide()" class="btn btn-orange btn-block">
              <span v-if="currentPage == 2">開始上傳</span>
              <span v-else>下一步</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';
import { createNamespacedHelpers } from 'vuex';

const projects = createNamespacedHelpers('projects');

export default {
  name: 'TrialModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Carousel,
    Slide,
  },
  computed: {
    ...projects.mapGetters(['projectDetail', 'isProjectManager']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    downloadCsvSrc() {
      return `${process.env.VUE_APP_API_URL}/api/v1/projects/${
        this.projectId
      }/example.csv`;
    },
  },
  watch: {
    open: 'watchToggle',
  },
  data() {
    return {
      currentPage: 0,
    };
  },
  methods: {
    watchToggle() {
      this.currentPage = 0;
    },
    nextSlide() {
      this.currentPage++;

      if (this.currentPage == 3) {
        this.$emit('close', 'trialModalOpen');
        this.currentPage = 2;
      }
    },
  },
};
</script>
