import React from 'react';
import Draggable from 'react-draggable';

import plateButtonPic from '../assets/img/plate.svg';
import plateSewedButtonPic from '../assets/img/plate_sewed.svg';
import plateGreenButtonPic from '../assets/img/plate_green.svg';

const PlateButton = (props) => {
  const contElem =
    <div className="button-cont">
      <div className="button-img">
        <img src={plateButtonPic} alt="Plate button" />
      </div>
      <div className="button-sewed">
        <img src={plateSewedButtonPic} alt="Plate sewed button" />
      </div>
      <div className="button-green">
        <img src={plateGreenButtonPic} alt="Plate green button" />
      </div>
    </div>;

  if (props.draggable) {
    return <Draggable
      onStart={props.onStart}
      onDrag={props.onDrag}
      onStop={props.onStop}
      disabled={props.disabled}
      position={props.position}
      onClick={props.onClick}>
      <div className={`button-plate plate${props.index} ${props.disabled ? 'matched' : ''}`}>
        {contElem}
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

    if (isClickable) {
      btn.classList.add('green');
      props.onClick(e);
    }
  };
  let classNames = `button-plate plate${props.index} `;

  if (props.disabled) {
    classNames += ` matched ${props.className}`;
  }

  return <div
    className={classNames}
    style={styles}
    data-slot-id={props.position.slot}
    onClick={handleClick}
  >
    {contElem}
  </div>;
};

export default PlateButton;