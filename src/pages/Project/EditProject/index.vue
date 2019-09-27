<template>
  <div class="page-project">
    <div
      class="container page-project-edit"
      v-bind:class="{ loading: isLoading }"
    >
      <div class="row">
        <div class="col-2">
          <router-link
            :to="{ name: 'projectInfo', params: { projectId } }"
            class="gray"
          >
            <i class="fa fa-chevron-left"></i> 返回計畫首頁
          </router-link>
          <h1 class="heading">計畫管理</h1>
          <nav class="list">
            <router-link
              :key="pathName"
              class="item"
              active-class="active"
              :to="{
                name: pathName,
                params: {
                  projectId,
                },
              }"
              v-for="{ pathName, title } in links"
            >
              <div class="icon">
                <i
                  :class="
                    $route.name == pathName
                      ? 'fa fa-pencil-alt'
                      : 'fa fa-xs fa-circle'
                  "
                />
              </div>
              <div class="text">{{ title }}</div>
            </router-link>
          </nav>
        </div>
        <div class="col-10 pt-3">
          <router-view :setLoading="setLoading" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      links: [
        { pathName: 'projectBasic', title: '基本資訊' },
        { pathName: 'projectSetting', title: '編輯設定' },
        { pathName: 'projectCameraLocation', title: '相機位置管理' },
        { pathName: 'projectCamera', title: '相機管理' },
        { pathName: 'projectTrip', title: '行程管理' },
        { pathName: 'projectMember', title: '計畫成員' },
        { pathName: 'projectLicense', title: '創⽤CC授權' },
      ],
      isLoading: false,
    };
  },
  computed: {
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    setLoading(v) {
      this.isLoading = v;
    },
  },
};
</script>
<style lang="scss" scoped>
.gray,
.gray:hover {
  color: #8b8b8b;
}
</style>
