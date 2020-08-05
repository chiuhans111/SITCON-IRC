function get(url) {
  console.log("get", url);
  let xhr = new XMLHttpRequest();
  xhr.open("get", url);
  return new Promise((done) => {
    console.log("done", url);
    xhr.onload = function () {
      done(JSON.parse(xhr.response));
    };
    xhr.send();
  });
}

function TimeProcess(date) {
  let d = new Date(date);
  let h = d.getHours().toString();
  let m = d.getMinutes().toString();
  if (h.length < 2) h = "0" + h;
  if (m.length < 2) m = "0" + m;
  return `${h}:${m}`;
}

function md2html(md) {
  var lines = md.split("\n").filter((x) => x.trim().length > 0);
  return lines
    .map((x) => {
      var match_header = x.match(/^(#+)\s(.*)$/);
      console.log(match_header);
      if (match_header) {
        var header_num = match_header[1].length;
        var header_content = match_header[2];
        return `<h${header_num}>${header_content}</h${header_num}>`;
      }

      return `<p>${x}</p>`;
    })
    .join("");
}

var noWrapList = [
  "大型資訊",
  "鯉魚教の教主崇拜分析",
  "有愛就沒把專案做出來，對吧",
  "這次換駭客當鬼來抓你了",
  "從零開始打造多維",
  "是不是吃錯藥",
  "指令式編程程式碼",
  "以資訊專長跳脫傳統升學體制",
  "聚集在一起吧",
  "架個網站不想花錢",
  "幫忙操控電腦嗎",
  "和他的困難點",
  "獻上你的肝",
  "自由與責任",
  "自我意識",
  "淺談 IB-AR 技術",
  "你也可以是 CIO",
  "要不要試試 Flutter?",
  "邁出 Windows",
  "演算法對其的影響",
  "金融型男主管",
  "我們一起放棄社群的時刻",
  
];

function FixTitle(title) {
  noWrapList.map((word) => {
    title = title.replace(new RegExp(word, "g"), [...word].join("\uFEFF"));
  });
  return title;
}

var puppeteer;
window.i = 0;

var app = new Vue({
  el: "#app",
  data: {
    name: "hi",
    session: {},
    title: "",
    desc: "",
    speakers: [],
    start: "",
    end: "",
    type: "",
    tags: [],
    data: {},
    i: 0,
  },
  methods: {
    set(i) {
      var data = this.data;
      i = i % data.sessions.length;
      var session = data.sessions[i];

      this.session = session;

      console.log("current session", session);

      this.title = FixTitle(session.zh.title);

      this.desc = md2html(session.zh.description);

      var speakers = session.speakers;

      var speakers_table = {};
      data.speakers.map((speaker) => {
        speakers_table[speaker.id] = speaker;
      });

      this.speakers = speakers.map((speaker_id) => {
        var speaker = speakers_table[speaker_id];
        var name = speaker.zh.name;
        var bio = md2html(speaker.zh.bio);
        var avatar = speaker.avatar;

        if (avatar.match("stone")) {
          avatar = "https://sitcon.org/2020/img/sitcon-logo.png";
        }

        return {
          name,
          bio,
          avatar,
          loaded: false,
        };
      });

      this.start = TimeProcess(session.start);
      this.end = TimeProcess(session.end);

      var types_table = {};
      data.session_types.map((type) => {
        types_table[type.id] = type;
      });

      this.type = types_table[session.type].zh.name;

      var tags_table = {};
      data.tags.map((tag) => {
        tags_table[tag.id] = tag;
      });

      this.tags = session.tags.map((x) => tags_table[x].zh.name);

      this.i = i;
      this.checkLoad();
    },
    loaded(speaker) {
      console.log("load");
      speaker.loaded = true;

      this.checkLoad();
    },
    checkLoad() {
      var i = this.i;

      if (this.speakers.every((x) => x.loaded)) {
        var me = this;
        setTimeout(() => {
          if (puppeteer) {
            var room = me.session.room;
            var start = me.start.replace(":", "");
            var end = me.end.replace(":", "");

            pup_render(
              room +
                "_" +
                start +
                "_" +
                end +
                "_" +
                me.session.zh.title.replace(/[？?\n\sの]/g, "_")
            ).then(function () {
              setTimeout(() => {
                me.set(i + 1);
              }, 10);
            });
          } else {
            setTimeout(() => {
              this.set(window.i);
            }, 100);
          }
        }, 100);
      }
    },
  },
});

get("https://sitcon.org/2020/json/session.json").then(function (data) {
  console.log(data);

  app.$data.data = data;

  app.set(0);
});
