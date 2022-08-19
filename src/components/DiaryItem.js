import React from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "./MyButton";

const DiaryItem = ({ id, emotion, content, date }) => {
  const navigate = useNavigate()
  const strDate = new Date(parseInt(date)).toLocaleDateString('ko');  //Date 객체의 날짜 부분을 지역의 언어에 맞는 문자열 표현으로 반환

  const goDetail = () => {
    navigate(`/diary/${id}`)
  };

  const goEdit = () => {
    navigate(`/edit/${id}`)
  }

  return (
    <div className={"DiaryItem"}>
      <div
        onClick={goDetail}
        className={[
          "emotion_img_wrapper",
          `emotion_img_wrapper_${emotion}`,
        ].join(" ")}
      >
        <img src={process.env.PUBLIC_URL + `/emotion/emotion${emotion}.png`} alt=''/>
      </div>
      <div onClick={goDetail} className="info_wrapper">
        <div className="diary_date">{strDate}</div>
        <div className="diary_content_preview">{content.slice(0, 25)}</div>  {/*다이어리 내용이 너무 길면 25자까지 끊어서 미리 보여주기*/}
      </div>
      <div className="btn_wrapper">
        <MyButton onClick={goEdit} text={"수정하기"} />
      </div>
    </div>
  );
};

export default React.memo(DiaryItem);