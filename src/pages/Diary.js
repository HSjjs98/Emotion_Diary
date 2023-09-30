import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import Header from "../components/Header";
import MyButton from "../components/MyButton";
import { emotionList } from "../util/emotion";

const getStringDate = (date) => { //date 객체를 파라미터로 받음 ex.Fri Aug 15 2022 09:00:00 GMT+0900 (Korean Standard Time)
  return date.toISOString().slice(0, 10); //YYYY-MM-DD
};

const Diary = () => {
  const [data, setData] = useState();
  const navigate = useNavigate()

  const { id } = useParams();
  const diaryList = useContext(DiaryStateContext);

  useEffect(() => { //페이지 랜더링 될때 한번 title 태그 내부 텍스트 바꿔주기
    const titleElement = document.getElementsByTagName('title')[0]
    titleElement.innerHTML = `감정 일기장- ${id}번 일기`
  }, [id])

  useEffect(() => {
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find((it) => it.id === parseInt(id));
      if (targetDiary) { //타켓 다이어리가 다이어리 리스트에 있다면
        setData(targetDiary);
      } else { //타겟 다이어리가 다이어리 리스트에 없다면
        alert("없는 일기입니다.");
        navigate('/Emotion_Diary', { replace: true }) //HOME으로 돌아가며 전 페이지로 돌아갈 수 없음
      }
    }
  }, [id, diaryList,navigate]); //타켓 다이어리가 바뀌는 경우, 다이어리 리스트가 바뀌는 경우 보여지는 Data값이 변해야하므로

  if (!data) {
    return <div className="DiaryPage">로딩중입니다...</div>;
  } else {
    const date = getStringDate(new Date(data.date));
    const curEmotionData = emotionList.find( //util 내부 emotion.js 파일 안 emotionList에서 가져오기
      (it) => it.emotion_id === parseInt(data.emotion)
    );
    return (
      <div className="DiaryPage">
        <Header
          headText={`${date} 기록`}
          leftChild={
            <MyButton
              text={"< 뒤로가기"}
              onClick={() => {
                navigate(-1); //뒤로가기
              }}
            />
          }
          rightChild={
            <MyButton
              text={"수정하기"}
              onClick={() => {
                navigate(`Emotion_Diary/edit/${id}`)
              }}
            />
          }
        />
        <article>
          <section>
            <h4>오늘의 감정</h4>
            <div
              className={[
                "diary_img_wrapper",
                `diary_img_wrapper_${data.emotion}`,
              ].join(" ")}
            >
              <img
                alt={`emotion${data.emotion}`}
                src={ //상황에 따라 이미지를 public에서 관리하거나 src에서 관리하는데 이번 프로젝트에서는 public에서 관리
                  process.env.PUBLIC_URL + `/emotion/emotion${data.emotion}.png` //이미지 경로를 public 폴더에서 절대 경로로 가져오기(PUBLIC_URL 환경변수 사용)
                }
              />
              <div className="emotion_descript">
                {curEmotionData.emotion_descript}
              </div>
            </div>
          </section>
          <section>
            <h4>오늘의 일기</h4>
            <div className="diary_content_wrapper">
              <p>{data.content}</p>
            </div>
          </section>
        </article>
      </div>
    );
  }
};

export default Diary;
