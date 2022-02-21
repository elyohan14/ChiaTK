<template>
  <q-page>
    <q-card class="q-pa-sm">
      <q-card class="text-primary">
        <q-card-section>
          <div class="row">
            <div class="col-md-11">
              <div class="text-h4"><b>{{ title }}</b></div>
              <div class="text-subtitle1"><b>{{ subtitle }}</b></div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card-section class="q-pa-sm row">
        <q-card
          flat
          class="q-pa-sm row q-gutter-sm"
          style="width: 100%;"
        >
          <div class="col-xs-12 offset-sm-3 col-sm-6 offset-md-4 col-md-4">
            <q-input
              v-model="form.title"
              label="Título"
              placeholder="iPhone X"
              :error="v$.title.$error"
              error-message="Ingrese un título"
              @blur="v$.title.$touch()"
              outlined
              autofocus
            />
          </div>
          <div class="col-xs-12 offset-sm-3 col-sm-6 offset-md-4 col-md-4">
            <q-input
              type="textarea"
              color="primary"
              label="Descripción"
              :error="v$.description.$error"
              error-message="Ingrese una descripción"
              @blur="v$.description.$touch()"
              placeholder="Teléfono celular"
              outlined
              v-model="form.description"
              autogrow
            />
          </div>
          <div class="col-xs-12 offset-sm-3 col-sm-6 offset-md-4 col-md-4">
            <q-input
              type="number"
              v-model="form.stock"
              label="Cantidad en stock"
              placeholder="1"
              :error="v$.stock.$error"
              error-message="Ingrese un cantidad"
              @blur="v$.stock.$touch()"
              outlined
            >
            </q-input>
          </div>
          <div class="col-xs-12 offset-sm-3 col-sm-6 offset-md-4 col-md-4">
            <q-uploader
              @added="fileAdded"
              label="Seleccione una imagen"
              style="width: 100%">
            <template v-if="!form.file" v-slot:list="scope">
              <span v-if="false">{{ scope }}</span>
              <q-list separator>

          <q-item v-if="form.filenamep">
            <!-- <q-item-section>
              <q-item-label class="full-width ellipsis">
                {{ form.filename }}
              </q-item-label>

              <q-item-label caption>
                Status: {{ file.__status }}
              </q-item-label>

              <q-item-label caption>
                {{ file.__sizeLabel }} / {{ file.__progressLabel }}
              </q-item-label>
            </q-item-section> -->

            <q-item-section

            >
              <q-img :src="form.filenamep"/>
            </q-item-section>

            <!-- <q-item-section top side>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="scope.removeFile(file)"
              />
            </q-item-section> -->
          </q-item>

        </q-list>
            </template>
            </q-uploader>

          </div>
          <div class="col-xs-12 offset-sm-3 col-sm-6 offset-md-4 col-md-4">
            <q-btn
              class="full-width"
              label="guardar"
              color="primary"
              size="md"
              @click="save"
            >
              <q-tooltip>
                Guardar producto
              </q-tooltip>
            </q-btn>
          </div>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { api } from 'boot/axios'
import { useRoute, useRouter } from 'vue-router'

const form = ref({})
const title = 'Cards'
const subtitle = 'Nuevo card'
const router = useRouter()
const route = useRoute()
const id = route.params.id

const rules = {
  title: { required },
  description: { required },
  stock: { required }
}

const v$ = useVuelidate(rules, form)

onMounted(() => {
  if (id) {
    getRecord()
  }
})

async function getRecord () {
  api.get(`cards/${id}`).then(({ data }) => {
    console.log({ data })
    form.value = data
  })
}

async function save () {
  console.log(route.params)
  console.log({ id })
  await v$.value.$validate()
  console.log(form.value)

  // Uso el FormData para poder enviar la imagen al backend
  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('description', form.value.description)
  formData.append('stock', form.value.stock)
  if (form.value.file) {
    formData.append('file', form.value.file)
    formData.append('filename', form.value.filename)
  }

  if (!v$.value.$error) { // Si no hay error
    if (!id) { // Si es modo de inserción
      api.post('cards', formData).then(res => {
        router.go(-1)
      })
    } else { // Si es modo de edición
      api.put(`cards/${id}`, formData).then(res => {
        router.go(-1)
      })
    }
  }
}

async function fileAdded (file) {
  form.value.file = null
  form.value.filename = null

  form.value.file = file[0]
  form.value.filename = file[0].name
  console.log(form.value)
}
</script>
