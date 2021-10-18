import React, { useRef, useEffect, useState } from 'react';
import Rx from 'rx';

import './App.css';

function App() {
  const startBtn = useRef(null);
  const stopBtn = useRef(null);
  const resetBtn = useRef(null);
  const waitBtn = useRef(null);
  const timeValue = useRef(null);

  const started = useRef(false);
  const time = useRef(0);

  const source = Rx.Observable.interval(1000).timeInterval();

  useEffect(() => {
    const subscription = source.subscribe((x) => {
      if (!started.current) return;
      time.current++;
      console.log(time.current);
      timeValue.current.innerHTML =
        ('0' + Math.floor((time.current / 360) % 60)).slice(-2) +
        ':' +
        ('0' + Math.floor((time.current / 60) % 60)).slice(-2) +
        ':' +
        ('0' + Math.floor(time.current % 60)).slice(-2);
    });
  });

  useEffect(() => {
    Rx.Observable.fromEvent(startBtn.current, 'click').subscribe((e) => {
      started.current = true;
    });
  });
  useEffect(() => {
    Rx.Observable.fromEvent(stopBtn.current, 'click').subscribe((e) => {
      started.current = false;
    });
  });
  useEffect(() => {
    Rx.Observable.fromEvent(resetBtn.current, 'click').subscribe((e) => {
      time.current = 0;
      timeValue.current.innerHTML = `00:00:00`;
    });
  });
  useEffect(() => {
    let stream = Rx.Observable.fromEvent(waitBtn.current, 'click');
    stream
      .buffer(stream.debounce(250))
      .map((list) => list.length)
      .filter((x) => x === 2)
      .subscribe(() => {
        started.current = false;
      });
  });

  return (
    <div className="App">
      <h1>Timer</h1>
      <p ref={timeValue}>00:00:00</p>
      <button ref={startBtn}>Start</button>
      <button ref={stopBtn}>Stop</button>
      <button ref={waitBtn}>Wait</button>
      <button ref={resetBtn}>Reset</button>
    </div>
  );
}

export default App;
