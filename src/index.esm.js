import VBuilder from './v-builder';
import * as types from './types';

const version = '__VERSION__';

// Auto install if Vue is defined globally.
if (typeof Vue !== 'undefined') {
  // eslint-disable-next-line
  Vue.use(Builder);
}

export {
  VBuilder,
  types,
  version
};

export default VBuilder;
