<template>
  <div class="side_main">
    <template v-for="(nextSession, i) in nextSessions">
      <div
        :class="{
        'side_main_top': true,
        'first': i==0
        }"
        :key="'sessions-top-'+i"
      >
        <template v-if="i==0">
          <div class="left">
            <p>NEXT UP</p>
          </div>
          <div class="right">
            <p>{{nextSession.info.startTime}} - {{nextSession.info.endTime}}</p>
          </div>
          <div class="percent">
            <div class="bar" :style="{
                width: nextSession.percent
              }"></div>
          </div>
        </template>

        <template v-else>
          <div class="left">
            <p>{{nextSession.info.zh.title}}</p>
            <!-- <span v-for="(p,i) in nextSession.info.speakers" :key="'speak-'+i">{{p.zh.name}}</span> -->
          </div>
          <div class="right">
            <p>
              {{nextSession.info.startTime}}
              <br />
              {{nextSession.info.endTime}}
            </p>
          </div>
        </template>
      </div>
      <div class="side_main_content" v-if="i==0" :key="'sessions-content-'+i">
        <h1>{{nextSession.info.zh.title}}</h1>
        <!-- <p v-for="(c,i) in nextSession.info.description" :key="'desc-'+i">{{c}}</p> -->
        <div v-for="(p,i) in nextSession.info.speakers" :key="'speak-'+i">
          <h2>
            <!-- <span style="font-weight:100">About</span> -->
            {{p.zh.name}}
          </h2>
          <!-- <p v-for="(c,i) in p.zh.bio" :key="'bio-'+i">{{c}}</p> -->
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import session from "../assets/json/session.json";
var t = 0;
function now() {
  t += 10000;
  return new Date("2020-03-28T08:00:00+08:00").getTime() + t;
}

function TimeProcess(date) {
  let d = new Date(date);
  let h = d.getHours().toString();
  let m = d.getMinutes().toString();
  if (h.length < 2) h = "0" + h;
  if (m.length < 2) m = "0" + m;
  return `${h}:${m}`;
}
session.speakers.map(x => {
  x.zh.bio = x.zh.bio.split("\n");
});

var rooms = session.rooms.map(room => {
  room.sessions = session.sessions
    .filter(s => s.room == room.id)
    .map(s => {
      s.startTime = TimeProcess(s.start);
      s.endTime = TimeProcess(s.end);
      s.start = new Date(s.start).getTime();
      s.end = new Date(s.end).getTime();
      s.speakers = s.speakers
        .map(p => {
          return session.speakers.filter(x => x.id == p)[0];
        })
        .filter(x => x != null);

      s.description = s.zh.description.split("\n");
      return s;
    })
    .sort((a, b) => {
      return a.start - b.start;
    });
  return room;
});

function nextSession() {
  return rooms[0].sessions
    .filter(session => {
      var buffer = true;
      if (session.zh.title == "休息時間") buffer = false;
      if (session.zh.title == "入場時間") buffer = false;
      if (session.zh.title == "午餐") buffer = false;
      if (session.zh.title == "換場") buffer = false;
      var bufferTime = buffer ? 5 * 60 * 1000 : 0;

      return session.start + bufferTime > now();
    })
    .slice(0, 10)
    .map(session => {
      return {
        info: session,
        percent:
          Math.max(
            0,
            Math.min(1, (now() - session.start) / (5 * 60 * 1000)) + 1
          ) *
            100 +
          "%"
      };
    });
}

export default {
  data() {
    return {
      interval_id: null,
      nextSessions: nextSession()
    };
  },
  mounted() {
    var me = this;
    this.interval_id = setInterval(() => {
      me.nextSessions = nextSession();
    }, 500);
  },
  destroyed() {
    clearInterval(this.interval_id);
  }
};
</script>
<style lang="scss">
h1 {
  font-size: 24px;
  text-align: left;
  margin: 0px 0px 20px;
}

h2 {
  font-size: 20px;
  text-align: left;
  margin: 20px 0px 5px;
}

p {
  margin: 0 0 10px;
}

hr {
  margin: -1px;
}

.side_main {
  width: 100%;
  height: 100%;
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.side_main_top {
  position: relative;
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: solid 1px gray;

  overflow: hidden;
  flex-shrink: 0;
  font-size: 16px;
  color: lightgray;
  background-color: #111;
  font-weight: 100;
  padding: 0px 20px;

  &.first {
    color: white;
    font-size: 18px;

    // border-bottom: solid 1px white;
    border-bottom: none;

    font-weight: bold;
  }

  .left {
    text-align: left;
  }
  .right {
    text-align: right;
    letter-spacing: 0.15em;
  }
  .room {
    position: absolute;
    opacity: 0.25;
    font-weight: bold;
    transform: skew(-20deg);
    font-size: 10em;
  }
  .percent {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.2;
    .bar {
      position: absolute;
      left: 0px;
      top: 0px;
      height: 100%;
      background-color: white;
    }
  }
}

.side_main_content {
  padding: 10px 20px 20px;
  flex-grow: 1;
  p {
    font-weight: 100;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 0.05em;
  }
  border-bottom: solid 1px white;
}
</style>