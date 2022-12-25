import "./App.css";
import { useEffect, useRef } from "react";
import { CanvasContainer } from "./services/canvas-container";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    CanvasContainer.setupCanvas(canvasRef.current!);
  }, []);

  return <canvas ref={canvasRef} />;
}

export default App;
