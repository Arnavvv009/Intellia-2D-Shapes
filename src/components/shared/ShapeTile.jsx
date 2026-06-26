import React from 'react';
import ShapeRenderer from './ShapeRenderer';

function ShapeTile({ type, small = false, draggable = false, onDragStart, style = {} }) {
  return (
    <div
      className={`shape-tile ${small ? 'small' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      style={style}
    >
      <ShapeRenderer type={type} size={small ? 32 : 48} />
    </div>
  );
}

export default ShapeTile;
