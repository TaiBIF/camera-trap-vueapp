<template>
  <div>
    <h1>計畫首頁 id: {{ projectId }}</h1>
    <ul>
      <li :key="pathName" v-for="{ pathName, title } in links">
        <router-link
          :to="{
            name: pathName,
            params: {
              projectId,
            },
          }"
          >{{ title }}</router-link
        >
      </li>
    </ul>
    <router-view />
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      links: [
        { pathName: 'projectBasic', title: '計畫基本資訊' },
        { pathName: 'projectSetting', title: '計畫編輯設定' },
        { pathName: 'projectCamera', title: '計畫相機位置管理' },
        { pathName: 'projectMember', title: '計畫成員' },
        { pathName: 'projectLicense', title: '計畫創⽤CC授權' },
      ],
    };
  },
  computed: {
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
};
</script>
