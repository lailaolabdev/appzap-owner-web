import React from "react"
import Lottie from 'react-lottie';
import animationData from './loading.json'

export default function AnimationLoading() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    return (
        <Lottie
            options={defaultOptions}
            height={200}
            width={200}
        />
    )
}