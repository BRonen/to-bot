<script setup lang="ts">
const { id } = defineProps<{ id: number }>()

const { isError, error, isSuccess, mutate: deleteToReadKeyword } = useDeleteToReadKeywordMutation()

const dialog = ref<boolean>(false)
const errorSnackbar = ref(false)

const cancel = () => { dialog.value = false }

const confirm = () => deleteToReadKeyword(id)

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
      <v-icon size="large" class="mr-2" v-bind="props">
        mdi-delete
      </v-icon>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">New To-Read-Keyword</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          Deleting To-Read-Keyword #{{ id }}
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue-darken-1" variant="text" @click="cancel">
          Cancel
        </v-btn>
        <v-btn color="red-darken-1" variant="text" @click="confirm">
          Delete
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
