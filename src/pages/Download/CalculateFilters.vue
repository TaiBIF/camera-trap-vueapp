<template>
  <div class="panel-content">
    <form class="search-columns">
      <div class="row">
        <div class="form-group col-4">
          <label>計算項目</label>
          <v-select
            :options="[
              { label: '相機工作時數', value: 'oi' },
              { label: 'OI_1', value: 'oi1' },
              { label: 'OI_2', value: 'oi2' },
              { label: 'OI_3', value: 'oi3' },
            ]"
          />
        </div>
      </div>
      <div class="col-12 text-right action">
        <button type="reset" class="btn btn-green-border">
          清空選項
        </button>
        <button
          type="submit"
          v-on:click.prevent="$emit('filter', params)"
          class="btn btn-orange"
        >
          計算
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  data: function() {
    return {};
  },

  components: { vSelect },
  mounted() {},
  methods: {},
};
</script>
