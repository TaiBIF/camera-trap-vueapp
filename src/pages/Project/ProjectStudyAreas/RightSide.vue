<template>
  <div
    class="sidebar"
    :style="{ width: `${historyShow || galleryShow ? galleryWidth : 0}px` }"
  >
    <div
      class="photo-container"
      v-if="galleryShow && currentAnnotationIdx !== -1"
    >
      <div class="gallery-body" v-if="!hasImage">
        <div class="empty-result">
          <img
            src="/assets/common/empty-site.png"
            width="174"
            srcset="/assets/common/empty-site@2x.png"
          />
          <h5 class="text-gray">尚未上傳照片資料</h5>
          <router-link
            :to="{
              name: 'projectUpload',
              params: {
                projectId,
              },
            }"
            class="btn btn-orange"
          >
            <span class="icon"><i class="icon-upload-white"></i></span>
            <span class="text">補上傳影像檔</span>
          </router-link>
        </div>
      </div>
      <div class="gallery-body" v-else>
        <zoom-drag
          v-if="currentData.url"
          :row="currentData"
          :index="currentAnnotationIdx"
          :total="annotationsTotal"
          :imageInfo="imageInfo"
        />
        <div class="control">
          <span
            class="prev"
            v-tooltip.top="'上一張'"
            :disabled="true"
            @click="
              $emit(
                'currentAnnotationIdx',
                currentAnnotationIdx > 0
                  ? currentAnnotationIdx - 1
                  : currentAnnotationIdx,
              )
            "
          >
            <i class="fa fa-caret-left"></i>
          </span>
          <span class="text">
            {{ imageInfo }}
          </span>
          <span
            class="prev"
            v-tooltip.top="'下一張'"
            @click="
              $emit(
                'currentAnnotationIdx',
                currentAnnotationIdx < annotations.length - 1
                  ? currentAnnotationIdx + 1
                  : currentAnnotationIdx,
              )
            "
          >
            <i class="fa fa-caret-right"></i>
          </span>
        </div>
        <!-- <div class="text-right my-2">
          <router-link
            v-if="currentData.type === 'StillImage'"
            :to="
              `/project/${$route.params.id}/site/${$route.params.site_id}/${
                $route.params.subsite_id
              }/photo/tag?image_id=${currentData._id}`
            "
            class="btn btn-sm btn-default"
          >
            進階標註
          </router-link>
        </div> -->
      </div>
    </div>
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
import { createNamespacedHelpers } from 'vuex';
import idx from 'idx';

import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper';
import ZoomDrag from '@/components/ProjectStudyAreas/ZoomDrag.vue';

const annotations = createNamespacedHelpers('annotations');

export default {
  components: {
    ZoomDrag,
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
  computed: {
    ...annotations.mapState(['annotationsTotal']),
    ...annotations.mapGetters(['annotations']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    currentData() {
      return idx(this.annotations, _ => _[this.currentAnnotationIdx].file);
    },
    hasImage() {
      return idx(this.currentData, _ => _.url);
    },
    imageInfo() {
      return `${
        this.annotations[this.currentAnnotationIdx].filename
      } | ${dateFormatYYYYMMDDHHmmss(
        this.annotations[this.currentAnnotationIdx].time,
      )}`;
    },
  },
};
</script>
