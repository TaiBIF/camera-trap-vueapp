<template>
  <ul class="tree-menu">
    <li
      class="tree-menu-item"
      v-for="studyArea in studyAreas"
      :key="studyArea.id"
      :class="{
        'is-open': expandId === studyArea.id,
      }"
    >
      <study-area-item
        :studyArea="studyArea"
        :link="generateAreaLink(studyArea)"
        :isExpand="expandId === studyArea.id"
        :isActive="currentStudyAreaId === studyArea.id"
        :isEditMode="isEditMode"
        @select="toggleExpand(studyArea, true)"
        @editArea="editArea"
      />
      <ul
        class="tree-menu-child"
        v-for="studyArea in studyArea.children"
        :key="studyArea.id"
      >
        <li class="tree-menu-item">
          <study-area-item
            :studyArea="studyArea"
            :link="generateAreaLink(studyArea)"
            :isActive="currentStudyAreaId === studyArea.id"
            :isEditMode="isEditMode"
            @select="toggleExpand(studyArea)"
            @editArea="editArea"
          />
          <div
            v-show="
              showCameraLocation &&
                cameraLocations.length > 0 &&
                currentStudyAreaId === studyArea.id &&
                currentStudyAreaId === cameraLocations[0].studyArea
            "
            class="tree-menu-checkbox"
          >
            <input
              type="text"
              placeholder="搜尋"
              v-model="searchCameraLocation"
              style="width: 120px"
            />
            <el-checkbox
              v-show="!searchCameraLocation"
              :indeterminate="isIndeterminate"
              v-model="selectAllCamera"
              @change="selectAllCameraLocation"
              >全部相機位置</el-checkbox
            >
            <el-checkbox-group
              v-model="selectedCamera"
              @change="selectCameraLocation"
            >
              <el-checkbox
                v-for="(cameraLocation, index) in cameraLocationsOption"
                :key="index"
                :label="cameraLocation.name"
              >
                {{ cameraLocation.name }}
                <span class="icon" v-if="cameraLocation.isLocked">
                  <i
                    class="icon-lock align-middle"
                    v-tooltip.top="`${cameraLocation.lockUser.name} 正在編輯中`"
                  ></i>
                </span>
                <span class="error-label" v-if="cameraLocation.failures > 0">
                  {{ cameraLocation.failures }}
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
      </ul>
      <ul v-show="isEditMode" class="tree-menu-child">
        <li class="tree-menu-item">
          <div class="tree-menu-link">
            <label :for="`addArea_${studyArea.id}`" class="icon"
              ><i class="fa fa-plus"></i
            ></label>
            <div class="text">
              <input
                type="text"
                :id="`addArea_${studyArea.id}`"
                placeholder="新增子樣區"
                v-model="newSubStudyArea"
                @keydown.enter="addNewSubStudyArea"
                :data-parent-id="studyArea.id"
              />
            </div>
          </div>
        </li>
      </ul>
    </li>
    <li v-show="isEditMode" class="tree-menu-item">
      <div class="tree-menu-link">
        <label for="addParentArea" class="icon"
          ><i class="fa fa-plus"></i
        ></label>
        <div class="text">
          <input
            type="text"
            id="addParentArea"
            placeholder="新增樣區"
            v-model="newStudyArea"
            @keydown.enter="addNewStudyArea"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import StudyAreaItem from '@/components/StudyAreaSidebar/StudyAreaItem.vue';

export default {
  name: 'study-area-sidebar',
  components: {
    StudyAreaItem,
  },
  props: {
    studyAreas: {
      type: Array,
      default: () => {
        return [];
      },
    },
    projectId: {
      type: String,
      required: true,
    },
    currentStudyAreaId: {
      type: String,
      default: null,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
    cameraLocations: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showCameraLocation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expandId: null,
      newStudyArea: '',
      newSubStudyArea: '',
      selectedCamera: [],
      selectAllCamera: false,
      isIndeterminate: false,
      cameraLocationsOption: [],
      searchCameraLocation: '',
    };
  },
  watch: {
    cameraLocations: function(value) {
      this.cameraLocationsOption = value;
    },
    searchCameraLocation: function(value) {
      if (!value) {
        this.cameraLocationsOption = this.cameraLocations;
      } else {
        this.cameraLocationsOption = this.cameraLocationsOption.filter(
          ({ name }) => name.toLowerCase().includes(value.toLowerCase()),
        );
      }
    },
    currentStudyAreaId: function() {
      this.searchCameraLocation = '';
    },
  },
  methods: {
    toggleExpand(studyArea, isParent) {
      this.$emit('selectArea', studyArea.id);
      if (!isParent) {
        return;
      }
      if (this.expandId === studyArea.id) {
        this.expandId = null;
      } else {
        this.expandId = studyArea.id;
      }
    },
    generateAreaLink(studyArea) {
      if (this.isEditMode) {
        return '';
      }
      return `/project/${this.projectId}/study-areas/${studyArea.id}`;
    },
    addNewSubStudyArea() {
      const value = this.newSubStudyArea;
      if (!value) {
        return;
      }
      const parentId = event.target.getAttribute('data-parent-id');
      this.$emit('addArea', value, parentId);
      this.$emit('handleSubmitBtnState', true);
      this.newSubStudyArea = '';
    },
    addNewStudyArea() {
      const value = this.newStudyArea;
      if (!value) {
        return;
      }
      this.$emit('addArea', value);
      this.$emit('handleSubmitBtnState', true);
      this.newStudyArea = '';
    },
    editArea(name, id) {
      this.$emit('editArea', name, id);
    },
    selectAllCameraLocation(isCheck) {
      this.selectedCamera = isCheck
        ? this.cameraLocations.map(({ name }) => name)
        : [];
      this.isIndeterminate = false;
    },
    selectCameraLocation(value) {
      let checkedCount = value.length;
      this.selectAllCamera = checkedCount === this.cameraLocations.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cameraLocations.length;
    },
  },
};
</script>

<style lang="scss">
.tree-menu-link {
  i {
    color: #8b8b8b;
    cursor: pointer;
  }
  input {
    border: 0;
    outline: 0;
    padding: 13px 0;
    background-color: transparent;

    &:focus {
      outline: 0;
      box-shadow: inset 0px -1px lightgray;
      &::placeholder {
        opacity: 0;
      }
    }
  }
}
</style>
