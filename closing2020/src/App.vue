<template>
  <div id="app">
    <Background class="background" :t="t" :p="p" :b="b"></Background>
    <img class="cover" src="../src/assets/img/define_16_9.png" alt />
    <div class="content" ref="content">
      <div class="big-gap" ref="anchor-0"></div>
      <h1>#CREDITS</h1>

      <div class="big-gap" ref="anchor-1"></div>
      <h1>講者</h1>
      <hr />
      <p>按照字母及筆畫順序</p>
      <div class="staff-group">
        <Speaker
          v-for="(speaker, i) in data.speakers"
          :key="'speaker-'+i"
          :info="speaker"
          @load="load('speaker', data.speakers.length)"
        ></Speaker>
      </div>
      <div class="small-gap" ref="anchor-2"></div>

      <div class="big-gap" ref="anchor-3"></div>

      <h1>工作人員</h1>
      <div class="staff">
        <template v-for="(group, i) in data.staff">
          <div :ref="'anchor-'+(i+4)" :key="'group-anchor-'+i" class="small-gap"></div>
          <Group :key="'group-'+i" :info="group" @load="load('staff', data.staff.length)"></Group>
        </template>
      </div>

      <div class="big-gap" ref="anchor-16"></div>
      <div class="small-gap" ref="anchor-17"></div>

      <div class="sponsor">
        <template v-for="(sponsor, i) in data.sponsor">
          <div :ref="'anchor-'+(i+17)" :key="'sponsor-anchor-'+i" class="small-gap"></div>
          <Sponsor :key="'sponsor-'+i" :info="sponsor" @load="load('sponsor', data.sponsor.length)"></Sponsor>
        </template>
      </div>

      <div class="big-gap" ref="anchor-25"></div>
      <div class="small-gap" ref="anchor-26"></div>
      <h1>特別感謝</h1>
      <div class="thanks">
        <div class="thanks-item" v-for="(item,i) in data.thanks" :key="'thanks-'+i">{{item}}</div>
      </div>
      <div class="big-gap" ref="anchor-27"></div>
      <div class="big-gap" ref="anchor-28"></div>
      <div class="big-gap" ref="anchor-29"></div>
      <div class="big-gap"></div>
      <div class="big-gap"></div>
    </div>
  </div>
</template>

<script>
import data from "./loader";
import Group from "./components/Group";
import Speaker from "./components/Speaker";
import Sponsor from "./components/Sponsor";
import Background from "./components/Background";

const BPM = 115;
const FPS = 30;
let SCROLL_SPEED = 6;

window.setScrollSpeed = function (speed) {
  SCROLL_SPEED = speed;
};

export default {
  name: "App",
  components: {
    Group,
    Speaker,
    Background,
    Sponsor,
  },
  data() {
    return {
      data,
      remain_loading: {},
      t: 0, // text animation hint
      p: 0, // page scroll pixel
      b: 0, // beats
      interval: 0,
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
        setTimeout(() => {
          window.scrollTo(0, 0);

          if (window.puppeteer) {
            this.puppeteerUpdate();
          } else {
            this.interval = window.setInterval(function () {
              scrollBy(0, SCROLL_SPEED);
            }, 1000 / FPS);
          }
        }, 10);
      }
    },

    update() {
      let t = 0;

      let anchors = [];

      for (let i in this.$refs) {
        if (i.startsWith("anchor-")) {
          let el = this.$refs[i];
          if (el == undefined) continue;
          if (el.length > 0) el = el[0];
          // console.log(i, el)
          let rect = el.getBoundingClientRect();
          let begin = window.innerHeight / 2;
          let end = window.innerHeight / 2 - rect.height * 1.5;

          if (begin - end <= 0) end = begin - 1;

          let id = parseInt(i.substr(7));
          let f = Math.max(0, Math.min(1, (rect.y - begin) / (end - begin)));
          anchors.push([id, f]);
        }
      }

      anchors.sort((a, b) => a[0] - b[0]);
      // console.log(anchors);
      anchors.map((x) => {
        let id = x[0];
        let f = x[1];
        t = t * (1 - f) + f * id;
      });

      this.t = t;
      this.p = -window.pageYOffset;
      this.b = ((window.pageYOffset / SCROLL_SPEED / FPS) * BPM) / 60;
    },
    puppeteerUpdate() {
      let me = this;
      scrollBy(0, SCROLL_SPEED);
      if (
        window.pageYOffset >=
        document.body.scrollHeight - window.innerHeight - 1
      )
        window.pup_end();
      this.update();
      setTimeout(() => {
        window.pup_render().then(function () {
          me.puppeteerUpdate();
        });
      }, 0);
    },
  },
  mounted() {
    window.addEventListener("scroll", this.update);
  },
  destroyed() {
    window.removeEventListener("scroll", this.update);
    window.clearInterval(this.interval);
  },
};
</script>
