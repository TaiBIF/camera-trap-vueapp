<template>
  <div class="panel mb-3">
    <div class="panel-heading">
      <h4>欄位設定</h4>
    </div>
    <div class="panel-body">
      <div class="column-editor">
        <div class="row column-header mx-0">
          <div class="col-3">欄位名稱</div>
          <div class="col-3">欄位形式</div>
          <div class="col-3">輸入格式</div>
          <div class="col-3"></div>
        </div>
        <div class="column-body">
          <!-- 不能拖拉的區塊 -->
          <div
            class="row column-item"
            :key="field.id"
            v-for="field in noDraggableFields"
          >
            <div class="col-3">{{ field.title }}</div>
            <div class="col-3">{{ DataFieldEnum[field.widgetType] }}</div>
            <div class="text-gray col-3">
              <div
                v-if="field.systemCode === 'species'"
                class="link text-green underline"
                @click="showSpeciesEdit = true"
              >
                <i class="fa fa-pencil-alt"></i> 編輯常見物種排序
              </div>
              <span v-else>{{ field.description }}</span>
            </div>
          </div>
          <!-- 可以拖拉的區塊 -->
          <draggable handle=".drag-item" v-model="draggableFields">
            <transition-group>
              <div
                class="row column-item"
                :key="field.id"
                v-for="field in draggableFields"
              >
                <div class="col-3">{{ field.title }}</div>
                <div class="col-3">{{ DataFieldEnum[field.widgetType] }}</div>
                <div class="text-gray col-3">
                  <span>{{ field.description }}</span>
                </div>
                <div class="text-right col-3">
                  <a
                    @click="removeFieldTarget = field"
                    class="d-inline-block align-middle ml-2"
                  >
                    <i class="icon-remove-sm"></i>
                  </a>
                  <a class="d-inline-block align-middle ml-2 drag-item">
                    <i class="icon-splitter"></i>
                  </a>
                </div>
              </div>
            </transition-group>
          </draggable>
        </div>
        <div class="column-footer">
          <a
            id="new-column"
            class="btn btn-text text-left dropdown-toggle"
            data-toggle="dropdown"
          >
            <i class="fa fa-plus"></i> 新增欄位
          </a>
          <div
            id="new-column-container"
            aria-labelledby="new-column"
            class="dropdown-menu dropdown-menu-right"
          >
            <div
              class="dropdown-item"
              :key="field.id"
              @click="addField(field.id)"
              v-for="field in fieldWithoutProject"
            >
              <span>{{ field.title }}</span>
            </div>
            <hr />
            <div class="dropdown-item" @click="showNewFieldForm = true">
              申請新增欄位
            </div>
          </div>
        </div>
      </div>
    </div>

    <Species v-if="showSpeciesEdit" @close="showSpeciesEdit = false" />

    <double-check-modal
      v-if="!!removeFieldTarget"
      :open="!!removeFieldTarget"
      @close="removeFieldTarget = undefined"
      @submit="deleteFields(removeFieldTarget.id)"
    >
      <img
        src="/assets/common/error-img.png"
        width="221"
        srcset="/assets/common/error-img@2x.png"
      />
      <h1 class="text-green">
        您確定要刪除「{{ removeFieldTarget.title }}」欄位嗎 ?
      </h1>
      <p class="text-gray">
        欄位刪除後，資料仍會存在，但將不會在「資料編輯」畫面中顯示（若您需加回自行新增之欄位，需再次向系統管理員提出申請）
      </p>
    </double-check-modal>
    <NewFieldForm
      v-if="showNewFieldForm"
      @close="showNewFieldForm = false"
      @submit="requestField"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable';

import DataFieldEnum from '@/constant/DataFieldEnum.js';
import DoubleCheckModal from '@/components/Modal/DoubleCheckModal.vue';
import NewFieldForm from '@/components/ProjectEdit/NewFieldForm.vue';

import Species from './Species.vue';

export default {
  components: {
    Species,
    draggable,
    DoubleCheckModal,
    NewFieldForm,
  },
  data: function() {
    return {
      DataFieldEnum,
      showSpeciesEdit: false,
      showNewFieldForm: false,
      removeFieldTarget: undefined,
    };
  },
  props: {
    dataFields: Array, // 從 api 來的完整 fields
    tempDataFields: Array, // 編輯暫存的 fields
  },
  computed: {
    projectId: function() {
      return this.$route.params.projectId;
    },
    fieldWithoutProject: function() {
      // 沒有被專案或是暫時新增所使用的 fields ，這些才可以在新增欄位時被選取
      const tempDataFieldsIds = this.tempDataFields.map(v => v.id);

      return this.dataFields.filter(v => !tempDataFieldsIds.includes(v.id));
    },
    noDraggableFields: function() {
      return this.tempDataFields.filter(v => v.systemCode);
    },
    draggableFields: {
      get() {
        return this.tempDataFields.filter(v => v.systemCode === undefined);
      },
      set(v) {
        this.$emit('change', [...this.noDraggableFields, ...v]);
      },
    },
  },
  methods: {
    addField(id) {
      const target = this.fieldWithoutProject.find(v => v.id === id);
      this.$emit('change', [...this.tempDataFields, target]);
    },
    deleteFields(id) {
      this.$emit('change', this.tempDataFields.filter(v => v.id !== id));
      this.removeFieldTarget = undefined;
    },
    requestField(payload) {
      this.$emit('request', payload);
      this.showNewFieldForm = false;
    },
  },
};
</script>
