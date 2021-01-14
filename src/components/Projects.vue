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
                    <span class="headline">{{ formTitle }}</span> <v-spacer /> <v-btn fab text @click="close"> <v-icon>close</v-icon> </v-btn>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" xs="12" sm="12">
                          <v-text-field
                              v-model="editedItem.name"
                              label="Nome"
                              outlined
                              hide-details
                              clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xs="12" sm="12">
                          <span>Risco do Projeto:</span>
                          <v-radio-group
                              v-model="editedItem.risk"
                              row
                              hide-details
                          >
                            <v-radio
                                label="Baixo"
                                :value="0"
                                color="success"
                            ></v-radio>
                            <v-radio
                                label="Medio"
                                :value="1"
                                color="warning"
                            ></v-radio>
                            <v-radio
                                label="Alto"
                                :value="2"
                                color="error"
                            ></v-radio>
                          </v-radio-group>
                        </v-col>
                        <v-col cols="12" xs="12" sm="6">
                          <v-text-field
                              v-model="editedItem.startDate"
                              label="Data de início"
                              placeholder="DD/MM/YYYY"
                              outlined
                              hide-details
                              clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xs="12" sm="6">
                          <v-text-field
                              v-model="editedItem.endDate"
                              label="Data de término"
                              placeholder="DD/MM/YYYY"
                              outlined
                              hide-details
                              clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xs="12" sm="6">
                          <v-text-field
                              v-model="editedItem.money"
                              label="Valor do Projeto"
                              prefix="R$"
                              type="number"
                              outlined
                              hide-details
                              clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xs="12" sm="12">
                          <v-text-field
                              v-model="person"
                              outlined
                              hide-details
                              clearable
                              label="Participante"
                              append-outer-icon="add_circle"
                              @click:append-outer="addPerson()"
                          ></v-text-field>
                        </v-col>

                        <div v-if="editedItem.persons.length > 0">
                          <span>Participantes:</span>
                          <ul>
                            <li v-for="(item, i) in editedItem.persons" :key="i">{{ item }}</li>
                          </ul>
                        </div>

                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer/>
                    <v-btn
                        v-if="editedIndex === -1"
                        color="success"
                        @click="save"
                    >
                      Salvar
                    </v-btn>
                    <v-btn
                        v-else
                        color="warning"
                        @click="edit"
                    >
                      Editar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogDelete" max-width="300">
                <v-card>
                  <v-card-title class="headline">Deletar este Projeto ?</v-card-title>
                  <v-card-actions>
                    <v-btn color="error" text @click="closeDelete">Cancel</v-btn>
                    <v-spacer/>
                    <v-btn color="success" text @click="deleteItemConfirm">OK</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogCalc" max-width="500">
                <v-card>
                  <v-card-title class="headline">Calcular Investimento?</v-card-title>
                  <v-card-text>
                    <v-col cols="12" xs="12" sm="12">
                      <v-text-field
                          v-model="editedItem.investment"
                          label="Valor do Investimento"
                          prefix="R$"
                          type="number"
                          outlined
                          hide-details
                          clearable
                          append-outer-icon="calculate"
                          @click:append-outer="calculate()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="12" sm="6" v-show="editedItem.returnValue">
                      <Strong>R$ {{editedItem.returnValue}}</Strong>
                    </v-col>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="error" text @click="dialogCalc = false">Cancel</v-btn>
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
                    @click="calcItem(item)"
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
                :color="item.risk === 0 ? 'green' : item.risk === 1 ? 'warning' : 'error'"
                dark
            >
              {{ item.risk === 0 ? 'Baixo' : item.risk === 1 ? 'Médio' : 'Alto' }}
            </v-chip>
          </template>

          <template v-slot:item.money="{ item }">
           <strong>R$ {{item.money}}</strong>
          </template>

          <template v-slot:item.persons="{ item }">
            <div v-if="item.persons.length > 0">
              <ol>
                <li v-for="(item, i) in item.persons" :key="i"> {{ item }}</li>
              </ol>
            </div>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Projects",
    data: () => ({
    dialog: false,
    dialogDelete: false,
      dialogCalc: false,
    headers: [
      { text: 'Nome', value: 'name', align: 'start', sortable: false },
      { text: 'Date', value: 'startDate', align: 'center', sortable: false },
      { text: 'Date', value: 'endDate', align: 'center', sortable: false },
      { text: 'Valor do Projeto', value: 'money', align: 'center', sortable: false },
      { text: 'Risco', value: 'risk', align: 'center', sortable: false },
      { text: 'Participantes', value: 'persons', align: 'center', sortable: false },
      { text: 'Actions', value: 'actions', align: 'center', sortable: false },
    ],
      person: undefined,
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: undefined,
      risk: undefined,
      startDate: undefined,
      endDate: undefined,
      money: undefined,
      persons: [],
      investment: undefined,
      returnValue: undefined,
    },
    defaultItem: {
      name: undefined,
      risk: undefined,
      startDate: undefined,
      endDate: undefined,
      money: undefined,
      persons: [],
      investment: undefined,
      returnValue: undefined,
    },
  }),
  created () {
    this.initialize()
  },
  mounted() {
    window.addEventListener('keydown', this.handleEnter)
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Novo Projeto' : 'Editar Projeto'
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
          money: '2.000',
          persons: ['jackson', 'andreza', 'eduardo'],
          investment: 0,
          returnValue: 0,
        },
        {
          name: 'B',
          risk: 1,
          startDate: '27/01/1995',
          endDate: '27/01/1995',
          money: '5.000',
          persons: ['jackson', 'andreza'],
          investment: 0,
          returnValue: 0,
        },
        {
          name: 'C',
          risk: 2,
          startDate: '27/01/1995',
          endDate: '27/01/1995',
          money: '4.000',
          persons: ['jackson'],
          investment: 0,
          returnValue: 0,
        },
      ]
    },

    handleEnter(e) {
      if (e.key === 'Enter') {
        this.addPerson()
      }
    },

    addPerson(){
      this.editedItem.persons.push(this.person)
      this.person =  undefined
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    calculate(){
      if(Number(this.editedItem.investment) < Number(this.editedItem.money)){
        alert('Error: o valor a ser investido não pode ser menor que o valor do projeto')
      } else if(this.editedItem.risk === 0){
        this.editedItem.returnValue = Number(this.editedItem.investment)*0.05
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else if(this.editedItem.risk === 1){
        this.editedItem.returnValue = Number(this.editedItem.investment)*0.10
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else if (this.editedItem.risk === 2){
        this.editedItem.returnValue = Number(this.editedItem.investment)*0.20
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      }
    },

    calcItem(item){
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogCalc = true
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

    edit () {
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