export function defaultSquareVertices() {
  return [
    { x: 20, y: 20 },
    { x: 80, y: 20 },
    { x: 80, y: 80 },
    { x: 20, y: 80 }
  ];
}

export function randomPresetVertices() {
  const presets = [
    [{ x: 50, y: 15 }, { x: 85, y: 85 }, { x: 15, y: 85 }], // triangle
    [{ x: 20, y: 25 }, { x: 80, y: 25 }, { x: 80, y: 75 }, { x: 20, y: 75 }], // rectangle
    [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 75, y: 75 }, { x: 25, y: 75 }], // square
  ];
  return presets[Math.floor(Math.random() * presets.length)];
}

export function classifyShapeFromVertices(vertices) {
  if (!vertices || vertices.length < 3) return 'unknown';
  if (vertices.length === 3) return 'triangle';
  if (vertices.length === 4) {
    const dists = [];
    for (let i = 0; i < vertices.length; i++) {
      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % vertices.length];
      const d = Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
      dists.push(d);
    }
    const avg = dists.reduce((a, b) => a + b, 0) / 4;
    const allEqualish = dists.every(d => Math.abs(d - avg) < avg * 0.25);
    return allEqualish ? 'square' : 'rectangle';
  }
  return 'polygon';
}

export function randomShapeSpec() {
  const types = ['square', 'rectangle', 'triangle', 'circle'];
  const type = types[Math.floor(Math.random() * types.length)];
  let sideCount = type === 'circle' ? 0 : type === 'triangle' ? 3 : 4;
  let cornerCount = type === 'circle' ? 0 : type === 'triangle' ? 3 : 4;
  return { type, sideCount, cornerCount };
}

export function classifyBySidesCorners(sides, corners) {
  if (sides === 0 || corners === 0) return 'circle';
  if (sides === 3) return 'triangle';
  if (sides === 4 && corners === 4) return 'square/rectangle';
  return 'unknown';
}

export function generateSortingPool(count = 8) {
  const types = ['square', 'rectangle', 'triangle', 'circle'];
  const pool = [];
  for (let i = 0; i < count; i++) {
    pool.push({ id: i, type: types[i % types.length] });
  }
  return shuffleArray(pool);
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function calcStars(correctCount, total = 10) {
  const pct = correctCount / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function canUnlockWorld(correctCount, total = 10) {
  return correctCount >= Math.floor(total * 0.5);
}
