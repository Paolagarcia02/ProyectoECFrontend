<script setup lang="ts">

import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import LoginView from './views/LoginView.vue'


</script>

<template>

  <div>
    <router-view />
  </div>

</template>

<style scoped>
@import './assets/styles/main.scss';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

main {
  flex: 1;
}
</style>
