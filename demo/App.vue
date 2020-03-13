<template>
  <v-builder
    :show-intro="true"
    :show-add-control="true"
    :show-sort-control="false"
    :show-clear-control="true"
    :data="{ title: 'Demo Page', sections }"
    export-text="Preview"
    @saved="onSave"
  />
  <!-- <v-renderer :data="{ title: 'Demo Page', sections }" /> -->
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      sections: [
        {
          name: 'Section1',
          data: {
            avatar: './img/avatar.jpg',
            name: 'Erin Lindford',
            role: 'Customer Support',
            email: 'erinlindford@example.com',
            phone: '(555) 765-4321'
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
