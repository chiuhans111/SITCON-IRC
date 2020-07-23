<template>
  <div id="app">
    <div class="main">
      <div class="top"></div>
      <div class="middle">
        <!-- <VideoPlayer></VideoPlayer> -->
      </div>
      <div class="bottom"></div>
    </div>
    <div class="side">
      <Side></Side>
    </div>
  </div>
</template>

<script>
import Side from "./components/Side";
// import VideoPlayer from "./components/VideoPlayer"
export default {
  name: "App",
  components: {
    Side,
    // VideoPlayer,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  display: flex;
  width: 100%;
  height: 100%;
}
html,
body {
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  width: 1600/1920 * 100%;
  height: 100%;
}
.side {
  width: 1920-1600px;
  flex-grow: 1;
  flex-shrink: 0;
}
.top,
.bottom {
  flex-shrink: 0;
  height: 90px;
  background-color: white;
}
.middle {
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  background-color: black;
}
</style>
