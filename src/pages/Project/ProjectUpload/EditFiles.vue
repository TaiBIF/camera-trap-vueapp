<template>
  <div class="col-12 px-0">
    <h1 class="text-green">檔案上傳</h1>
    <div class="row">
      <div
        class="col-9"
        :class="{ 'col-12': isUploading, 'pr-0': !isUploading }"
      >
        <label for="upload" class="btn btn-upload">
          <span class="icon">
            <i class="icon-add-green" />
          </span>
          <span class="text">新增上傳檔案</span>
        </label>

        <!-- <div class="message is-alert" v-if="alertMsg !== '' && showAlert">
          <a class="float-right close" @click="showAlert = false">
            <i class="icon-remove-red"></i>
          </a>
          <div class="alert-box float-left">!</div>
          <div class="text">{{ alertMsg }}</div>
        </div> -->

        <div class="float-right" v-if="!isUploading">
          <div class="checkbox checkbox-inline mb-0 mt-2">
            <input
              type="checkbox"
              name="select-all"
              id="select-all"
              value="1"
              :checked="selectedFileList.length === fileList.length"
              @change="selectAll"
            />
            <label for="select-all">全選檔案</label>
          </div>
          <span v-if="selectedFileList.length > 0">
            <span> | </span>
            <span class="btn btn-text text-gray">
              <span class="icon">
                <i class="icon-trash" />
              </span>
              <span
                class="text"
                v-if="selectedFileList.length === fileList.length"
                @click="removeFiles(true)"
              >
                移除全部檔案
              </span>
              <span v-else class="text" @click="removeFiles(true)">
                移除選取的檔案
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- <div class="upload-list-container">
      <div class="row mx-0">
        <div class="col-9 px-0" :class="{ 'col-12': isUploading }">
          <table class="table" id="upload-list">
            <thead>
              <tr>
                <th :width="!isUploading ? '40%' : '25%'">檔案名稱</th>
                <th>檔案大小</th>
                <th>樣區</th>
                <th width="25%">樣點</th>
                <th width="25%" v-if="isUploading">上傳進度</th>
              </tr>
            </thead>
            <tbody>
              <tr
                :class="{ 'is-selected': selectedFileList.indexOf(f_id) > -1 }"
                v-for="(file, f_id) in fileList"
                :key="`file-${f_id}`"
                @click.stop.prevent="toggleSelect($event, f_id)"
              >
                <td>
                  <span class="icon" v-if="file.type === 'jpg'"
                    ><i class="icon-photo"></i
                  ></span>
                  <span class="icon" v-if="file.type === 'csv'"
                    ><i class="icon-csv"></i
                  ></span>
                  <span class="icon" v-if="file.type === 'zip'"
                    ><i class="icon-zip"></i
                  ></span>
                  <span class="icon" v-if="file.type === 'folder'"
                    ><i class="icon-folder"></i
                  ></span>
                  <span class="text">{{ file.name }}</span>
                </td>
                <td>{{ file.size }}</td>
                <td>{{ file.site }}-{{ file.subsite }}</td>
                <td>
                  <span class="action">
                    <a class="del icon"><i class="icon-trash"></i></a>
                  </span>
                  <span class="text">{{ file.camera }}</span>
                </td>
                <td v-if="isUploading">
                  <div class="float-right">
                    <a
                      v-if="file.state === 0 || file.state === 1"
                      class="link text-underline text-muted"
                      >取消</a
                    >

                    <a
                      v-if="file.state === -1"
                      class="link text-danger text-underline"
                      >錯誤：{{ file.errorMessage }}</a
                    >
                    <a
                      v-if="file.state === 1 || file.state === 2"
                      :href="
                        `/index.html#/project/${$route.params.projectId}/site/${
                          fileList[f_id].site
                        }/${fileList[f_id].subsite}?camera=${
                          fileList[f_id].fullCameraLocationMd5
                        }&upload_session_id=${uploadSessions[f_id]}`
                      "
                      class="link text-green text-underline"
                      >查看</a
                    >
                  </div>
                  <div
                    :id="`upload-progress-${f_id}`"
                    class="upload-progress"
                    :class="{ 'd-none': file.state == 2 || file.state == -1 }"
                  ></div>
                  <div v-if="file.state === -1">
                    <i class="icon icon-upload-fail"></i> 上傳失敗
                  </div>
                  <div v-if="file.state === 2">
                    <i class="icon icon-upload-success"></i> 上傳完成
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-3" v-if="!isUploading">
          <p class="text-center" v-if="!selectedFileList.length">
            請選擇並編輯上傳檔案
          </p>
          <form class="form" v-else>
            <p class="text-center">
              選擇並編輯上傳檔案 ({{ selectedFileList.length }} /
              {{ fileList.length }})
            </p>
            <div class="form-group">
              <label class="required">樣區：</label>
              <v-select
                :options="siteOptions"
                v-model="form.site"
                :onChange="updateSiteValue"
                :placeholder="multiSite ? '多個樣區位置' : '請選擇檔案所屬樣區'"
              />
            </div>
            <div class="form-group">
              <label class="required">子樣區：</label>
              <v-select
                :options="subSiteOptions"
                v-model="form.subsite"
                :onChange="updateSubsiteValue"
                :placeholder="
                  multiSite ? '多個子樣區位置' : '請選擇檔案所屬子樣區'
                "
                resetOnOptionsChange
              />
            </div>
            <div class="form-group">
              <label class="required">相機位置：</label>
              <v-select
                :options="cameraOptions"
                v-model="form.camera"
                :onChange="updateCameraValue"
                :placeholder="
                  multiCamera ? '多個相機位置' : '請選擇檔案所屬相機位置'
                "
                resetOnOptionsChange
              />
            </div>
          </form>
        </div>
      </div>
    </div> -->

    <!-- <div class="action text-center">
      <p class="text-orange">請為每個檔案都編輯「樣區」和「相機位置」</p>
      <button
        @click.stop.prevent="startUpload()"
        class="btn btn-orange"
        :disabled="hasEmpty"
      >
        <span class="icon"><i class="icon-upload"></i></span>
        <span class="text"
          >開始上傳 <span v-if="!hasEmpty">({{ fileList.length }})</span></span
        >
      </button>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    isUploading: {
      type: Boolean,
      default: false,
    },
    fileList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedFileList: [], // 對應 fileList 的 _.upload.uuid
    };
  },
  methods: {
    selectAll(e) {
      this.selectedFileList = e.target.checked
        ? this.fileList.map(v => v.upload.uuid)
        : [];
    },
    removeFiles(isAll = false) {
      //todo
      console.log(isAll);
    },
  },
};
</script>
