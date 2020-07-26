<template>
  <div class="staff-member">
    <!-- <h2>{{info.zh.bio}}</h2> -->
    <img :src="imgsrc" alt @load="load" hidden />
    <div class="staff-member_img" :style="{
        backgroundImage: `url(${imgsrc})`
        }"></div>
    <h3>{{info.zh.name}}</h3>
  </div>
</template>

<script>
export default {
  props: ["info"],
  methods: {
    load() {
      console.log("loaded", this.imgsrc);
      this.$emit("load");
      this.loaded = true;
    },
  },
  computed: {
    imgsrc() {
      return this.info.avatar;
    },
  },
  data() {
    return {
      loaded: false,
    };
  },
};
</script>