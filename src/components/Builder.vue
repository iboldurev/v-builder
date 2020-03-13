<template lang="pug">
  div
    div#artboard.artboard(
      ref="artboard"
      :class="{ 'is-sorting': $builder.isSorting, 'is-editable': $builder.isEditing }"
    )
      component(v-for='section in $builder.sections'
        :is='section.name'
        :key='section.id'
        :id='section.id'
      )

    .controller
      .controller-intro(v-if="showIntro && !this.$builder.sections.length")
        label(for="projectName") Hello, start your project
        input.controller-input(
          id="projectName"
          placeholder="project name"
          v-model="title"
        )
        template(v-if="themes")
          .controller-themes
            button.controller-theme(
              v-for="theme in themes"
              @click="addTheme(theme)"
            )
              | {{ theme.name }}

      .controller-panel
        button.controller-button.is-green(
          tooltip-position="top"
          :tooltip="exportText"
          @click="submit"
        )
          BuilderIcon(name='download')
        button.controller-button.is-red(
          v-if="showClearControl && !tempSections"
          tooltip-position="top"
          tooltip="clear sections"
          @click="clearSections"
        )
          BuilderIcon(name='trash')
        button.controller-button.is-gray(
          v-if="showClearControl && tempSections"
          tooltip-position="top"
          tooltip="undo"
          @click="undo"
        )
          BuilderIcon(name='undo')
        button.controller-button.is-blue(
          v-if="showSortControl"
          tooltip-position="top"
          tooltip="sorting"
          :class="{ 'is-red': $builder.isSorting }"
          @click="toggleSort"
        )
          BuilderIcon(name='sort')
        button.controller-button.is-blue(
          v-if="showAddControl"
          tooltip-position="top"
          tooltip="add section"
          :class="{ 'is-red': listShown, 'is-rotated': listShown }"
          :disabled="!$builder.isEditing"
          @click="newSection"
        )
          BuilderIcon(name='plus')

    ul.menu(:class="{ 'is-visiable': listShown }" ref="menu")
      li.menu-group(v-for="(group, name) in groups"  v-if="group.length")
        .menu-header(@click="toggleGroupVisibility")
          span.menu-title {{ name }}
          span.menu-icon
            BuilderIcon(name='arrowDown')
        .menu-body
          template(v-for="section in group")
            a.menu-element(
              @click="addSection(section); toggleListVisibility()"
              @drag="currentSection = section"
            )
              img.menu-elementImage(v-if="section.cover" :src="section.cover")
              span.menu-elementTitle {{ section.name }}

</template>

<script>
import Sortable from 'sortablejs';
import BuilderIcon from './BuilderIcon';

export default {
  name: 'Builder',
  components: {
    BuilderIcon
  },
  props: {
    showIntro: {
      type: Boolean,
      default: true
    },
    showAddControl: {
      type: Boolean,
      default: true
    },
    showSortControl: {
      type: Boolean,
      default: true
    },
    showClearControl: {
      type: Boolean,
      default: true
    },
    exportText: {
      type: String,
      default: 'export'
    },
    data: {
      type: Object,
      default: () => ({
        title: '',
        sections: []
      })
    }
  },
  data () {
    return {
      title: null,
      listShown: false,
      tempSections: null,
      sections: this.getSections(),
      currentSection: '',
      groups: {}
    }
  },

  watch: {
    title (value) {
      this.$builder.title = value;
      document.title = value;
    }
  },
  created () {
    // sets the initial data.
    this.$builder.set(this.data);
    this.title = this.$builder.title;
    this.themes = this.$builder.themes;
    this.generateGroups();
  },
  mounted () {
    this.$builder.rootEl = this.$refs.artboard;
    const groups = this.$refs.menu.querySelectorAll('.menu-body');
    const _self = this;
    groups.forEach((group) => {
      Sortable.create(group, {
        group: {
          name: 'sections-group',
          put: false,
          pull: 'clone'
        },
        sort: false
      });
    });
    this.sortable = Sortable.create(this.$refs.artboard, {
      group: {
        name: 'artboard',
        put: 'sections-group'
      },
      animation: 150,
      scroll: true,
      scrollSpeed: 10,
      sort: false,
      disabled: true,
      preventOnFilter: false,
      onAdd (evt) {
        _self.addSection(_self.currentSection, evt.newIndex);
        evt.item.remove();
      },
      onUpdate (evt) {
        _self.$builder.sort(evt.oldIndex, evt.newIndex);
      }
    });
  },

  updated () {
    if (this.$builder.scrolling) {
      this.$builder.scrolling(this.$refs.artboard);
    }
  },

  beforeDestroy () {
    this.$builder.clear();
  },
  methods: {
    newSection () {
      // add the section immediatly if none are present.
      if (this.sections.length === 1) {
        this.addSection(this.sections[0]);
        return;
      }
      this.toggleListVisibility();
    },
    addSection (section, position) {
      this.$builder.add(section, position);
    },
    clearSections () {
      this.tempSections = this.$builder.clear();
      setTimeout(() => {
        this.tempSections = null;
      }, 5000);
    },
    undo () {
      this.$builder.sections = this.tempSections;
      this.tempSections = null;
    },
    addTheme (theme) {
      this.$builder.set(theme);
    },
    toggleSort () {
      this.$builder.isSorting = !this.$builder.isSorting;
      this.$builder.isEditing = !this.$builder.isSorting;
      if (!this.$builder.isSorting && this.sortable) {
        this.sortable.option('sort', false);
        this.sortable.option('disabled', true);
        return;
      }
      this.sortable.option('disabled', false);
      this.sortable.option('sort', true);
    },
    toggleListVisibility () {
      this.listShown = !this.listShown;
      this.sortable.option('disabled', !this.listShown);
    },
    showList () {
      this.listShown = true;
      this.sortable.option('disabled', false);
    },
    hideList () {
      this.listShown = false;
      this.sortable.option('disabled', true);
    },
    toggleGroupVisibility (e) {
      const element = e.target;
      const group = element.closest('.menu-group');
      group.classList.toggle('is-visiable');
    },
    submit () {
      this.$emit('saved', this.$builder);
    },
    generateGroups () {
      let groups = { random: [] };

      // group sections together
      this.sections.forEach((section) => {
        let sectionGroup = section.group;
        if (!sectionGroup) {
          groups.random.push(section);
          return;
        }
        if (!groups[sectionGroup]) {
          groups[sectionGroup] = [section];
          return;
        }
        groups[sectionGroup].push(section);
      })
      this.groups = groups;
    },
    getSections () {
      let sections = [];

      // get sections data
      sections = Object.keys(this.$builder.components).map((sec) => {
        return {
          name: sec,
          group: this.$builder.components[sec].options.group,
          cover: this.$builder.components[sec].options.cover,
          schema: this.$builder.components[sec].options.$schema
        }
      });
      return sections;
    }
  }
};
</script>

<style>
  .v-builder-icon {
    display: block;
    width: 20px;
    height: 20px;
  }
  .controller-button:hover,
  .menu-element:hover {
    cursor: pointer;
    box-shadow: 0 14px 28px rgba(0,0,0,0.125), 0 10px 10px rgba(0,0,0,0.1);
  }
  .artboard {
    transform-origin: top center;
  }
  .artboard.is-editable .is-editable {
    outline: none;
  }
  .artboard.is-editable .is-editable:hover {
    box-shadow: inset 0 0 0 2px #c1c1c1;
  }
  .controller {
    box-sizing: border-box;
  }
  .controller-panel {
    position: fixed;
    z-index: 200;
    bottom: 30px;
    right: 40px;
  }
  .controller-input {
    outline: none;
    border: 1px solid #c1c1c1;
    padding: 0.5em 1em;
    margin: 20px 0;
    border-radius: 40px;
    width: 100%;
    font-size: 16px;
  }
  .controller-input:focus {
    border-color: #0072ff;
    box-shadow: 0 0 0 2px rgba(0,114,255,0.5);
  }
  .controller-button {
    transition: 0.2s;
    border: none;
    outline: none;
    border-radius: 20px;
    padding: 5px;
    color: #fff;
    fill: #fff;
    font-size: 16px;
  }
  .controller-button svg {
    transition: 0.2s;
  }
  .controller-button:not(:last-child) {
    margin-right: 20px;
  }
  .controller-button.is-rotated >svg {
    transform: rotate(45deg);
  }
  .controller-button.is-blue {
    background-color: #0072ff;
  }
  .controller-button.is-blue:hover {
    background-color: #005bcc;
  }
  .controller-button.is-red {
    background-color: #ff3d3d;
  }
  .controller-button.is-red:hover {
    background-color: #fd0000;
  }
  .controller-button.is-green {
    background-color: #18d88b;
  }
  .controller-button.is-green:hover {
    background-color: #13ad6f;
  }
  .controller-button.is-dark {
    background-color: #323c47;
  }
  .controller-button.is-dark:hover {
    background-color: #283039;
  }
  .controller-button.is-gray {
    background-color: $gary;
  }
  .controller-button.is-gray:hover {
    background-color: #9a9a9a;
  }
  .controller-intro {
    width: 100%;
    max-width: 500px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 70px 50px;
    text-align: center;
    font-size: 30px;
    color: #323c47;
  }
  .controller-themes {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .controller-theme {
    background-color: #fff;
    color: #323c47;
    border: 1px solid #c1c1c1;
    margin: 5px;
    padding: 20px;
    border-radius: 4px;
    width: 100%;
    cursor: pointer;
    font-size: 16px;
  }
  .controller-theme:hover {
    border-color: #0072ff;
  }
  .menu {
    user-select: none;
    -moz-user-select: none;
    position: fixed;
    z-index: 300;
    top: 0;
    left: 0;
    bottom: 0;
    margin: 0;
    width: 250px;
    background: #fff;
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    list-style: none;
    transition: 0.4s;
    box-shadow: 1px 0 10px rgba(50,60,71,0.2);
    transform: translate3d(-100%, 0, 0);
  }
  .menu.is-visiable {
    transform: translate3d(0, 0, 0);
  }
  .menu-body {
    display: none;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .menu-group .menu-body {
    width: 90%;
    margin: 10px auto;
  }
  .menu-group.is-visiable .menu-body {
    display: block;
  }
  .menu-icon {
    width: 24px;
    height: 24px;
    fill: #c1c1c1;
    transition: 0.2s;
  }
  .menu-group.is-visiable .menu-icon {
    transform: rotate(180deg);
  }
  .menu-element {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 50px;
    border-radius: 5px;
    background: #aeaeae;
    transition: 0.3s;
    cursor: pointer;
    color: #fff;
    overflow: hidden;
    user-select: none;
    -moz-user-select: none;
  }
  .menu-element:not(:last-child) {
    margin-bottom: 10px;
  }
  .menu-elementImage {
    max-width: 100%;
    pointer-events: none;
  }
  .menu-elementTitle {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    text-align: center;
    padding: 5px;
  }
  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 5px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .sortable-ghost {
    opacity: 0.3;
    box-shadow: 0 0 2px 1px #0072ff;
  }
  .is-editable:hover {
    box-shadow: inset 0 0 0 2px #c1c1c1;
  }
</style>
