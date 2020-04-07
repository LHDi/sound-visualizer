import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Canvas, useThree } from 'react-three-fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DanceFloor from '../DanceFloor';

function nearestPow2(aSize) {
    return Math.pow(2, Math.ceil(Math.log(aSize) / Math.log(2)));
}

const CameraController = () => {
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
    const [track, setTrack] = useState('Fearless')
    const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());
    const analyser = useRef(audioContext.current.createAnalyser());
    const currentSource = useRef(null);
    const currentBuffer = useRef(null);

    useEffect(() => {
        analyser.current.fftSize = nearestPow2(num) * 2;
    }, [num])

    useEffect(() => {
        fetch("/" + track + ".mp3")
            .then((res) => {
                res.arrayBuffer().then((value => {
                    audioContext.current.decodeAudioData(value)
                        .then((audioBuffer) => {
                            currentBuffer.current = audioBuffer;
                            setReady(true);
                        });
                }))
            });
        return () => {
            if (playerOptions.current.playing) play();
            currentBuffer.current = null;
            playerOptions.current = {
                playing: false,
                pausedAt: 0,
                playedAt: 0
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [track]);

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
            <div style={{
                color: "black",
                position: "absolute",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
            }}>
                <button
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.1em",
                        color: "#222"
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
                <select
                    style={{ background: "none", border: "2px solid", borderRadius: "3px", fontSize: "1.1em" }}
                    onChange={e => { setTrack(e.target.value) }}
                >
                    <option value="Fearless" defaultChecked>Lost Sky - Fearless [NCS Release]</option>
                    <option value="Invincible">DEAF KEV - Invincible _NCS Release_</option>
                </select>
                <select
                    style={{ background: "none", border: "2px solid", borderRadius: "3px", fontSize: "1.1em" }}
                    onChange={e => { setNum(e.target.value) }}
                >
                    <option value={16} defaultChecked>16</option>
                    <option value={32}>32</option>
                    <option value={64}>64</option>
                    <option value={128}>128</option>
                    <option value={256}>256</option>
                </select>
            </div>
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
            <span style={{ position: "absolute", zIndex: 1000, bottom: 0, left: 0 }}>Music Provided By <a href="https://ncsmusic.com/">NoCopyrightSounds</a></span>
        </>
    )
}

export default Visualizer
