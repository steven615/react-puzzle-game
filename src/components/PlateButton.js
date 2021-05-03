import React from 'react';
import Draggable from 'react-draggable';

const PlateButton = (props) => {
  if (props.draggable) {
    return <Draggable
      onStart={props.onStart}
      onDrag={props.onDrag}
      onStop={props.onStop}
      disabled={props.disabled}
      position={props.position}
      onClick={props.onClick}>
      <div className={`button-plate plate${props.index} ${props.disabled ? 'matched' : ''}`}>
        <div className="button-cont">
          <div className="button-img"></div>
          <div className="button-sewed"></div>
          <div className="button-green"></div>
        </div>
      </div>
    </Draggable>;
  }

  let isClickable = props.rightAnswer === props.position.slot;

  let styles = {
    transform: `translate(${props.position.x}px, ${props.position.y}px)`,
    cursor: isClickable ? 'pointer' : 'default'
  };

  const handleClick = (e) => {
    const btn = e.target.closest('.button-plate');

    if(isClickable) {
      btn.classList.add('green');
      props.onClick(e);
    }
  };
  let classNames = `button-plate plate${props.index} `;

  if(props.disabled) {
    classNames += ` matched ${props.className}`;
  }
  
  return <div
    className={classNames}
    style={styles}
    data-slot-id={props.position.slot}
    onClick={handleClick}
  >
    <div className="button-cont">
      <div className="button-img"></div>
      <div className="button-sewed"></div>
      <div className="button-green"></div>
    </div>
  </div>;
};

export default PlateButton;