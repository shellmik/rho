<template>
  <Layout style="background-color: #bb86fc;">
    <template slot="bleed">
      <HeroSearch class="bg-white" />
      <HeroFeatures class="bg-gray-50" />
    </template>
  </Layout>
</template>

<script>
import HeroSearch from '~/components/HeroSearch'
import HeroFeatures from '~/components/HeroFeatures'

export default {
  components: { HeroSearch, HeroFeatures },
  metaInfo () {
    return {
      title: this.$t && this.$t('navigation.main.home'),
    }
  },
}
</script>

<style>
body{
  background-color: #bb86fc;
}
</style>
