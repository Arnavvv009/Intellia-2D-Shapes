import React from 'react';

function getShapeFillToken(type) {
  switch (type) {
    case 'square': return 'var(--shape-square-fill)';
    case 'rectangle': return 'var(--shape-rectangle-fill)';
    case 'triangle': return 'var(--shape-triangle-fill)';
    case 'circle': return 'var(--shape-circle-fill)';
    default: return 'var(--accent-gold)';
  }
}

function ShapeRenderer({
  type = 'square',
  size = 56,
  fill,
  rotation = 0,
  style = {},
  vertices
}) {
  const fillColor = fill || getShapeFillToken(type);

  if (vertices) {
    const points = vertices.map(v => `${v.x},${v.y}`).join(' ');
    const minX = Math.min(...vertices.map(v => v.x));
    const maxX = Math.max(...vertices.map(v => v.x));
    const minY = Math.min(...vertices.map(v => v.y));
    const maxY = Math.max(...vertices.map(v => v.y));
    const width = maxX - minX || 100;
    const height = maxY - minY || 100;

    return (
      <svg
        width={size}
        height={size}
        viewBox={`${minX - 10} ${minY - 10} ${width + 20} ${height + 20}`}
        className="shape-renderer"
        style={{ transform: `rotate(${rotation}deg)`, ...style }}
      >
        <polygon
          points={points}
          fill={fillColor}
          stroke="var(--shape-stroke)"
          strokeWidth="2"
        />
      </svg>
    );
  }

  const renderShape = () => {
    switch (type) {
      case 'square':
        return (
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            fill={fillColor}
            stroke="var(--shape-stroke)"
            strokeWidth="3"
            rx="4"
          />
        );
      case 'rectangle':
        return (
          <rect
            x="5"
            y="20"
            width="90"
            height="60"
            fill={fillColor}
            stroke="var(--shape-stroke)"
            strokeWidth="3"
            rx="4"
          />
        );
      case 'triangle':
        return (
          <polygon
            points="50,10 90,90 10,90"
            fill={fillColor}
            stroke="var(--shape-stroke)"
            strokeWidth="3"
          />
        );
      case 'circle':
        return (
          <circle
            cx="50"
            cy="50"
            r="40"
            fill={fillColor}
            stroke="var(--shape-stroke)"
            strokeWidth="3"
          />
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shape-renderer"
      style={{ transform: `rotate(${rotation}deg)`, ...style }}
    >
      {renderShape()}
    </svg>
  );
}

export default ShapeRenderer;
