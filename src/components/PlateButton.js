import React from 'react';
import Draggable from 'react-draggable';

/**
 * The component for Plate button
 * 
 * <PlateButton
 *  draggable={true|false} If true, return draggable button, else return clickable button
 *  onStart={handleEvent}
 *  onDrag={handleEvent}
 *  onStop={handleEvent}
 *  disabled={true|false} - If false, can't drag
 *  position={object} - Default position {x, y, slot} {100, 200, 1}
 *  slot={ref} - If matched button, slot is matched slot ref
 *  onClick={handleEvent}
 *  rightAnswer={rightAnswer} - In wrong mode, hint right answer
 *  className={string} - Custom class names
 *  index={Number} - Plate button index or id
 * />
 * 
 * @param {*} props props for draggable module and clickable button for answer is wrong
 * @returns The jsx for plate button
 */

const PlateButton = (props) => {
  let position = props.position;
  // matched slot elem
  let slot = props.slot;
  let screenWidth = Math.min(window.outerWidth, window.innerWidth);

  const getPosition = () => {
    // Get position of plate to matched slot
    let offsetX = 7;
    let offsetY = 66;

    if (screenWidth <= 768) {
      offsetX = 1;
      offsetY = 61;
    }

    return {
      ...position,
      x: slot.offsetLeft - offsetX,
      y: slot.offsetTop - offsetY
    };
  }

  if(slot) {
    position = getPosition();
  }
  
  // The basic content of component
  // default, sewed and green plate button
  const contElem =
    <div className="button-cont">
      <div className="button-img"></div>
      <div className="button-sewed"></div>
      <div className="button-green"></div>
    </div>;

  // If draggable
  if (props.draggable) {
    return <Draggable
      onStart={props.onStart}
      onDrag={props.onDrag}
      onStop={props.onStop}
      disabled={props.disabled}
      position={position}>
      <div className={`button-plate plate${props.index} ${props.disabled ? 'matched' : ''}`}>
        {contElem}
      </div>
    </Draggable>;
  }

  // If clickable
  // In the wrong mode, only clickable that hint answer button (Top to color).
  let isClickable = props.rightAnswer === position.slot;

  // position, cursor
  let styles = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    cursor: isClickable ? 'pointer' : 'default'
  };

  // The button click
  const handleClick = (e) => {
    // Add class for animation that changes the sewed to the green button and emit the event to parent.
    const btn = e.target.closest('.button-plate');
    if (isClickable) {
      btn.classList.add('green');
      props.onClick(e);
    }
  };

  // The class name for buttons
  let classNames = `button-plate plate${props.index} `;

  if (props.disabled) {
    classNames += ` matched ${props.className}`;
  }

  return <div
    className={classNames}
    style={styles}
    data-slot-id={position.slot}
    onClick={handleClick}
  >
    {contElem}
  </div>;
};

export default PlateButton;