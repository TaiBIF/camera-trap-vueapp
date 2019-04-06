<template>
  <div>
    <h1>計畫管理-計畫成員</h1>
    <p v-if="errorMessage" :style="{ color: 'red' }">
      錯誤訊息: {{ errorMessage }}
    </p>
    <div :style="{ border: '3px red dashed' }">
      <label>新成員</label>
      <input type="text" v-model="newMember.user" />
      <br />
      <label>權限</label>
      <select v-model="newMember.role">
        <option :key="role.key" :value="role.key" v-for="role in memberRole">{{
          role.value
        }}</option>
      </select>
      <button @click="postMember">新增</button>
    </div>
    <br />
    <div
      :key="member.id"
      :style="{ 'border-bottom': '3px blue dashed' }"
      v-for="member in members"
    >
      <button @click="deleteMember(member.id)">delete</button>
      <p>id: {{ member.id }}</p>
      <p>name: {{ member.name }}</p>
      <p>email: {{ member.email }}</p>
      <span>role: </span>
      <select :value="member.role">
        <option :key="role.key" :value="role.key" v-for="role in memberRole">{{
          role.value
        }}</option>
      </select>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import idx from 'idx';

import memberRole from '@/constant/memberRole.js';

const projects = createNamespacedHelpers('projects');

export default {
  data: function() {
    return {
      memberRole,
      errorMessage: undefined,
      newMember: {},
    };
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    members: function() {
      return (
        this.projectDetail.members &&
        this.projectDetail.members.map(v => ({
          id: v.user.id,
          name: v.user.name,
          email: v.user.email,
          role: v.role,
        }))
      );
    },
  },
  methods: {
    ...projects.mapActions(['postProjectMember', 'deleteProjectMember']),
    postMember() {
      this.postProjectMember({ id: this.projectId, body: this.newMember }).then(
        v => {
          this.errorMessage = idx(v, _ => _.message);
        },
      );
    },
    deleteMember(userId) {
      this.deleteProjectMember({ id: this.projectId, userId }).then(v => {
        this.errorMessage = idx(v, _ => _.message);
      });
    },
  },
};
</script>
