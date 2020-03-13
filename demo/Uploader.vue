<template lang="pug">
  div.uploader
    img(:src="src")
    input.uploader-input(
      type="file"
      ref="uploader"
      @change="updateImage"
      v-if="$builder.isEditing && mode === 'input'"
    )
</template>

<script>
export default {
  name: 'Uploader',
  inject: ['$builder', '$section'],
  props: {
    path: {
      type: String,
      required: true
    },
    mode: {
      default: 'input',
      type: String
    }
  },
  data: () => ({
    src: ''
  }),
  created () {
    this.src = this.$section.get(this.path);
  },
  methods: {
    updateImage () {
      const file = this.$refs.uploader.files[0];
      if (!file) return;
      const imageURL = URL.createObjectURL(file);

      this.src = imageURL;
      this.$section.set(this.path, imageURL);
    }
  }
}
</script>

<style>
  .uploader {
    position: relative;
    outline: none;
    overflow: hidden;
  }
  .artboard.is-editable .uploader {
    cursor: pointer;
  }
  .uploader-input {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    opacity: 0;
    z-index: 100;
    cursor: pointer;
  }
  .uploader >img {
    width: 100%;
    display: block;
  }
  .artboard.is-editable .uploader:hover {
    box-shadow: 0 0 0 2px #c1c1c1;
  }
</style>
