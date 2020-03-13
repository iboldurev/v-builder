<template>
  <div class="bg-gray-300 p-3">
    <div class="md:flex">
      <div class="md:flex-shrink-0">
        <uploader
          class="rounded-lg md:w-56"
          path="$sectionData.cover" />
      </div>
      <div class="mt-4 md:mt-0 md:ml-6">
        <div
          v-styler:text="$sectionData.role"
          class="uppercase tracking-wide text-sm text-indigo-600 font-bold"
          v-html="$sectionData.title" />
        <a
          v-styler:button="$sectionData.subTitle"
          :href="$sectionData.subTitle.href"
          class="block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline"
          v-html="$sectionData.subTitle.text" />
        <p
          v-styler:text="$sectionData.description"
          class="mt-2 text-gray-600"
          v-html="$sectionData.description" />
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '../../src/types';

export default {
  name: 'Section2',
  cover: 'img/covers/tailwind-twitter-square.png',
  group: 'Demo',
  $schema: {
    cover: types.Cover,
    title: 'Marketing',
    subTitle: () => ({
      text: 'Finding customers for your new business',
      classes: [],
      href: 'http://example.com'
    }),
    description: 'Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.'
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  }
};
</script>
