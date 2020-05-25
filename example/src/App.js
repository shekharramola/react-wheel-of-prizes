import React from 'react'

import { WheelComponent } from 'react-wheel-of-prizes'
import 'react-wheel-of-prizes/dist/index.css'

const App = () => {
  const segments = ['better luck next time', 'won 70', 'won 10','better luck next time', 'won 2', 'won uber pass', 'better luck next time', 'won a voucher'];
  const seg_colors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];
  const onFinished = (winner) => {
    console.log(winner);
  }
  return <WheelComponent
  segments = {segments}
  seg_colors = {seg_colors} 
  winning_segment ='won 10'
  onFinished={(winner)=>onFinished(winner)}/>
}

export default App
