<template>
  <div>
    <img class="background_define-img" src="@/assets/img/define.svg" alt="">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import canvas from "./Background/Canvas";
export default {
  props: ["t", "p"],

  data() {
    return {
      /**@type {CanvasRenderingContext2D} */
      ctx: {},
      /**@type {HTMLCanvasElement} */
      canvas: {},
    };
  },
  mounted() {
    /**@type {HTMLCanvasElement} */
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", this.resize);
    this.loop();
  },
  watch: {
    t() {
      this.update();
    },
    p() {
      this.update();
    },
  },
  methods: {
    loop() {
      this.update();
      requestAnimationFrame(this.loop);
    },
    update() {
      canvas.update(this.canvas, this.ctx, this.t, this.p);
    },
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.update();
    },
  },
};
</script>