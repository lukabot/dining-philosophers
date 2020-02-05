### Dining Philosophers
[Demo](https://lukabot.github.io/dining-philosophers)

Visualization of [dining philosophers problem](https://en.wikipedia.org/wiki/Dining_philosophers_problem) written in javascript.

- Web workers are assigned for each philosoher to emulate the behavior.
- Chopstick data is shared between workers by using [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) and [`Atomics`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) api.

Since this project uses `SharedArrayBuffer`, google chrome is recommended currently.
Further support might be introduced after [thread proposal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes) stabilized.


#### behavior of philosophers
1. think random amount of time (0 ~ 500ms)
2. pick up left chopstick
3. (wait 250ms to observe deadlock easily)
4. pick up right chopstick
5. eat random amout of time (0 ~ 500ms)
6. put down right chopstick
7. put down left chpstick
8. repeat from the beginning

To change this behavior, please edit `worker.js`
