// v-builder scripts
import Builder from '../../src';

// demo scripts
import Uploader from '../../demo/Uploader.vue'
import Section1 from '../../demo/sections/Section1';
import Section2 from '../../demo/sections/Section2';

// add the uploader to the list of sub-components.
Builder.mix({
  components: {
    Uploader
  }
});

// register components.
Builder.component(Section1);
Builder.component(Section2);

export default ({ Vue }) => {
  // install the builder
  Vue.use(Builder, {
    // main css file
    assets: {
      css: 'style.css'
    },
    // builder default themes
    themes: [{
      name: 'Theme 1',
      sections: [Section1]
    }, {
      name: 'Theme 2',
      sections: [Section1, Section2]
    }]
  });
}


function normalize (component) {
  component.cover = component.cover.replace('static', '.');
}
