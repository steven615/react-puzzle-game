/**
 * The main app
 */
import React, { useState, useEffect, useRef } from "react";

import "./App.scss";

// The fruit picture for end animation
import fruitPic from "./assets/img/fruit.svg";
// The play picture
import playButtonPic from "./assets/img/play1.svg";
// The jacket picture
import jacketPic from "./assets/img/jacket.svg";

import NumRows from "./components/NumRows";
import PlateButton from "./components/PlateButton";

const App = () => {
  const [slotElems, setSlotElems] = useState([]); // The array of slot refs
  const [selectedSlotElem, setSelectedSlotElem] = useState(null); // The slot ref of hovered plate button
  const [matchedPlateElems, setMatchedPlateElems] = useState([]); // The array of matched plate button refs
  const [matchedSlotElems, setMatchedSlotElems] = useState([]); //The array of matched slot refs
  const [isAllMatched, setIsAllMatched] = useState(false); // Is all slots are matched with plate button
  const [isAllRightAnswer, setIsAllRightAnswer] = useState(null); // Is the basic answer is right
  const [rightAnswer, setRightAnswer] = useState(1); // In basic answer is wrong mode(hint mode), the right answer
  const [selectedAnswerElem, setSelectedAnswerElem] = useState(null); // The selected answer ref in num rows
  const [isStarted, setIsStarted] = useState(false); // Is game started
  const [isEnd, setIsEnd] = useState(false); //Is game end
  const [wrongMode, setWrongMode] = useState(false); // Is wrong mode(hint mode), when the basic answer is wrong
  const [isRunningEndAnimation, setIsRunningEndAnimation] = useState(false); // That is true for running the end animation
  const [draggingBtn, setDraggingBtn] = useState(null); // dragging button ref
  const boradElem = useRef(null); // The game board ref
  const playWallElem = useRef(null); // The play wall ref
  const palyButtonElem = useRef(null); // The play button ref
  const headerElem = useRef(null); // The header ref
  const rightAnswerElem = useRef(null); // The basic right answer ref for animation
  const numRowsElem = useRef(null); // The num rows ref
  const fruitElem = useRef(null); // The fruit ref for end animation
  const hintWrongElem = useRef(null); // The hint ref in wrong mode (Top to color)
  const hintLabelElem = useRef(null); // The button count hint ref

  // The initial plate buttons position
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
  const screenWidth = window.outerWidth; // window width for responsive
  const slotCount = 5; // The total slot count
  const plateCount = 8; // The total plate button count
  const slotOffset = 40; // That is offset for select the slot, the plate button is there around the slot

  // Responsive plate btn position
  useEffect(() => {
    let newPositions = platePositions;

    if (screenWidth <= 1024) {
      newPositions = [
        { x: 660, y: 80, slot: 0 },
        { x: 622, y: 160, slot: 0 },
        { x: 706, y: 240, slot: 0 },
        { x: 600, y: 260, slot: 0 },
        { x: 534, y: 200, slot: 0 },
        { x: 492, y: 95, slot: 0 },
        { x: 438, y: 45, slot: 0 },
        { x: 465, y: 212, slot: 0 }
      ];
    }

    if (screenWidth <= 768) {
      let jacketWidth = (screenWidth / 100) * 75;
      let jacketHeight = (screenWidth / 100) * 54;
      newPositions = [
        { x: jacketWidth + 10, y: 15, slot: 0 },
        { x: jacketWidth + 40, y: 90, slot: 0 },
        { x: jacketWidth + 20, y: jacketHeight + 100, slot: 0 },
        { x: jacketWidth + 40, y: 350, slot: 0 },
        { x: 185, y: jacketHeight + 50, slot: 0 },
        { x: 10, y: jacketHeight + 95, slot: 0 },
        { x: 100, y: jacketHeight + 45, slot: 0 },
        { x: 300, y: jacketHeight + 60, slot: 0 }
      ];
    }

    setPlatePositions(() => {
      return newPositions;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenWidth]);

  // When the plate button is matched with the slot, ask the button count
  useEffect(() => {
    if (matchedPlateElems.length !== slotCount) return;
    if (isAllMatched) return;

    setIsAllMatched(true);

    // For animation that gather the plate buttons.
    matchedPlateElems.map(elem => {
      // The plate button index
      const plateIndex = elem.classList
        .toString()
        .match(/plate[0-9]/)[0]
        .match(/[0-9]/)[0];

      const prevPosition = platePositions[plateIndex - 1];

      let offset = 10;
      if (screenWidth <= 1024) {
        offset = 5;
      }
      if (screenWidth <= 768) {
        offset = 2;
      }

      // The new position
      let position = {
        ...prevPosition,
        y: prevPosition.y - (prevPosition.slot - 1) * offset
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

    // Change the header
    hideHeaderElem();
    setTimeout(() => {
      showHeaderElem("How many buttons?");
      showNumRowElem();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedPlateElems]);

  // When answer for basic
  useEffect(() => {
    if (!isStarted) return;

    // If the basic answer is right
    if (isAllRightAnswer) {
      handleRightAnswer();
      return;
    }

    // If the basic answer is wrong and not wrong mode
    if (!isAllRightAnswer && !wrongMode) {
      setTimeout(() => {
        handleWrongAnswer();
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllRightAnswer]);

  // The end animation
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

  // handle event that click the play button - for animation and game start
  const handlePlay = () => {
    const wallElem = playWallElem.current;
    const playButton = palyButtonElem.current;

    wallElem.classList.add("fade-out");
    playButton.classList.add("fade-out");

    setTimeout(() => {
      wallElem.style.display = "none";
      playButton.style.display = "none";
    }, 500);
    setIsStarted(true);
  };

  // When load, set slot elems
  const setRef = ref => {
    if (!ref || slotElems.length > 4) return;

    setSlotElems(prev => {
      prev.push(ref);
      return prev;
    });
  };

  /**
   * The plate button is draggable
   * 
   * @param {number} index - plate button index - 1, 2
   * @returns true|false - draggable
   */
  const isDraggable = index => {
    let draggable = true;

    matchedPlateElems.forEach(elem => {
      if (elem.classList.contains(`plate${index}`)) {
        draggable = false;
      }
    });

    return draggable;
  };

  /**
   * If the slot is matched, can't match any other plate button
   * 
   * @param {number} index - slot index - 1, 2
   * @returns true|false - matched
   */
  const isMatchedSlot = index => {
    let isMatched = false;

    matchedSlotElems.forEach(elem => {
      if (elem.classList.contains(`slot${index}`)) {
        isMatched = true;
      }
    });

    return isMatched;
  };

  // drag start
  const handleStart = e => {
    // Change the cursor to grabbing
    e.target.closest(".button-plate").style.cursor = "grabbing";
  };

  // dragging
  const handleDrag = e => {
    let btn = e.target.closest(".button-plate");

    if(!draggingBtn) {
      setDraggingBtn(btn);
    } else {
      btn = draggingBtn;
    }

    // set default background of all slot elems
    slotElems.map(elem => {
      elem.style.background = "#00000000";
      return null;
    });

    // Check there is match slot
    checkMatchSlot(btn);
    // Change background of selected slot
    if (selectedSlotElem) {
      selectedSlotElem.style.background = "#00000050";
    }
  };

  // drag stop
  const handleStop = e => {
    // dragged plate button
    const plateBtn = draggingBtn
      ? draggingBtn
      : e.target.closest(".button-plate");

    const plateIndex = plateBtn.classList
      .toString()
      .match(/plate[0-9]/)[0]
      .match(/[0-9]/)[0];

    // there is matched slot
    if (selectedSlotElem) {
      const slotIndex = Number(
        selectedSlotElem.classList
          .toString()
          .match(/slot[0-9]/)[0]
          .match(/[0-9]/)[0]
      );

      // Change the cursor to grab
      plateBtn.style.cursor = "default";
      // Set background as default
      selectedSlotElem.style.background = "#00000000";

      // set position of plate to matched slot - animation
      let offsetX = 7;
      let offsetY = 66;
      if (screenWidth <= 768) {
        offsetX = 1;
        offsetY = 61;
      }
      let newPosition = {
        x: selectedSlotElem.offsetLeft - offsetX,
        y: selectedSlotElem.offsetTop - offsetY,
        slot: slotIndex
      };

      setPlatePositions(prev => {
        prev[plateIndex - 1] = newPosition;
        return prev;
      });

      // Add matched plate and slot ref
      setMatchedPlateElems(prev => {
        return [...prev, plateBtn];
      });
      setMatchedSlotElems(prev => {
        return [...prev, selectedSlotElem];
      });
    } else {
      // there isn't matched slot
      // Change the cursor to grab
      plateBtn.style.cursor = "grab";

      // The plate button go back to original position
      plateBtn.style.transitionDuration = "1000ms";
      setTimeout(() => {
        plateBtn.style.removeProperty("transition-duration");
      }, 1000);
    }
    setDraggingBtn(null)
    setSelectedSlotElem(null);
  };

  // Check there is matched slot with dragging plate button
  const checkMatchSlot = plateBtn => {
    // Get position x and y of center of plate button
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

  // handle event that select answer
  const handleNumRowClick = (answer, elem) => {
    // The basic answer is true or wrong
    if (isAllRightAnswer === null) {
      setIsAllRightAnswer(prev => {
        return answer === slotCount;
      });

      setSelectedAnswerElem(elem);
      return;
    }

    // The basic answer is true
    if (!wrongMode && answer === slotCount) {
      setTimeout(() => {
        runEndAnimation();
      }, 500);
      return;
    }

    // The wrong mode(hint)
    // answer is wrong, don't anything
    if (answer !== rightAnswer) return;

    // Increase right answer one by one
    setRightAnswer(prev => {
      return prev + 1;
    });

    // Show hint elem of button count with right button count
    showHintLabelElem(rightAnswer);

    // With increase right answer until the answer is the same basic right answer, ask
    if (answer !== slotCount) {
      hideNumRowElem();
      showHintWrongElem(rightAnswer);
      return;
    }

    // If answer is the same basci right answer, ask total count
    hideHeaderElem();
    setTimeout(() => {
      headerElem.current.classList.remove("green");
      showHeaderElem("How many buttons?");
    }, 600);
    setWrongMode(false);
  };

  // In wrong mode, the clicked plate to green button, ask green button count
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

  // The basic answer is right, end animation
  const handleRightAnswer = () => {
    // The animaition of right answer elem
    const elem = rightAnswerElem.current;
    const board = boradElem.current;
    elem.innerText = selectedAnswerElem.innerText;
    let bounds = selectedAnswerElem.getBoundingClientRect();
    let boardBounds = board.getBoundingClientRect();

    elem.style.transform = `translate(${bounds.x - boardBounds.x}px, ${bounds.y
      }px)`;
    elem.style.opacity = 1;

    setTimeout(() => {
      let headerBounds = headerElem.current.getBoundingClientRect();
      let offset = 0;
      if (screenWidth <= 1024) {
        offset = screenWidth / 100;
      }
      let x =
        headerBounds.width / 1.3 + (boardBounds.x - headerBounds.x) + offset;
      let y = headerBounds.y + 10;
      elem.style.transition = "transform 1000ms";
      elem.style.transform = `translate(${x}px, ${y}px)`;
    }, 500);

    // When finish the animation of right answer elem, hide num rows
    setTimeout(() => {
      hideNumRowElem();
    }, 2000);

    setTimeout(() => {
      runEndAnimation();
    }, 2500);
  };

  // If the basic answer is wrong
  const handleWrongAnswer = () => {
    hideHeaderElem();
    hideNumRowElem();
    showHintWrongElem();
    setWrongMode(true);
  };

  // The end animation
  const runEndAnimation = () => {
    setIsRunningEndAnimation(true);
    hideHeaderElem();
    hideHintLabelElem();
    hideNumRowElem();

    // Hide all elems
    if (rightAnswerElem.current.innerText) {
      rightAnswerElem.current.classList.add("fade-out");
    }

    matchedPlateElems.map((elem, i) => {
      elem.classList.add("fade-out");
      return null;
    });

    setTimeout(() => {
      setIsEnd(true);
    }, 500);

    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };

  /**
   * Show header elem
   * @param {string} text The header text
   */
  const showHeaderElem = text => {
    const elem = headerElem.current;
    elem.innerText = text;
    elem.style.animationDuration = "1s";

    elem.classList.remove("fade-out");
    elem.classList.add("fade-in");
  };

  // Hide header elem
  const hideHeaderElem = () => {
    const elem = headerElem.current;
    elem.classList.remove("fade-in");
    elem.classList.add("fade-out");
  };

  /**
   * Show hint wrong elem (top to color)
   * 
   * @param {number} slotIndex 
   */
  const showHintWrongElem = (slotIndex = 0) => {
    setTimeout(() => {
      // Get bounding rect of that slot elem for show hint popup.
      const position = slotElems[slotIndex].getBoundingClientRect();
      // Get bounding rect of palyground board elem.
      const boardBounds = boradElem.current.getBoundingClientRect();
      const hintElem = hintWrongElem.current;
      let offsetX = 20;
      let offsetY = 10;

      offsetY = screenWidth <= 1024 ? 6 : offsetY;

      offsetX = screenWidth <= 768 ? -30 : offsetX;
      offsetY = screenWidth <= 768 ? 0 : offsetY;

      // Get the hint wrong elem position left by slot position.
      let hintElemWidth = 144;
      let left = position.left - boardBounds.left - hintElemWidth - offsetX;

      // Get the hint wrong elem position top by slot position
      let top = position.top - slotIndex * offsetY;

      // To the hint elem should be to the center of the slot elem.
      // 29 is hint elem height.
      top = screenWidth >= 768 ? top : top + (position.height - 29) / 2;

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

  /**
   * Get center position from boundings
   * @param {object} bounds  {x, y, width, height}
   * @returns 
   */
  const getCenterFromBounds = bounds => {
    return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  };

  // Get jsx of slot
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

  // Get plates
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
      <div className="play-button-wall" ref={playWallElem}></div>
      <div className="play-button" onClick={handlePlay} ref={palyButtonElem}>
        <img src={playButtonPic} alt="" className="img" />
      </div>
      <div
        className={`board ${isAllMatched ? "all-matched" : ""}`}
        ref={boradElem}
      >
        <div ref={headerElem} className="header">
          Sew the buttons on the jacket
        </div>
        <div className="jacket">
          <img src={jacketPic} alt="" />
        </div>
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
                <img src={fruitPic} alt="Fruit" className="rotate" />
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
