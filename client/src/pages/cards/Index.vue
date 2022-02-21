<template>
  <q-page>
    <div>
      <q-card
        flat
        class="text-primary"
      >
        <q-card-section>
          <div class="row">
            <div class="col-md-9">
              <div class="text-h4 text-primary"><b>{{ title }}</b></div>
            </div>
            <div
              class="col-md-3"
              style="text-align: right;"
            >
              <q-btn
                class="q-ma-sm"
                round
                icon="add"
                color="primary"
                size="md"
                :to="`${$route.path}/new`"
              >
                <q-tooltip>
                  Nuevo card
                </q-tooltip>
              </q-btn>
              <!-- <q-btn
                class="q-ma-sm"
                round
                icon="get_app"
                color="primary"
                size="md"
                @click="exportTable"
              >
                <q-tooltip>
                  Exportar
                </q-tooltip>
              </q-btn> -->
              <!-- <q-btn
                class="q-ml-sm"
                round
                @click="$q.fullscreen.toggle()"
                :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                color="primary"
                size="md"
              >
                <q-tooltip>
                  Pantalla completa
                </q-tooltip>
              </q-btn> -->
            </div>
            <div class="col-md-2">
              <q-input
                v-model="text"
                placeholder="Buscar"
                @input="getRecords"
                debounce="1000"
                outlined
                dense
              >
                <template v-slot:append>
                  <q-icon
                    v-if="text !== ''"
                    name="close"
                    @click="clearSearch"
                    class="cursor-pointer"
                  />
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pa-sm">
        <q-card
          flat
          bordered
          class="my-card bg-grey-1 q-pa-md q-mt-md"
        >
          <q-card-section class="row">
            <div class="col">
              <b class="text-grey-7">Título</b>
            </div>
            <div class="col">
              <b class="text-grey-7">Descripción</b>
            </div>
            <div class="col">
              <b class="text-grey-7">Stock</b>
            </div>
            <div
              class="col"
              style="text-align: right"
            >
              <b class="text-grey-7">Acciones</b>
            </div>
          </q-card-section>
          <q-separator color="grey-4" />
          <q-card-section
            v-if="!records.length"
            style="text-align: center;"
          >
            <p class="text-grey-6 text-bold">No hay registros para mostrar</p>
          </q-card-section>
          <q-card-section
            class="row"
            v-for="(item, index) in records"
            :key="index"
          >
            <div class="col">
              <p class="text-grey-7">{{ item.title }}</p>
            </div>
            <div class="col">
              <p class="text-grey-7">{{ item.description }}</p>
            </div>
            <div class="col">
              <p class="text-grey-7">{{ item.stock }}</p>
            </div>
            <div
              class="col"
              style="text-align: right"
            >
              <q-btn
                flat
                icon="edit"
                size="sm"
                color="primary"
                :to="`/cards/form/${item.id}`"
                dense
              >
                <q-tooltip>
                  Editar
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                icon="delete"
                size="sm"
                color="primary"
                @click="deleteRecord(item.id)"
                dense
              >
                <q-tooltip>
                  Eliminar
                </q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
          <q-separator color="grey-4" />
          <!-- <div
            v-if="records.length"
            class="q-pa-lg flex flex-center"
          >
            <q-pagination
              v-model="current"
              :max="response.lastPage"
              direction-links
              boundary-links
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
              @input="getRecords"
              boundary-numbers
              :max-pages="6"
            />
          </div> -->
        </q-card>
      </div>
    </div>
    <q-dialog
      v-model="confirm"
      persistent
    >
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            icon="warning"
            color="negative"
            text-color="white"
          />
          <span class="q-ml-sm">Está seguro de eliminar?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            v-close-popup
          />
          <q-btn
            flat
            label="Eliminar"
            color="primary"
            @click="confirmDelete"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const title = 'Cards'
const records = ref([])
const confirm = ref(false)
const text = ref('')
const $q = useQuasar()

onMounted(() => {
  getRecords()
})

async function getRecords () {
  api.get('cards').then(({ data }) => {
    console.log({ data })
    records.value = data
  })
}

async function deleteRecord (id) {
  $q.dialog({
    title: 'Confirmar',
    message: '¿Realmente desea eliminar el registro?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // console.log('>>>> OK')
    api.delete(`cards/${id}`).then(res => {
      getRecords()
      $q.notify({
        message: 'Registro eliminado'
      })
    })
  })
}
</script>
