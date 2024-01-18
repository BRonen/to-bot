<script setup lang="ts">
const dayjs = useDayjs()

const { data: toReadKeywordsData, isLoading: loadingToReadKeywords } = useToReadKeywordsPaginatedQuery()

type Header = { title: string, key: string, sortable: boolean, align?: 'end' | 'center' } 
const headers: Header[] = [
  {
    title: 'Id',
    key: 'id',
    sortable: false
  },
  {
    title: 'Tag',
    key: 'tag',
    sortable: false,
  },
  {
    title: 'Created at',
    key: 'created_at',
    sortable: false,
    align: 'end'
  },
  {
    title: 'Updated at',
    key: 'updated_at',
    sortable: false,
    align: 'end'
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    align: 'end',
  }
]

const newItemDialog = ref(false)
const defaultItem = ref(undefined)
</script>
<template>
  <v-data-table
    :headers="headers"
    :items="toReadKeywordsData?.results"
    :total-items="toReadKeywordsData?.total"
    :loading="loadingToReadKeywords"
  >
    <template #top>
      <v-toolbar flat>
        <slot name="tooltip" />

        <v-divider class="mx-4" inset vertical />
        <v-spacer />

        <to-read-keyword-create-dialog v-model="newItemDialog" v-model:defaul-item="defaultItem" />
      </v-toolbar>
    </template>
    <template #item.tag="{ item }">
      <v-chip>
        {{ item.tag }}
      </v-chip>
    </template>
    <template #item.created_at="{ item }">
      {{ dayjs(item.created_at).format('YYYY/MM/DD HH:mm:ss') }}
    </template>
    <template #item.updated_at="{ item }">
      {{ dayjs(item.updated_at).format('YYYY/MM/DD HH:mm:ss') }}
    </template>
    <template #item.actions="{ item }">
      <to-read-keyword-delete-dialog :id="item.id"></to-read-keyword-delete-dialog>
    </template>
  </v-data-table>
</template>
