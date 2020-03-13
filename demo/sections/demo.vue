<template>
  <section class="social">
    <div class="container">
      <div class="grid is-center">
        <div class="column is-desktop-2 social-item">
          <h6
            v-styler="$sectionData.columns[0].content"
            class="social-number">{{ $sectionData.columns[0].content }}</h6>
          <b
            v-styler="$sectionData.columns[0].title"
            class="social-keyword">{{ $sectionData.columns[0].title }}</b>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import * as types from '../../src/types';

export default {
  name: 'Demo',
  cover: 'img/covers/social1.png',
  group: 'demo',
  $schema: {
    classes: types.ClassList,
    columns: [
      {
        title: types.Title,
        content: Number
      }
    ]
  },
  props: {
    id: {
      type: Number, required: true
    }
  }
};
</script>
