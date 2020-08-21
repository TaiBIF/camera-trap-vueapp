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
      <small class="text-center">
        單一檔案上傳大小限制於 <b>2G</b> 以內，一次上傳中，檔案大小總合須小於
        <b>2G</b>
        <br />您可以上傳的檔案形式：內含資料檔（.csv）及其對應影像之壓縮檔
        (.zip)、影像資料壓縮檔 (.zip)、單一影像檔 及 單一資料檔（.csv） <br />
        <br />
        ZIP 檔案限制：只能一個 csv、不能有資料夾、csv
        資料數量跟影片/照片數量要一樣
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
