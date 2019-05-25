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
    <ActionBtns @cancel="handleClickCancel" @submit="doSubmit" :error="error" />

    <double-check-modal
      v-if="!!removeMemberTarget"
      :open="!!removeMemberTarget"
      @close="removeMemberTarget = undefined"
      @submit="deleteMember(removeMemberTarget.id)"
    >
      <img
        src="/assets/common/error-img.png"
        width="221"
        srcset="/assets/common/error-img@2x.png"
      />
      <h1 class="text-green">
        您確定將 {{ removeMemberTarget.name }} 從計畫成員移除嗎 ? ?
      </h1>
      <p class="text-gray">
        移除後，該成員將無法瀏覽或編輯此計畫中的資料，若要回復權限，請再次加入此成員
      </p></double-check-modal
    >
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import vSelect from 'vue-select';

import ActionBtns from '@/components/ActionBtns/ActionBtns.vue';
import DoubleCheckModal from '@/components/Modal/DoubleCheckModal.vue';
import memberRole from '@/constant/memberRole.js';

const projects = createNamespacedHelpers('projects');

export default {
  data: function() {
    return {
      memberRole,
      error: undefined,
      members: [],
      newMember: {
        user: '',
        role: null,
      },
      removeMemberTarget: undefined,
    };
  },
  components: {
    DoubleCheckModal,
    vSelect,
    ActionBtns,
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
    ...projects.mapActions(['postProjectMember', 'putProjectMember']),
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
    handleClickCancel() {
      this.$router.push({
        name: 'projectInfo',
        params: {
          projectId: this.projectId,
        },
      });
    },
    async postMember() {
      try {
        await this.postProjectMember({
          id: this.projectId,
          body: this.newMember,
        });
        this.error = undefined;
        this.newMember = {
          user: '',
          role: null,
        };
      } catch (e) {
        this.error = e;
      }
    },
    async deleteMember(userId) {
      this.members = this.members.filter(v => v.id !== userId);
      this.removeMemberTarget = undefined;
    },
    async doSubmit() {
      try {
        await this.putProjectMember({
          projectId: this.projectId,
          members: this.members,
        });
        this.error = undefined;
        this.$router.push({
          name: 'projectLicense',
          params: {
            projectId: this.projectId,
          },
        });
      } catch (e) {
        this.error = e;
      }
    },
  },
};
</script>
