<template>
  <dir :style="{ border: '3px green dashed' }">
    <h1>資料欄位設定</h1>
    <div :style="{ border: '3px red dashed', 'margin-bottom': '1rem' }">
      <label>新增欄位: </label>
      <br />
      <button
        :key="field.id"
        @click="addField(field.id)"
        v-for="field in fieldWithoutProject"
      >
        {{ field.title }}
      </button>
      <button @click="showNewFieldForm = !showNewFieldForm">
        ---申請新欄位---
      </button>
    </div>
    <div v-if="showNewFieldForm" :style="{ border: '3px green dashed' }">
      <h2>申請新欄位</h2>
      <label>欄位名稱: </label>
      <input type="text" v-model="newField.title" />
      <label>欄位描述: </label>
      <input type="text" v-model="newField.description" />
      <label>欄位備註: </label>
      <input type="text" v-model="newField.note" />
      <button @click="requestField()">送出</button>
    </div>
    <br />
    <div
      :key="field.id"
      :style="{ 'border-bottom': '3px blue dashed' }"
      v-for="(field, idx) in tempDataFields"
    >
      <button v-if="!field.systemCode" @click="deleteFields(idx)">
        delete
      </button>
      <p>欄位名稱: {{ field.title }}</p>
      <p>欄位形式: {{ field.widgetType }}</p>
      <p>輸入格式: {{ field.description }}</p>
      <p>systemCode: {{ field.systemCode }}</p>
    </div>
    <button @click="sumbitDataFields">儲存</button>
  </dir>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const dataFields = createNamespacedHelpers('dataFields');
const projects = createNamespacedHelpers('projects');

export default {
  data: function() {
    return {
      tempDataFields: [],
      showNewFieldForm: false,
      newField: {
        title: '',
        description: '',
        note: '',
        widgetType: 'text', // 寫死，之後需照可選內容設定更多選項
      },
    };
  },
  mounted() {
    this.getDataFields();
    this.tempDataFields = this.projectDataFields;
  },
  watch: {
    projectDataFields: function(val) {
      this.tempDataFields = val;
    },
  },
  computed: {
    ...dataFields.mapGetters(['dataFields']),
    ...projects.mapGetters(['projectDataFields']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    fieldWithoutProject: function() {
      // 沒有被專案或是暫時新增所使用的 fields ，這些才可以在新增欄位時被選取
      const tempDataFieldsIds = this.tempDataFields.map(v => v.id);

      return this.dataFields.filter(v => !tempDataFieldsIds.includes(v.id));
    },
  },
  methods: {
    ...dataFields.mapActions(['getDataFields', 'postDataFields']),
    ...projects.mapActions(['putProjectDataFields']),
    addField(id) {
      const target = this.fieldWithoutProject.find(v => v.id === id);
      this.tempDataFields.push(target);
    },
    deleteFields(idx) {
      this.tempDataFields.splice(idx, 1);
    },
    sumbitDataFields() {
      this.putProjectDataFields({
        id: this.projectId,
        fields: this.tempDataFields,
      });
    },
    requestField() {
      this.postDataFields(this.newField);
      this.showNewFieldForm = false;
    },
  },
};
</script>
