<script setup lang="ts">
const dayjs = useDayjs()
const pagination = usePagination()

const { data: toReadsData, isLoading: loadingToReads } = useToReadPaginatedQuery(pagination.page, pagination.pageSize)
const { isError, error, mutate: updateToRead } = useUpdateToReadMutation()
const errorSnackbar = ref(false)

// TODO: add dialog before update to read as readed
// TODO: implement edit dialog on to read

type Header = { title: string, key: string, sortable: boolean, align?: 'end' | 'center' } 
const headers: Header[] = [
  {
    title: 'Id',
    key: 'id',
    sortable: false
  },
  {
    title: 'Name',
    key: 'name',
    sortable: false
  },
  {
    title: 'Url',
    key: 'url',
    sortable: false
  },
  {
    title: 'Readed',
    key: 'readed',
    sortable: false
  },
  {
    title: 'Discord id',
    key: 'discord_id',
    sortable: false,
    align: 'center'
  },
  {
    title: 'Tags',
    key: 'tags',
    sortable: false,
    align: 'center'
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

const markAsReaded = (id: number) => {
  if (!toReadsData.value) { return }

  const updateToReadDto = toReadsData.value.results.find(result => result.id === id)

  if (!updateToReadDto) { return }

  updateToRead({
    id,
    name: updateToReadDto.name,
    url: updateToReadDto.url,
    discord_id: updateToReadDto.discord_id,
    readed: !updateToReadDto.readed
  })
}

watch([isError], () => {
  if (isError) { return }

  errorSnackbar.value = true
})
</script>
<template>
  <v-data-table
    v-model:page="pagination.page"
    :headers="headers"
    :items="toReadsData?.results"
    :items-per-page="pagination.pageSize"
    :total-items="toReadsData?.total"
    :loading="loadingToReads"
  >
    <template #top>
      <v-toolbar flat>
        <slot name="tooltip" />

        <v-divider class="mx-4" inset vertical />
        <v-spacer />

        <to-read-create-dialog v-model="newItemDialog" v-model:defaul-item="defaultItem" />
      </v-toolbar>
    </template>
    <template #item.url="{ item }">
      <a :href="item.url">{{ item.url }}</a>
    </template>
    <template #item.readed="{ item }">
      <span class="w-100 mx-auto d-flex justify-center align-center">
        <v-checkbox :model-value="item.readed" @update:model-value="() => markAsReaded(item.id)" />
      </span>
    </template>
    <template #item.discord_id="{ item }">
      <span class="d-block w-100 text-center">{{ item.discord_id || '-' }}</span>
    </template>
    <template #item.tags="{ item }">
      <span class="d-block w-100 text-center">{{ item.tags || '-' }}</span>
    </template>
    <template #item.created_at="{ item }">
      {{ dayjs(item.created_at).format('YYYY/MM/DD HH:mm:ss') }}
    </template>
    <template #item.updated_at="{ item }">
      {{ dayjs(item.updated_at).format('YYYY/MM/DD HH:mm:ss') }}
    </template>
    <template #item.actions="a">
      <to-read-update-dialog :to-read="a.item"></to-read-update-dialog>
      <to-read-delete-dialog :id="a.item.id"></to-read-delete-dialog>
    </template>
  </v-data-table>

  <v-snackbar v-model="errorSnackbar" :timeout="3000">
    {{ error }}

    <template #actions>
      <v-btn color="blue" variant="text" @click="errorSnackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
