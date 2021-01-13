<template lang='pug'>
.home-wrapper
  .play-ground
    .row(v-for="(row, i) in squareData")
      .columns(v-for="(col, colIdx) in row")
        Square(
          :rowId="i",
          :columnId="colIdx",
          :onSquareClick="onSquareClick",
          :name="col"
        )
</template>

<script lang="ts">
import Vue from "vue";
import Square from "./Square.vue";

export default Vue.extend({
  name: "HomeComponent",
  components: {
    Square,
  },
  data() {
    return {
      squareData: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    };
  },
  methods: {
    onSquareClick(col: number, row: number) {
      console.log({ row, col });
    },
  },
});
</script>

<style scoped lang="scss">
.home-wrapper {
  .play-ground {
    .row {
      display: flex;
    }
  }
}
</style>
