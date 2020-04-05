import React, { useEffect, createContext, useState, useRef, useCallback } from 'react'
import { Canvas, useThree } from 'react-three-fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DanceFloor from '../DanceFloor'
import { DoubleSide } from 'three';

function nearestPow2(aSize) {
    return Math.pow(2, Math.ceil(Math.log(aSize) / Math.log(2)));
}

const CameraController = (props) => {
    const { camera, gl } = useThree();
    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);

            controls.minDistance = 3;
            controls.maxDistance = 20;
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
}

const Visualizer = () => {
    const [ready, setReady] = useState(false);
    const playerOptions = useRef({
        playing: false,
        pausedAt: 0,
        playedAt: 0
    });
    const [num, setNum] = useState(16);
    const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());
    const analyser = useRef(audioContext.current.createAnalyser());
    const currentSource = useRef(null);
    const currentBuffer = useRef(null);

    useEffect(() => {
        analyser.current.fftSize = nearestPow2(num) * 2;
        fetch('/Lost Sky - Fearless [NCS Release].mp3')
            .then((res) => {
                res.arrayBuffer().then((value => {
                    audioContext.current.decodeAudioData(value)
                        .then((audioBuffer) => {
                            currentBuffer.current = audioBuffer;
                            setReady(true);
                        });
                }))
            })
    }, [num]);

    const play = useCallback(
        () => {

            if (!playerOptions.current.playing) {
                const source = audioContext.current.createBufferSource();
                source.buffer = currentBuffer.current;
                source.connect(analyser.current);
                analyser.current.connect(audioContext.current.destination);
                currentSource.current = source;
                currentSource.current.start(0, playerOptions.current.pausedAt);
                playerOptions.current.playedAt = audioContext.current.currentTime - playerOptions.current.pausedAt;
            } else {
                playerOptions.current.pausedAt = audioContext.current.currentTime - playerOptions.current.playedAt;
                currentSource.current.stop();
            }
            return playerOptions.current.playing = !playerOptions.current.playing;
        },
        [],
    );

    return (
        <>
            <button style={{
                color: "black",
                position: "absolute",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                background: "none",
                border: "none",
                cursor: "pointer"
            }}
                onClick={() => {
                    if (playerOptions.current.playing)
                        play();
                    playerOptions.current = {
                        playing: false,
                        pausedAt: 0,
                        playedAt: 0
                    };
                    play();
                }}
            >Replay</button>
            <Canvas
                pixelRatio={window.devicePixelRatio}
                invalidateFrameloop={false}
                style={{ position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' }}
                camera={{ position: [0, -2, 3] }}
            >
                <CameraController />
                <ambientLight />
                <pointLight position={[0, 0, 20]} color={0xff0000} />
                <pointLight position={[-20, 0, 20]} color={0x00ff00} />
                <pointLight position={[20, 0, 20]} color={0x0000ff} />
                <directionalLight position={[0, 0, 20]} lookAt={[4, 4, 4]} color={0xff0000} />
                {
                    ready &&
                    <DanceFloor num={num} analyser={analyser.current} player={playerOptions} play={play} />
                }
            </Canvas>
        </>
    )
}

export default Visualizer
