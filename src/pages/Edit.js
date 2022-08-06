import React, { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";
import { useNavigate, useParams} from 'react-router-dom';
import DiaryEditor from "../components/DiaryEditor";

const Edit = () => {
  const navigate = useNavigate()
  const [originData, setOriginData] = useState();

  const diaryList = useContext(DiaryStateContext);
  const { id } = useParams();

  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0]
    titleElement.innerHTML = `감정 일기장- ${id}번 일기 수정`
  }, [])

  useEffect(() => {
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find((it) => it.id === parseInt(id));
      if (targetDiary) {
        setOriginData(targetDiary);
      } else {
        alert("없는 일기입니다.");
        navigate('/', { replace: true })
      }
    }
  }, [id, diaryList,navigate]);

  return (
    <div>
      {originData && <DiaryEditor isEdit={true} originData={originData} />}
    </div>
  );
};

export default Edit;