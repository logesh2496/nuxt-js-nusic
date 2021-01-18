<template lang='pug'>
.home-wrapper
  div string A
    input(type="text", @change="stringOneChange")
  div string B
    input(type="text", @change="stringTwoChange")
  div
    input(
      type="checkbox",
      placeholder="createConnectedPaths",
      v-model="createConnectedPaths",
      disabled
    )
    span Create Connected Paths
  div No of Paths
    select(v-model="noOfPaths", disabled)
      option(v-for="value in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]") {{ value }}
  div
    input(type="button", @click="generatePath", value="Generate")
  .play-ground(v-if="generateMath")
    .row(v-for="(row, i) in squareData")
      .columns(v-for="(col, colIdx) in row")
        Square(
          :rowId="i",
          :columnId="colIdx",
          :onSquareClick="onSquareClick",
          :name="col",
          :pathHighlighter="pathHighlighter"
        )
  .paths(v-if="generateMath") Generated No of Paths:
    span {{ Object.keys(allPath).length }}
    .path-container
      .path-row(v-for="(singlePath, i) in allPath")
        input(type="button", @click="onShowClick(i)", value="Show")
        .single-path(v-for="operation in singlePath")
          .way {{ operation }}
</template>

<script lang="ts">
import Vue from "vue";
import { hasMultipleMatch } from "~/helpers";
import Square from "./Square.vue";

export default Vue.extend({
  name: "HomeComponent",
  components: {
    Square,
  },
  data() {
    return {
      firstString: "",
      secondString: "",
      squareData: [] as number[][],
      generateMath: false,
      createConnectedPaths: false,
      noOfPaths: "1",
      pathHighlighter: [] as PathIndex[],
      allPath: {} as any,
      ignorableProps: {},
    };
  },
  methods: {
    stringOneChange(e: any) {
      this.firstString = e.target.value;
    },
    stringTwoChange(e: any) {
      this.secondString = e.target.value;
    },
    onSquareClick(col: number, row: number) {
      console.log({ row, col });
    },
    generatePath() {
      this.getDistance(parseInt(this.noOfPaths), this.createConnectedPaths);
    },
    onShowClick(i: number) {
      this.pathHighlighter = this.allPath[i];
    },
    getDistance(
      noOfPaths: number,
      createConnectedPaths: boolean = false
    ): Path[] {
      this.generateMath = false;
      const one: string = this.firstString;
      const two: string = this.secondString;
      /**
       * Replace, Insert, Delete
       * ""
       * ""
       *      "" i v c b c c o
       *  ""  0  1 2 3 4 5 6 7
       *   v  1  1 1 2 3 4 5 6
       *   c  2  2 2 1 2 3 4 5
       *   v  3  3 2 2 2 3 4 5
       *   c  4  4 3 2 3 2 3 4
       *   o  5  5 4 3 3 3 3 3
       */
      const matrix: number[][] = [];
      for (const [idx, val] of [" ", ...one.split("")].entries()) {
        matrix[idx] = [idx];
      }
      for (const [idx, val] of [" ", ...two.split("")].entries()) {
        matrix[0][idx] = idx;
      }
      const operations: Operation[] = [];
      for (let i = 1; i <= one.length; i++) {
        for (let j = 1; j <= two.length; j++) {
          let operation: Operation;
          if (one[i - 1] === two[j - 1]) {
            operation = new Operation(OperationKind.match, i, j);
            operations.push(operation);
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            const replaceValue: number = matrix[i - 1][j - 1];
            const deleteValue: number = matrix[i][j - 1];
            const insertValue: number = matrix[i - 1][j];

            const { minValue, kind } = this.getMinValueAndKind(
              replaceValue,
              insertValue,
              deleteValue
            );
            operation = new Operation(kind, i, j);
            operations.push(operation);
            matrix[i][j] = minValue + 1;
          }
        }
      }
      const path: Path = new Path(operations);
      console.log({ matrix, path });
      const shortestPath: PathIndex[] = this.reverseTravers(matrix);
      this.squareData = matrix;
      this.pathHighlighter = shortestPath;
      console.log({ shortestPath });
      console.log({ allPath: this.allPath });
      this.generateMath = true;
      return [path];
    },
    getMinValueAndKind(
      replaceValue: number,
      insertValue: number,
      deleteValue: number
    ): { minValue: number; kind: OperationKind } {
      let minValue: number;
      let kind: OperationKind;
      if (replaceValue <= deleteValue && replaceValue <= insertValue) {
        minValue = replaceValue;
        kind = OperationKind.replace;
      } else if (deleteValue <= replaceValue && deleteValue <= insertValue) {
        minValue = deleteValue;
        kind = OperationKind.delete;
      } else {
        minValue = insertValue;
        kind = OperationKind.insert;
      }
      return { minValue, kind };
    },

    reverseTravers(matrix: number[][]): PathIndex[] {
      const result: PathIndex[] = [];
      let currentRowIndex: number = matrix.length - 1;
      let colIndex: number = matrix[currentRowIndex - 1].length - 1;

      result.push({ rowIndex: currentRowIndex, colIndex });

      const pathPointer = 0;
      this.allPath[pathPointer] = [{ rowIndex: currentRowIndex, colIndex }];
      this.recursiveTree(matrix, currentRowIndex, colIndex, pathPointer);
      return this.allPath["0"];
    },

    recursiveTree(
      matrix: number[][],
      currentRowIndex: number,
      colIndex: number,
      pointer: number
    ) {
      while (currentRowIndex || colIndex) {
        const rowIndex: number = currentRowIndex;

        const deleteIndex: number[] = [rowIndex, (colIndex || 1) - 1];
        const replaceIndex: number[] = [
          (rowIndex || 1) - 1,
          (colIndex || 1) - 1,
        ];
        const insertIndex: number[] = [(rowIndex || 1) - 1, colIndex];

        const deletionValue: number = matrix[deleteIndex[0]][deleteIndex[1]];
        const replaceValue: number = matrix[replaceIndex[0]][replaceIndex[1]];
        const insertionValue: number = matrix[insertIndex[0]][insertIndex[1]];

        const {
          minValue,
          kind,
        }: { minValue: number; kind: string } = this.getMinValueAndKind(
          replaceValue,
          insertionValue,
          deletionValue
        );

        const isMultipleRoutes = hasMultipleMatch(
          deletionValue,
          replaceValue,
          insertionValue
        );

        switch (kind) {
          case OperationKind.replace:
            currentRowIndex = replaceIndex[0];
            colIndex = replaceIndex[1];
            if (isMultipleRoutes) {
              const newRowIndex =
                minValue === insertionValue ? insertIndex[0] : deleteIndex[0];
              const newColIndex =
                minValue === insertionValue ? insertIndex[1] : deleteIndex[1];
              const newPointer = pointer + 1;

              this.allPath[newPointer] = [
                ...this.allPath[pointer],
                {
                  rowIndex: newRowIndex,
                  colIndex: newColIndex,
                },
              ];
              const newPath = this.recursiveTree(
                matrix,
                newRowIndex,
                newColIndex,
                newPointer
              );
            }
            this.allPath[pointer].push({
              rowIndex: replaceIndex[0],
              colIndex: replaceIndex[1],
            });
            break;
          case OperationKind.insert:
            currentRowIndex = insertIndex[0];
            colIndex = insertIndex[1];
            if (isMultipleRoutes) {
              const newRowIndex =
                minValue === replaceValue ? replaceIndex[0] : deleteIndex[0];
              const newColIndex =
                minValue === replaceValue ? replaceIndex[1] : deleteIndex[1];
              const newPointer = pointer + 1;

              this.allPath[newPointer] = [
                ...this.allPath[pointer],
                {
                  rowIndex: newRowIndex,
                  colIndex: newColIndex,
                },
              ];
              const newPath = this.recursiveTree(
                matrix,
                newRowIndex,
                newColIndex,
                newPointer
              );
            }
            this.allPath[pointer].push({
              rowIndex: insertIndex[0],
              colIndex: insertIndex[1],
            });
            break;
          case OperationKind.delete:
            currentRowIndex = deleteIndex[0];
            colIndex = deleteIndex[1];
            if (isMultipleRoutes) {
              const newRowIndex =
                minValue === replaceValue ? replaceIndex[0] : deleteIndex[0];
              const newColIndex =
                minValue === replaceValue ? replaceIndex[1] : deleteIndex[1];
              const newPointer = pointer + 1;
              this.allPath[newPointer] = [
                ...this.allPath[pointer],
                {
                  rowIndex: newRowIndex,
                  colIndex: newColIndex,
                },
              ];
              const newPath = this.recursiveTree(
                matrix,
                newRowIndex,
                newColIndex,
                newPointer
              );
            }
            this.allPath[pointer].push({
              rowIndex: deleteIndex[0],
              colIndex: deleteIndex[1],
            });
            break;
          default:
            console.error(`Kind exception ${kind}`);
        }
      }
    },
  },
});
enum OperationKind {
  replace = "replace",
  insert = "insert",
  delete = "delete",
  match = "match",
}
class Operation {
  constructor(
    public kind: OperationKind,
    public firstIndex: number,
    public secondIndex: number
  ) {}
}
class Path {
  constructor(public operations: Operation[]) {}
}

export interface PathIndex {
  rowIndex: number;
  colIndex: number;
}
</script>

<style scoped lang="scss">
.home-wrapper {
  background: white;
  height: 100%;
  color: black;
  padding: 20px;
  border-radius: 4px;

  .play-ground {
    padding: 50px;
    .row {
      margin: 0px;
      display: flex;
      justify-content: center;
    }
  }
  input {
    padding: 5px;
    margin: 10px;
    border: 1px solid;
  }
  select {
    width: 40px;
    border: 1px solid;
    margin-left: 10px;
    padding: 5px;
  }
  .path-container {
    display: flex;
    flex-wrap: wrap;

    .paths {
      span {
        margin-left: 5px;
        font-weight: bold;
      }
    }
    .path-row {
      margin: 30px;
    }
  }
}
</style>
