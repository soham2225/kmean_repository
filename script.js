const canvas = document.getElementById('kmeansCanvas');
const ctx = canvas.getContext('2d');
let points = [];
let centroids = [];

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  points.push({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    cluster: -1,
  });
  draw();
});

function generatePoints(num = 20) {
  points = [];
  const width = canvas.width;
  const height = canvas.height;
  for (let i = 0; i < num; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      cluster: -1,
    });
  }
  draw();
}

function resetCanvas() {
  points = [];
  centroids = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function runKMeans() {
  const k = parseInt(document.getElementById('kValue').value);
  if (points.length < k) {
    alert('Add more points than the number of clusters!');
    return;
  }

  // Initialize centroids
  centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(points[Math.floor(Math.random() * points.length)]);
  }

  let changed = true;
  while (changed) {
    changed = assignClusters();
    updateCentroids();
  }
  draw();
}

function assignClusters() {
  let changed = false;
  for (let point of points) {
    let minDist = Infinity;
    let assignedCluster = point.cluster;
    for (let i = 0; i < centroids.length; i++) {
      const c = centroids[i];
      const dist = Math.hypot(point.x - c.x, point.y - c.y);
      if (dist < minDist) {
        minDist = dist;
        assignedCluster = i;
      }
    }
    if (point.cluster !== assignedCluster) {
      point.cluster = assignedCluster;
      changed = true;
    }
  }
  return changed;
}

function updateCentroids() {
  const k = centroids.length;
  const sums = Array(k).fill().map(() => ({ x: 0, y: 0, count: 0 }));

  for (let point of points) {
    sums[point.cluster].x += point.x;
    sums[point.cluster].y += point.y;
    sums[point.cluster].count++;
  }

  for (let i = 0; i < k; i++) {
    if (sums[i].count === 0) continue;
    centroids[i] = {
      x: sums[i].x / sums[i].count,
      y: sums[i].y / sums[i].count,
    };
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'teal', 'brown', 'pink', 'yellow', 'gray'];

  for (let point of points) {
    ctx.fillStyle = colors[point.cluster % colors.length] || 'black';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < centroids.length; i++) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(centroids[i].x, centroids[i].y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
}
