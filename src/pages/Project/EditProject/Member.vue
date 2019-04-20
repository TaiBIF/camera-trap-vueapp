<template>
  <div>
    <div class="panel">
      <div class="panel-heading">
        <h4>計畫成員</h4>
      </div>
      <div class="panel-body">
        <div class="invite-block">
          <form class="form-horizontal">
            <div class="form-group row mb-0">
              <label for="" class="col-2 text-right">加入成員</label>
              <div class="col-4">
                <input
                  type="text"
                  class="form-control"
                  v-model="newMember.user"
                  placeholder="請輸入成員 ORCiD"
                />
              </div>
              <div class="col-4">
                <v-select
                  label="value"
                  :options="memberRole"
                  v-model="newMember.role"
                />
                <router-link
                  to="/help/member-description"
                  class="d-block link text-green underline mt-1"
                >
                  成員權限說明
                </router-link>
              </div>
              <div class="col-2">
                <button
                  @click.prevent="postMember"
                  class="btn btn-orange"
                  :disabled="!newMember.user || !newMember.role"
                >
                  加入
                </button>
              </div>
            </div>
          </form>
          <p v-if="errorMessage" :style="{ color: 'red' }">
            錯誤訊息: {{ errorMessage }}
          </p>
        </div>
        <table class="table mt-2">
          <thead>
            <tr>
              <th>計畫成員</th>
              <th>電子郵件</th>
              <th>權限設置</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.id">
              <td>{{ member.name }}</td>
              <td class="text-gray">{{ member.email }}</td>
              <td>
                <v-select
                  label="value"
                  :clearable="false"
                  :options="memberRole"
                  v-model="member.role"
                  :disabled="!member.editable"
                />
              </td>
              <td class="text-right" v-if="member.editable">
                <a @click="removeMemberTarget = member">
                  <i class="fas fa-times fa-2x" />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="action">
      <div @click="$router.back()" class="btn btn-default">取消</div>
      <button
        type="submit"
        @click.stop.prevent="doSubmit()"
        class="btn btn-orange"
      >
        儲存
      </button>
    </div>

    <remove-member-dialog
      v-if="!!removeMemberTarget"
      :open="!!removeMemberTarget"
      :name="removeMemberTarget.name"
      @close="removeMemberTarget = undefined"
      @submit="deleteMember(removeMemberTarget.id)"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import vSelect from 'vue-select';

import RemoveMemberDialog from '@/components/ProjectEdit/RemoveMemberDialog.vue';
import memberRole from '@/constant/memberRole.js';

const projects = createNamespacedHelpers('projects');

export default {
  data: function() {
    return {
      memberRole,
      errorMessage: undefined,
      members: [],
      newMember: {
        user: '',
        role: null,
      },
      removeMemberTarget: undefined,
    };
  },
  components: {
    RemoveMemberDialog,
    vSelect,
  },
  mounted() {
    this.updateMember(this.projectDetail.members);
  },
  watch: {
    'projectDetail.members': function(val) {
      this.updateMember(val);
    },
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...projects.mapActions([
      'postProjectMember',
      'deleteProjectMember',
      'putProjectMember',
    ]),
    updateMember(newMember) {
      this.members =
        newMember &&
        newMember.map(v => ({
          id: v.user.id,
          name: v.user.name,
          email: v.user.email,
          role: memberRole.find(m => m.key === v.role),
          editable: v.role !== 'manager',
        }));
    },
    async postMember() {
      try {
        await this.postProjectMember({
          id: this.projectId,
          body: this.newMember,
        });
        this.errorMessage = '';
        this.newMember = {
          user: '',
          role: null,
        };
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
    },
    async deleteMember(userId) {
      try {
        await this.deleteProjectMember({ id: this.projectId, userId });
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
      this.removeMemberTarget = undefined;
    },
    async doSubmit() {
      try {
        await this.putProjectMember({
          projectId: this.projectId,
          payload: this.members,
        });
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
    },
  },
};
</script>
