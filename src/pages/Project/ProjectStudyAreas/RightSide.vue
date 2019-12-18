<template>
  <div
    class="sidebar"
    :style="{ width: `${historyShow || galleryShow ? galleryWidth : 0}px` }"
  >
    <div class="photo-container" v-if="galleryShow">
      <div class="gallery-body" v-if="!hasMedia">
        <div class="empty-result">
          <img
            src="/assets/common/empty-site.png"
            width="174"
            srcset="/assets/common/empty-site@2x.png"
          />
          <div v-if="uploadType === uploadStatus.uploading">
            <h5 class="text-gray">
              <i
                class="icon fas fa-circle-notch fa-spin"
                style="font-size: 25px"
              />上傳中
            </h5>
          </div>
          <div v-else>
            <h5 class="text-gray">尚未上傳照片資料</h5>
            <label :class="['btn', !!currentData ? 'btn-orange' : 'btn-gray']">
              <input
                style="display:none;"
                type="file"
                :accept="uploadAccept"
                @change="uploadFile"
                :disabled="!currentData"
              />
              <span class="icon"><i class="icon-upload-white"></i></span>
              <span class="text">補上傳影像檔</span>
            </label>
          </div>
        </div>
      </div>
      <div class="gallery-body" v-else>
        <zoom-drag
          v-if="currentMedia.type === 'annotation-image'"
          :row="currentMedia"
          :index="currentAnnotationIdx"
          :total="annotationsTotal"
          :imageInfo="mediaInfo"
          :annotation="currentData"
        />
        <video-player
          v-else-if="currentMedia.type === 'annotation-video'"
          class="vjs-custom-skin"
          ref="videoPlayer"
          :options="playerOptions"
          @ready="onPlayerReadied"
          @ended="onPlayerEnded"
        >
        </video-player>
        <div class="control">
          <span
            class="prev"
            v-tooltip.top="'上一張'"
            :disabled="true"
            @click="goPrev"
          >
            <i class="fa fa-caret-left"></i>
          </span>
          <span class="text">
            {{ mediaInfo }}
          </span>
          <span class="prev" v-tooltip.top="'下一張'" @click="goNext">
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
    <div class="version-container" v-if="historyShow">
      <div class="version-header">
        <a
          @click="$emit('historyShow', !historyShow)"
          class="close mt-1 float-right"
        >
          <i class="icon-remove-sm"></i>
        </a>
        版本紀錄
      </div>
      <div class="version-body">
        <table class="table version-list">
          <tbody>
            <tr v-for="rev in revision" :key="rev.id">
              <td>{{ rev.createTime }}</td>
              <td class="text-gray">
                由 <b>{{ rev.name }}</b> 編輯
              </td>
              <td class="text-gray" v-if="rev.isCurrent">目前版本</td>
              <td class="text-gray" v-else>
                <a
                  class="btn btn-basic btn-sm"
                  @click="
                    rollbackRevision({
                      annotationId: currentData.id,
                      revisionId: rev.id,
                    })
                  "
                  >還原成此版本
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      class="drag-bar"
      @mousedown="dragStart"
      v-tooltip.right="'拖曳拉大影像檢視範圍'"
    ></div>

    <info-modal
      :open="
        uploadType === uploadStatus.success ||
          uploadType === uploadStatus.uploadError
      "
      @close="uploadType = uploadStatus.waiting"
    >
      <div v-if="uploadType === uploadStatus.success">
        <div class="image">
          <img
            src="/assets/upinfo/upload-img.png"
            width="221"
            srcset="/assets/upinfo/upload-img@2x.png"
          />
        </div>
        <h1 class="text-green">
          上傳成功
        </h1>
        <p class="text-gray">
          系統已收到檔案，處理中
        </p>
      </div>
      <div v-if="uploadType === uploadStatus.uploadError">
        <div class="image">
          <img
            src="/assets/upinfo/file-error.png"
            width="221"
            srcset="/assets/upinfo/file-error@2x.png"
          />
        </div>
        <h1 class="text-green">
          上傳失敗
        </h1>
        <p class="text-gray">
          上傳失敗，請重載頁面再試一次，若問題持續，請<router-link
            to="/help/contact-us"
          >
            聯絡我們
          </router-link>
        </p>
      </div>
    </info-modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { videoPlayer } from 'vue-video-player';
import idx from 'idx';

import { acceptDef } from '@/constant/uploadAccept.js';
import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper';
import { uploadFileByAnnotation } from '@/service';
import InfoModal from '@/components/Modal/InfoModal.vue';
import ZoomDrag from '@/components/ProjectStudyAreas/ZoomDrag.vue';
import uploadStatus from '@/constant/uploadStatus.js';

import 'video.js/dist/video-js.css';

const annotations = createNamespacedHelpers('annotations');

export default {
  components: {
    ZoomDrag,
    videoPlayer,
    InfoModal,
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
      uploadAccept: [acceptDef.image, acceptDef.video].join(','),
      galleryWidth: 450,
      isDrag: false,
      playbackRate: 1,
      uploadType: uploadStatus.waiting,
      uploadStatus,
    };
  },
  mounted() {
    // 拖拉側欄照片區塊大小
    document.body.addEventListener('mousemove', e => {
      this.dragMove(e);
    });

    document.body.addEventListener('mouseup', e => {
      if (e.which === 1) this.dragEnd(e);
    });
  },
  watch: {
    currentAnnotationIdx: function() {
      this.currentData && this.getRevision(this.currentData.id);
    },
  },
  computed: {
    ...annotations.mapState(['annotationsTotal']),
    ...annotations.mapGetters(['annotations', 'revision']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    currentData() {
      return this.annotations[this.currentAnnotationIdx];
    },
    currentMedia() {
      return this.currentData && this.currentData.file;
    },
    hasMedia() {
      return idx(this.currentMedia, _ => _.url);
    },
    mediaInfo() {
      return `${this.currentData.filename} | ${dateFormatYYYYMMDDHHmmss(
        this.currentData.time,
      )}`;
    },
    playerOptions() {
      return {
        width: this.galleryWidth - 20,
        autoplay: true,
        muted: true,
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            src: this.currentMedia.url,
          },
        ],
      };
    },
  },
  methods: {
    ...annotations.mapActions(['getRevision', 'rollbackRevision']),
    dragStart() {
      this.isDrag = true;
    },
    dragMove(e) {
      if (this.isDrag) {
        this.galleryWidth = window.innerWidth - e.pageX;
        this.$emit('changeWidth');
      }
    },
    dragEnd() {
      if (this.isDrag) {
        this.isDrag = false;
        this.$emit('changeWidth');
      }
    },
    goPrev() {
      this.$emit(
        'currentAnnotationIdx',
        this.currentAnnotationIdx > 0
          ? this.currentAnnotationIdx - 1
          : this.currentAnnotationIdx,
      );
    },
    goNext() {
      this.$emit(
        'currentAnnotationIdx',
        this.currentAnnotationIdx < this.annotations.length - 1
          ? this.currentAnnotationIdx + 1
          : this.currentAnnotationIdx,
      );
    },
    onPlayerReadied(e) {
      e.playbackRate(this.playbackRate);
    },
    onPlayerEnded(e) {
      this.playbackRate = e.playbackRate();
      this.goNext();
    },

    async uploadFile(e) {
      const file = idx(e, _ => _.target.files[0]);
      if (file) {
        try {
          this.uploadType = uploadStatus.uploading;
          await uploadFileByAnnotation(this.currentData.id, file);
          this.uploadType = uploadStatus.success;
        } catch (error) {
          this.uploadType = uploadStatus.uploadError;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: #f3f2f2;
}

.drag-bar:hover {
  background-color: #8ac731;
}
</style>

<style lang="scss">
.vjs-custom-skin > .video-js .vjs-big-play-button {
  top: 50%;
  left: 50%;
  margin-left: -1.5em;
  margin-top: -1em;
}
</style>
