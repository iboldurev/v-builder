import VBuilder from './v-builder';
import * as types from './types';

// Auto install if Vue is defined globally.
if (typeof Vue !== 'undefined') {
  // eslint-disable-next-line
  Vue.use(Builder);
}

VBuilder.version = '__VERSION__';
VBuilder.types = types;

export default VBuilder;
