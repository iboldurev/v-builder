---
navbar: true
sidebar: false
editLink: false
pageClass: example
---

<v-builder @saved="onSave"></v-builder>

<script>
export default {
  methods: {
    onSave (builder) {
      builder.export('preview');
    }
  }
}
</script>

<style>
.example .content {
  padding: 0 !important;
  margin: 0 !important;
  max-width: 100% !important;
}
.example .page {
  padding: 0 !important;
}
.example .page-edit {
 display: none !important;
}
.example .menu {
  margin: 0;
}
</style>
