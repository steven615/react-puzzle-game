import React, { useState, useEffect, useRef } from "react";

import "./App.scss";
import Fruit from "./assets/img/fruit.svg";

import NumRows from "./components/NumRows";
import PlateButton from "./components/PlateButton";

const App = () => {
  const [slotElems, setSlotElems] = useState([]);
  const [selectedSlotElem, setSelectedSlotElem] = useState(null);
  const [matchedPlateElems, setMatchedPlateElems] = useState([]);
  const [matchedSlotElems, setMatchedSlotElems] = useState([]);
  const [isAllMatched, setIsAllMatched] = useState(false);
  const [isAllRightAnswer, setIsAllRightAnswer] = useState(null);
  const [rightAnswer, setRightAnswer] = useState(1);
  const [selectedAnswerElem, setSelectedAnswerElem] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [wrongMode, setWrongMode] = useState(false);
  const [isRunningEndAnimation, setIsRunningEndAnimation] = useState(false);
  const boradElem = useRef(null);
  const headerElem = useRef(null);
  const rightAnswerElem = useRef(null);
  const numRowsElem = useRef(null);
  const fruitElem = useRef(null);
  const hintWrongElem = useRef(null);
  const hintLabelElem = useRef(null);

  const [platePositions, setPlatePositions] = useState([
    { x: 986, y: 80, slot: 0 },
    { x: 686, y: 160, slot: 0 },
    { x: 786, y: 240, slot: 0 },
    { x: 900, y: 360, slot: 0 },
    { x: 934, y: 200, slot: 0 },
    { x: 986, y: 400, slot: 0 },
    { x: 700, y: 400, slot: 0 },
    { x: 840, y: 120, slot: 0 }
  ]);
  const slotCount = 5;
  const plateCount = 8;
  const slotOffset = 40;
  let draggingBtn = null;

  useEffect(() => {
    if (matchedPlateElems.length !== slotCount) return;
    if (isAllMatched) return;

    setIsAllMatched(true);

    matchedPlateElems.map(elem => {
      const plateIndex = elem.classList
        .toString()
        .match(/plate[0-9]/)[0]
        .match(/[0-9]/)[0];
      const prevPosition = platePositions[plateIndex - 1];
      let position = {
        ...prevPosition,
        y: prevPosition.y - (prevPosition.slot - 1) * 10
      };

      setPlatePositions(prev => {
        prev[plateIndex - 1] = position;
        return prev;
      });

      elem.style.transitionDuration = "1000ms";
      elem.style.trasitionDelay = "500ms";
      setTimeout(() => {
        elem.style.removeProperty("transition-duration");
      }, 1000);
      return null;
    });
    hideHeaderElem();

    setTimeout(() => {
      showHeaderElem("How many buttons?");
      showNumRowElem();
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedPlateElems]);

  useEffect(() => {
    if (!isStarted) return;

    if (isAllRightAnswer) {
      handleRightAnswer();
      return;
    }

    if (!isAllRightAnswer && !wrongMode) {
      setTimeout(() => {
        handleWrongAnswer();
      }, 500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllRightAnswer]);

  useEffect(() => {
    if (!isEnd) return;

    setTimeout(() => {
      fruitElem.current.firstChild.classList.remove("rotate");
      fruitElem.current.firstChild.classList.add("shake");
    }, 2000);
    setTimeout(() => {
      setIsEnd(false);
      setIsStarted(false);
    }, 4000);
  }, [isEnd]);

  const setRef = ref => {
    if (!ref || slotElems.length > 4) return;

    setSlotElems(prev => {
      prev.push(ref);
      return prev;
    });
  };

  const isDraggable = index => {
    let draggable = true;

    matchedPlateElems.forEach(elem => {
      if (elem.classList.contains(`plate${index}`)) {
        draggable = false;
      }
    });

    return draggable;
  };

  const isMatchedSlot = index => {
    let isMatched = false;

    matchedSlotElems.forEach(elem => {
      if (elem.classList.contains(`slot${index}`)) {
        isMatched = true;
      }
    });

    return isMatched;
  };

  const handleStart = e => {
    // Change the cursor to grabbing
    e.target.closest(".button-plate").style.cursor = "grabbing";
  };

  const handleDrag = e => {
    draggingBtn = draggingBtn ? draggingBtn : e.target.closest(".button-plate");
    slotElems.map(elem => {
      elem.style.background = "#00000000";
      return null;
    });
    checkMatchSlot(draggingBtn);
    if (selectedSlotElem) {
      selectedSlotElem.style.background = "#00000050";
    }
  };

  const handleStop = e => {
    const plateBtn = draggingBtn
      ? draggingBtn
      : e.target.closest(".button-plate");
    const plateIndex = plateBtn.classList
      .toString()
      .match(/plate[0-9]/)[0]
      .match(/[0-9]/)[0];

    if (selectedSlotElem) {
      const slotIndex = Number(
        selectedSlotElem.classList
          .toString()
          .match(/slot[0-9]/)[0]
          .match(/[0-9]/)[0]
      );

      // Change the cursor to grab
      plateBtn.style.cursor = "default";
      selectedSlotElem.style.background = "#00000000";

      let newPosition = {
        x: selectedSlotElem.offsetLeft - 17,
        y: selectedSlotElem.offsetTop - 78,
        slot: slotIndex
      };

      setPlatePositions(prev => {
        prev[plateIndex - 1] = newPosition;
        return prev;
      });
      setMatchedPlateElems(prev => {
        return [...prev, plateBtn];
      });
      setMatchedSlotElems(prev => {
        return [...prev, selectedSlotElem];
      });
    } else {
      // Change the cursor to grab
      plateBtn.style.cursor = "grab";

      plateBtn.style.transitionDuration = "1000ms";
      setTimeout(() => {
        plateBtn.style.removeProperty("transition-duration");
      }, 1000);
    }
    draggingBtn = null;
    setSelectedSlotElem(null);
  };

  const checkMatchSlot = plateBtn => {
    // Get btn center x and y
    const buttonCenter = getCenterFromBounds(plateBtn.getBoundingClientRect());
    // Find matchs slot
    let slots = [...(slotElems ?? [])];
    let isSelectedNew = false;

    slots.forEach(slot => {
      if (slot.classList.contains("matched")) {
        return;
      }
      // Center x and y of each slot
      const slotCenter = getCenterFromBounds(slot.getBoundingClientRect());
      if (
        checkXOfSlot(buttonCenter, slotCenter) &&
        checkYOfSlot(buttonCenter, slotCenter)
      ) {
        isSelectedNew = true;
        setSelectedSlotElem(slot);
        return;
      }

      if (!isSelectedNew) {
        setSelectedSlotElem(null);
      }
      return null;
    });
  };

  const checkXOfSlot = (b, s) => {
    // Check the available when button exists the right side of the slot
    if (s.x < b.x && s.x + slotOffset > b.x) {
      return true;
    }

    // Check the available when button exists the left side of the slot
    if (s.x > b.x && s.x - slotOffset < b.x) {
      return true;
    }

    return false;
  };

  const checkYOfSlot = (b, s) => {
    // Check the available when button exists the top of the slot
    if (s.y > b.y && s.y - slotOffset < b.y) {
      return true;
    }

    // Check the available when button exists the bottom of the slot
    if (s.y < b.y && s.y + slotOffset > b.y) {
      return true;
    }

    return false;
  };

  const handleNumRowClick = (answer, elem) => {
    if (isAllRightAnswer === null) {
      setIsAllRightAnswer(prev => {
        return answer === slotCount;
      });

      setSelectedAnswerElem(elem);
      return;
    }

    if (!wrongMode && answer === slotCount) {
      setTimeout(() => {
        runEndAnimation();
      }, 500);
      return;
    }

    if (answer !== rightAnswer) return;

    setRightAnswer(prev => {
      return prev + 1;
    });

    showHintLabelElem(rightAnswer);

    if (answer !== slotCount) {
      hideNumRowElem();
      showHintWrongElem(rightAnswer);
      return;
    }

    hideHeaderElem();
    setTimeout(() => {
      headerElem.current.classList.remove("green");
      showHeaderElem("How many buttons?");
    }, 600);
    setWrongMode(false);
  };

  const handlePlateClick = e => {
    hideHintWrongElem();

    setTimeout(() => {
      headerElem.current.classList.add("green");
      showHeaderElem("How many green buttons?");
    }, 500);

    setTimeout(() => {
      hideHintLabelElem();
      showNumRowElem();
    }, 500);
  };

  const handleRightAnswer = () => {
    const elem = rightAnswerElem.current;
    const board = boradElem.current;
    elem.innerText = selectedAnswerElem.innerText;
    let bounds = selectedAnswerElem.getBoundingClientRect();
    let boardBounds = board.getBoundingClientRect();

    elem.style.transform = `translate(${bounds.x - boardBounds.x}px, ${bounds.y}px)`;
    elem.style.opacity = 1;
    
    setTimeout(() => {
      let headerBounds = headerElem.current.getBoundingClientRect();
      let x = headerBounds.width / 1.4 + (boardBounds.x - headerBounds.x);
      let y = headerBounds.y + 10;
      elem.style.transition = "transform 1000ms";
      elem.style.transform = `translate(${x}px, ${y}px)`;
    }, 500);

    setTimeout(() => {
      hideNumRowElem();
    }, 2000);

    setTimeout(() => {
      runEndAnimation();
    }, 2500);
  };

  const handleWrongAnswer = () => {
    hideHeaderElem();
    hideNumRowElem();
    showHintWrongElem();
    setWrongMode(true);
  };

  const runEndAnimation = () => {
    setIsRunningEndAnimation(true);
    hideHeaderElem();
    hideHintLabelElem();
    hideNumRowElem();
    rightAnswerElem.current.classList.add("fade-out");
    matchedPlateElems.map((elem, i) => {
      elem.classList.add("fade-out");
      return null;
    });

    setTimeout(() => {
      setIsEnd(true);
    }, 500);
  };

  const showHeaderElem = text => {
    const elem = headerElem.current;
    elem.innerText = text;
    elem.style.animationDuration = "1s";

    elem.classList.remove("fade-out");
    elem.classList.add("fade-in");
  };

  const hideHeaderElem = () => {
    const elem = headerElem.current;
    elem.classList.remove("fade-in");
    elem.classList.add("fade-out");
  };

  const showHintWrongElem = (slotIndex = 0) => {
    setTimeout(() => {
      const position = slotElems[slotIndex].getBoundingClientRect();
      const boardBounds = boradElem.current.getBoundingClientRect();
      const hintElem = hintWrongElem.current;
      let offset = 20;
      let top = position.top - slotIndex * 10;
      let hintElemWidth = 144;
      let left = position.left - boardBounds.left - hintElemWidth - offset;
      
      hintElem.style.left = left + "px";
      hintElem.style.top = top + "px";

      hintElem.style.display = "block";
      hintElem.classList.remove("fade-out");
      hintElem.classList.add("fade-in");
    }, 500);
  };

  const hideHintWrongElem = () => {
    setTimeout(() => {
      const hintElem = hintWrongElem.current;
      hintElem.classList.remove("fade-in");
      hintElem.classList.add("fade-out");

      setTimeout(() => {
        hintElem.style.display = "none";
      }, 500);
    }, 500);
  };

  const showNumRowElem = () => {
    const elem = numRowsElem.current;
    elem.style.display = "flex";
    elem.classList.remove("fade-out-bottom");
    elem.classList.add("fade-in-bottom");
  };

  const hideNumRowElem = () => {
    const elem = numRowsElem.current;

    setTimeout(() => {
      elem.classList.remove("fade-in-bottom");
      elem.classList.add("fade-out-bottom");
    }, 500);

    setTimeout(() => {
      elem.style.display = "none";
    }, 900);
  };

  const showHintLabelElem = (count = 1) => {
    let labelElem = hintLabelElem.current;
    labelElem.innerText = `${count} button${count > 1 ? "s" : ""}`;
    labelElem.classList.remove("fade-out");
    labelElem.classList.add("fade-in");
  };

  const hideHintLabelElem = () => {
    let labelElem = hintLabelElem.current;
    labelElem.classList.remove("fade-in");
    labelElem.classList.add("fade-out");
  };

  const getCenterFromBounds = bounds => {
    return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  };

  const getSlots = () => {
    var rows = [];
    for (var i = 1; i <= slotCount; i++) {
      rows.push(
        <div
          ref={setRef}
          className={`slot slot${i} ${isMatchedSlot(i) ? "matched" : ""}`}
          key={i}
        ></div>
      );
    }
    return rows;
  };

  const getPlates = () => {
    var rows = [];

    for (var i = 1; i <= plateCount; i++) {
      let disabled = !isDraggable(i);
      let draggable = isStarted && isAllRightAnswer !== false;

      rows.push(
        <PlateButton
          draggable={draggable}
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}
          disabled={disabled}
          position={platePositions[i - 1]}
          rightAnswer={rightAnswer}
          onClick={handlePlateClick}
          className={isRunningEndAnimation ? "fade-out" : ""}
          index={i}
          key={i}
        />
      );
    }
    return rows;
  };

  return (
    <div className="App">
      <button
        style={{ position: "absolute", zIndex: 1000 }}
        onTouchStart={() => {
          setIsStarted(true)
        }}
        onClick={() => {
          setIsStarted(true);
        }}
      >
        start
      </button>
      <div className={`board ${isAllMatched ? "all-matched" : ""}`} ref={boradElem}>
        <div ref={headerElem} className="header">
          Sew the buttons on the jacket
        </div>
        <div className="jacket"></div>
        {getSlots()}
        {getPlates()}

        <NumRows
          rightAnswer={wrongMode ? rightAnswer : slotCount}
          onClick={handleNumRowClick}
          ref={numRowsElem}
        />
        <div ref={rightAnswerElem} className="right-answer"></div>
        <div ref={hintWrongElem} className="hint-wrong">
          <div className="content">Tap to color</div>
          <div className="corner"></div>
        </div>
        <div className="hint-label" ref={hintLabelElem}></div>
        {isEnd && (
          <div className="end-animation">
            <div>
              <div className="title">Great!</div>
              <div className="fruit bounce-left-right" ref={fruitElem}>
                <img src={Fruit} alt="Fruit" className="rotate" />
              </div>
              <div className="mask"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
