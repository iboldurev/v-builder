<template lang="pug">
  .styler(
    ref="styler"
    id="styler"
    v-if="$builder.isEditing"
    :class="{ 'is-visible': isVisible }"
    @click.stop=""
  )
    ul.styler-list
      li(v-if="type === 'button' || type === 'section'")
        button.styler-button(@click="updateOption('colorer')")
          BuilderIcon(name='palettes')
      li(v-if="type === 'button'")
        button.styler-button(@click="updateOption('link')")
          BuilderIcon(name='link')
      li(v-if="type === 'header' || type === 'section'")
        button.styler-button(@click="removeSection")
          BuilderIcon(name='trash')
      template(v-if="type === 'text'")
        li: button.styler-button(@click="updateOption('textColor')")
            BuilderIcon(name='palettes')
        li: button.styler-button(@click="updateOption('align')")
            BuilderIcon(name='align')
        li: button.styler-button(@click="updateOption('textStyle')")
            BuilderIcon(name='textStyle')
      template(v-if="type === 'grid'")
        li: button.styler-button(@click="selectDevice('mobile')")
            BuilderIcon(name='mobile')
        //- li: button.styler-button(@click="selectDevice('tablet')")
        //-     BuilderIcon(name='tablet')
        li: button.styler-button(@click="selectDevice('desktop')")
            BuilderIcon(name='laptop')
        //- li: button.styler-button(@click="selectDevice('widescreen')")
        //-     BuilderIcon(name='monitor')

    ul.styler-list
      li(v-if="currentOption === 'colorer'")
        ul.colorer
          li(v-for="color in colors")
            input(
              type="radio"
              :id="`color${color.charAt(0).toUpperCase() + color.slice(1)}`"
              name="colorer"
              :value="color"
              v-model="colorerColor"
            )
      li(v-if="currentOption === 'textColor'")
          ul.colorer
            li(v-for="(color, index) in colors")
              input(
                type="radio"
                :id="`color${color.charAt(0).toUpperCase() + color.slice(1)}`"
                name="colorer"
                :value="textColors[index]"
                v-model="textColor"
                )
      li(v-if="currentOption === 'link'")
        .input-group.is-rounded.has-itemAfter.is-primary
          input.input(type="text" placeholder="type your link" v-model="url")
          button.button(@click="addLink")
            BuilderIcon(name='link')

      li(v-if="currentOption === 'align'")
        ul.align
          li: button.styler-button(@click="execute('justifyleft')")
            BuilderIcon(name='left')
          li: button.styler-button(@click="execute('justifycenter')")
            BuilderIcon(name='center')
          li: button.styler-button(@click="execute('justifyright')")
            BuilderIcon(name='right')

      li(v-if="currentOption === 'textStyle'")
        ul.align
          li: button.styler-button(@click="execute('bold')")
            BuilderIcon(name='bold')
          li: button.styler-button(@click="execute('italic')")
            BuilderIcon(name='italic')
          li: button.styler-button(@click="execute('underline')")
            BuilderIcon(name='underline')

      li(v-if="currentOption === 'columnWidth'")
        ul.align
          li: button.styler-button(@click="gridValue--")
            BuilderIcon(name='arrowLeft')
          li: input(type="number" min="0" max="12" v-model="gridValue").styler-input
          li: button.styler-button(@click="gridValue++")
            BuilderIcon(name='arrowRight')

</template>

<script>
import Popper from 'popper.js';
import BuilderIcon from './BuilderIcon';
import { isParentTo } from './../util';

export default {
  name: 'Styler',
  components: {
    BuilderIcon
  },
  props: {
    el: {
      type: HTMLElement, // Object
      required: true
    },
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    section: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    colors: ['blue', 'green', 'red', 'black', 'white'],
    textColors: ['#4da1ff', '#38E4B7', '#EA4F52', '#000000', '#FFFFFF'],
    textColor: '',
    oldColorerColor: '',
    colorerColor: '',
    mouseTarget: '',
    currentOption: '',
    url: '',
    gridValue: 0,
    isVisible: false
  }),
  watch: {
    colorerColor: function () {
      this.changeColor();
    },
    textColor: function () {
      this.execute('forecolor', this.textColor)
    },
    gridValue: function () {
      this.gridValue = Math.min(Math.max(this.gridValue, 0), 12);
      this.section.set(this.name, (grid) => {
        grid[this.device] = this.gridValue;
      });
    }
  },
  created () {
    if (!this.$builder.isEditing) {
      this.el.classList.remove('is-editable');
      return;
    }

    if (this.type === 'button') {
      this.url = this.section.get(`${this.name}.href`);
      this.el.contentEditable = 'true';
    }
    if (this.type === 'text') {
      this.el.contentEditable = 'true';
    }
  },
  mounted () {
    if (!this.$builder.isEditing) return;

    // add listeners to show/hide styler
    this.el.addEventListener('click', this.showStyler);
  },
  beforeDestroy () {
    this.hideStyler();
    this.$refs.styler.remove();
    this.el.classList.remove('is-editable');
    this.el.removeEventListener('click', this.showStyler);
    document.removeEventListener('click', this.hideStyler, true);
  },
  methods: {
    updateOption (option) {
      this.currentOption = option;
      this.$nextTick(() => {
        this.popper.update();
      })
    },
    addLink () {
      this.section.set(`${this.name}.href`, this.url);
    },
    changeColor () {
      this.removeClass(`is-${this.oldColorerColor}`);
      this.oldColorerColor = this.colorerColor;
      this.addClass(`is-${this.colorerColor}`);
    },
    addClass (className) {
      this.section.set(this.name, (value) => {
        if (value && value.classes && Array.isArray(value.classes)) {
          value = value.classes;
        }
        value.push(className);
      });
    },
    selectDevice (device) {
      const gridValue = this.section.get(this.name)[device];
      this.updateOption('columnWidth');
      this.device = device;
      this.gridValue = gridValue;
    },
    removeClass (className) {
      if (Array.isArray(className)) {
        return className.forEach(c => {
          this.removeClass(c);
        });
      }
      this.section.set(this.name, value => {
        if (value && value.classes && Array.isArray(value.classes)) {
          value = value.classes;
        }
        const idx = value.indexOf(className);
        value.splice(idx, 1);
      });
    },
    removeSection () {
      this.$builder.remove(this.section);
    },
    execute (command, value = null) {
      this.el.focus();
      document.execCommand(command, false, value);
    },
    showStyler (event) {
      event.stopPropagation();
      if (this.isVisible) return;
      this.isVisible = true;

      // exute popper element
      if (!this.popper) {
        const position = this.$props.type === 'section' ? 'left-start' : 'top';
        this.popper = new Popper(this.el, this.$refs.styler, {
          placement: position
        });
      }
      document.addEventListener('click', this.hideStyler, true);
      this.currentOption = '';
    },
    hideStyler (event) {
      if (
        (event && isParentTo(event.target, this.$el)) ||
        (event && isParentTo(event.target, this.el))
      ) {
        return
      }
      this.isVisible = false;
      if (this.popper) {
        this.popper.destroy();
        this.popper = null;
      }
      document.removeEventListener('click', this.hideStyler, true);

      if (this.type === 'section' || this.type === 'grid') {
        return;
      }
      if (this.type === 'button') {
        this.section.set(`${this.name}.text`, this.el.innerHTML);
        return;
      }

      this.section.set(this.name, this.el.innerHTML);
    }
  }
};
</script>

<style>
  .styler {
    position: absolute;
    top: 0;
    z-index: 200;
    visibility: hidden;
    opacity: 0;
    margin: 10px 0;
    padding: 5px;
    background: #323c47;
    border-radius: 26px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .styler-list,
  .align,
  .colorer {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .styler-input {
    background: #fff;
    color: #323c47;
    border: 0;
    outline: 0;
    width: 40px;
    height: 40px;
    border-radius: 42px;
    margin: 0 5px 0 0;
    text-align: center;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    appearance: none;
  }
  .styler-button {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 0;
    background: #323c47;
    border: 0;
    fill: #fff;
    color: #fff;
    width: 42px;
    height: 42px;
    border-radius: 42px;
    margin: 0 5px 0 0;
  }
  .styler-button:hover {
    background: #283039;
  }
  .styler-button:first-child {
    margin-left: 5px;
  }
  .styler-selector {
    margin: 0 5px;
  }
  .styler.is-visible {
    visibility: visible;
    opacity: 1;
  }
  .styler .input-group {
    margin: 5px;
  }
  .align {
    height: 42px;
  }
  .colorer {
    height: 42px;
  }
  .colorer li >input {
    -webkit-appearance: none;
    -moz-appearance: textfield;
    appearance: none;
    width: 30px;
    height: 30px;
    border-radius: 40px;
    border: 4px solid #283039;
    margin: 0 5px;
    outline: none;
  }
  .colorer li >input:checked {
    border-color: #526375;
  }
  .colorer li >input:hover {
    border-color: #526375;
  }
  .colorer li >input#colorRed {
    background: #ff3d3d;
  }
  .colorer li >input#colorBlue {
    background: #0072ff;
  }
  .colorer li >input#colorGreen {
    background: #18d88b;
  }
  .colorer li >input#colorBlack {
    background: #000;
  }
  .colorer li >input#colorWhite {
    background: #fff;
  }
  .is-hidden {
    display: none;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
