// CodeSandBox 상에서 수행될 수 있도록 추가함, Local기준 추가할 필요 X
const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL || "";

export const emotionList = [
  {
    emotion_id: 1,
    emotion_img: process.env.PUBLIC_URL + `/emotion/emotion1.png`,
    emotion_descript: "완전 좋음"
  },
  {
    emotion_id: 2,
    emotion_img: process.env.PUBLIC_URL + `/emotion/emotion2.png`,
    emotion_descript: "좋음"
  },
  {
    emotion_id: 3,
    emotion_img: process.env.PUBLIC_URL + `/emotion/emotion3.png`,
    emotion_descript: "그럭저럭"
  },
  {
    emotion_id: 4,
    emotion_img: process.env.PUBLIC_URL + `/emotion/emotion4.png`,
    emotion_descript: "나쁨"
  },
  {
    emotion_id: 5,
    emotion_img: process.env.PUBLIC_URL + `/emotion/emotion5.png`,
    emotion_descript: "끔찍함"
  }
];
