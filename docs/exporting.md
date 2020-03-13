# Exporting

There are three ways to export the built page: preview, pwa or json. When clicking the save button the `v-builder` component emits a saved event with the builder instance as its payload, which exposes an `export` method.

```html
<div id="app">
  <v-builder @saved="onSave"></v-builder>
</div>

<script>
  new Vue({
  el: '#app',
  methods: {
    onSave (builder) {
      // you can use 'preview', 'pwa' or 'json' strings
      // 'json' is the default exporting mode
      builder.export('preview');
    }
  }
});
</script>
```
