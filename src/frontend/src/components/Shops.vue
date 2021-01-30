<template>
  <div class="md:flex-row flex flex-col-reverse flex-1" style="background-color: #222222">

    <div class="owl:mt-5 bg-gray-50 z-10 flex-grow w-full max-w-lg p-5 pt-0 border-r border-white-300 shadow">
      <header class="relative sticky top-0 z-10 -mx-5">
        <div class="bg-gray-50 md:p-5 z-10 flex items-center justify-between px-4 py-3 border-b border-white-200">
          <div class="owl:ml-2 flex">
            <h2 class="sm:text-3xl sm:leading-9 sm:truncate text-2xl font-bold leading-7 text-gray-900">Closest
              Location</h2>
            <p class="sm:text-3xl sm:leading-9 sm:truncate text-2xl font-bold leading-7 text-blue-600"
               :class="[loading && 'spinner']">{{ Object.keys(filteredShops).length + 1 }}</p>
          </div>
          <div class="owl:ml-2 flex">
            <BaseButton @click.native="showFilters = !showFilters" variant="secondary" size="sm">
              <template slot="icon">
                <FilterIcon class="w-5 h-5 stroke-current"/>
              </template>
              Filter Shops
            </BaseButton>
          </div>
        </div>
        <div v-if="showFilters"
             class="top-full md:p-5 bg-gray-50 absolute inset-x-0 z-0 w-full px-4 py-3 border-b border-gray-200">
          <dl class="owl:mt-6">
            <div class="grid grid-cols-3 gap-2">
              <dt class="w-full col-span-3">
                <div class="text-sm font-medium text-gray-400 uppercase">Type of Store</div>
              </dt>
              <dd class="flex items-start w-full col-span-1" v-for="(label, key) in shopTypes" :key="key">
                <div class="absolute flex items-center h-5">
                  <input v-model="shopTypeTerms" :value="key" :id="key" type="checkbox"
                         class="form-checkbox w-4 h-4 text-blue-600 transition duration-150 ease-in-out"/>
                </div>
                <div class="pl-7 text-sm leading-5">
                  <label :for="key" class="text-gray-600">{{ label }}</label>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </header>
      <div v-if="!shops && loading" class="m-auto text-center">Loading…</div>
      <div v-else class="owl:mt-5">
        <ShopCard
            id="000000"
            :shop="csLab"
            @flyTo="$refs.map.flyTo($event)"
            @bookTime="isBooking = $event"
        />
        <ShopCard
            :key="shop.id"
            v-for="shop in sortedShops"
            :id="String(shop.id)"
            :shop="shop"
            @flyTo="$refs.map.flyTo($event)"
            @bookTime="isBooking = $event"
        />
      </div>
    </div>

    <div class="aspect-ratio-16/9 md:aspect-ratio-none relative sticky top-0 w-full max-h-screen">
      <div class="md:static absolute inset-0 w-full h-full">
        <ShopsMap v-if="userLocation" ref="map" :shops="filteredShops" :center="userLocation"
                  @move="changeCenter($event)"/>
      </div>
    </div>

    <ClientOnly>
      <ShopsBookTime :open="isBooking" @close="isBooking = false"/>
    </ClientOnly>

  </div>
</template>

<script>
import distance from '@turf/distance'
import {FilterIcon} from 'vue-feather-icons'

export default {
  name: 'Shops',
  components: {
    FilterIcon,
    BaseButton: () => import('~/components/base/BaseButton'),
    ShopCard: () => import('~/components/ShopCard'),
    ShopsMap: () => import('~/components/ShopsMap'),
    ShopsBookTime: () => import('~/components/ShopsBookTime'),
  },
  props: [
    'shops',
    'loading',
    'userLocation',
  ],
  data() {
    return {
      csLab: {
        geometry: {
          coordinates: [22.340567299261917, 114.17479826104316],
          type: "Point"
        },
        id: 23232249842,
        properties: {
          category_en: "School",
          'category_zh-Hans': "學校",
          class: "cs_lab",
          filterrank: 1,
          iso_3166_1: "HK",
          iso_3166_2: "CN-91",
          maki: "school",
          name: "Computer Science Lab",
          name_script: "Han",
          sizerank: 16,
          tilequery: {
            distance: 2.7644259714088,
            geometry: "point",
            layer: "poi_label"
          },
          type: "School",
        },
        type: "Feature"
      },
      isBooking: false,
      mapCenter: null,
      showFilters: false,
      shopTypeTerms: ['food_and_drink_stores', 'medical', 'cs_lab'],
      shopTypes: {
        food_and_drink_stores: 'Food Stores',
        medical: 'Pharmacies',
        hospital: 'Hospital',
      },
      // itemTerms: [],
      // items: [
      //     'Fruit', 'Vegetables', 'Rice', 'Pasta', 'Bread', 'Flour', 'Yeast',
      //     'Toilet Paper', 'Hand Sanitiser', 'Cleaning Products',
      // ],
    }
  },
  computed: {
    filteredShops() {
      return Object.values(this.shops)
          .filter((shop) => {
            console.log("SHOP", shop)
            return this.shopTypeTerms.includes(shop.properties.class)
          })
    },
    sortedShops() {
      return this.sortedShopsBy(this.mapCenter || this.userLocation)
    }
  },
  methods: {
    changeCenter(center) {
      this.mapCenter = center
      this.$emit('changeCenter', center)
    },
    sortedShopsBy(center = []) {
      const distanceFromCenter = (coords) => distance(coords, center)
      return this.filteredShops
          .map((shop) => ({...shop, distance: distanceFromCenter(shop.geometry.coordinates)}))
          .sort((a, b) => a.distance - b.distance)
    },
  },
}
</script>

<style lang="postcss" scoped>
header,
.max-h-screen {
  top: 56px;

@screen md {
  top: 64px;
}
}

.max-h-screen {
  max-height: calc(100vh - 56px);

@screen md {
  height: calc(100vh - 64px);
}
}
</style>
