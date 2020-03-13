// v-builder scripts
import Vue from 'vue';
import pwa from '../src/plugins/pwa';
import Builder from '../src';

// demo scripts
import App from './App.vue';
import Uploader from './Uploader'

import Section1 from './sections/Section1';
import Section2 from './sections/Section2';

// add the uploader to the list of sub-components.
Builder.mix({
  components: {
    Uploader
  }
});

// register components.
Builder.component(Section1);
Builder.component(Section2);

// install pwa plugin.
Builder.use(pwa);

// install the builder
Vue.use(Builder, {
  // main css file
  assets: {
    css: 'css/style.css'
  },
  // builder default themes
  themes: [
    {
      name: 'Theme 1',
      sections: [Section1]
    },
    {
      name: 'Theme 2',
      sections: [Section1, Section2]
    }
  ]
});

new Vue({
  el: '#app',
  render: h => h(App)
});
