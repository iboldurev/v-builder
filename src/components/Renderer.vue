<template lang="pug">
  #artboard.artboard
    component(v-for='section in $builder.sections'
      :is='section.name'
      :key='section.id'
      :id='section.id'
    )
</template>

<script>
export default {
  name: 'Renderer',
  props: {
    data: {
      type: Object,
      default: () => ({
        title: '',
        sections: []
      })
    }
  },
  created () {
    console.log(this.$builder)
    this.$builder.set(this.data);
    this.$builder.sortable = false;
    this.$builder.isEditing = false;
    this.$builder.isRendered = true;
  }
};
</script>
