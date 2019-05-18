<template>
  <div class="modal trial-modal fade" :class="{ in: open }">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div class="error-maintain">
            <div class="image">
              <img
                src="/assets/upinfo/column-error.png"
                srcset="/assets/upinfo/column-error@2x.png"
              />
            </div>
            <!-- ref: camera-trap-api: ./src/models/const/upload-session-error-type.js -->
            <div class="content text-center px-3">
              <h5 v-if="errorType === 'lost-exif-time'">
                無法從 exif 中取得時間資訊
              </h5>
              <h5 v-else-if="errorType === 'inconsistent-quantity'">
                圖片數量與 csv 的資料數量不一致
              </h5>
              <h5 v-else-if="errorType === 'images-and-csv-not-match'">
                圖片與 csv 的資料不一致
              </h5>
              <h5 v-else-if="errorType === 'permission-denied'">
                沒有權限
              </h5>
              <h5 v-else-if="errorType === 'others'">
                其他錯誤
              </h5>
            </div>
          </div>
          <!-- TODO following are old error type -->
          <div class="error-maintain" v-if="errorType === 1">
            <div class="image">
              <img
                src="/assets/upinfo/column-error.png"
                srcset="/assets/upinfo/column-error@2x.png"
              />
            </div>
            <div class="content text-center px-3">
              <h5>資料欄位不合系統規定</h5>
              <p>
                請檢查資料欄位之名稱、格式及順序，是否符合系統欄位規範。詳細欄位規範請參考
                <a href="#" target="_blank">欄位規範說明</a>。
              </p>
            </div>
          </div>
          <div class="error-maintain" v-if="errorType === 2">
            <div class="image">
              <img
                src="/assets/upinfo/data-error.png"
                srcset="/assets/upinfo/data-error@2x.png"
              />
            </div>
            <div class="content text-center px-3">
              <h5>資料檔案與影像檔不對應</h5>
              <p>
                請檢查壓縮檔種的資料檔案與影像檔是否為對應之檔案。詳細檔案規範請參考
                <a href="#" target="_blank">上傳格式說明</a>。
              </p>
            </div>
          </div>
          <div class="error-maintain" v-if="errorType === 3">
            <div class="image">
              <img
                src="/assets/upinfo/file-error.png"
                srcset="/assets/upinfo/file-error@2x.png"
              />
            </div>
            <div class="content text-center px-3">
              <h5>上傳檔案內容與計畫設定不符</h5>
              <p>
                請確認資料檔案時間範圍、樣區、相機位置等資訊，是否符合計畫設定。
              </p>
            </div>
          </div>
          <div class="action">
            <a @click="$emit('close')" class="btn btn-orange btn-block">
              我知道了
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadSessionsErrorModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    errorType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      //errorType: '',
    };
  },
};
</script>
