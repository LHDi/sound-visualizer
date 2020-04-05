import React, { useContext } from 'react'
import { soundContext } from '../DanceFloor/index';
import { DoubleSide } from 'three';

const Dancer = ({ index }) => {

    const height = useContext(soundContext)[index] / 128;
    return (
        <mesh position={[/* ...position*/ 0, 0, Math.max(0, height)]}>
            {/* <boxBufferGeometry attach="geometry" args={[size[0] - .1, size[1] - .1, 1]} /> */}
            <ringBufferGeometry attach="geometry" args={[index * .3 + 1.3, index * .3 + 1.1, 6]} />
            <meshToonMaterial
                attach="material"
                color={`hsl(${height * 128},100%, 50%)`}
                //transparent
                //opacity={height <= 0.51 ? 1 : (height <= 0.75 ? .98 : (height <= 1 ? .96 : (height <= 1.5 ? .94 : .92)))}
                side={DoubleSide}
            />
        </mesh>
    )
}

export default Dancer
