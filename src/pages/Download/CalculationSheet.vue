<template>
  <hot-table
    ref="sheet"
    id="sheet"
    licenseKey="non-commercial-and-evaluation"
    language="zh-TW"
    :settings="HandsontableSetting"
    />
</template>
<script>
 
import { HotTable } from '@handsontable/vue';
import { createNamespacedHelpers } from 'vuex';
export default {
  props: {
    calculatorData: Object,
  },
  data: function() {
    return {
      HandsontableSetting: {
        height: 500,
        colHeaders: ['項目', '計算結果'],
        readOnly: true,
        data: [
          ['相機工作時數', `${this.calculatorData.cameraLocationWorkDuration} 小時`],
          ['有效照片', `${this.calculatorData.validQuantity} 張`],
          ['目擊事件', `${this.calculatorData.eventQuantity} 次`],
          ['平均偵測天數比例', 'xx %'],
          ['有效圖片除以相機工作時長', 'xx 小時'],
          ['目擊事件除以相機工作時長', 'xx 小時'],
          ]
      },
    };
  },
  components: {
    HotTable
  },
}
</script>
