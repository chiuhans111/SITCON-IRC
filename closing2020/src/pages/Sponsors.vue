<template>
  <div id="app">
    <template v-for="(sponsor, i) in data.sponsor">
      <div :key="'sponsor-' + i">
        {{ sponsor }}
        <hr />
      </div>
    </template>
  </div>
</template>

<script>
import data from "../loader";

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
  },
  mounted() {},
  destroyed() {},
};
</script>
