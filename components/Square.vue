<template lang="pug">
.square
  input(type="button", v-on:click="onBtnClick", :value="name")
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
    padding: 20px;
    margin: 20px;
    background: #c4c4c4;
  }
}
</style>