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
import moment from 'moment';

export default {
  props: {
    calculateType: String,
    calculatorData: [Object, Array],
  },
  data: function() {
    return {
      HandsontableSetting: {
        height: 500,
        colHeaders:
          this.calculateType === 'oi'
            ? ['項目', '計算結果']
            : ['日期', '初測延遲'],
        readOnly: true,
        data: [],
      },
    };
  },
  computed: {
    data() {
      if (this.calculateType === 'oi') {
        const dutyHours = Math.floor(
          this.calculatorData.cameraLocationWorkDuration / 60 / 60 / 1000,
        );
        return [
          ['相機工作時數', `${dutyHours} 小時`],
          ['有效照片', `${this.calculatorData.validQuantity} 張`],
          ['目擊事件', `${this.calculatorData.eventQuantity} 次`],
          [
            '有效圖片除以相機工作時長',
            `${
              dutyHours === 0
                ? '-'
                : this.calculatorData.validQuantity / dutyHours
            } 張/小時`,
          ],
          [
            '目擊事件除以相機工作時長',
            `${
              dutyHours === 0
                ? '-'
                : this.calculatorData.eventQuantity / dutyHours
            } 次/小時`,
          ],
        ];
      }

      return this.calculatorData.map(x => {
        const duration = new Date(x.duration);
        return [
          moment(x.time).format('YY/M/D'),
          x.duration == null
            ? '沒有照片'
            : `${duration.getUTCHours()} 小時 ${`${duration.getUTCMinutes()}`.padStart(
                2,
                '0',
              )} 分`,
        ];
      });
    },
  },
  watch: {
    calculatorData() {
      this.$refs.sheet.$data.hotInstance.loadData(this.data);
    },
  },
  components: {
    HotTable,
  },
};
</script>
