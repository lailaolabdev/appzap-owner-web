import React, { Component } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import contactAnimationData from '../image/lottieContact.json'
import Lottie from 'react-lottie';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: contactAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

export default class AnimationLoading extends Component {
    render() {
        return (
            <div style={{ position: 'fixed', zIndex: 10000, height: '100vh', width: '100%', display: "flex", flexDirection:"column",justifyContent: "center", alignItems: "center" }}>
                <div style={{ backgroundColor: 'white', top: 0, height: '100vh', width: '100vw', opacity: 0.95 }}></div>
                <div style={{ zIndex: 2, position: 'absolute', alignSelf: 'center', flexDirection:"column",display: "flex", justifyContent: "center", alignItems: "center" }}>
                <p style={{fontSize:30,color:"#616161"}}>ກໍາລັງໂຫລດຂໍ້ມູນ...</p>
                    <Lottie options={defaultOptions} width={400} />
                </div>
            </div>
        )
    }
}
