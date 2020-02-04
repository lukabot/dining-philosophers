const minEatTime = 0;
const maxEatTime = 500;
const minThinkTime = 0;
const maxThinkTime = 500;
const sleep = 250;

self.onmessage = (e => {
  const { sab, index, numberOfPhils} = e.data;
  const typedArray = new Int32Array(sab);
  const leftChopstickIndex = index;
  const rightChopstickIndex = (leftChopstickIndex + 1) % numberOfPhils;
  const leftPhilosopherIndex = (numberOfPhils + index - 1) % numberOfPhils;
  const rightPhilosopherIndex = rightChopstickIndex;

  async function action() {
    const think = new Promise(res => {
      setTimeout(res, minThinkTime + Math.random() * (maxThinkTime - minThinkTime));
    });

    const pickUpLeft = _ => new Promise(res => {
      while(true) {
        Atomics.wait(typedArray, leftChopstickIndex, leftPhilosopherIndex);
        if(Atomics.compareExchange(typedArray, leftChopstickIndex, -1, index) == -1) {
          /// wait before picking right chopstick
          setTimeout(res, sleep);
          return;
        }
      }
    });

    const pickUpRight = _ => new Promise(res => {
      while(true) {
        Atomics.wait(typedArray, rightChopstickIndex, rightPhilosopherIndex);
        if(Atomics.compareExchange(typedArray, rightChopstickIndex, -1, index) == -1) {
          res();
          return;
        }
      }
    });

    const eat = _ => new Promise(res => {
      setTimeout(res, minEatTime + Math.random() * (maxEatTime - minEatTime));
    });

    const putDownRight = _ => new Promise(res => {
      Atomics.store(typedArray, rightChopstickIndex, -1);
      Atomics.notify(typedArray, rightChopstickIndex);
      res();
    });

    const putDownLeft = _ => new Promise(res => {
      Atomics.store(typedArray, leftChopstickIndex, -1);
      Atomics.notify(typedArray, leftChopstickIndex);
      res();
    });

    return think
        .then(pickUpLeft)
        .then(pickUpRight)
        .then(eat)
        .then(putDownRight)
        .then(putDownLeft);
  }

  async function wrapper() {
    while(true) {
      await action();
    }
  }
  wrapper();
});
