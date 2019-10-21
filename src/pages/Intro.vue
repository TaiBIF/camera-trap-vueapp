/* eslint-disable prettier/prettier */ /* eslint-disable prettier/prettier */ /*
eslint-disable prettier/prettier */ /* eslint-disable prettier/prettier */
<template>
  <div class="page-intro">
    <section class="banner">
      <div class="container">
        <div class="caption col-xs-12 col-sm-12 col-md-6">
          <h1 class="header">自動相機監測影像<br />及資料管理系統</h1>
          <p>簡單、效率、專業 - 紅外線相機資料管理平台</p>
          <a class="btn btn-orange btn-lg" @click="handleClickStartUse"
            >開始使用</a
          >
        </div>
      </div>
    </section>
    <section class="important">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <h6 v-if="map.mode === 'studyArea'" @click="backTo('region')">
              返回
            </h6>
            <h6 v-else>點擊地圖區塊進行資料探索</h6>
            <l-map
              style="height: 600px; width: 100%"
              :zoom="map.mode === 'studyArea' ? 10 : 7"
              :center="center"
              @update:zoom="zoomUpdated"
              @update:center="centerUpdated"
              @update:bounds="boundsUpdated"
              :options="controlableMapOptions"
            >
              <l-geo-json
                ref="geoRef"
                :geojson="geojson"
                :options="geoOptions"
              />
              <l-tile-layer :url="url" :attribution="attribution" />
              <l-circle-marker
                v-for="l in locations"
                :key="l.id"
                :lat-lng="l.latlng"
                :radius="l.id"
                color="orange"
                :fillOpacity="1"
                fillColor="orange"
                @click="handleStudyAreaClick(l)"
              >
                <l-tooltip
                  :content="l.text"
                  :options="{
                    direction: 'top',
                  }"
                />
              </l-circle-marker>
            </l-map>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 text-right">
            <div v-if="map.mode === 'none'">
              <h2 class="text-green">
                <big>自動相機資料庫</big><br />
                共享的資料平台
              </h2>
              <p class="desp pl-5 text-left">
                Camera Trap提供研究人員自動相機影像統一倉儲、管理、
                查詢及分析的便利性，透過公開資源的共享，與其他專業人士交流、探索生態與開創更多研究可能性。
              </p>
            </div>
            <div v-else-if="map.mode === 'region'">
              <h2 class="text-green text-left mb-3">
                <big>{{ map.region.name }}</big
                ><br />
                {{ regionData.species[0] || ''
                }}{{
                  regionData.species[1] ? `、${regionData.species[1]}` : ''
                }}
              </h2>
              <div
                class="desp row"
                v-for="(key, i) in Object.keys(regionData)"
                :key="i"
              >
                <div class="col-3 text-left">
                  {{ regionDataString[key] }}
                </div>
                <div
                  class="col-6 text-left"
                  v-if="!Array.isArray(regionData[key])"
                >
                  {{ regionData[key] }}
                </div>
                <div class="col-6 text-left" v-else>
                  {{
                    regionData[key].reduce(
                      (pre, cur) => (pre === '' ? cur : `${pre}、${cur}`),
                      '',
                    )
                  }}
                </div>
              </div>
            </div>
            <div v-else-if="map.mode === 'studyArea'">
              <ve-histogram :data="histogramData"></ve-histogram>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="important p-5">
      <div class="row service-items total-data-chart">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <span>資料成長數</span>
          <hr />
          <ve-histogram
            :data="dataCount"
            :settings="dataCountSettings"
          ></ve-histogram>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <span>物種分布</span>
          <hr />
          <div class="row">
            <ve-bar
              class="col-xs-12 col-sm-12 col-md-6"
              :data="speciesLocationCount"
            ></ve-bar>
            <ve-bar
              class="col-xs-12 col-sm-12 col-md-6"
              :data="speciesPictureCount"
            ></ve-bar>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <span>單位比例圖</span>
          <hr />
          <ve-pipe
            :data="funderRatio"
            :settings="funderRatioSettings"
            :legend-visible="false"
          ></ve-pipe>
          <p class="float-right pipe-chart-des">資料量(GB)</p>
        </div>
      </div>
    </section>
    <carousel-3d :autoplay="true" :height="320" :width="460" :border="0">
      <slide v-for="(slide, i) in slides" :index="i" :key="i">
        <img src="https://placehold.it/460x320" />
      </slide>
    </carousel-3d>

    <section class="important">
      <div class="container">
        <h1 class="text-green text-center">
          減少相機資料處理時間，提升工作效率
        </h1>
        <div class="row service-items">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="image">
              <img
                src="/assets/intro/service-1.png"
                srcset="/assets/intro/service-1@2x.png"
              />
            </div>
            <div class="content">
              <h2 class="text-green">資料彙整</h2>
              <p class="description">資料雲端留存，統一管理</p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="image">
              <img
                src="/assets/intro/service-2.png"
                srcset="/assets/intro/service-2@2x.png"
              />
            </div>
            <div class="content">
              <h2 class="text-green">資料處理</h2>
              <p class="description">線上辨識物種、標註及分析</p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="image">
              <img
                src="/assets/intro/service-3.png"
                srcset="/assets/intro/service-3@2x.png"
              />
            </div>
            <div class="content">
              <h2 class="text-green">資料共享</h2>
              <p class="description">開放科學，資源共享共用</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="easy">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-5">
            <h2 class="text-green">
              <big>簡單</big><br />
              熟悉的工作介面
            </h2>
            <p class="desp">
              彈性的管理模組讓你可以自行建立計畫所需之樣區層級，並透過目錄結構管理，像使用電腦資料夾一樣，輕鬆歸納大量資料。Camera
              Trap將慣用的Excel工作介面，套用至平台中，延續原有使用習慣，減少學習時間，能更專注於研究工作！
            </p>

            <div class="img-items text-right">
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/easy-item-1.png"
                    srcset="/assets/intro/easy-item-1@2x.png"
                    width="120"
                  />
                </div>
                <div class="content">
                  目錄式結構
                </div>
              </div>
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/easy-item-2.png"
                    srcset="/assets/intro/easy-item-2@2x.png"
                    width="120"
                  />
                </div>
                <div class="content">
                  Excel 工作介面
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="effect">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 offset-md-6 text-right">
            <h2 class="text-green">
              <big>效率</big><br />
              高效的管理系統
            </h2>
            <p class="desp pl-5">
              統計各樣區資料回收狀況，透過圖表呈現一目了然，讓管理者能迅速掌握資料進度。連拍補齊功能加速您的標註作業，當您辨識第一筆資料時，被標示為該次連拍的資料會同步填入相同內容。Camera
              Trap會自動檢核常見錯誤狀況，維持資料正確性，利於進一步的分析
            </p>

            <div class="img-items text-left">
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/effect-item-1.png"
                    srcset="/assets/intro/effect-item-1@2x.png"
                    width="120"
                  />
                </div>
                <div class="content">
                  掌握進度
                </div>
              </div>
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/effect-item-2.png"
                    srcset="/assets/intro/effect-item-2@2x.png"
                    width="120"
                  />
                </div>
                <div class="content">
                  連拍補齊
                </div>
              </div>
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/effect-item-3.png"
                    srcset="/assets/intro/effect-item-3@2x.png"
                    width="120"
                  />
                </div>
                <div class="content">
                  自動檢核
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="professional">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-5">
            <h2 class="text-green">
              <big>專業</big><br />
              標準化的資料處理
            </h2>
            <p class="desp">
              規範資料格式，讓所有資料能在Camera
              Trap上輕鬆整合，有效串接資料與共享。平台上提供資料篩選功能，能讓您在資料中依自行設定之條件篩選出所需資料，進一步做學術分析。另外，Camera
              Trap也提供簡易計算功能，您可以直接對平台上的資料進行「有效照片與目擊事件」及「初測延遲」等計算！
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="img-items text-right">
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/pro-item-1.png"
                    srcset="/assets/intro/pro-item-1@2x.png"
                  />
                </div>
                <div class="content">篩選提煉資料</div>
              </div>
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/pro-item-2.png"
                    srcset="/assets/intro/pro-item-2@2x.png"
                  />
                </div>
                <div class="content">線上計算</div>
              </div>
              <div class="item">
                <div class="image">
                  <img
                    src="/assets/intro/pro-item-3.png"
                    srcset="/assets/intro/pro-item-3@2x.png"
                  />
                </div>
                <div class="content">留存共享</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="demo text-center">
      <div class="container">
        <h1 class="text-green">
          Camera Trap
          <br />
          <small>簡易操作，高效管理，輕鬆串連</small>
        </h1>
        <div class="my-5">
          <img
            src="/assets/intro/demo-img.png"
            width="903"
            srcset="/assets/intro/demo-img@2x.png"
          />
        </div>

        <a class="btn btn-orange btn-lg" @click="handleClickStartUse">
          立即開始使用
        </a>
      </div>
      <login-modal :open="loginModalOpen" @close="loginModalOpen = false" />
    </section>
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-4 text-center pt-4">
            <img
              src="/assets/intro/footer-logo.png"
              class="logo"
              srcset="/assets/intro/footer-logo@2x.png"
            />
            <div class="mt-2">
              <small class="text-gray">
                Copyright © 2018 Forestry Bureau<br />
                行政院農業委員會林務局 版權所有
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-8">
            <div class="sitemap">
              <div class="item">
                <label class="text-gray">相關連結</label>
                <ul>
                  <li>
                    <a href="//www.forest.gov.tw" target="_blank">
                      林務局網站
                    </a>
                  </li>
                  <li>
                    <a href="//tesri.tesri.gov.tw" target="_blank">
                      特有生物研究保育中心
                    </a>
                  </li>
                  <li>
                    <a href="http://taibif.tw" target="_blank">
                      台灣生物多樣性資訊入口網
                    </a>
                  </li>
                </ul>
              </div>
              <div class="item">
                <label class="text-gray">幫助</label>
                <ul>
                  <li>
                    <a href="/article.html#/faq" target="_blank">
                      常見問題
                    </a>
                  </li>
                  <li>
                    <a href="/article.html#/privacy-policy" target="_blank">
                      隱私權聲明及使用條款
                    </a>
                  </li>
                </ul>
              </div>
              <div class="item">
                <label class="text-gray">聯絡我們</label>
                <ul>
                  <li>
                    <a href="mailto:TaiBIF@gmail.com" target="_blank">
                      <i class="icon icon-mail-gray"></i>
                      <span class="text">TaiBIF@gmail.com</span>
                    </a>
                  </li>
                  <li>
                    <a href="tel:+886227899621" target="_blank">
                      <i class="icon icon-phone-gray"></i>
                      <span class="text">02-27899621</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-12">
            <hr />
            <small class="text-center d-block">
              <span class="text-gray">主辦機關：</span>
              <span class="gov-item">
                <img
                  class="gov-logo"
                  src="/assets/intro/logo-forest.png"
                  srcset="/assets/intro/logo-forest@2x.png"
                />
                <span class="text">
                  <small>行政院農委會</small>
                  林 務 局
                </span>
              </span>
              <span class="gov-item">
                <img
                  class="gov-logo"
                  src="/assets/intro/logo-tesri.png"
                  srcset="/assets/intro/logo-tesri@2x.png"
                />
                <span class="text">
                  <small>行政院農委會</small>
                  特有生物研究保育中心
                </span>
              </span>
              <span class="gov-item">
                <img
                  class="gov-logo"
                  src="/assets/intro/logo-taibif.png"
                  srcset="/assets/intro/logo-taibif@2x.png"
                />
                <span class="text">
                  台灣生物多樣性資訊入口網
                </span>
              </span>
            </small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { Carousel3d, Slide } from 'vue-carousel-3d';
import {
  // LCircle,
  LCircleMarker,
  // LControl,
  LGeoJson,
  // LIconDefault,
  // LLayerGroup,
  LMap,
  // LMarker,
  // LPolygon,
  // LPopup,
  LTileLayer,
  LTooltip,
} from 'vue2-leaflet';
import { createNamespacedHelpers } from 'vuex';
import { latLng } from 'leaflet';
import $ from 'jquery';
import LoginModal from '@/components/Modal/LoginModal';
import veBar from 'v-charts/lib/bar.common.min';
import veHistogram from 'v-charts/lib/histogram.common.min';
import vePipe from 'v-charts/lib/pie.common.min';
import 'echarts/lib/chart/line';
import 'leaflet/dist/leaflet.css';
const account = createNamespacedHelpers('account');

const regionData = {
  totalProject: 75,
  totalCameraLocation: 537,
  totalIdentifiedSpecies: 65,
  totalPictrue: 3076233,
  totalCameraWorkHour: 3479760,
  species: ['山羌', '台灣藍鵲', '水鹿', '獼猴'],
};
const regionDataString = {
  totalProject: '計畫總數',
  totalCameraLocation: '相機位置',
  totalIdentifiedSpecies: '總辨識進度',
  totalPictrue: '總相片數',
  totalCameraWorkHour: '相機總工時',
  species: '出現物種',
};

export default {
  components: {
    LoginModal,
    Carousel3d,
    Slide,
    veBar,
    vePipe,
    veHistogram,
    LGeoJson,
    // LIconDefault,
    // LCircle,
    // LControl,
    // LLayerGroup,
    LCircleMarker,
    LMap,
    // LPopup,
    // LMarker,
    // LPolygon,
    LTileLayer,
    LTooltip,
  },
  data() {
    this.dataCountSettings = {
      showLine: ['照片累積張數(萬)'],
    };
    this.funderRatioSettings = {
      radius: 65,
      label: {
        formatter: '{b}\n{c}',
      },
      labelLine: {
        length: 5,
        length2: 5,
      },
    };
    return {
      locations: [],
      map: {
        // none, region, studyArea,
        mode: 'none',
        region: {
          name: '',
          event: {},
        },
        studyArea: {
          name: '',
        },
      },
      mapOptions: {
        zoomControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        touchZoom: false,
        dragging: false,
      },
      controlableMapOptions: {
        zoomControl: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        touchZoom: true,
        dragging: true,
      },
      geoOptions: {
        style: {
          color: 'white',
          fillColor: '#7C9C2D',
        },
        weight: 1.2,
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: e => {
              if (this.map.region.name !== feature.properties.name) {
                e.target.setStyle({
                  fillColor: 'green',
                });
              }
            },
            mouseout: e => {
              if (this.map.region.name !== feature.properties.name) {
                e.target.setStyle({
                  fillColor: '#7C9C2D',
                });
              }
            },
            click: e => {
              this.map.mode = 'region';
              const rand = n => {
                let max = n + 0.1;
                let min = n - 0.1;
                return Math.random() * (max - min) + min;
              };
              if (this.map.region.event.target) {
                this.map.region.event.target.setStyle({
                  fillColor: '#7C9C2D',
                });
              }
              e.target.setStyle({
                fillColor: '#7CEC2D',
              });
              Object.assign(this.map.region.event, {}, e);
              this.map.region.name = feature.properties.name;
              const locations = [];
              for (let i = 0; i < 10; i++) {
                locations.push({
                  id: i,
                  latlng: latLng(rand(e.latlng.lat), rand(e.latlng.lng)),
                  text: `玉里站${i} <br/>
                  ${i * 10}個相機位置，${i * 1.5}萬筆資料`,
                });
              }
              this.locations = locations;
              console.log(this.locations);
              // fetch api
            },
          });
        },
      },
      geojson: {
        features: [],
        type: 'FeatureCollection',
      },
      zoom: 9,
      url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      bounds: null,
      center: {
        lat: 23.5,
        lng: 121.2,
      },
      loginModalOpen: false,
      slides: 7,
      funderRatio: {
        columns: ['funder', 'funderCount'],
        rows: [
          { funder: '林務局', funderCount: 750 },
          { funder: '玉山國家公園', funderCount: 100 },
          { funder: '太魯閣國家公園', funderCount: 50 },
          { funder: '特有生物研究保育中心', funderCount: 120 },
        ],
      },
      histogramData: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
          { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
          { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 },
        ],
      },
      dataCount: {
        columns: ['year', '照片累積張數(萬)', '相機位置數'],
        rows: [
          { year: '101', '照片累積張數(萬)': 30, 相機位置數: 40 },
          { year: '102', '照片累積張數(萬)': 40, 相機位置數: 50 },
          { year: '103', '照片累積張數(萬)': 70, 相機位置數: 70 },
          { year: '104', '照片累積張數(萬)': 150, 相機位置數: 160 },
          { year: '105', '照片累積張數(萬)': 200, 相機位置數: 210 },
          { year: '106', '照片累積張數(萬)': 250, 相機位置數: 270 },
          { year: '107', '照片累積張數(萬)': 300, 相機位置數: 360 },
        ],
      },
      speciesLocationCount: {
        columns: ['species', '分佈位置數'],
        rows: [
          { species: '山羌', 分佈位置數: 152 },
          { species: '鼬獾', 分佈位置數: 144 },
          { species: '獼猴', 分佈位置數: 140 },
          { species: '白鼻心', 分佈位置數: 124 },
          { species: '野豬', 分佈位置數: 114 },
          { species: '食蟹獴', 分佈位置數: 113 },
        ],
      },
      speciesPictureCount: {
        columns: ['species', '照片張數(萬)'],
        rows: [
          { species: '山羌', '照片張數(萬)': 165 },
          { species: '鼬獾', '照片張數(萬)': 140 },
          { species: '獼猴', '照片張數(萬)': 160 },
          { species: '白鼻心', '照片張數(萬)': 50 },
          { species: '野豬', '照片張數(萬)': 65 },
          { species: '食蟹獴', '照片張數(萬)': 35 },
        ],
      },
      regionData,
      regionDataString,
    };
  },
  watch: {
    'map.mode': function(mode) {
      // if (mode === 'none') {
      // } else if (mode === 'region') {
      // } else if (mode === 'studyArea') {
      // }
      return mode;
    },
  },
  computed: {
    ...account.mapGetters(['isLogin']),
  },
  methods: {
    handleStudyAreaClick({ id, ...l }) {
      this.map.mode = 'studyArea';
      console.log('==', this.map.mode);
      // 進入花蓮
      console.log('-id', id);
      this.map.studyArea.name = id;
      this.center = {
        lat: l.latlng.lat,
        lng: l.latlng.lng,
      };
    },
    click() {},
    zoomUpdated(e) {
      this.zoom = e;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    handleClickStartUse() {
      if (this.isLogin) {
        this.$router.push({ name: 'projectOverview' });
      } else {
        this.loginModalOpen = true;
      }
    },
    backTo(mode) {
      this.map.mode = mode;
    },
  },
  async created() {
    $.getJSON(
      'https://raw.githubusercontent.com/g0v/twgeojson/master/json/twCounty2010.geo.json',
      {},
      geojson => (this.geojson = geojson),
    );
  },
};
</script>
<style lang="sass" scoped>
/*.leaflet-pane*/
/*  .leaflet-tooltip-pane*/
/*    .leaflet-tooltip*/

/*      &.leaflet-tooltip-top*/


/*        &:before*/
</style>
