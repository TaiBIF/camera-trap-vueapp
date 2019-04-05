<template>
  <div class="container page-article">
    <div v-if="loading">
      <p>Loading</p>
    </div>
    <div v-if="prose">
      <h1 class="text-green">
        {{ prose.title }}
      </h1>
      <p class="text-gray">
        {{ prose.description }}
      </p>
      <article>
        <prose-content></prose-content>
      </article>
      <div class="text-right text-gray">最後更新日期：{{ prose.date }}</div>
    </div>
  </div>
</template>

<script>
import ProseContent from '@/prose/contribution-protocol.md';

export default {
  name: 'ContributionProtocol',
  components: {
    'prose-content': ProseContent,
  },
  data() {
    return {
      loading: false,
      prose: {
        path: 'contribution-protocol',
        title: 'Camera Trap 自動相機資料平台貢獻協議',
        description: '',
        date: '2018-11-01',
      },
    };
  },
};
</script>
