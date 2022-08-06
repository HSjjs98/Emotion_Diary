import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";
import { createContext, useEffect, useReducer, useRef } from "react";

export const DiaryStateContext = createContext(null);
export const DiaryDispatchContext = createContext(null);

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const newItem = {
        ...action.data
      };
      newState = [newItem, ...state];
      break;
    }
    case "REMOVE": {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case "EDIT": {
      newState = state.map((it) =>
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
  localStorage.setItem("diary", JSON.stringify(newState))
  return newState;
};

const App = () => {
  const [data, dispatch] = useReducer(reducer, []);
  const dataId = useRef(1);
  useEffect(() => {
    const localData = localStorage.getItem('diary')
    if(localData){
      const diaryList = JSON.parse(localData).sort(
        (a,b) => parseInt(b.id) - parseInt(a.id)
      )
      if (diaryList.length >= 1){
      dataId.current = parseInt(diaryList[0].id) + 1
      dispatch({type: "INIT", data: diaryList})
      }
    } 
  }, [])

  const onCreate = (date, content, emotion) => {
    const nowSavingDate = new Date(date);
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: nowSavingDate.getTime(),
        content,
        emotion
      }
    });
    dataId.current += 1;
  };

  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId });
  };

  const onEdit = (targetId, date, content, emotion) => {
    const nowSavingDate = new Date(date);
    nowSavingDate.setHours(12, 0, 0);

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

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/diary/:id" element={<Diary />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;