// v-builder scripts
import Builder from '../../src';

// demo scripts
import '../../demo/style/_demo.styl';
import Uploader from '../../demo/Uploader.vue'
import hero1 from '../../demo/sections/hero/hero1';
import hero2 from '../../demo/sections/hero/hero2';
import section1 from '../../demo/sections/section/section1';
import section2 from '../../demo/sections/section/section2';
import social1 from '../../demo/sections/social/social1';
import social2 from '../../demo/sections/social/social2';
import social3 from '../../demo/sections/social/social3';
import social4 from '../../demo/sections/social/social4';
import newsletter from '../../demo/sections/forms/newsletter';

// add the uploader to the list of sub-components.
Builder.mix({
  components: {
    Uploader
  }
});

// register components.
Builder.component(hero1);
Builder.component(hero2);
Builder.component(section1);
Builder.component(section2);
Builder.component(social1);
Builder.component(social2);
Builder.component(social3);
Builder.component(social4);
Builder.component(newsletter);

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
      sections: [hero1, section1, social1, social3, newsletter]
    }, {
      name: 'Theme 2',
      sections: [hero2, section2, social3, social4, newsletter]
    }]
  });
}


function normalize (component) {
  component.cover = component.cover.replace('static', '.');
}
