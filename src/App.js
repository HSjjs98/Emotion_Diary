import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";
import { createContext, useEffect, useReducer, useRef } from "react";

export const DiaryStateContext = createContext(null); //전역 변수 설정
export const DiaryDispatchContext = createContext(null);

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT": {  //처음에 한번 실행되는 case
      return action.data;
    }
    case "CREATE": {  //새 일기를 작성할 때 실행되는 case
      const newItem = { //새로 작성한 일기의 정보
        ...action.data
      };
      newState = [newItem, ...state]; //새로 작성한 일기가 dataId가 가장 크므로 가장 앞에 배치
      break;
    }
    case "REMOVE": {  //특정 일기를 삭제했을 때 실행되는 case
      newState = state.filter((it) => it.id !== action.targetId); //모든 diary의 id를 targetId와 비교하여 다른 것만 newState에 대입
      break;
    }
    case "EDIT": {  //특정 일기를 수정할 때 실행되는 case
      newState = state.map((it) =>  //모든 diary의 id를 targtId와 비교하여 같으면 제공받은 action.data와 교체; 다이어리 배치 순서는 바뀌지 않음
        it.id === action.data.id
          ? {
              ...action.data
            }
          : it
      );
      break;
    }
    default:
      return state;
  }
  localStorage.setItem("diary", JSON.stringify(newState)) //newState를 문자열 형태로 localStorage['diary']에 저장
  return newState;
};

const App = () => {
  const [data, dispatch] = useReducer(reducer, []); //dispatch 호출하면 reducer가 실행되고 리턴값이 state이 됨; useReducer 2번째 parameter는 state 초기값
  const dataId = useRef(1); //특정 DOM을 선택하거나 컴포넌트 안에서 조회 및 수정 가능한 변수 관리할 때 사용(변수가 업데이트 될 때 컴포넌트 리랜더링 x)
  useEffect(() => { //배열 내에 들어있는 값이 변화하면 콜백 함수가 수행됨; 빈 배열이 주어졌으므로 마운트 될 때 한번만 실행되고 이후 실행되지 않음
    const localData = localStorage.getItem('diary') //string
    if(localData){
      const diaryList = JSON.parse(localData).sort( //string to object
        (a,b) => parseInt(b.id) - parseInt(a.id)  //function body가 양수가 되는 경우 a,b 순서 바꿈
      )
      if (diaryList.length >= 1){ //표시할 다이어리가 한개 이상 있는 경우
      dataId.current = parseInt(diaryList[0].id) + 1  //다음 다이어리 dataId = 현재 dataId가 가장 큰 다이어리의 dataId 값 + 1
      dispatch({type: "INIT", data: diaryList}) // reducer에 action = {type: "INIT", data: diaryList} 객체를 제공;
      }
    }
  }, [])

  const onCreate = (date, content, emotion) => {
    const nowSavingDate = new Date(date); //일기가 작성된 시간(YYYY-MM-DD)
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: nowSavingDate.getTime(),  //1970 1월 1일 자정을 기준으로 현재 시간까지 millisecond
        content,
        emotion
      }
    });
    dataId.current += 1;  //다음에 생성될 일기의 dataId
  };

  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId }); //targetId만 있으면 diaryList에서 삭제 가능
  };

  const onEdit = (targetId, date, content, emotion) => {
    const nowSavingDate = new Date(date);
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: nowSavingDate.getTime(),
        content,
        emotion
      }
    });
  };

  const dispatches = {
    onCreate,
    onEdit,
    onRemove
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={dispatches}>
        <div className="App">
          <AppRouter />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
};

const AppRouter = () => { //경로와 component 연결
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Emotion_Diary" element={<Home />} />
        <Route path="/Emotion_Diary/new" element={<New />} />
        <Route path="/Emotion_Diary/edit/:id" element={<Edit />} /> {/* : 는 path parameter가 올 것임을 의미; id는 임의의 path parameter 이름 */}
        <Route path="/Emotion_Diary/diary/:id" element={<Diary />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;