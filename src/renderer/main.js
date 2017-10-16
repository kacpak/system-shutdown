import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';
import 'mdi/css/materialdesignicons.css';

import moment from 'moment';
import VueMomentJS from 'vue-momentjs';

import App from './App';

moment.locale(navigator.language);
Vue.use(Vuetify);
Vue.use(VueMomentJS, moment);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
}).$mount('#app');
