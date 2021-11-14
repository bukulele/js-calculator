import React, { useEffect, useState, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import Display from "./components/display/Display";
import Container from "./components/container/Container";
import "./index.css";

function App() {
  const [displayInput, setDisplayInput] = useState("0");
  const [upperDisplayInput, setUpperDisplayInput] = useState(["0"]);
  const [calcDone, setCalcDone] = useState(false);

  const calcElements = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    clear: "AC",
    divide: "÷",
    multiply: "×",
    subtract: "-",
    add: "+",
    equals: "=",
    decimal: ".",
  };

  const calcElementsValues = Object.values(calcElements);

  const handleClick = (event) => {
    manageUpperDisplayData(event.target.value);
  };

  const keyboardListener = (event) => {
    let code = event.code;
    let shift = event.shiftKey;
    if (code.includes("Digit")) {
      code = code.slice(5);
    } else if (code.includes("Numpad")) {
      code = code.slice(6);
    }
    if (code === "Minus" || code === "Subtract") {
      code = "-";
    } else if (code === "Add" || (code === "Equal" && shift)) {
      code = "+";
    } else if (code === "Multiply" || (code === "8" && shift)) {
      code = "×";
    } else if (code === "Decimal" || code === "Period") {
      code = ".";
    } else if (code === "Equal" || code === "Enter") {
      code = "=";
    } else if (code === "Slash" || code === "Divide") {
      event.preventDefault();
      code = "÷";
    } else if (code === "Escape") {
      code = "AC";
    }
    if (calcElementsValues.includes(code)) manageUpperDisplayData(code);
  };

  const manageUpperDisplayData = (data) => {
    let lastElement = upperDisplayInput[upperDisplayInput.length - 1];
    let secondLastElement = upperDisplayInput[upperDisplayInput.length - 2];
    let input = "";
    let newUpperDisplayInput = [...upperDisplayInput];

    if (data === "AC") {
      setUpperDisplayInput(["0"]);
      setDisplayInput("0");
      setCalcDone(false);
    } else if (data === "=") {
      if (upperDisplayInput.includes("=")) {
        calcResult([lastElement]);
      } else {
        calcResult(upperDisplayInput);
      }
    } else if (calcDone === true) {
      if (isNaN(data) && data !== ".") {
        setUpperDisplayInput([lastElement, data]);
        setCalcDone(false);
      } else if (!isNaN(data)) {
        setUpperDisplayInput([data]);
        setCalcDone(false);
      } else if (data === ".") {
        setUpperDisplayInput(["0."]);
        setCalcDone(false);
      }
    } else {
      if (upperDisplayInput.length === 1 && lastElement === "0") {
        if (!isNaN(data)) {
          setUpperDisplayInput([data]);
        } else if (isNaN(data) && data !== ".") {
          setUpperDisplayInput([...upperDisplayInput, data]);
        } else if (data === ".") {
          input = lastElement + data;
          newUpperDisplayInput.splice(
            newUpperDisplayInput.length - 1,
            1,
            input
          );
          setUpperDisplayInput(newUpperDisplayInput);
        }
      } else if (
        (upperDisplayInput.length === 1 && lastElement !== "0") ||
        (upperDisplayInput.length > 1 && !isNaN(lastElement))
      ) {
        if (!isNaN(data)) {
          input = lastElement + data;
          newUpperDisplayInput.splice(
            newUpperDisplayInput.length - 1,
            1,
            input
          );
          setUpperDisplayInput(newUpperDisplayInput);
        } else if (isNaN(data) && data !== ".") {
          setUpperDisplayInput([...upperDisplayInput, data]);
        } else if (data === ".") {
          input = lastElement + data;
          newUpperDisplayInput.splice(
            newUpperDisplayInput.length - 1,
            1,
            input
          );
          if (!lastElement.includes("."))
            setUpperDisplayInput(newUpperDisplayInput);
        }
      } else if (isNaN(lastElement) && lastElement !== "-") {
        if (!isNaN(data)) {
          setUpperDisplayInput([...upperDisplayInput, data]);
        } else if (isNaN(data) && data !== "." && data !== "-") {
          input = data;
          newUpperDisplayInput.splice(
            newUpperDisplayInput.length - 1,
            1,
            input
          );
          setUpperDisplayInput(newUpperDisplayInput);
        } else if (data === ".") {
          input = "0" + data;
          setUpperDisplayInput([...upperDisplayInput, input]);
        } else if (data === "-") {
          setUpperDisplayInput([...upperDisplayInput, data]);
        }
      } else if (lastElement === "-") {
        if (!isNaN(data)) {
          setUpperDisplayInput([...upperDisplayInput, data]);
        } else if (isNaN(data) && data !== "." && data !== "-") {
          input = data;
          while (isNaN(newUpperDisplayInput[newUpperDisplayInput.length - 1])) {
            newUpperDisplayInput.pop();
          }
          setUpperDisplayInput([...newUpperDisplayInput, input]);
        } else if (data === ".") {
          input = "0" + data;
          newUpperDisplayInput.splice(
            newUpperDisplayInput.length - 1,
            1,
            input
          );
          setUpperDisplayInput(newUpperDisplayInput);
        } else if (data === "-") {
          if (secondLastElement !== "-") {
            while (
              isNaN(newUpperDisplayInput[newUpperDisplayInput.length - 1])
            ) {
              newUpperDisplayInput.pop();
            }
            setUpperDisplayInput([...newUpperDisplayInput, "+"]);
          }
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyboardListener);
    return () => {
      window.removeEventListener("keydown", keyboardListener);
    };
  });

  useLayoutEffect(() => {
    setDisplayInput(upperDisplayInput[upperDisplayInput.length - 1]);
  }, [upperDisplayInput]);

  let expression;

  const calcResult = (exp) => {
    let tempArray = [...exp];
    let correctSignsArr = tempArray.map((elem) => {
      if (elem === "×") {
        return "*";
      } else if (elem === "÷") {
        return "/";
      } else {
        return elem;
      }
    });
    while (isNaN(correctSignsArr[correctSignsArr.length - 1])) {
      correctSignsArr.pop();
    }
    expression = correctSignsArr.join("");
    calcExpression(expression);
  };

  function calcExpression(exp) {
    let calc = new Function("return " + exp);
    let result = (calc().toFixed(10) * 100) / 100;
    setUpperDisplayInput([exp, "=", result]);
    setCalcDone(true);
  }

  return (
    <div className="calc">
      <Display
        displayInput={displayInput}
        upperDisplayInput={upperDisplayInput}
      />
      <Container calcElements={calcElements} handleClick={handleClick} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
