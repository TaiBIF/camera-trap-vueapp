<template>
  <div class="col-10 offset-1 upload-container">
    <vue-dropzone
      ref="dropzone"
      id="dropzone"
      class="upload-area"
      :options="dropzoneOptions"
      :useCustomSlot="true"
      @vdropzone-files-added="show($event)"
    >
      <img
        src="/assets/upinfo/upload-img.png"
        height="180"
        srcset="/assets/upinfo/upload-img@2x.png"
      />
      <div v-if="disabled">
        <h1>
          請先
          <router-link
            :to="{
              name: 'projectCameraLocation',
              params: {
                projectId: $route.params.projectId,
              },
            }"
            >建立樣區及相機位置</router-link
          >
          再上傳檔案
        </h1>
      </div>
      <div v-else>
        <h1>將檔案拖曳於此並上傳</h1>
        <p>或 <label class="text-green underline">點此瀏覽檔案</label></p>
      </div>
    </vue-dropzone>

    <div class="text-center mt-2">
      <small align="left">
        <p align="left">可上傳的檔案形式包含：</p>
        <ol>
          <li>壓縮檔 (限zip格式）</li>
          <ul>
            <li>
              csv及其對應影像壓縮檔:
              zip檔內限一個csv及影像檔，不能含子資料夾，且該csv文件內筆數要與影像檔數量相同
            </li>
            <li>影像壓縮檔</li>
          </ul>
          <li>
            單一檔案: 上傳大小限制於
            <b>2G</b> 以內，一次上傳中，檔案大小總合須小於<b>2G</b>
          </li>
          <ul>
            <li>單一資料檔：限csv及excel格式</li>
            <li>單一影像檔：限JPG、MP4、AVI格式</li>
          </ul>
        </ol>
      </small>
    </div>
  </div>
</template>

<script>
import VueDropzone from 'vue2-dropzone';

import uploadAccept from '@/constant/uploadAccept.js';

export default {
  components: {
    VueDropzone,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.setDisabled();
  },
  data() {
    return {
      fileList: [],
      dropzoneOptions: {
        url: 'localhost',
        //directly set the acceptedFiles instead of using uploadAccept can solve the problem of not showing xls files
        acceptedFiles: uploadAccept,
        autoProcessQueue: false,
        previewsContainer: false,
      },
    };
  },
  watch: {
    disabled: 'setDisabled',
  },
  methods: {
    show(files) {
      // 跳出視窗選取會套用 accepted 設定，但是拖拉不會
      this.$emit(
        'change',
        [...files].filter(({ type, name }) => {
          if (
            navigator.appVersion.indexOf('Win') != -1 &&
            name.toLowerCase().indexOf('.csv') >= 0 &&
            type == ''
          ) {
            // windows (Chrome) cannot detact csv file type, ignore checked upload cce
            return true;
          } else {
            return type !== '' && uploadAccept.includes(type);
          }
        }),
      );
    },
    setDisabled() {
      this.disabled
        ? this.$refs.dropzone.removeEventListeners()
        : this.$refs.dropzone.setupEventListeners();
    },
  },
};
</script>
