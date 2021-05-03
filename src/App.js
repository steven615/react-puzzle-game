import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

import './App.scss';
import Fruit from './assets/img/fruit.svg';

import NumRows from './components/NumRows';

const App = () => {
  const [slotElemsRef, setSlotElemsRef] = useState([]);
  const [selectedSlotElem, setSelectedSlotElem] = useState(null);
  const [matchedPlateElems, setMatchedPlateElems] = useState([]);
  const [matchedSlotElems, setMatchedSlotElems] = useState([]);
  const [isAllMatched, setIsAllMatched] = useState(false);
  const [isRightAnswer, setIsRightAnswer] = useState(false);
  const [selectedAnswerElem, setSelectedAnswerElem] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const headerElem = useRef(null);
  const rightAnswerElem = useRef(null);
  const numRowsElem = useRef(null);
  const fruitElem = useRef(null);

  const [platePositions, setPlatePositions] = useState([
    {x: 986, y: 80},
    {x: 686, y: 160},
    {x: 786, y: 240},
    {x: 900, y: 360},
    {x: 934, y: 200},
    {x: 986, y: 400},
    {x: 700, y: 400},
    {x: 840, y: 120},
  ]);
  const slotCount = 5;
  const plateCount = 8;
  const offset = 40;
  let draggingBtn = null;

  useEffect(() => {
    if(matchedPlateElems.length !== slotCount) {
      return;
    }

    setIsAllMatched(true);
    
    matchedPlateElems.map((elem, i) => {
      const plateIndex = elem.classList.toString().match(/plate[0-9]/)[0].match(/[0-9]/)[0];

      let newPosition = {
        x: platePositions[plateIndex - 1].x,
        y: platePositions[plateIndex - 1].y - (i * 5)
      }
      
      setPlatePositions(prev => {
        prev[plateIndex - 1] = newPosition;
        return prev;
      });

      elem.style.transitionDuration = '1000ms';
      elem.style.trasitionDelay = '500ms';
      setTimeout(() => {
        elem.style.removeProperty('transition-duration');
      }, 1000);
      return null;
    });

    setTimeout(() => {
      const header = headerElem.current;
      header.innerText = 'How many buttons?';
      header.classList.add('fade-in');
      header.style.opacity = 1;
      header.style.transitionDuration = '1000ms';
    }, 500);
    
  }, [matchedPlateElems]);

  useEffect(() => {
    if(isRightAnswer) {
      handleRightAnswer();
    }
  }, [isRightAnswer]);

  useEffect(() => {
    if(!isEnd) return;

    setTimeout(() => {
      fruitElem.current.firstChild.classList.remove('rotate');
      fruitElem.current.firstChild.classList.add('shake');
    }, 2000);
    setTimeout(() => {
      setIsEnd(false);
      setIsStarted(false);
    }, 4000);
  }, [isEnd]);
  
  const setRef = (ref) => {
    if(!ref || slotElemsRef.length > 4) return;

    setSlotElemsRef(prev => {
      prev.push(ref);
      return prev;
    });
  }

  const isDraggable = (index) => {
    let draggable = true;
    
    matchedPlateElems.forEach(elem => {
      if(elem.classList.contains(`plate${index}`)) {
        draggable = false;
      }
    });

    return draggable;
  }

  const isMatchedSlot = (index) => {
    let isMatched = false;
    
    matchedSlotElems.forEach(elem => {
      if(elem.classList.contains(`slot${index}`)) {
        isMatched = true;
      }
    });

    return isMatched;
  }

  const handleStart = (e) => {
    // Change the cursor to grabbing
    e.target.closest('.button-plate').style.cursor = 'grabbing';
  }
  const handleDrag = (e) => {
    draggingBtn = draggingBtn ? draggingBtn : e.target.closest('.button-plate');
    slotElemsRef.map(elem => {
      elem.style.background = '#00000000';
      return null;
    });
    checkMatchSlot(draggingBtn);
    if(selectedSlotElem) {
      selectedSlotElem.style.background = '#00000050';
    }
  };

  const handleStop = (e) => {
    const plateBtn = draggingBtn ? draggingBtn : e.target.closest('.button-plate');
    const plateIndex = plateBtn.classList.toString().match(/plate[0-9]/)[0].match(/[0-9]/)[0];
    
    if(selectedSlotElem) {
      // Change the cursor to grab
      plateBtn.style.cursor = 'default';
      selectedSlotElem.style.background = '#00000000';

      let newPosition = {
        x: selectedSlotElem.offsetLeft - 17,
        y: selectedSlotElem.offsetTop - 78
      }
      
      setPlatePositions(prev => {
        prev[plateIndex - 1] = newPosition;
        return prev;
      });
      setMatchedPlateElems(prev => {
        return [...prev, plateBtn]
      });
      setMatchedSlotElems(prev => {
        return [...prev, selectedSlotElem];
      });
    } else {
      // Change the cursor to grab
      plateBtn.style.cursor = 'grab';

      plateBtn.style.transitionDuration = '1000ms';
      setTimeout(() => {
        plateBtn.style.removeProperty('transition-duration');
      }, 1000);
    }
    draggingBtn = null;
    setSelectedSlotElem(null);
  };

  const checkMatchSlot = (plateBtn) => {
    // Get btn center x and y
    const buttonCenter = getCenterFromBounds(plateBtn.getBoundingClientRect());    
    // Find matchs slot
    let slots = [...(slotElemsRef ?? [])];
    let isSelectedNew = false;

    slots.forEach(slot => {
      if(slot.classList.contains('matched')) {
        return;
      }
      // Center x and y of each slot
      const slotCenter = getCenterFromBounds(slot.getBoundingClientRect());
      if(checkXOfSlot(buttonCenter, slotCenter) && checkYOfSlot(buttonCenter, slotCenter)) {
        isSelectedNew = true;
        setSelectedSlotElem(slot);
        return;
      }
      
      if(!isSelectedNew) {
        setSelectedSlotElem(null);
      }
      return null;
    });
  }

  const checkXOfSlot = (b, s) => {
    // Check the available when button exists the right side of the slot
    if(s.x < b.x && s.x + offset > b.x) {
      return true;
    }

    // Check the available when button exists the left side of the slot
    if(s.x > b.x && s.x - offset < b.x) {
      return true;
    }

    return false;
  }

  const checkYOfSlot = (b, s) => {
    // Check the available when button exists the top of the slot
    if(s.y > b.y && s.y - offset < b.y) {
      return true;
    }

    // Check the available when button exists the bottom of the slot
    if(s.y < b.y && s.y + offset > b.y) {
      return true;
    }

    return false;
  }

  const handleNumRowClick = (isRight, elem) => {
    setIsRightAnswer(isRight);
    setSelectedAnswerElem(elem);
  }
  const handleRightAnswer = () => {
    const elem = rightAnswerElem.current;
    elem.innerText = selectedAnswerElem.innerText;
    let bounds = selectedAnswerElem.getBoundingClientRect();
    elem.style.transform = `translate(${bounds.left - bounds.width - 2}px, ${bounds.y}px)`;
    elem.style.opacity = 1;

    setTimeout(() => {
      let headerBounds = headerElem.current.getBoundingClientRect();
      let x = headerBounds.width / 1.55 + headerBounds.x;
      let y = headerBounds.y + 10;
      elem.style.transition = 'transform 1000ms';
      elem.style.transform = elem.style.transform = `translate(${x}px, ${y}px)`;
    }, 500);

    setTimeout(() => {
      numRowsElem.current.classList.add('fade-out-bottom');
      setTimeout(() => {
        numRowsElem.current.style.display = 'none';
      }, 400);
    }, 2000);

    setTimeout(() => {
      runEndAnimation();
    }, 2500);
  }

  const runEndAnimation = () => {
    headerElem.current.classList.add('fade-out');
    rightAnswerElem.current.classList.add('fade-out');
    matchedPlateElems.map((elem, i) => {
      elem.classList.add('fade-out');
      return null;
    });

    setTimeout(() => {
      setIsEnd(true);
    }, 500);
  }

  const getCenterFromBounds = (bounds) => {
    return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2}
  }

  const getSlots = () => {
    var rows = [];
    for (var i = 1; i <= slotCount; i++) {
      rows.push(<div ref={setRef} className={`slot slot${i} ${isMatchedSlot(i) ? 'matched' : ''}`} key={i}></div>);
    }
    return rows;
  }

  const getPlates = () => {
    var rows = [];
    for (var i = 1; i <= plateCount; i++) {
      let draggable = isDraggable(i);
      rows.push(
        <Draggable
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}
          disabled={!draggable}
          position={platePositions[i - 1]}
          key={i}>
          <div className={`button-plate plate${i} ${draggable ? '' : 'matched'}`}>
            <div className="button-cont">
              <div className="button-img"></div>
              <div className="button-sewed"></div>
              <div className="button-green"></div>
            </div>
          </div>
        </Draggable>
      );
    }
    return rows;
  }
  

  return (
    <div className="App">
      <div className={`board ${isAllMatched ? 'all-matched' : ''}`}>
        <div ref={headerElem} className="header">Sew the buttons on the jacket</div>
        <div className="jacket"></div>
        {getSlots()}
        {getPlates()}

        <NumRows
          rightAnswer={slotCount}
          onClick={handleNumRowClick}
          ref={numRowsElem}
          />
        <div ref={rightAnswerElem} className="right-answer"></div>
        { isEnd &&
          <div className="end-animation">
            <div>
              <div className="title">Great!</div>
              <div className="fruit bounce-left-right" ref={fruitElem}>
                <img src={Fruit} alt="Fruit" className="rotate" />
              </div>
              <div className="mask"></div>
            </div>
          </div>
        }
      </div>
    </div >
  );
};

export default App;
