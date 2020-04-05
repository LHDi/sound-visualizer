import React, { useRef, useState, useEffect, useCallback, createContext } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import { DoubleSide, BackSide } from 'three';
import Dancer from '../Dancer';

const makeDancers = (num) => {
    const dancers = [];
    for (let i = 0; i < num; i++) {
        dancers.push(<Dancer key={`danc${dancers.length}`} index={dancers.length} />)
    }
    return dancers;
}

export const soundContext = createContext();

const DanceFloor = ({ num, analyser, player, play, ...rest }) => {
    const mesh = useRef();
    const [soundArray, setSoundArray] = useState(() => (Array(num).fill(0)));

    useFrame(() => {
        if (!analyser) return;
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);
        setSoundArray(frequencyData);
    })

    return (
        <mesh
            ref={mesh}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            {...rest}
        >
            <sphereBufferGeometry attach="geometry" args={[20]} />
            <meshToonMaterial attach="material" color={`hsl(${Math.max(...soundArray) + 100}, 100%, 50%)`} side={BackSide} />
            {
                !player.current.playing &&
                <mesh onClick={play}>
                    <ringBufferGeometry attach="geometry" args={[1, 0.3, 3]} />
                    <meshLambertMaterial attach="material" color={`hsl(${Math.max(...soundArray)}, 100%, 50%)`} side={DoubleSide} />
                </mesh>
            }
            {
                player.current.playing &&
                <group position={[0, 0, Math.max(...soundArray) / 128]} onClick={play}>
                    <mesh position={[-.3, 0, 0]}>
                        <planeBufferGeometry attach="geometry" args={[.3, 1]} />
                        <meshToonMaterial attach="material" color={`hsl(${Math.max(...soundArray)}, 100%, 50%)`} side={DoubleSide} />
                    </mesh>
                    <mesh position={[.3, 0, 0]}>
                        <planeBufferGeometry attach="geometry" args={[.3, 1]} />
                        <meshToonMaterial attach="material" color={`hsl(${Math.max(...soundArray)}, 100%, 50%)`} side={DoubleSide} />
                    </mesh>
                </group>
            }
            <soundContext.Provider value={soundArray}>
                {makeDancers(num)}
            </soundContext.Provider>
        </mesh>
    )
}

export default DanceFloor
