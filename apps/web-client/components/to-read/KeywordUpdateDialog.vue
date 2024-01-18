<script setup lang="ts">
const { toRead } = defineProps<{ toRead: ToReadDto }>()

const { data: keywordsData, isLoading: loadingKeywords } = useToReadKeywordsPaginatedQuery()
const { isError, error, isSuccess, mutate: updateToRead } = useUpdateToReadMutation()

const dialog = ref(false)
const errorSnackbar = ref(false)

const editedItem = ref<CreateToReadDto>({
  discord_id: toRead.name,
  name: toRead.name,
  url: toRead.url,
  tags: [],
})

// TODO: fix dialog state reset on close without confirm
const resetEditedItem = () => {
  const keywords = keywordsData.value?.results.filter(
    result => toRead.tags && toRead.tags.includes(result.tag)
  ).map(result => result.id) || []

  editedItem.value = {
    discord_id: toRead.discord_id,
    name: toRead.name,
    url: toRead.url,
    tags: keywords
  }
}

const cancel = () => {
  dialog.value = false
  resetEditedItem()
}

const update = () => {
  dialog.value = false
  updateToRead({
    id: toRead.id,
    readed: toRead.readed,
    ...editedItem.value,
  })
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
        <v-icon size="large" v-bind="props">
            mdi-pencil
        </v-icon>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">New To-Read-Keyword</span>
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
                multiple
                chips
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
        <v-btn color="blue-darken-1" variant="text" @click="update">
          Update
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
