<template>
  <div class="bg-gray-300 p-3">
    <div class="md:flex bg-white rounded-lg p-6">
      <uploader
        class="h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 md:mr-6"
        path="$sectionData.avatar" />
      <div class="text-center md:text-left">
        <h2
          v-styler="$sectionData.name"
          class="text-lg"
          v-html="$sectionData.name"/>
        <div
          v-styler:text="$sectionData.role"
          class="text-purple-500"
          v-html="$sectionData.role"/>
        <div
          v-styler:text="$sectionData.email"
          class="text-gray-600"
          v-html="$sectionData.email"/>
        <div
          v-styler:text="$sectionData.phone"
          class="text-gray-600"
          v-html="$sectionData.phone"/>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '../../src/types';

export default {
  name: 'Section1',
  cover: 'img/covers/tailwind-twitter-square.png',
  group: 'Demo',
  $schema: {
    avatar: types.Image,
    name: types.Name,
    role: types.Role,
    email: types.Email,
    phone: types.Phone
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  }
};
</script>
