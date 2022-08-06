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
  return date.toISOString().slice(0, 10);
};

const DiaryEditor = ({ isEdit, originData }) => {
  const navigate = useNavigate()
  const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);

  const [date, setDate] = useState("");
  const [emotion, setEmotion] = useState(3);
  const [content, setContent] = useState("");

  const contentRef = useRef(null);

  const handleClickEmote = useCallback((emotion) => {
    setEmotion(() => emotion);
  }, [])

  const handleRemove = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onRemove(originData.id);
      navigate('/', { replace: true })
    }
  };

  const handleSubmit = () => {
    if (content.length < 5) {
      contentRef.current.focus();
      return;
    }

    if (
      window.confirm(
        isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?"
      )
    ) {
      if (!isEdit) {
        onCreate(date, content, emotion);
      } else {
        onEdit(originData.id, date, content, emotion);
      }
      navigate('/', { replace: true })
    }
  };

  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(parseInt(originData.date))));
      setContent(originData.content);
      setEmotion(originData.emotion);
    } else {
      setDate(getStringDate(new Date()));
    }
  }, [isEdit, originData]);

  const env = process.env;
  env.PUBLIC_URL = env.PUBLIC_URL || "";

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
              onChange={(e) => setDate(e.target.value)}
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
                isSelected={it.emotion_id === emotion}
                onClick={handleClickEmote}
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
              placeholder={"오늘은 어땠나요?"}
              value={content}
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
