<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
</script>

<template>
  <div class="main-layout">
    <AppHeader />
    <main class="content">
      <router-view /> 
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
}
</style>