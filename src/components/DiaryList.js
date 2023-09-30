import React, { useState } from "react";
import MyButton from "./MyButton";
import { useNavigate } from "react-router-dom";
import DiaryItem from "./DiaryItem";

const sortOptionList = [
  { value: "latest", name: "최신순" },
  { value: "oldest", name: "오래된 순" },
]

const filterOptionList = [
  { value: "all", name: "전부다" },
  { value: "good", name: "좋은 감정만" },
  { value: "bad", name: "안좋은 감정만" },
]

const ControlMenu = React.memo(({ value, onChange, optionList }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="ControlMenu"
    >
      {optionList.map((it, idx) => (
        <option key={idx} value={it.value}>
          {it.name}
        </option>
      ))}
    </select>
  );
})

const DiaryList = ({ diaryList }) => {
  const navigate = useNavigate(); //특정 행동을 했을 때 해당 주소로 이동
  const [sortType, setSortType] = useState("latest"); //초기값 최신순으로 보여주기
  const [filter, setFilter] = useState("all");  //초기값 전부다 보여주기

  const getProcessedDiaryList = () => {
    const filterCallback = (item) => {  //item.emotion과 filter 값에 따라서 True 또는 False 반환
      if (filter === "good") {
        return parseInt(item.emotion) <= 3;
      } else {
        return parseInt(item.emotion) > 3;
      }
    }
    const compare = (a, b) => {
      if (sortType === "latest") {  //sortType에 따라서 date 기준으로 오름차순 또는 내림차순으로 정렬하는 비교 함수
        return parseInt(b.date) - parseInt(a.date); //내림차순
      } else {
        return parseInt(a.date) - parseInt(b.date); //오름차순
      }
    };
    const copyList = JSON.parse(JSON.stringify(diaryList)); //diaryList 객체 문자열로 변환 후 다시 객체로 변환 (= 얕은 복사)

    const filteredList = filter === "all" ? copyList : copyList.filter((it) => filterCallback(it)); //감정점수에 따라 안보여지는 다이어리 처리

    const sortedList = filteredList.sort(compare); //작성된 시각에 따라 다이어리 순서 정렬

    return sortedList;
  };

  return (
    <div className="DiaryList">
      <div className="menu_wrapper">
        <div className="left_col">
          <ControlMenu  //setSortType(e.target.value)
            value={sortType}
            onChange={setSortType}
            optionList={sortOptionList}
          />
          <ControlMenu
            value={filter}
            onChange={setFilter}
            optionList={filterOptionList}
          />
        </div>
        <div className="right_col">
          <MyButton
            text={"새 일기쓰기"}
            type={"positive"}
            onClick={() => navigate('/Emotion_Diary/new')}
          />
        </div>
      </div>
      {getProcessedDiaryList().map((it) => (  //홈 화면에 보여질 다이어리 목록을 props로 전달; 각 다이어리는 DiaryItem에서 구현
        <DiaryItem key={it.id} {...it} />
      ))}
    </div>
  );
};

DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;