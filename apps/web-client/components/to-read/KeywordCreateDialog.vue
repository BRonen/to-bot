<script setup lang="ts">
const { isError, error, isSuccess, mutate: createToReadKeyword } = useNewToReadKeywordsMutation()

const dialog = defineModel<boolean>()
const defaultItem = defineModel<ToReadKeywordDto | undefined>('defaulItem')

const editedItem = ref<CreateToReadKeywordDto>({ tag: '' })
const errorSnackbar = ref(false)

// TODO: implement edit dialog on to read keywords

const resetEditedItem = () => {
  editedItem.value = {
    tag: defaultItem.value?.tag || ''
  }
}

watch([defaultItem], resetEditedItem)

const cancel = () => {
  dialog.value = false
  resetEditedItem()
}

const save = () => {
  createToReadKeyword(editedItem.value)
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
        <span class="text-h5">New To-Read-Keyword</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="editedItem.tag" label="Tag" />
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
