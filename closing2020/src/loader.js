function get(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("get", url);
  return new Promise((done) => {
    xhr.send();
    xhr.onload = function() {
      done(JSON.parse(xhr.response));
    };
  });
}

var data = {
  staff: {},
  speakers: {},
  sponsor: {},
};

var thanks = [
  "朱庭宏",
  "官承翰",
  "cras4202tw",
  "Yung-Yu Chen",
  "Sean Chang",
  "安安",
  "Can",
  "張文沛",
  "塘",
  "李昀陞",
  "Henry Law",
  "林大中",
  "陳軍翰",
  "賴翔偉",
  "李恆寬",
  "林",
  "楊承昊",
  "謝博宇",
  "黃嘉安",
  "張秉棋",
  "葉昱震",
  "陳哲雋",
  "林博仁",
  "張嘉哲",
  "黃晴威",
  "劉宇彤",
  "陳0燕",
  "張振",
  "陳晉緯",
  "李文資",
  "林小姐",
  "莊秉澂",
  "陳勁",
  "王同學",
  "蔡宗翰",
  "郭同學",
  "黃子軒",
  "蔡承祐",
  "林小姐",
  "莊x華",
  "陳子峯",
  "杰夫禮策略行銷管理顧問有限公司",
  "劉家霂",
  "戴宏諺",
  "張××",
  "willy_Hsu",
  "王O全",
  "謝晨",
  "珈瑞",
  "珈瑞",
  "PENNYKEN",
  "Victor",
  "洪儷娟",
  "徐正修",
  "周恩賢",
  "周淑芬",
  "徐子鈞",
  "davidhcefx",
  "劉聖龍",
  "以及超過20位匿名捐贈者",
];

Promise.all([
  get("https://sitcon.org/2020/json/staff.json"),
  get("https://sitcon.org/2020/json/session.json"),
  get("https://sitcon.org/2020/json/sponsor.json"),
  new Promise((done) => done(thanks)),
]).then(([staff, session, sponsor, thanks]) => {
  data.staff = staff;
  data.speakers = session.speakers
    .sort((a, b) => {
      return a.zh.name.localeCompare(b.zh.name, "zh-Hant");
    })
    .map((x) => {
      x.zh.name = x.zh.name.replace(/.+\s-\s/g, "");
      return x;
    });

  let sponsorGroups = {};
  sponsor.map((x) => {
    if (sponsorGroups[x.level] == null) sponsorGroups[x.level] = [];
    sponsorGroups[x.level].push(x);
  });
  data.sponsor = Object.keys(sponsorGroups).map((key) => ({
    level: key,
    sponsors: sponsorGroups[key],
  }));

  data.thanks = thanks;
});

export default data;
