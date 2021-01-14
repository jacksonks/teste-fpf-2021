<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-data-table
            :headers="headers"
            :items="desserts"
            class="elevation-3"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Projetos</v-toolbar-title>
              <v-divider
                  class="mx-4"
                  inset
                  vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog
                  v-model="dialog"
                  max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon left>add</v-icon>
                    Novo Projeto
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.name"
                              label="Nome"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.risk"
                              label="Risco"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.startDate"
                              label="startDate"
                              v-mask="'##/##/####'"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.endDate"
                              label="endDate"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.money"
                              label="money (g)"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1" left
                        @click="close"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        @click="save"
                        :disabled="formValidade"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                    class="mr-3"
                    color="success"
                    @click="editItem(item)"
                    v-bind="attrs"
                    v-on="on"
                >
                  monetization_on
                </v-icon>
              </template>
              <span>Simular Investimento</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                    class="mr-3"
                    color="warning"
                    @click="editItem(item)"
                    v-bind="attrs"
                    v-on="on"
                >
                  edit
                </v-icon>
              </template>
              <span>Editar</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                    color="error"
                    @click="deleteItem(item)"
                    v-bind="attrs"
                    v-on="on"
                >
                  delete
                </v-icon>
              </template>
              <span>Deletar</span>
            </v-tooltip>
          </template>

          <template v-slot:item.risk="{ item }">
            <v-chip
                :color="getColor(item.risk)"
                dark
            >
              {{ item.risk == 0 ? 'Baixo' : item.risk == 1 ? 'Médio' : 'Alto'  }}
            </v-chip>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mask} from "vue-the-mask";
export default {
  name: "Projects",
  directives: { mask },
    data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Nome', value: 'name', align: 'start', sortable: false },
      { text: 'Date', value: 'startDate', align: 'center', sortable: false },
      { text: 'Date', value: 'endDate', align: 'center', sortable: false },
      { text: 'Valor do Projeto', value: 'money', align: 'center', sortable: false },
      { text: 'Risco', value: 'risk', align: 'center', sortable: false },

      { text: 'Actions', value: 'actions', align: 'center', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: undefined,
      risk: undefined,
      startDate: undefined,
      endDate: undefined,
      money: undefined,
    },
    defaultItem: {
      name: undefined,
      risk: undefined,
      startDate: undefined,
      endDate: undefined,
      money: undefined,
    },
  }),
  created () {
    this.initialize()
  },
  computed: {
    formValidade(){
      return this.name
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Project' : 'Edit Project'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  methods: {
    initialize () {
      this.desserts = [
        {
          name: 'A',
          risk: 0,
          startDate: '27/01/1995',
          endDate: '27/01/1995',
          money: 2.000,
        },
        {
          name: 'B',
          risk: 1,
          startDate: '27/01/1995',
          endDate: '27/01/1995',
          money: 5.000,
        },
        {
          name: 'C',
          risk: 2,
          startDate: '27/01/1995',
          endDate: '27/01/1995',
          money: 4.000,
        },
        {
          name: 'A',
          risk: 0,
          startDate: '27/01/1995',
          endDate: '27/01/1995',
          money: 2.000,
        },
        {
          name: 'B',
          risk: 1,
          startDate: '27/01/1995',
          endDate: '27/01/1995',
          money: 5.000,
        },
        {
          name: 'C',
          risk: 2,
          startDate: '27/01/1995',
          endDate: '27/01/1995',
          money: 4.000,
        },
      ]
    },

    getColor (risk) {
      if (risk === 2) return 'red'
      else if (risk === 1) return 'orange'
      else return 'green'
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>