import { useRef, useState, useEffect } from "react";
import "./canvas.css";

function Canvas() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#3B3B3B");
    const [size, setSize] = useState("3");
    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const timeout = useRef(null);
    const [cursor, setCursor] = useState("default");

    useEffect(() => {
        const canvas = canvasRef.current;
        ctx.current = canvas.getContext("2d");

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const canvasimg = localStorage.getItem("canvasimg");

        if (canvasimg) {
            var image = new Image();
            image.onload = function () {
                ctx.current.drawImage(image, 0, 0);
                setIsDrawing(false);
            };
            image.src = canvasimg;
        }
    }, []);

    const startPosition = ({ nativeEvent }) => {
        setIsDrawing(true);
        draw(nativeEvent);
    };

    const finishedPosition = () => {
        setIsDrawing(false);
        ctx.current.beginPath();
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        const canvas = canvasRef.current;
        ctx.current.lineWidth = size;
        ctx.current.lineCap = "round";
        ctx.current.strokeStyle = color;
        ctx.current.lineTo(nativeEvent.clientX, nativeEvent.clientY);
        ctx.current.stroke();
        ctx.current.beginPath();
        ctx.current.moveTo(nativeEvent.clientX, nativeEvent.clientY);

        if (timeout.current !== undefined) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            var base64ImageData = canvas.toDataURL("image/png");
            localStorage.setItem("canvasimg", base64ImageData);
        }, 400);
    };

    const clearCanvas = () => {
        localStorage.removeItem("canvasimg");
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height); 

        if (timeout.current !== undefined) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            var base64ImageData = canvas.toDataURL("image/png");
            localStorage.setItem("canvasimg", base64ImageData);
        }, 400);
    };

    const getPen = () => {
        setCursor("default");
        setSize("3");
        setColor("#3B3B3B");
    };

    const eraseCanvas = () => {
        setCursor("grab");
        setSize("20");
        setColor("#ffffff");
        
        if (isDrawing) {
            draw({ nativeEvent: { clientX: 0, clientY: 0 } }); 
        }
    };

    return (
        <>
            <div className="canvas-btn" title="Lápis">
                <button onClick={getPen} className="btn-width">Lápis</button>
                <div className="btn-width" title="Cores">
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /> 
                </div>
                <div title="Tamanho da fonte">
                    <select className="btn-width" value={size} onChange={(e) => setSize(e.target.value)}> 
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                        <option value="30">30</option>
                    </select>
                </div>
                <button onClick={clearCanvas} className="btn-width" title="Limpar">Limpar</button>
                <div title="Borracha">
                    <button onClick={eraseCanvas} className="btn-width">Borracha</button>
                </div>
            </div>
            <canvas
                style={{ cursor: cursor }}
                onMouseDown={startPosition}
                onMouseUp={finishedPosition}
                onMouseMove={draw}
                ref={canvasRef}
            />
        </>
    );
}

export default Canvas;
