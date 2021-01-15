import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
//import * as firebase from 'firebase';
import {store} from './store/store'

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App),
  created(){
/*    var firebaseConfig = {
      apiKey: "AIzaSyCHFzThFCb4VIlILR2DuMhMu20eT941-HI",
      authDomain: "fpftech2021.firebaseapp.com",
      projectId: "fpftech2021",
      storageBucket: "fpftech2021.appspot.com",
      messagingSenderId: "72616340559",
      appId: "1:72616340559:web:591335c8acb081cd014e3a",
      measurementId: "G-Q9GP1Y2R9L"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();*/
  }
}).$mount('#app')
