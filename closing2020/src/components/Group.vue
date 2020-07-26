<template>
  <div>
    <h2>{{info.name}}</h2>
    <p>{{info.description}}</p>
    <div class="staff-group">
      <Member v-for="(member, i) in info.members" :key="'member-'+i" :info="member" @load="load(i)"></Member>
    </div>
  </div>
</template>

<script>
import Member from "./Member";
export default {
  props: ["info"],
  components: {
    Member,
  },
  methods: {
    load() {
      if (this.remain_loading == null)
        this.remain_loading = this.info.members.length;
      this.remain_loading--;
      if (this.remain_loading == 0) {
        console.log("loaded", this.info.name);
        this.loaded = true;
        this.remain_loading = null;
        this.$emit("load");
      }
    },
  },
  data() {
    return {
      remain_loading: null,
      loaded: false,
    };
  },
};
</script>