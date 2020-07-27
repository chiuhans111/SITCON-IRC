<template>
  <div id="app">
    <div class="sponsor">
      <template v-for="(sponsorGroup,i) in data.sponsor">
        <div :key="'sponsor-group-' + i" class="sponsor-group">
          <h1>{{getLevel(sponsorGroup)}}</h1>
          <div class="sponsor-break"></div>
          <template v-for="(sponsor, j) in sponsorGroup.sponsors">
            <div :key="'sponsor-' + j" class="sponsor-group_item">
              <img
                :src="imgsrc(sponsor)"
                alt
                hidden
                @load="load('sponsor'+sponsorGroup.level,sponsorGroup.sponsors.length)"
              />
              <div
                :class="getClass(sponsor)"
                :style="{
              backgroundImage: `url(${imgsrc(sponsor)}`
              }"
              ></div>
              <!-- {{ sponsor }} -->
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import data from "../loader";

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
  name: "App",
  components: {},
  data() {
    return {
      data,
      remain_loading: {},
    };
  },

  methods: {
    load(type, all) {
      if (this.remain_loading[type] == null) this.remain_loading[type] = all;
      this.remain_loading[type]--;
      console.log(this.remain_loading[type]);
      if (this.remain_loading[type] == 0) {
        console.log("loaded", type);
        this.remain_loading[type] = null;
      }

      var all_loaded = true;
      for (var i in this.remain_loading) {
        if (this.remain_loading[i] != null) {
          all_loaded = false;
        }
      }

      if (all_loaded) {
        console.log("all loaded");
      }
    },
    imgsrc(sponsor) {
      return "https://sitcon.org/2020/img/sponsors/" + sponsor.image;
    },
    getClass(sponsor) {
      let obj = { "sponsor-group_item-img": true };
      obj[sponsor.level] = true;
      return obj;
    },
    getLevel(sponsor) {
      return LEVEL_TEXT[sponsor.level];
    },
  },
  mounted() {},
  destroyed() {},
};
</script>
