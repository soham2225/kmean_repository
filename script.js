const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let points = [];
let centroids = [];
let k = 3;
let colors = ["red", "green", "blue", "orange", "purple", "cyan", "magenta", "yellow", "brown", "black"];

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  points.push({ x, y, cluster: -1 });
  draw();
});

document.getElementById("startBtn").addEventListener("click", () => {
  k = parseInt(document.getElementById("kInput").value);
  initializeCentroids();
  runKMeans();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  points = [];
  centroids = [];
  draw();
});

function initializeCentroids() {
  centroids = [];
  for (let i = 0; i < k; i++) {
    const randIndex = Math.floor(Math.random() * points.length);
    centroids.push({ ...points[randIndex] });
  }
}

function runKMeans() {
  let changed = true;
  let iterations = 0;
  const maxIterations = 10;

  while (changed && iterations < maxIterations) {
    changed = assignPointsToClusters();
    updateCentroids();
    iterations++;
  }

  draw();
}

function assignPointsToClusters() {
  let changed = false;
  for (let point of points) {
    let minDist = Infinity;
    let closestCluster = -1;
    for (let i = 0; i < k; i++) {
      const dist = distance(point, centroids[i]);
      if (dist < minDist) {
        minDist = dist;
        closestCluster = i;
      }
    }
    if (point.cluster !== closestCluster) {
      point.cluster = closestCluster;
      changed = true;
    }
  }
  return changed;
}

function updateCentroids() {
  for (let i = 0; i < k; i++) {
    const clusterPoints = points.filter(p => p.cluster === i);
    if (clusterPoints.length > 0) {
      const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
      const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);
      centroids[i] = {
        x: sumX / clusterPoints.length,
        y: sumY / clusterPoints.length
      };
    }
  }
}

function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw points
  for (let point of points) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = point.cluster >= 0 ? colors[point.cluster % colors.length] : "#666";
    ctx.fill();
  }

  // Draw centroids
  for (let i = 0; i < centroids.length; i++) {
    const c = centroids[i];
    ctx.beginPath();
    ctx.arc(c.x, c.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = colors[i % colors.length];
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  }
}
