import { useEffect, useState } from "react";

interface dimension {
    width: number;
    height: number;
    dsk: boolean;
    dsk2: boolean;
}

function getWindowDimensions(): dimension{
    const {innerWidth: width, innerHeight: height} = window;
    const dsk = width>680;
    const dsk2 = width>1100;
    return {
        width,
        height,
        dsk,
        dsk2
    };
}

export default function useWindowDimensions(){
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(()=>{
        function handleResize(){
            setWindowDimensions(getWindowDimensions())
        }
        window.addEventListener('resize', handleResize);
        return ()=> window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}