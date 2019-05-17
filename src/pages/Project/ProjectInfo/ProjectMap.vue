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
        name="Layer Circle"
      >
        <l-circle
          v-for="(area, idx) in areas"
          :key="`project-area-${idx}`"
          :lat-lng="area.position"
          :draggable="false"
          :radius="10000"
          :fillColor="'#2A7F60'"
          :fillOpacity="1"
          :color="'rgba(42,127,96,.43)'"
          @click="selectArea(area.path)"
        >
          <l-tooltip
            :content="area.title"
            :options="{ permanent: true, direction: 'center' }"
          ></l-tooltip>
        </l-circle>
      </l-layer-group>
      <l-layer-group
        v-if="mapMode === 'camera'"
        :className="'site-container'"
        layer-type="overlay"
        name="Layer Marker"
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
        v-if="showForestBoundary"
        layer-type="overlay"
        name="Layer polyline"
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
    <div class="checkbox float-right mt-3 mb-0">
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

const defaultZoom = {
  area: 8,
  camera: 12,
};

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
      getForestBoundaryParam: { lng: 0, lat: 0 },
      options: {
        zoomControl: true,
      },
      url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      showForestBoundary: false,
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
      const { position } =
        this.cameras.find(({ id }) => id === this.selectedCameraId) || {};

      return {
        lat: position.lat,
        lng: position.lng,
      };
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
        path: `/project/${this.projectId}/info/video/${path}/receive`,
      });
    },
    selectCamera(cameraId) {
      this.$router.push({
        path: `/project/${this.projectId}/info/video/${
          this.selectedStudyAreaId
        }/receive/${cameraId}`,
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
  },
};
</script>
