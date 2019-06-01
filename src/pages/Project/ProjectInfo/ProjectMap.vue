<template>
  <div>
    <l-map
      style="height: 395px"
      :zoom="zoom"
      :center="mapCenter"
      :options="options"
      @update:center="centerUpdated"
      @update:zoom="zoomUpdated"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-layer-group
        v-if="mapMode === 'area'"
        layer-type="overlay"
        name="Layer StudyArea"
      >
        <l-circle
          v-for="(area, idx) in areas"
          :key="`project-area-${idx}`"
          :lat-lng="area.position"
          :draggable="false"
          :radius="studyAreaRadius"
          :color="markerColor.area.color"
          :fillColor="markerColor.area.color"
          :fillOpacity="showSpecies ? 0.2 : 0.8"
          @click="selectArea(area.path)"
        >
          <l-tooltip
            :content="area.title"
            :options="{ permanent: true, direction: 'center' }"
          ></l-tooltip>
        </l-circle>
      </l-layer-group>
      <l-layer-group
        v-if="mapMode === 'camera' && !showSpecies"
        :className="'site-container'"
        layer-type="overlay"
        name="Layer Camera"
      >
        <l-marker
          v-for="(camera, idx) in cameras"
          :key="`project-camera-${idx}`"
          :icon="camera.icon"
          :lat-lng="camera.position"
          :draggable="false"
          @click="selectCamera(camera.id)"
          @mouseover="$emit('hoverCamera', camera.id)"
          @mouseout="$emit('hoverCamera')"
        >
          <l-tooltip
            :content="camera.name"
            :options="{ permanent: true, direction: 'top' }"
          />
        </l-marker>
      </l-layer-group>
      <l-layer-group
        v-if="mapMode === 'camera' && showSpecies"
        :className="'site-container'"
        layer-type="overlay"
        name="Layer Camera"
      >
        <l-circle
          v-for="(camera, idx) in cameras"
          :key="`project-camera-${idx}`"
          :lat-lng="camera.position"
          :draggable="false"
          :radius="cameraRadius"
          :color="markerColor.camera.color"
          :fillColor="markerColor.camera.color"
          fillOpacity="0.2"
          @click="selectCamera(camera.id)"
          @mouseover="$emit('hoverCamera', camera.id)"
          @mouseout="$emit('hoverCamera')"
        >
          <l-tooltip
            :content="camera.name"
            :options="{ permanent: true, direction: 'top' }"
          />
        </l-circle>
      </l-layer-group>
      <l-layer-group
        v-if="showSpecies"
        layer-type="overlay"
        name="Layer Species"
      >
        <div
          v-for="(group, idx) in speciesGroups"
          :key="`project-species-${idx}`"
        >
          <l-circle
            v-for="(species, speciesIdx) in group.speciesMarkers"
            :key="`project-species-${idx}-${speciesIdx}`"
            :lat-lng="species.position"
            :draggable="false"
            :radius="species.radius"
            :color="species.color"
            :fillColor="species.color"
            :fillOpacity="1"
          >
          </l-circle>
        </div>
      </l-layer-group>
      <l-layer-group
        v-if="showForestBoundary"
        layer-type="overlay"
        name="Layer ForestBoundary"
      >
        <l-polygon
          v-for="item in forestBoundary"
          :key="item.id"
          :lat-lngs="item.points"
          :fillColor="'rgba(255,140,35,.15)'"
          :stroke="true"
          :fillOpacity="1"
          :color="'#FFAF00'"
        />
      </l-layer-group>
    </l-map>
    <div class="checkbox__container checkbox">
      <div>
        <input
          type="checkbox"
          name="show-species"
          id="show-species"
          value="1"
          v-model="showSpecies"
        />
        <label for="show-species">顯示物種</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="show-woods"
          id="show-woods"
          value="1"
          v-model="showForestBoundary"
        />
        <label for="show-woods">在地圖顯示林班地範圍</label>
      </div>
    </div>
    <div class="range__container">
      <input
        type="range"
        name="speciesDate"
        v-model="displaySpeciesDate"
        min="0"
        :max="totalDisplayMonth"
        :disabled="!showSpecies"
        @mousedown="mousedownSlider"
        @mousemove="mousemoveSlider"
        @mouseup="mouseupSlider"
      />
      <div
        v-show="displayCurrentDate.show"
        class="range__current"
        :style="{ left: displayCurrentDate.x + 'px' }"
      >
        {{ currentDisplayDate }}
      </div>
      <div class="range__display">
        <span>{{ startDisplayDate }}</span>
        <span>{{ endDisplayDate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  LCircle,
  LLayerGroup,
  LMap,
  LMarker,
  LPolygon,
  LTileLayer,
  LTooltip,
} from 'vue2-leaflet';
import { createNamespacedHelpers } from 'vuex';
import L from 'leaflet';
import chartColors from '@/constant/chartColors';
import idx from 'idx';
import 'leaflet/dist/leaflet.css';

const studyAreas = createNamespacedHelpers('studyAreas');
const forest = createNamespacedHelpers('forest');

const CameraIcon = L.icon({
  iconUrl: '/assets/common/marker-icon@2x.png',
  iconSize: [66, 120],
  iconAnchor: [33, 80],
  popupAnchor: [-3, -76],
  shadowSize: [66, 120],
  shadowAnchor: [31, 77],
});

const ErrorCameraIcon = L.icon({
  iconUrl: '/assets/common/marker-icon-error@2x.png',
  iconSize: [66, 120],
  iconAnchor: [30, 80],
  popupAnchor: [-3, -80],
  shadowSize: [66, 120],
  shadowAnchor: [33, 80],
});

const CameraIconSelect = L.icon({
  iconUrl: '/assets/common/marker-icon-select@2x.png',
  iconSize: [66, 120],
  iconAnchor: [33, 80],
  popupAnchor: [-3, -76],
  shadowSize: [66, 120],
  shadowAnchor: [31, 77],
});

const ErrorCameraIconSelect = L.icon({
  iconUrl: '/assets/common/marker-icon-error-select@2x.png',
  iconSize: [66, 120],
  iconAnchor: [30, 80],
  popupAnchor: [-3, -80],
  shadowSize: [66, 120],
  shadowAnchor: [33, 80],
});

const defaultZoom = { area: 8, camera: 12 };
const defaultPosition = { lng: 120.982024, lat: 23.973875 };

const positonShift = [
  { lat: 0.000002, lng: 0.000002 },
  { lat: -0.000002, lng: 0.000002 },
  { lat: -0.000002, lng: -0.000001 },
  { lat: 0.000001, lng: 0.000002 },
  { lat: 0.000002, lng: -0.000002 },
];

export default {
  name: 'project-map',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolygon,
    LCircle,
    LTooltip,
    LLayerGroup,
  },
  props: {
    activeCameraId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      zoom: defaultZoom.area,
      getForestBoundaryParam: defaultPosition,
      options: {
        zoomControl: true,
      },
      url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      studyAreaRadius: 10000,
      cameraRadius: 5000,
      markerColor: {
        area: {
          color: 'rgba(42, 127, 96, .43)',
          fillColor: 'rgb(42, 127, 96)',
        },
        camera: {
          color: 'rgba(17, 138, 178,.43)',
          fillColor: 'rgb(17, 138, 178)',
        },
      },
      showForestBoundary: false,
      showSpecies: false,
      displaySpeciesDate: 0,
      displayCurrentDate: {
        x: 0,
        show: false,
      },
      startDisplayDate: '2010-05', // TODO: get from API
      endDisplayDate: '2016-11', // TODO: get from API
      speciesMarkers: {
        // TODO: get from API
        '5ceb8464caaeca01402d6354': [
          {
            name: 'A',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 28,
          },
          {
            name: 'B',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 36,
          },
          {
            name: 'C',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 145,
          },
          {
            name: 'D',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 1515,
          },
          {
            name: 'E',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 0,
          },
        ],
        '5ceb83f7caaecaca502d62d9': [
          {
            name: 'A',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 78,
          },
          {
            name: 'B',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 66,
          },
          {
            name: 'C',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 45,
          },
          {
            name: 'D',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 185,
          },
          {
            name: 'E',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 30,
          },
        ],
        '5ceb8488caaecaf5472d63a8': [
          {
            name: 'A',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 278,
          },
          {
            name: 'B',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 6,
          },
          {
            name: 'C',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 415,
          },
          {
            name: 'D',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 15,
          },
          {
            name: 'E',
            speciesId: '5cd661e332a98b60839c6cab',
            numberOfRecords: 83,
          },
        ],
      },
    };
  },
  watch: {
    mapMode(value) {
      this.zoom = defaultZoom[value];
    },
    showForestBoundary() {
      this.reloadForestBoundary();
    },
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    ...forest.mapGetters(['forestBoundary']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    selectedStudyAreaId: function() {
      return this.$route.params.selectedStudyAreaId;
    },
    selectedCameraId: function() {
      return this.$route.params.selectedCameraId;
    },
    mapMode: function() {
      if (this.selectedStudyAreaId === 'all') {
        return 'area';
      }
      return 'camera';
    },
    areas: function() {
      return this.studyAreas.map(({ title, id, children, position }) => ({
        title,
        position,
        path: idx(children, _ => _[0].id) || id, // if area have children, use first child id as path
      }));
    },
    cameras: function() {
      return this.cameraLocations.map(
        ({ id, name, latitude, longitude, failures }) => ({
          id,
          name,
          position: {
            lat: latitude,
            lng: longitude,
          },
          icon: this.getMarkerIcon(id, failures),
        }),
      );
    },
    speciesMaxRecords: function() {
      return Object.values(this.speciesMarkers)
        .reduce((join, speciesMarkers) => [...join, ...speciesMarkers], [])
        .reduce(
          (max, { numberOfRecords }) => Math.max(max, numberOfRecords),
          0,
        );
    },
    speciesGroups: function() {
      if (this.mapMode === 'area') {
        return this.studyAreas.map(({ position, id }) => ({
          position,
          speciesMarkers: this.speciesMarkers[id].map(
            ({ speciesId, numberOfRecords }, index) => ({
              speciesId,
              color: chartColors[index],
              radius: (numberOfRecords / this.speciesMaxRecords) * 2000,
              position: this.getRandomPosition(
                position,
                index,
                this.studyAreaRadius,
              ),
            }),
          ),
        }));
      }
      return this.studyAreas.map(({ position, id }) => ({
        position,
        speciesMarkers: this.speciesMarkers[id].map(
          ({ speciesId, numberOfRecords }, index) => ({
            speciesId,
            color: chartColors[index],
            radius: (numberOfRecords / this.speciesMaxRecords) * 200,
            position: this.getRandomPosition(
              position,
              index,
              this.cameraRadius,
            ),
          }),
        ),
      }));
    },
    mapCenter: function() {
      // project level: calculate center base on all parent studyAreas
      if (this.selectedStudyAreaId === 'all') {
        return this.areas.reduce(
          (res, { position }) => {
            const { lat, lng } = position;
            res.lat += lat / this.areas.length;
            res.lng += lng / this.areas.length;
            return res;
          },
          {
            lat: 0,
            lng: 0,
          },
        );
      }
      if (!this.selectedCameraId) {
        // studyArea level: calculate center base on all cameraLocation in this studyArea
        return this.cameras.reduce(
          (res, { position }) => {
            const { lat, lng } = position;
            res.lat += lat / this.cameras.length;
            res.lng += lng / this.cameras.length;
            return res;
          },
          {
            lat: 0,
            lng: 0,
          },
        );
      }
      // camera level: use current cameraLocation
      const { position } = this.cameras.find(
        ({ id }) => id === this.selectedCameraId,
      ) || { position: defaultPosition };

      return {
        lat: position.lat,
        lng: position.lng,
      };
    },
    startDisplayYear: function() {
      return parseInt(this.startDisplayDate.slice(0, 4), 10);
    },
    startDisplayMonth: function() {
      return parseInt(this.startDisplayDate.slice(5), 10);
    },
    endDisplayYear: function() {
      return parseInt(this.endDisplayDate.slice(0, 4), 10);
    },
    endDisplayMonth: function() {
      return parseInt(this.endDisplayDate.slice(5), 10);
    },
    totalDisplayMonth: function() {
      return (
        (this.endDisplayYear - this.startDisplayYear) * 12 +
        (this.endDisplayMonth - this.startDisplayMonth)
      );
    },
    currentDisplayDate: function() {
      // transfer slider number to date
      const num = parseInt(this.displaySpeciesDate, 10);
      const totalMonth = this.startDisplayMonth + num;
      const year = this.startDisplayYear + Math.floor((totalMonth - 1) / 12);
      const month = totalMonth % 12 === 0 ? 12 : totalMonth % 12;

      return `${year}-${('0' + month).slice(-2)}`;
    },
  },
  methods: {
    ...forest.mapActions(['loadForestBoundary']),
    getMarkerIcon: function(id, failures) {
      if (failures > 0) {
        if (id === this.activeCameraId) {
          return ErrorCameraIconSelect;
        }
        return ErrorCameraIcon;
      }
      if (id === this.activeCameraId) {
        return CameraIconSelect;
      }
      return CameraIcon;
    },
    zoomUpdated(e) {
      this.zoom = e;
    },
    selectArea(path) {
      this.$router.push({
        name: 'projectMedia',
        params: {
          projectId: this.projectId,
          selectedStudyAreaId: path,
          type: 'retrieved',
        },
      });
    },
    selectCamera(cameraId) {
      this.$router.push({
        name: 'projectMedia',
        params: {
          projectId: this.projectId,
          selectedStudyAreaId: this.selectedStudyAreaId,
          type: 'retrieved',
          selectedCameraId: cameraId,
        },
      });
    },
    reloadForestBoundary(position) {
      if (!this.showForestBoundary) return;
      if (this.zoom < defaultZoom.area) return;

      const { lat, lng } = position || this.mapCenter;
      const { lat: qLat, lng: qLng } = this.getForestBoundaryParam;
      if (Math.abs(lat - qLat) < 0.05 || Math.abs(lng - qLng) < 0.05) return;

      this.getForestBoundaryParam = { lat, lng };
      this.loadForestBoundary({ lat, lng });
    },
    centerUpdated({ lat, lng }) {
      this.reloadForestBoundary({ lat, lng });
    },
    mousedownSlider(e) {
      this.displayCurrentDate = {
        show: true,
        x: e.layerX,
      };
    },
    mousemoveSlider(e) {
      const { target, layerX } = e;
      if (
        this.displayCurrentDate.show &&
        layerX >= 0 &&
        layerX <= target.clientWidth
      ) {
        this.displayCurrentDate.x = layerX;
      }
    },
    mouseupSlider() {
      this.displayCurrentDate.show = false;
    },
    getRandomPosition({ lat, lng }, idx, scale) {
      return {
        lat: lat + positonShift[idx].lat * scale,
        lng: lng + positonShift[idx].lng * scale,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.checkbox__container {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;

  & > div {
    position: relative;

    & > label {
      padding-left: 25px;
      font-size: 14px;
    }
  }
}

.range__container {
  position: relative;

  & > input {
    width: 100%;

    &:disabled {
      cursor: not-allowed;
    }
  }

  .range__current {
    position: absolute;
    top: -28px;
    left: 0;
    padding: 5px 10px;
    border-radius: 3px;
    width: 80px;
    transform: translateX(-40px);
    background-color: white;
    color: #8b8b8b;
  }

  .range__display {
    display: flex;
    justify-content: space-between;
    color: #8b8b8b;
  }
}
</style>
