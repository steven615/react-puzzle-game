import React from 'react';
import Draggable from 'react-draggable';

import './App.scss';

const App = () => {
  const handleStart = (e) => {
    // Change the cursor to grabbing
    e.target.closest('.button-plate').style.cursor = 'grabbing';
  }
  const handleDrag = (e) => {
  };

  const handleStop = (e) => {
    const plateBtn = e.target.closest('.button-plate');
    // Change the cursor to grab
    plateBtn.style.cursor = 'grab';
  };

  return (
    <div className="App">
      <div className="board">
        <div className="header">Sew the buttons on the jacket</div>
        <div className="jacket"></div>

        <div className="button-slot slot1"></div>
        <div className="button-slot slot2"></div>
        <div className="button-slot slot3"></div>
        <div className="button-slot slot4"></div>
        <div className="button-slot slot5"></div>

        <Draggable
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}>
          <div className="button-plate plate1">
            <div className="button-cont">
              <div className="button-img"></div>
              <div className="button-sewed"></div>
              <div className="button-green"></div>
            </div>
          </div>
        </Draggable>
        <Draggable
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}>
          <div className="button-plate plate2">
            <div className="button-cont">
              <div className="button-img"></div>
              <div className="button-sewed"></div>
              <div className="button-green"></div>
            </div>
          </div>
        </Draggable>
        <Draggable
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}>
          <div className="button-plate plate3">
            <div className="button-cont">
              <div className="button-img"></div>
              <div className="button-sewed"></div>
              <div className="button-green"></div>
            </div>
          </div>
        </Draggable>
        <Draggable
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}>
          <div className="button-plate plate4">
            <div className="button-cont">
              <div className="button-img"></div>
              <div className="button-sewed"></div>
              <div className="button-green"></div>
            </div>
          </div>
        </Draggable>
        <Draggable
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}>
          <div className="button-plate plate5">
            <div className="button-cont">
              <div className="button-img"></div>
              <div className="button-sewed"></div>
              <div className="button-green"></div>
            </div>
          </div>
        </Draggable>
        <Draggable
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}>
          <div className="button-plate plate6">
            <div className="button-cont">
              <div className="button-img"></div>
              <div className="button-sewed"></div>
              <div className="button-green"></div>
            </div>
          </div>
        </Draggable>
        <Draggable
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}>
          <div className="button-plate plate7">
            <div className="button-cont">
              <div className="button-img"></div>
              <div className="button-sewed"></div>
              <div className="button-green"></div>
            </div>
          </div>
        </Draggable>
        <Draggable
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}>
          <div className="button-plate plate8">
            <div className="button-cont">
              <div className="button-img"></div>
              <div className="button-sewed"></div>
              <div className="button-green"></div>
            </div>
          </div>
        </Draggable>
      </div>
    </div >
  );
};

export default App;
