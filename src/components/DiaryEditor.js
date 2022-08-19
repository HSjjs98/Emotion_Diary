import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import EmotionItem from "./EmotionItem";
import Header from "./Header";
import MyButton from "./MyButton";
import { emotionList } from "../util/emotion";
import { useNavigate } from "react-router-dom";
import { DiaryDispatchContext } from "./../App";

const getStringDate = (date) => {
  return date.toISOString().slice(0, 10); //Date 객체를 받아 문자열로 변환; slice(0,10) => YYYY-MM-DD만 남기고 나머지는 버림
};

const DiaryEditor = ({ isEdit, originData }) => {
  const navigate = useNavigate()
  const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);  //비구조화 할당

  const [date, setDate] = useState("");
  const [emotion, setEmotion] = useState(3);  //emotion default = 그럭저럭
  const [content, setContent] = useState("");

  const contentRef = useRef(null);
  
  const handleClickEmote = useCallback((emotion) => { //컴포넌트가 랜더링될 때마다 생성x; 배열 안의 값이 바뀌지 않는다면 기존 함수를 계속 반환; 빈 배열을 줬으므로 컴포넌트 랜더링 여부에 관계 없이 항상 같은 함수 반환
    setEmotion(() => emotion);
  }, [])

  const handleRemove = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onRemove(originData.id);
      navigate('/', { replace: true })  //다이어리 삭제 후 Home 화면으로 돌아가며 바로 전 페이지로 돌아갈 수 없음
    }
  };

  const handleSubmit = () => {
    if (content.length < 3) { //일기 내용은 3글자 이상 입력
      contentRef.current.focus(); //useRef로 textarea 선택 후 일기 내용 부족할 시 focus 주기
      return;
    }

    if (
      window.confirm(
        isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?"
      )
    ) {
      if (!isEdit) {  //새로운 일기를 작성하는 경우
        onCreate(date, content, emotion);
      } else {  //기존 일기를 수정하는 경우
        onEdit(originData.id, date, content, emotion);
      }
      navigate('/', { replace: true })
    }
  };

  useEffect(() => {
    if (isEdit) { //수정하는 경우 예전 데이터를 그대로 가져옴
      setDate(getStringDate(new Date(parseInt(originData.date))));  //예전에 일기가 작성된 시각
      setContent(originData.content);
      setEmotion(originData.emotion);
    } else { //새로 작성하는 겨우 일기 작성 시간을 현재로 맞춰줌
      setDate(getStringDate(new Date())); //현재 시각
    }
  }, [isEdit, originData]); //(다른 일기를 수정하는 경우) 또는 (일기 수정 작업 <-> 새로운 일기 쓰기 작업)

  return (
    <div className="DiaryEditor">
      <Header
        headText={isEdit ? "일기 수정하기" : "새로운 일기 쓰기"}
        leftChild={
          <MyButton
            text={"< 뒤로가기"}
            onClick={() => {
              navigate(-1)
            }}
          />
        }
        rightChild={
          isEdit && (
            <MyButton
              type={"negative"}
              text={"삭제하기"}
              onClick={handleRemove}
            />
          )
        }
      />
      <div>
        {/* 날짜 */}
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input-box">
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)} //화살표 함수 내에서는 this가 제대로 작동하지 않기 때문에 e.target.value 사용
              className="input_date"
              type="date"
            />
          </div>
        </section>

        {/* 감정 */}
        <section>
          <h4>오늘의 감정</h4>

          <div className="input-box emotion-list-wrapper">
            {emotionList.map((it) => (
              <EmotionItem
                key={it.emotion_id}
                {...it}
                isSelected={it.emotion_id === emotion} //수정 전 감정이 이미 선택되어 있음
                onClick={handleClickEmote} //다른 감정을 선택했을 때 처리
              />
            ))}
          </div>
        </section>

        {/* 오늘의 일기 */}
        <section>
          <h4>오늘의 일기</h4>

          <div className="input-box text_warpper">
            <textarea
              ref={contentRef}
              value = {content} //수정 전 일기 내용이 이미 적혀 있음
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>

        {/* 취소, 작성 컨트롤 박스 */}
        <section>
          <div className="control-box">
            <MyButton
              text={"취소하기"}
              onClick={() => {
                navigate(-1);
              }}
            />
            <MyButton
              text={"작성완료"}
              type={"positive"}
              onClick={handleSubmit}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
export default DiaryEditor;
