const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const points = [];
let centroids = [];
let clusters = [];
let k = 3;

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  points.push({ x, y });
  draw();
});

document.getElementById("startBtn").addEventListener("click", () => {
  k = parseInt(document.getElementById("clusters").value);
  if (points.length < k) {
    alert("Add more points before clustering!");
    return;
  }
  initCentroids();
  runKMeans();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  points.length = 0;
  centroids = [];
  clusters = [];
  draw();
});

function initCentroids() {
  centroids = [];
  const shuffled = points.slice().sort(() => 0.5 - Math.random());
  centroids = shuffled.slice(0, k);
}

function runKMeans() {
  let changed = true;
  while (changed) {
    clusters = Array.from({ length: k }, () => []);
    for (const point of points) {
      const distances = centroids.map((c) => distance(point, c));
      const minIndex = distances.indexOf(Math.min(...distances));
      clusters[minIndex].push(point);
    }

    changed = false;
    for (let i = 0; i < k; i++) {
      const newCentroid = mean(clusters[i]);
      if (distance(newCentroid, centroids[i]) > 1) {
        centroids[i] = newCentroid;
        changed = true;
      }
    }
  }
  draw();
}

function mean(cluster) {
  const sum = cluster.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
    x: 0,
    y: 0,
  });
  return {
    x: sum.x / cluster.length,
    y: sum.y / cluster.length,
  };
}

function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const colors = ["#e53935", "#8e24aa", "#3949ab", "#00897b", "#fbc02d", "#fb8c00", "#6d4c41", "#43a047", "#1e88e5", "#d81b60"];

  clusters.forEach((cluster, i) => {
    ctx.fillStyle = colors[i % colors.length];
    cluster.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  });

  centroids.forEach((c, i) => {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(c.x, c.y, 7, 0, 2 * Math.PI);
    ctx.fill();
  });

  if (clusters.length === 0) {
    ctx.fillStyle = "gray";
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
}
