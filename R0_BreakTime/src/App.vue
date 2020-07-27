<template>
  <div id="app">
    <div class="main">
      <div class="top">{{currentTime}}</div>
      <div class="middle">
        <!-- <VideoPlayer></VideoPlayer> -->
      </div>
      <div class="bottom"></div>
    </div>
    <div class="side">
      <Side @update="update"></Side>
    </div>
  </div>
</template>

<script>
import sessiondata from "./assets/json/session.js";

import Side from "./components/Side";
// import VideoPlayer from "./components/VideoPlayer"
export default {
  name: "App",
  components: {
    Side,
    // VideoPlayer,
  },
  data() {
    return {
      currentTime: "",
    };
  },
  methods: {
    update() {
      this.currentTime = sessiondata.TimeProcess(new Date().getTime());
    },
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
}

.top {
  background-image: url("./assets/img/top.png");
  background-size: cover;
  background-position: left;
  background-repeat: no-repeat;

  color: white;
  font-weight: 900;
  font-size: 18px;
  padding: 25px 40px;
  box-sizing: border-box;

  letter-spacing: 2.7px;
}
.bottom {
  background-image: url("./assets/img/bottom.png");
  background-size: cover;
  background-position: left;
  background-repeat: no-repeat;
}
.middle {
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  background-color: black;
}
</style>
