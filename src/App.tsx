import "./App.css";
import { useEffect, useRef } from "react";
import { CanvasContainer } from "./utils/canvas-container/canvas-container";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const player0HealthBarRef = useRef<HTMLDivElement>(null);
  const player1HealthBarRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    CanvasContainer.setupCanvas(
      canvasRef.current!,
      player0HealthBarRef.current!,
      player1HealthBarRef.current!,
      timerRef.current!,
      resultRef.current!
    );
  }, []);

  return (
    <div className="container">
      <div className="interface">
        <div className="health-bar-container">
          <div
            className="health-bar health-bar-player-0"
            ref={player0HealthBarRef}
          />
        </div>
        <div className="timer" ref={timerRef}>
          60
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
