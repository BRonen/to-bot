<script setup lang="ts">
const drawer = reactive({
  open: false
})
</script>
<template>
  <v-layout>
    <v-app-bar scroll-behavior="hide" color="primary" flat :rounded="false" density="default">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer.open = !drawer.open" />
      <v-toolbar-title>
        <NuxtLink to="/" class="text-decoration-none text-white">
          To-Bot
        </NuxtLink>
      </v-toolbar-title>
      <v-spacer />

      <!-- <v-btn variant="text" icon="mdi-magnify" />
      <v-btn variant="text" icon="mdi-filter" />
      <v-btn variant="text" icon="mdi-dots-vertical" /> -->
    </v-app-bar>
    <v-navigation-drawer v-model="drawer.open" location="left" temporary>
      <v-list>
        <v-list-item
          prepend-icon="mdi-book-open-page-variant-outline"
          title="To-Read"
          to="/to-read"
          router
        />
        <v-list-group value="To-Do">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-order-bool-ascending-variant"
              title="To-Do"
            />
          </template>
          <v-list-item prepend-icon="mdi-account-circle" title="Bar" to="/bar" router />
        </v-list-group>
        <v-list-group value="To-Project">
          <template #activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-draw" title="To-Project" />
          </template>
          <v-list-item prepend-icon="mdi-account-circle" title="Bar" to="/bar" router />
        </v-list-group>
        <v-list-group value="To-Pay">
          <template #activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-cash-clock" title="To-Pay" />
          </template>
          <v-list-item prepend-icon="mdi-account-circle" title="Bar" to="/bar" router />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-main style="min-height: 100vh; margin: 0 auto;">
      <slot />
    </v-main>
  </v-layout>
</template>
