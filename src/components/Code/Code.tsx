import React, { useState, useEffect } from "react";
import "./Code.scss";

export interface CodeProps {
  fields: 4 | 6;
  getCode: Function;
  label: string;
  codeId: string;
  type?: "text" | "password";
}

const Code = (props: CodeProps) => {
  const { fields, getCode, label, codeId, type, ...restProps } = props;
  const [labelFocus, setlabelFocus] = useState("");
  const [codeArr, setCodeArr] = useState<string[]>([]);

  // Once the component mounts set the state array with the number of prop fields
  useEffect(() => {
    let codeArrEnum = Array(fields).fill("");
    setCodeArr(codeArrEnum);
  }, []);

  function onInputChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number
  ) {
    // if the target event is empty then delete and go back
    // Replace the user input to allow only numbers
    let codeInput = event.target.value.replace(/[^0-9]+/g, "");
    // Case to handle backspace event in case there is a value already in the field
    if (codeInput.length == 2 && index + 1 <= fields - 1) {
      console.log("in if");
      codeInput = codeInput[1];
      let tempCodeArr = [...codeArr];
      tempCodeArr[index + 1] = codeInput;
      setCodeArr(tempCodeArr);
      getCode(tempCodeArr.join(""));
      goToNextField(index);
      setlabelFocus("n-code-focused-label");
      // IMP to return
      return;
    }
    // only if there is input with 1 digit
    if (codeInput && codeInput.length <= 1) {
      let tempCodeArr = [...codeArr];
      tempCodeArr[index] = codeInput;
      setCodeArr(tempCodeArr);
      getCode(tempCodeArr.join(""));
      goToNextField(index);
      setlabelFocus("n-code-focused-label");
    }
  }

  function goToNextField(currentIndex: number) {
    // if there is a field after the current index then shift focus on that
    if (currentIndex + 1 <= fields - 1) {
      let nextField = document.getElementById(
        `code-input-${codeId}-${currentIndex + 1}`
      );
      nextField?.focus();
    }
  }

  function handleBackSpace(currentIndex: number) {
    // if there is a field before the current index then delete and focus on that index
    if (currentIndex >= 0 && currentIndex <= fields - 1) {
      let tempCodeArr = [...codeArr];
      tempCodeArr[currentIndex] = "";
      setCodeArr(tempCodeArr);
      getCode(tempCodeArr.join(""));
      let prevField = document.getElementById(
        `code-input-${codeId}-${currentIndex - 1}`
      );
      prevField?.focus();
    }
  }
  function handleKeyDown(event: any, currentIndex: number) {
    if ([8, 46].includes(event.keyCode)) {
      console.log(event.keyCode, "evet from backspace");
      handleBackSpace(currentIndex);
    }
  }
  // handle the focus of the label container
  function handleClick() {
    setlabelFocus("n-code-focused-label");
  }
  // handle the focus of the label container
  function handleBlur() {
    if (!codeArr.join("").length) {
      setlabelFocus("");
    }
  }
  return (
    <div className="n-code-main">
      <div
        className={`n-code-label-container ${labelFocus}`}
        data-testid={`label-id-${codeId}`}
      >
        <label className="n-code-label" data-testid={`code-label-${codeId}`}>
          {label}
        </label>
      </div>
      <div className={`n-code-field-container`}>
        {codeArr.map((value, index) => {
          return (
            <input
              autoComplete="off"
              id={`code-input-${codeId}-` + index}
              data-testid={`code-input-${codeId}-` + index}
              value={value}
              type={type}
              onClick={handleClick}
              onBlur={handleBlur}
              onChange={(e) => onInputChange(e, index)}
              className={`n-code-input-field ${`n-code-${fields}`}`}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          );
        })}
      </div>
    </div>
  );
};

Code.defaulProps = {
  fields: 4,
  label: "",
  codeId: "",
  default: "text",
};

export default React.memo(Code);