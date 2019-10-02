<template>
  <div class="add-project-camera">
    <div class="camera-filter p-3">
      <div class="camera-filter-title mb-3">篩選條件</div>
      <div class="camera-filter-option-type">
        <div>
          廠牌
          <span class="float-right" v-on:click="clearFilter('manufacturer')"
            >清除 －</span
          >
        </div>
        <input type="text" placeholder="搜尋" v-model="searchManufacturer" />
        <div v-for="(option, index) in manufacturerOption" :key="index">
          <i
            class="el-icon-check"
            v-show="selectedFilters.manufacturer === option"
          />
          <span
            :id="option"
            class="camera-filter-option"
            v-on:click="selectSingleFilter('manufacturer', $event)"
          >
            {{ option }}
          </span>
          <span class="float-right" v-show="!!manufacturerOptionCount[option]">
            ({{ manufacturerOptionCount[option] }})
          </span>
        </div>
      </div>
      <hr />
      <div class="camera-filter-option-type">
        <div>
          型號<span class="float-right" v-on:click="clearFilter('model')"
            >清除 －</span
          >
        </div>
        <input type="text" placeholder="搜尋" v-model="searchModel" />
        <div v-for="(option, index) in modelOption" :key="index">
          <i class="el-icon-check" v-show="selectedFilters.model === option" />
          <span
            :id="option"
            class="camera-filter-option"
            v-on:click="selectSingleFilter('model', $event)"
          >
            {{ option }}
          </span>
          <span class="float-right" v-show="!!modelOptionCount[option]">
            ({{ modelOptionCount[option] }})
          </span>
        </div>
      </div>
      <hr />
      <div class="camera-filter-option-type">
        <div>
          相機序號<span class="float-right" v-on:click="clearFilter('sn')"
            >清除 －</span
          >
        </div>
        <el-checkbox-group v-model="selectedFilters.sn">
          <el-checkbox
            v-for="(data, index) in selectedFilters.sn"
            :key="index"
            :label="data"
            @change="selectMultipleFilter"
          ></el-checkbox>
        </el-checkbox-group>
        <input type="text" placeholder="關鍵字搜尋" v-model="searchSn" />
        <el-checkbox-group v-model="selectedFilters.sn">
          <el-checkbox
            v-for="(option, index) in snOption"
            :key="index"
            :label="option"
            @change="selectMultipleFilter"
          ></el-checkbox>
        </el-checkbox-group>
      </div>
      <hr />
      <div class="camera-filter-option-type">
        <div>
          廠商維護編號<span class="float-right" v-on:click="clearFilter('vn')"
            >清除 －</span
          >
        </div>
        <el-checkbox-group v-model="selectedFilters.vn">
          <el-checkbox
            v-for="(data, index) in selectedFilters.vn"
            :key="index"
            :label="data"
            @change="selectMultipleFilter"
          ></el-checkbox>
        </el-checkbox-group>
        <input type="text" placeholder="關鍵字搜尋" v-model="searchVn" />
        <el-checkbox-group v-model="selectedFilters.vn">
          <el-checkbox
            v-for="(option, index) in vnOption"
            :key="index"
            :label="option"
            @change="selectMultipleFilter"
          ></el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="camera-list">
      <el-table
        :data="cameraListData"
        :row-class-name="selectedStyle"
        @row-click="selectCamera"
      >
        <el-table-column prop="name" label="相機編號"></el-table-column>
        <el-table-column prop="sn" label="相機序號"></el-table-column>
        <el-table-column prop="vn" label="廠商維護編號"> </el-table-column>
        <el-table-column prop="manufacturer" label="廠牌"> </el-table-column>
        <el-table-column prop="model" label="型號"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddProjectCamera',
  props: {
    cameraListData: {
      type: Array,
      default: () => [],
    },
    addProjectCameraList: {
      type: Array,
      default: () => [],
    },
    setAddProjectCameraList: { type: Function },
    getCamerasByFilter: { type: Function },
    getCameraType: { type: Function },
  },
  data: function() {
    return {
      manufacturerOption: [],
      modelOption: [],
      manufacturerOptionCount: {},
      modelOptionCount: {},
      snOption: [],
      vnOption: [],
      selectedFilters: {},
      searchManufacturer: '',
      searchModel: '',
      searchSn: '',
      searchVn: '',
    };
  },
  async mounted() {
    let cameraManufacturer = await this.getCameraType({
      type: 'manufacturers',
    });
    let cameraModel = await this.getCameraType({ type: 'models' });
    this.manufacturerOptionCount = cameraManufacturer.reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.name]: currentValue.dataCount,
      }),
      {},
    );
    this.modelOptionCount = cameraModel.reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.name]: currentValue.dataCount,
      }),
      {},
    );

    this.manufacturerOption = [
      '全部廠牌',
      ...Object.keys(this.manufacturerOptionCount),
    ];
    this.modelOption = ['全部型號', ...Object.keys(this.modelOptionCount)];

    this.selectedFilters = {
      manufacturer: this.manufacturerOption[0],
      model: this.modelOption[0],
      sn: [],
      vn: [],
    };
  },
  methods: {
    selectCamera(row) {
      const new_addProjectCameraList = Array.from(this.addProjectCameraList);
      const index = new_addProjectCameraList.indexOf(row);
      if (index !== -1) new_addProjectCameraList.splice(index, 1);
      else new_addProjectCameraList.push(row);
      this.setAddProjectCameraList(new_addProjectCameraList);
    },
    selectedStyle({ row }) {
      const index = this.addProjectCameraList.indexOf(row);
      if (index !== -1) return 'add-project-selected';
    },
    selectSingleFilter(key, event) {
      this.selectedFilters[key] = event.currentTarget.id;

      const filters = this.preProcessFilters();

      this.getCamerasByFilter(filters);
      this.clearAddProjectCameraList();
    },
    selectMultipleFilter() {
      const filters = this.preProcessFilters();

      this.getCamerasByFilter(filters);
      this.clearAddProjectCameraList();
    },
    async clearFilter(type) {
      switch (type) {
        case 'manufacturer':
          this.searchManufacturer = '';
          await this.handleSearchManufacturerChange('');
          this.selectedFilters.manufacturer = this.manufacturerOption[0];
          break;
        case 'model':
          this.searchModel = '';
          await this.handleSearchModelChange('');
          this.selectedFilters.model = this.modelOption[0];
          break;
        case 'sn':
          this.selectedFilters.sn = [];
          this.searchSn = '';
          break;
        case 'vn':
          this.selectedFilters.vn = [];
          this.searchVn = '';
          break;
      }
      let filters = this.preProcessFilters();

      this.getCamerasByFilter(filters);
      this.clearAddProjectCameraList();
    },
    preProcessFilters() {
      let filters = Object.assign({}, this.selectedFilters);

      Object.keys(filters).map(key => {
        if (
          typeof this.selectedFilters[key] === 'string' &&
          this.selectedFilters[key].indexOf('全部') > -1
        )
          delete filters[key];
        else if (typeof this.selectedFilters[key] === 'object') {
          this.selectedFilters[key].length > 0
            ? (filters[key] = filters[key][0])
            : delete filters[key];
        }
      });

      return filters;
    },
    clearAddProjectCameraList() {
      this.setAddProjectCameraList([]);
    },
    async handleSearchManufacturerChange(searchName) {
      let option = await this.getCameraType({
        type: 'manufacturers',
        searchName,
      });
      option = option.map(({ name }) => name);
      if (searchName === '') this.manufacturerOption = ['全部廠牌', ...option];
      else this.manufacturerOption = option;
    },
    async handleSearchModelChange(searchName) {
      let option = await this.getCameraType({
        type: 'models',
        searchName,
      });
      option = option.map(({ name }) => name);
      if (searchName === '') this.modelOption = ['全部型號', ...option];
      else this.modelOption = option;
    },
  },
  watch: {
    searchManufacturer: function(searchName) {
      this.handleSearchManufacturerChange(searchName);
    },
    searchModel: async function(searchName) {
      this.handleSearchModelChange(searchName);
    },
    searchSn: async function(searchName) {
      if (searchName === '') this.snOption = [];
      else {
        let option = await this.getCameraType({
          type: 'sn',
          searchName,
        });
        option = option.map(({ name }) => name);
        this.snOption = option;
      }
    },
    searchVn: async function(searchName) {
      if (searchName === '') this.vnOption = [];
      else {
        let option = await this.getCameraType({
          type: 'vn',
          searchName,
        });
        option = option.map(({ name }) => name);
        this.vnOption = option;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
