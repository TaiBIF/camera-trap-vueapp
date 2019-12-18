<template>
  <div class="img-container">
    <img
      class="img"
      id="img-preview"
      :src="row.url"
      draggable="true"
      @dragstart="onDragStart($event)"
      @drag="onDrag($event)"
      @dragend="onDragEnd($event)"
    />
    <div class="control-buttons">
      <div class="btn-group">
        <div
          class="btn btn-sm btn-basic"
          v-tooltip.left="'影像局部放大'"
          @click="changeScale('increase')"
        >
          <i class="icon-plus"></i>
        </div>
        <div
          class="btn btn-sm btn-basic"
          v-tooltip.left="'影像局部縮小'"
          @click="changeScale('decrease')"
        >
          <i class="icon-minus"></i>
        </div>
      </div>
      <div class="btn-group">
        <div
          class="btn btn-sm btn-basic"
          v-tooltip.left="'影像整張放大'"
          @click="openLightBox()"
        >
          <i class="icon-expand"></i>
        </div>
      </div>
    </div>
    <!-- light-box -->
    <div class="modal light-box fade in" v-if="lightBoxOpen">
      <div class="modal-dialog">
        <div class="modal-content">
          <a
            @click="
              lightBoxOpen = false;
              isTagCanvas = false;
              tagData.isTagCanvasInit = false;
            "
            class="close"
          >
            <i class="icon-remove-white"></i>
          </a>
          <canvas
            v-if="isTagCanvas"
            @mousemove="mouseMove"
            @mousedown="mouseDown"
            @mouseup="mouseUp"
            id="tag-canvas"
            width="800"
            height="500"
            :style="'background-image: url(' + row.url + ')'"
          >
          </canvas>
          <img v-if="!isTagCanvas" :src="row.url" />
          <div class="caption">
            <small class="float-right">
              ( {{ total }} 筆資料中的第 {{ index + 1 }} 筆 )
            </small>
            <span class="text"> {{ imageInfo }} </span>
          </div>
          <button
            v-if="!isTagCanvas"
            class="btn btn-default"
            @click="openTagCanvas()"
          >
            進階標註
          </button>
          <div v-if="isTagCanvas" class="tag-form">
            <div class="tag-form__label">進階標註：</div>
            <textarea
              v-model="tagText"
              class="tag-form__textarea form-control"
              placeholder="您可以輸入任何標註資料"
            ></textarea>
            <button class="btn btn-default tag-form__btn" @click="submitTag">
              送出
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const annotations = createNamespacedHelpers('annotations');
export default {
  name: 'ZoomDrag',
  props: {
    row: {
      type: Object,
      default: null,
    },
    index: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    imageInfo: {
      type: String,
      default: '',
    },
    annotation: {
      type: Object,
      default: null,
    },
  },
  watch: {
    row: 'updateImgWidth',
  },
  data() {
    return {
      isDrag: false,
      coordinate: { x: 0, y: 0 },
      lastCoordinate: { x: 0, y: 0 },
      currentCoordinate: { x: 0, y: 0 },
      originWidth: 0,
      currentWidth: 0,
      lightBoxOpen: false,
      scaleSize: 1,
      isTagCanvas: false,
      tagData: {
        canvasX: 0,
        canvasY: 0,
        lastMouseX: 0,
        lastMouseY: 0,
        isStartTag: false,
        isTagCanvasInit: false,
        canvas: null,
        width: 0,
        height: 0,
      },
    };
  },
  methods: {
    ...annotations.mapActions(['setAnnotations']),
    mouseMove: function(e) {
      let mousex = parseInt(e.clientX - this.tagData.canvasX);
      let mousey = parseInt(e.clientY - this.tagData.canvasY);
      if (!this.tagData.isTagCanvasInit) {
        this.initTagCanvas();
      }
      if (this.tagData.canvas && this.tagData.isStartTag) {
        this.tagData.ctx.clearRect(
          0,
          0,
          this.tagData.canvas.width,
          this.tagData.canvas.height,
        );
        this.tagData.ctx.beginPath();
        let width = mousex - this.tagData.lastMouseX;
        let height = mousey - this.tagData.lastMouseY;
        this.tagData.ctx.rect(
          this.tagData.lastMouseX,
          this.tagData.lastMouseY,
          width,
          height,
        );
        this.tagData.width = width;
        this.tagData.height = height;
        this.tagData.ctx.strokeStyle = 'orange';
        this.tagData.ctx.lineWidth = 3;
        this.tagData.ctx.stroke();
        //console.log(width, height);
      }
    },
    mouseDown: function(e) {
      this.tagData.lastMouseX = parseInt(e.clientX - this.tagData.canvasX);
      this.tagData.lastMouseY = parseInt(e.clientY - this.tagData.canvasY);
      this.tagData.isStartTag = true;
    },
    mouseUp: function() {
      this.tagData.isStartTag = false;
    },
    openLightBox() {
      // 打開 Lightbox
      this.lightBoxOpen = true;
    },
    openTagCanvas() {
      // 打開 Lightbox
      this.isTagCanvas = true;
      this.$nextTick(function() {
        this.initTagCanvas();
      });
    },
    onDragStart(e) {
      // 紀錄圖片起始拖拉位置
      this.isDrag = true;
      this.coordinate.x = e.clientX;
      this.coordinate.y = e.clientY;
    },
    onDrag(e) {
      // 圖片拖拉位置更新
      if (!this.isDrag || this.scaleSize === 1) return;

      const el = this.$el;
      const img = this.$el.querySelector('#img-preview');
      const x = e.clientX;
      const y = e.clientY;

      if (
        (x === 0 && y === 0) ||
        (x === this.coordinate.x && y === this.coordinate.y)
      ) {
        return;
      }

      const xLimit = (img.clientWidth - el.clientWidth) / 2;
      const yLimit = (img.clientHeight - el.clientHeight) / 2;
      let disX = this.lastCoordinate.x + x - this.coordinate.x;
      let disY = this.lastCoordinate.y + y - this.coordinate.y;

      disX = disX > xLimit ? xLimit : disX <= xLimit ? -xLimit : disX;
      disY = disY > yLimit ? yLimit : disY <= yLimit ? -yLimit : disY;

      this.currentCoordinate = {
        x: disX,
        y: disY,
      };

      img.style.transform = `translate(${this.currentCoordinate.x}px, ${
        this.currentCoordinate.y
      }px)`;
    },
    onDragEnd() {
      // 記錄最後拖拉座標
      this.lastCoordinate = {
        x: this.currentCoordinate.x,
        y: this.currentCoordinate.y,
      };

      this.isDrag = false;
    },
    changeScale(type) {
      // 取得目前圖片尺寸，以 +- 50% 比例縮放
      const img = this.$el.querySelector('#img-preview');
      const container = this.$el;

      this.originWidth = this.src !== '' ? container.clientWidth : 0;
      this.currentWidth = this.src !== '' ? container.clientWidth : 0;

      if (type === 'increase') {
        this.scaleSize = this.scaleSize + 0.5;
      }
      if (type === 'decrease') {
        this.scaleSize = this.scaleSize - 0.5 < 1 ? 1 : this.scaleSize - 0.5;
      }

      img.style.width = this.originWidth * this.scaleSize + 'px';
    },
    updateImgWidth() {
      // Sheet 切換列表時更新圖片和尺寸
      const container = this.$el;
      const img = this.$el.querySelector('#img-preview');

      this.scaleSize = 1;
      this.originWidth = this.src !== '' ? container.clientWidth : 0;
      this.currentWidth = this.src !== '' ? container.clientWidth : 0;

      img.style.width = this.currentWidth + 'px';
      img.style.transform = 'translate(0px, 0px)';
    },
    initTagCanvas() {
      const canvas = this.$el.querySelector('#tag-canvas');
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const offset = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      };
      this.tagData.canvasX = offset.left - 30; // HACK: strange shift
      this.tagData.canvasY = offset.top;
      this.tagData.canvas = canvas;
      this.tagData.ctx = ctx;
      this.tagData.isTagCanvasInit = true;
      //console.log('init-tag-canvas');
      if (this.annotation.tags.length > 0) {
        const t = this.annotation.tags[0];
        //console.log('render', t);
        this.tagData.ctx.rect(t.x, t.y, t.width, t.height);
        this.tagData.ctx.strokeStyle = 'orange';
        this.tagData.ctx.lineWidth = 3;
        this.tagData.ctx.stroke();
      }
    },
    submitTag() {
      //console.log('submit', this.tagData, this.row, this.annotation);
      const tagText = this.$el.querySelector('.tag-form__textarea').value;
      let annotation = {
        speciesTitle: this.annotation.species.title,
        tags: [
          {
            text: tagText,
            x: this.tagData.lastMouseX,
            y: this.tagData.lastMouseY,
            width: this.tagData.width,
            height: this.tagData.height,
          },
        ],
      };
      this.setAnnotations({
        annotationId: this.annotation.id,
        body: annotation,
      });
      this.isTagCanvas = false;
      this.tagData.isTagCanvasInit = false;
      this.lightBoxOpen = false;
    },
  },
  mounted() {
    this.updateImgWidth();
  },
  computed: {
    tagText() {
      return this.annotation.tags.length <= 0
        ? ''
        : this.annotation.tags[0].text;
    },
  },
};
</script>

<style lang="scss" scoped>
#tag-canvas {
  cursor: crosshair;
  background-size: cover;
}
.tag-form {
  padding: 20px;
}
.tag-form__label,
.tag-form__textarea,
tag-form__btn {
  margin: 10px 0;
}
</style>
