/**
 * The forward ref component for select answer.
 * 
 * <NumRows ref={numRowsElem} rightAnswer="1" onClick={handleEvent}  />
 * 
 * @props props{rightAnswer, onClick}, ref
 * @return NumRows component
 * 
 * 
 * @authour monkeyflytiger@gmail.com
 */
import React from 'react';

const NumRows = React.forwardRef((props, ref) => {
  const handleClick = (e) => {
    // The clicked num elem
    const target = e.target;
    // The selected answer
    let selectedAnswer = Number(target.innerText);
    
    // If the answer is right
    if(props.rightAnswer === selectedAnswer) {
      // Change selected answer elem color to success.
      target.style.background = '#90f73b';
      // event emit to parent
      props.onClick(selectedAnswer, target);
    } else {
      // Change selected answer elem color to fail.
      target.style.background = '#f94e4e';
      // event emit to parent
      props.onClick(selectedAnswer);
    }

    // After 700ms, set initial background
    setTimeout(() => {
      target.style.removeProperty('background');
    }, 700);
  }

  // Get num rows jsx
  const getNumRows = () => {
    var rows = [];
    for (var i = 1; i <= 8; i++) {
      rows.push(
        <div
          className="btn-num"
          key={i}
          onClick={handleClick}
          >{i}</div>
      );
    }
    return rows;
  }

  return (
    <div className="num-rows" ref={ref}>
      {getNumRows()}
    </div>
  )
})

export default NumRows;