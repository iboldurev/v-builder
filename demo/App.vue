<template>
  <!-- <v-builder
    :show-intro="true"
    :show-add-control="true"
    :show-sort-control="false"
    :show-clear-control="false"
    :data="{ title: 'Agency Page', sections }"
    export-text="Preview"
    @saved="onSave"
  /> -->
  <v-renderer :data="{ title: 'Agency Page', sections }" />
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      sections: [
        {
          name: 'Demo',
          data: {
            classes: [],
            columns: [
              {
                title: 'demo',
                content: 100
              },
              {
                title: 'demo',
                content: 100
              },
              {
                title: 'demo',
                content: 100
              },
              {
                title: 'demo',
                content: 100
              }
            ]
          }
        }
      ]
    }
  },
  methods: {
    onSave (builder) {
      builder.export('preview');
      // builder.export('pwa');
    }
  }
}
</script>
