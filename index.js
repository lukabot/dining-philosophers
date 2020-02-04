/// create workers and run
let workers = [];
let sab = null;
let typedArray = null;
const run = function(numberOfPhils) {
  /// clean workers
  workers.map(worker => worker.terminate());
  workers = [];

  const WORKER_SIZE = parseInt(numberOfPhils);

  /// initialize chopstick data
  sab = new SharedArrayBuffer(WORKER_SIZE * 4);
  typedArray = new Int32Array(sab);
  typedArray.forEach((_, i) => typedArray[i] = -1);

  for(let i = 0; i < numberOfPhils; i++) {
    const worker = new Worker('./worker.js');
    workers.push(worker);
    worker.postMessage({
      sab, index: i, numberOfPhils
    });
  }
  draw(numberOfPhils);
};

/// draw screen
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const draw = function(numberOfPhils) {
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const r = x - canvas.width / 16;

  ctx.beginPath();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  /// table
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = "128px Courier";
  ctx.fillText("🍝", x, y);

  /// philosophers
  ctx.translate(x, y);
  ctx.font = "48px Helvetica";
  for(let i = 0; i < numberOfPhils; i++) {
    const angle = Math.PI * 2 / numberOfPhils;
    ctx.rotate(angle);
    ctx.fillText("😶", 0, r - 50);

    /// left chopstick
    /// need to copy array since data can be changed while drawing.
    const cloned = Array.from(typedArray);
    if(cloned[i] == i) {
      ctx.moveTo(-10, r - 150);
      ctx.lineTo(-10, r - 100)
      ctx.stroke();
    } else if(cloned[i] == -1) {
      ctx.moveTo(Math.sin(angle / 2) * (r - 150), Math.cos(angle / 2) * (r - 150));
      ctx.lineTo(Math.sin(angle / 2) * (r - 200), Math.cos(angle / 2) * (r - 200));
      ctx.stroke();
    }

    /// right chopstick
    if(cloned[(i + 1) % numberOfPhils] == i) {
      ctx.moveTo(10, r - 150);
      ctx.lineTo(10, r - 100)
      ctx.stroke();
    }
  }
  ctx.translate(-x, -y);

  requestAnimationFrame(_ => draw(numberOfPhils));
};

/// run button
const runbtn = document.getElementById("run");
runbtn.addEventListener("click", function() {
  const phils = document.getElementById("philosophers");
  run(parseInt(phils.value));
});
