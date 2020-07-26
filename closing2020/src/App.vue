<template>
  <div id="app">
    <Background class="background" :t="t"></Background>
    <div class="content">
      <div class="big-gap" ref="anchor-0"></div>
      <div class="big-gap" ref="anchor-1"></div>
      <h1>講者</h1>
      <p>按照字母及筆畫順序</p>
      <div class="staff-group">
        <Speaker
          v-for="(speaker, i) in data.speakers"
          :key="'speaker-'+i"
          :info="speaker"
          @load="load('speaker', data.speakers.length)"
        ></Speaker>
      </div>
      <div class="big-gap" ref="anchor-2"></div>


      <h1>工作人員</h1>
      <div class="staff">
        <template v-for="(group, i) in data.staff">
          <div :ref="'anchor-'+(i+3)" :key="'group-anchor-'+i" class="small-gap"></div>
          <Group :key="'group-'+i" :info="group" @load="load('staff', data.staff.length)"></Group>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import data from "./loader";
import Group from "./components/Group";
import Speaker from "./components/Speaker";
import Background from "./components/Background";

export default {
  name: "App",
  components: {
    Group,
    Speaker,
    Background,
  },
  data() {
    return {
      data,
      remain_loading: {},
      t: 0,
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

    update() {
      let t = 0;

      for (let i in this.$refs) {
        if (i.startsWith("anchor-")) {
          let el = this.$refs[i];
          if (el == undefined) continue;
          if (el.length > 0) el = el[0];
          // console.log(i, el)
          let rect = el.getBoundingClientRect();
          let begin = window.innerHeight/2;
          let end = window.innerHeight/2 - (rect.height + 1);

          let id = parseInt(i.substr(7));
          let f = Math.max(0, Math.min(1, (rect.y - begin) / (end - begin)));
          t = t * (1 - f) + f * id;
        }
      }

      this.t = t;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.update);
  },
};
</script>
