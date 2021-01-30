<template>
  <div class="relative flex overflow-hidden cityImg" style="min-height: 56vh;">
    <div class="lg:block lg:absolute lg:inset-0 hidden">
      <span class="left-1/2 absolute top-1/3 transform translate-x-64">
        <svg width="640">
        </svg>
        <figure class="-translate-x-1/2 absolute inset-0 flex items-center transform">
          <img src="https://images.wallpapersden.com/image/download/low-poly-city-block_a2tuaGWUmZqaraWkpJRobWllrWdma2U.jpg"/>
        </figure>
      </span>
    </div>

    <BaseContainer class="md:py-16 lg:py-20 w-full h-full py-12 my-auto">
      <div class="lg:hidden z-0 mb-8">
          <figure class="translate-x-1/4 translate-y-1/12 transform">
            <ShoppingCart class="h-72 w-auto -mt-20" />
          </figure>
      </div>

      <div class="lg:w-1/2 lg:h-full relative z-10 flex flex-col justify-center">

        <ClientOnly>
          <h2 class="sm:text-4xl sm:leading-10 flex flex-col text-3xl font-extrabold leading-9 tracking-tight">
            <span style="color: #ffffff">Need <vue-typer style="color: white" :text="items" :shuffle="true" initialAction="erasing" />?</span>
            <span style="color: #bb86fc">{{ $t && $t('components.HeroSearch.title')[1] }}</span>
            <!-- <span class="text-blue-600">Optimise your supermarket &amp; pharmacy visit during the COVID-19 quarantine.</span> -->
          </h2>
        </ClientOnly>
        <p class="mt-3 text-lg leading-7 text-gray-500">{{ $t && $t('components.HeroSearch.description') }}</p>

        <form class="owl:ml-3 flex mt-8" @submit.prevent="handleSubmit">
          <SiteNavigationSearch class="sm:max-w-xs" size="xl" placeholder="Enter your ZIP Code" />
          <div class="flex-shrink-0">
            <BaseButton class="shadow" size="xl" type="submit">Search</BaseButton>
          </div>
        </form>

        <transition v-bind="transitions.zoom">
          <div v-show="suggestions.length" class="mt-8">
            <dl class="owl:mt-2 owl:mr-2 flex flex-wrap text-sm">
              <dt class="w-full mb-1 text-gray-500">Suggestions</dt>
              <dd v-for="(suggestion, index) in suggestions" :key="index" class="font-medium leading-5">
                <g-link :to="$tp && $tp(`/shops?q=${suggestion}`)"
                  class="focus:outline-none focus:shadow-outline inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800"
                >
                  {{ suggestion }}
                </g-link>
              </dd>
            </dl>
          </div>
        </transition>

      </div>
    </BaseContainer>

  </div>
</template>

<script>
import { SearchIcon } from 'vue-feather-icons'

import { transitions } from '~/mixins/Transitions'
import BaseContainer from '~/components/base/BaseContainer'
import BaseButton from '~/components/base/BaseButton'
import BaseInput from '~/components/base/BaseInput'
import ShoppingCart from '~/components/icon/ShoppingCart'
import SiteNavigationSearch from '~/components/site/SiteNavigationSearch'

export default {
  name: 'HeroSearch',
  mixins: [transitions],
  components: {
    SearchIcon,
    BaseContainer, BaseButton, BaseInput,
    ShoppingCart, SiteNavigationSearch,
    VueTyper: () =>
      import ('vue-typer')
      .then(m => m.VueTyper)
      .catch(),
  },
  data () {
    return {
      searchTerm: '',
      items: ['toilet paper', 'lunch', 'drinks', 'shopping', 'breakfast'],
      cities: new Set(),
      postitions: new Set(),
      zipcodes: new Set(),
    }
  },
  computed: {
    suggestions () {
      return [ ...this.zipcodes, ...this.postitions, ...this.cities ]
    },
  },
  methods: {
    handleSubmit (event) {
      this.$router.push({
        path: 'shops',
        query: { q: this.searchTerm },
      })
    },
  },
  mounted () {
    fetch('/api/userGeo')
      .then((response) => response.json())
      .then((data) => data.forEach((res) => {
        this.cities = new Set(this.cities.add(res.city))
        this.postitions = new Set(this.postitions.add(`${res.longitude},${res.latitude}`))
        this.zipcodes = new Set(this.zipcodes.add(res.postal))
      }))
  },
}
</script>

<style lang="css">
img {
  /*transform: scaleX(-1);*/
  max-width: 160% !important;
}
.cityImg {
  background: rgb(18,18,18);
  background: linear-gradient(100deg, rgba(18,18,18,1) 0%, rgba(19,9,22,1) 50%, rgba(17,11,25,1) 100%);
}

.vue-typer {
  font-family: monospace;
}

.vue-typer .custom.char {
  color: #ffffff;
  background-color: #121212;
}
.vue-typer .custom.char.selected {
  background-color: #3700b3;
}

.vue-typer .custom.caret {
  width: 10px;
  background-color: #3700b3;
}
</style>
