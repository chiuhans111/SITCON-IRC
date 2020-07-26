<template>
  <div>
    <h1>{{level}}</h1>
    <div class="sponsor-group">
      <div class="sponsor-group_sponsor" v-for="(sponsor,i) in info.sponsors" :key="'sponsor'+i">
        <img :src="imgsrc(sponsor)" @load="load" hidden />
        <div
          class="sponsor-group_sponsor-img"
          :style="{
            backgroundImage: `url(${imgsrc(sponsor)})`
            }"
        ></div>
        <h3>{{sponsor.name}}</h3>
      </div>
    </div>
  </div>
</template>

<script>
const LEVEL_TEXT = {
  holder: "主辦單位",
  "co-holder": "共同主辦",
  "co-organizer": "協辦單位",
  "level-1": "深耕級",
  "level-2": "前瞻級",
  "level-3": "新芽級",
  thank: "特別感謝",
  media: "媒體夥伴",
};

export default {
  props: ["info"],
  data() {
    return {
        remain_loading : null,
        loaded: false
    };
  },
  computed: {
    level() {
      return LEVEL_TEXT[this.info.level];
    },
  },
  methods: {
    imgsrc(sponsor) {
      return "https://sitcon.org/2020/img/sponsors/" + sponsor.image;
    },
    load() {
      if (this.remain_loading == null)
        this.remain_loading = this.info.sponsors.length;
      this.remain_loading--;
      if (this.remain_loading == 0) {
        console.log("loaded", this.info.name);
        this.loaded = true;
        this.remain_loading = null;
        this.$emit("load");
      }
    },
  },
};
</script>