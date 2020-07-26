<template>
  <div class="staff-member">
    <img :src="imgsrc" alt @load="load" hidden/>
    <div class="staff-member_img" :style="{
        backgroundImage: `url(${imgsrc})`
    }"></div>
    <h3>{{info.name}}</h3>
  </div>
</template>

<script>

const GRAVATAR_DEFAULT = "https://sitcon.org/2020/img/sitcon-logo.png"

export default {
  props: ["info"],
  computed: {
    imgsrc() {
      return `https://www.gravatar.com/avatar/${this.info.emailHash}?s=320&d=${GRAVATAR_DEFAULT}&r=g`;
    },
  },
  methods: {
    load() {
      console.log("loaded", this.imgsrc);
      this.$emit("load");
      this.loaded = true;
    },
  },
  data() {
    return {
      loaded: false,
    };
  },
};
</script>