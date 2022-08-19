import React, { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";
import DiaryList from "../components/DiaryList";
import Header from "../components/Header";
import MyButton from "../components/MyButton";

const Home = () => {
  const diaryList = useContext(DiaryStateContext);  //App.js에서 data 받아오기

  const [curDate, setCurDate] = useState(new Date());
  const [data, setData] = useState([]); //curMonth 기준으로 해당 달 안에 작성된 다이어리 모음

  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0] 
    titleElement.innerHTML = '감정 일기장'  ////Home 랜더링될 때 index.html에서 title 변경
  }, [])

  useEffect(() => {
    if (diaryList.length >= 1) {
      const firstDay = new Date(  //ex) 22년 8월 1일
        curDate.getFullYear(),
        curDate.getMonth(),
        1
      ).getTime();

      const lastDay = new Date( //ex) 22년 8월 31일 23시 59분 59초
        curDate.getFullYear(),
        curDate.getMonth() + 1,
        0,
        23,
        59,
        59
      ).getTime();

      setData(
        diaryList.filter(
          (it) => firstDay <= parseInt(it.date) && parseInt(it.date) <= lastDay
        )
      );
    }
  }, [diaryList, curDate]); //curDate가 바뀌는 경우(다른 달에 작성된 다이어리를 보고 싶은 경우) 또는 diaryList가 변경되는 경우(추가, 삭제, 수정)

  const increaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() + 1)
    );
  };

  const decreaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() - 1)
    );
  };

  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth()+1}월`; //getMonth 메서드는 0 ~ 11 까지로 계산하므로 1을 더해줘야 제대로 된 값을 가져올 수 있음(0월 -> 1월)
  
  return (
    <div>
      <Header
        headText={headText}
        leftChild={<MyButton text={"<"} onClick={decreaseMonth} />} //defaultProps type: 'default'
        rightChild={<MyButton text={">"} onClick={increaseMonth} />}
      />
      <DiaryList diaryList={data} />
    </div>
  );
};

export default Home;
