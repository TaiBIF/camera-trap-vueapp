<template>
  <div
    class="sidebar"
    :style="{ width: `${historyShow || galleryShow ? galleryWidth : 0}px` }"
  >
    {{ currentAnnotationIdx }}
    <!-- <div class="photo-container" v-if="displayImageComponent">
      <div class="gallery-header">
        <a
          @click="changeMode('galleryShow', false)"
          class="close mt-1 float-right"
        >
          <i class="icon-remove-sm"></i>
        </a>
        影像檢視
      </div>
      <div class="gallery-body" v-if="!hasImage && !hasVideo">
        <div class="empty-result">
          <img
            src="/assets/common/empty-site.png"
            width="174"
            srcset="/assets/common/empty-site@2x.png"
          />
          <h5 class="text-gray">尚未上傳照片資料</h5>
          <a class="btn btn-orange">
            <span class="icon"><i class="icon-upload-white"></i></span>
            <span class="text">補上傳影像檔</span>
          </a>
        </div>
      </div>
      <div class="gallery-body" v-else>
        <zoom-drag
          v-if="siteData.data[currentRow].imageUrl"
          :row="siteData.data[currentRow]"
          :index="currentRow"
          :total="siteDataLength"
        />
        <youtube-embed v-else :row="siteData.data[currentRow]" />
        <div class="control">
          <span
            class="prev"
            v-tooltip.top="'上一張'"
            @click="currentRow > 0 ? currentRow-- : currentRow"
          >
            <i class="fa fa-caret-left"></i>
          </span>
          <span class="text">
            {{ siteData.data[currentRow].fileName }} |
            {{ siteData.data[currentRow].corrected_date_time }}
          </span>
          <span
            class="prev"
            v-tooltip.top="'下一張'"
            @click="
              currentRow > siteData.data[currentRow].length - 1
                ? currentRow
                : currentRow++
            "
          >
            <i class="fa fa-caret-right"></i>
          </span>
        </div>
        <div class="text-right my-2">
          <router-link
            v-if="siteData.data[currentRow].type === 'StillImage'"
            :to="
              `/project/${$route.params.id}/site/${$route.params.site_id}/${
                $route.params.subsite_id
              }/photo/tag?image_id=${siteData.data[currentRow]._id}`
            "
            class="btn btn-sm btn-default"
          >
            進階標註
          </router-link>
        </div>
      </div>
    </div> -->
    <!--  -->
    <!-- <div class="version-container" v-if="historyShow">
      <div class="version-header">
        <a
          @click="changeMode('historyShow', false)"
          class="close mt-1 float-right"
        >
          <i class="icon-remove-sm"></i>
        </a>
        版本紀錄
      </div>
      <div class="version-body">
        <table class="table version-list">
          <tbody>
            <tr v-for="(rev, i) in revision" :key="`rev-${i}`">
              <td>{{ rev.created }}</td>
              <td class="text-gray">
                由 <b>{{ rev.modifiedBy.name }}</b> 編輯
              </td>
              <td class="text-gray" v-if="i === 0">目前版本</td>
              <td class="text-gray" v-else>
                <a class="btn btn-basic btn-sm" @click="restoreRev(i)"
                  >還原成此版本</a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> -->
  </div>
</template>

<script>
// import ZoomDrag from '@/components/ProjectStudyAreas/ZoomDrag.vue';

export default {
  components: {
    // ZoomDrag,
  },
  props: {
    galleryShow: {
      type: Boolean,
      required: true,
    },
    historyShow: {
      type: Boolean,
      required: true,
    },
    currentAnnotationIdx: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      galleryWidth: 450,
    };
  },
};
</script>
