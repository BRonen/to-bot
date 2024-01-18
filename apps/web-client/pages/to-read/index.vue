<script setup lang="ts">
const tab = ref<'to-read' | 'to-read-keyword'>('to-read')
</script>
<template>
  <to-read-data-table v-if="tab === 'to-read'">
    <template #tooltip>
      <v-tabs v-model="tab">
        <v-tab value="to-read">
          To-Read
        </v-tab>
        <v-tab value="to-read-keyword">
          To-Read-Keyword
        </v-tab>
      </v-tabs>
    </template>
  </to-read-data-table>
  <to-read-keyword-data-table v-else-if="tab === 'to-read-keyword'">
    <template #tooltip>
      <v-tabs v-model="tab">
        <v-tab value="to-read">
          To-Read
        </v-tab>
        <v-tab value="to-read-keyword">
          To-Read-Keyword
        </v-tab>
      </v-tabs>
    </template>
  </to-read-keyword-data-table>
</template>
