<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'App'
})
export default class extends Vue {}
</script>

<style lang="scss">
// 处理input type = number的上下箭头
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
.page-info {
  // position:fixed;
  // bottom:0;
  // width:100%;
  // height:35px;
  // background:#fff;
  // z-index: 10;
  // padding-left: 20px;
  // box-sizing: border-box;
  margin-top: 20px;
  text-align: center;
}

  /* 一行超出省略号显示 */
.ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}

/* 两行超出省略号显示 */
.ellipsis-2 {
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
}
</style>
