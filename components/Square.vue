<template lang="pug">
.square
  input(
    type="button",
    v-on:click="onBtnClick",
    :value="name",
    v-bind:class="getClassName"
  )
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Square",
  props: {
    rowId: Number,
    columnId: Number,
    onSquareClick: Function,
    name: Number,
    pathHighlighter: {
      type: Array,
    },
  },
  computed: {
    getClassName: function (): string {
      const isUnderPath: boolean = this.pathHighlighter.some(
        (item: any) =>
          item.rowIndex === this.rowId && item.colIndex === this.columnId
      );
      if (isUnderPath) {
        return "highlight";
      } else {
        return "";
      }
    },
  },
  methods: {
    onBtnClick() {
      this.onSquareClick(this.columnId, this.rowId);
    },
  },
});
</script>

<style scoped lang="scss">
.square {
  input[type="button"] {
    height: 40px;
    width: 40px;
    border-radius: 4px;
    background: black;
    color: white;
  }
  .highlight {
    background-color: yellow !important;
    color: black !important;
  }
}
</style>