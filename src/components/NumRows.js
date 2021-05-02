import React from 'react';

const NumRows = React.forwardRef((props, ref) => {
  const handleClick = (e) => {
    const target = e.target;
    let clickedAnswer = target.innerText;

    if(props.rightAnswer === Number(clickedAnswer)) {
      props.onClick(true, target);
      target.style.background = '#90f73b';
    } else {
      target.style.background = '#f94e4e';
      props.onClick(false);
    }
  }

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