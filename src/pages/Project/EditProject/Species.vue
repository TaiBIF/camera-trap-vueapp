<template>
  <div class="modal fade in">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">編輯常見物種排序</h4>
        </div>
        <div class="modal-body p-0">
          <div class="container sortable-container">
            <div class="row sortable-header">
              <div class="col-2">排序</div>
              <div class="col-7">物種</div>
              <div class="col-3"></div>
            </div>
            <div class="sortable-body">
              <draggable handle=".drag-item" v-model="tempSpecies">
                <transition-group>
                  <div
                    class="row sortable-item"
                    v-for="(sp, idx) in tempSpecies"
                    :key="idx"
                  >
                    <div class="col-2">{{ idx + 1 }}</div>
                    <div class="col-4">
                      <input
                        class="form-control"
                        v-model="sp.title"
                        :disabled="sp.id"
                      />
                    </div>
                    <div class="col-3">
                      <span
                        v-if="sp.code"
                        v-tooltip.right="tooltipNote[sp.code]"
                      >
                        <i class="icon icon-info"></i>
                      </span>
                    </div>
                    <div class="col-3 text-right">
                      <a class="d-inline-block align-middle ml-2 drag-item">
                        <i class="icon-splitter"></i>
                      </a>
                    </div>
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
        <div class="modal-footer text-right">
          <a
            @click="addSpecies()"
            class="btn btn-text text-green float-left ml-0"
          >
            <i class="fa fa-plus"></i> 新增項目
          </a>
          <a @click="$emit('close')" class="btn btn-default">取消</a>
          <button
            @click="sumbitSpecies"
            class="btn btn-orange"
            :disabled="tempSpecies.some(v => v.title === '')"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import draggable from 'vuedraggable';

import SpeciesTooltip from '@/constant/SpeciesTooltip.js';

const projects = createNamespacedHelpers('projects');

export default {
  components: {
    draggable,
  },
  data: function() {
    return {
      tempSpecies: [],
      tooltipNote: SpeciesTooltip,
    };
  },
  mounted() {
    this.getProjectSpecies(this.projectId);
    this.tempSpecies = this.projectSpecies;
  },
  watch: {
    projectSpecies: function(val) {
      this.tempSpecies = val;
    },
  },
  computed: {
    ...projects.mapGetters(['projectSpecies']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...projects.mapActions(['getProjectSpecies', 'putProjectSpecies']),
    addSpecies() {
      this.tempSpecies.push({ title: '' });
    },
    async sumbitSpecies() {
      await this.putProjectSpecies({
        id: this.projectId,
        species: this.tempSpecies,
      });
      this.$emit('close');
    },
  },
};
</script>
