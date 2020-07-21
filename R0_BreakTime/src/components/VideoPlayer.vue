<template>
  <div class="videoplayer_main">
    <button v-if="!playing" @click="playVideo">play</button>
    <video src="@/assets/videos/test.mp4"></video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playing: false
    };
  },
  mounted() {},
  methods: {
    playVideo() {
      this.playing = true;
      this.$el.querySelector("video").play();
      this.$el.querySelector("video").loop = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.videoplayer_main {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  video {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translate(0, -50%);
  }
}
</style>