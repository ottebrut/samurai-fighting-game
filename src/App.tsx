import "./App.css";
import { useEffect, useRef } from "react";
import { CanvasContainer } from "./utils/canvas-container/canvas-container";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const player0HealthBarRef = useRef<HTMLDivElement>(null);
  const player1HealthBarRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    CanvasContainer.setupCanvas(
      canvasRef.current!,
      player0HealthBarRef.current!,
      player1HealthBarRef.current!,
      timerRef.current!,
      resultRef.current!,
      containerRef.current!
    );
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <div className="interface">
        <div className="health-bar-container">
          <div className="health-bar" ref={player0HealthBarRef} />
          <div className="border-right" />
        </div>
        <div className="timer-container">
          <div className="timer-counter" ref={timerRef}>
            60
          </div>
          <div className="border-left" />
          <div className="border-right" />
        </div>
        <div className="health-bar-container">
          <div className="health-bar" ref={player1HealthBarRef} />
        </div>
      </div>

      <div className="result" ref={resultRef} />

      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
