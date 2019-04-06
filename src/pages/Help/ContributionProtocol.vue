<template>
  <div class="container page-article">
    <div>
      <h1 class="text-green">
        {{ title }}
      </h1>
      <p class="text-gray">
        {{ description }}
      </p>
      <article>
        <mark-down></mark-down>
      </article>
      <div v-if="date" class="text-right text-gray">
        最後更新日期：{{ date }}
      </div>
    </div>
  </div>
</template>

<script>
import markdown from '@/prose/contribution-protocol.md';

export default {
  name: 'ContributionProtocol',
  components: {
    MarkDown: markdown,
  },
  data() {
    return {
      title: 'Camera Trap 自動相機資料平台貢獻協議',
      description: '',
      date: '2018-11-01',
    };
  },
};
</script>
