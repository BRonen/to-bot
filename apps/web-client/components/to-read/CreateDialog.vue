<script setup lang="ts">
const { data: keywordsData, isLoading: loadingKeywords } = useToReadKeywordsPaginatedQuery()
const { isError, error, isSuccess, mutate: createToRead } = useNewToReadMutation()

const dialog = defineModel<boolean>()
const defaultItem = defineModel<ToReadDto | undefined>('defaulItem')
const errorSnackbar = ref(false)

// TODO: fix to read create with tags

const editedItem = ref<CreateToReadDto>({
  discord_id: '',
  name: '',
  url: '',
  tags: []
})

const resetEditedItem = () => {
  const tags = defaultItem.value?.tags
  const keywords = keywordsData.value?.results.filter(
    result => tags && tags.includes(result.tag)
  ).map(result => result.id) || []

  editedItem.value = {
    discord_id: '',
    name: defaultItem.value?.name || '',
    url: defaultItem.value?.url || '',
    tags: keywords
  }
}

watch([defaultItem], resetEditedItem)

const cancel = () => {
  dialog.value = false
  resetEditedItem()
}

const save = () => {
  dialog.value = false
  createToRead(editedItem.value)
  resetEditedItem()
}

watch([isError], () => {
  if (!isError) { return }

  errorSnackbar.value = true
})

watch([isSuccess], () => {
  if (!isSuccess.value) { return }

  dialog.value = false
})
</script>
<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ props }">
      <v-btn color="primary" dark class="mb-2" v-bind="props">
        New
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">New To-Read</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="editedItem.name" label="Name" />
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field v-model="editedItem.url" label="Url" />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="editedItem.tags"
                :items="keywordsData?.results"
                :loading="loadingKeywords"
                item-title="tag"
                item-value="id"
                label="Tags"
                single-line
                chips
                multiple
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue-darken-1" variant="text" @click="cancel">
          Cancel
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="save">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="errorSnackbar" :timeout="3000">
    {{ error }}

    <template #actions>
      <v-btn color="blue" variant="text" @click="errorSnackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
