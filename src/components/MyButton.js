import React from "react";

const MyButton = ({ text, onClick, type }) => { //button type은 button 스타일링을 위함
  return (
    <button
      className={["MyButton", `MyButton_${type}`].join(" ")}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

MyButton.defaultProps = {
  type: "default"
};

export default MyButton;