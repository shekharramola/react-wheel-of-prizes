import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'

export const WheelComponent = ({
  segments,
  seg_colors,
  winning_segment,
  onFinished
}) => {
  let current_segment = ''
  const [isFinished, setFinished] = useState(false)
  let timerHandle = 0
  let timerDelay = 33
  let angleCurrent = 0
  let angleDelta = 0
  let size = 290
  let canvasContext = null
  let maxSpeed = Math.PI / 16
  let upTime = 500
  let downTime = 10000
  let spinStart = 0
  let frames = 0
  let centerX = 300
  let centerY = 300
  useEffect(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1)
    }, 0)
  }, [])
  const wheelInit = () => {
    initCanvas()
    wheelDraw()
  }
  
  const initCanvas = () => {
    let canvas = document.getElementById('canvas')
    if (navigator.appVersion.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas')
      canvas.setAttribute('width', 1000)
      canvas.setAttribute('height', 600)
      canvas.setAttribute('id', 'canvas')
      document.getElementById('wheel').appendChild(canvas)
    }
    canvas.addEventListener('click', spin, false)
    canvasContext = canvas.getContext('2d')
  }
  const spin = () => {
    if (timerHandle === 0) {
      spinStart = new Date().getTime()
      maxSpeed = Math.PI / (16 + Math.random())
      frames = 0
      timerHandle = setInterval(onTimerTick, timerDelay)
    }
  }
  const onTimerTick = () => {
    frames++
    draw()
    let duration = new Date().getTime() - spinStart
    let progress = 0
    let finished = false
    if (duration < upTime) {
      progress = duration / upTime
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2)
    } else {
      if (winning_segment) {
        if (current_segment === winning_segment && frames > 240) {
          progress = 1
          
          
        } else {
          progress = duration / downTime
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
        }
      } else {
        progress = duration / downTime
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
      }
      if (progress >= 1) finished = true
    }

    angleCurrent += angleDelta
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2
    if (finished) {
      setFinished(true);
      onFinished(current_segment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  }

  const wheelDraw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const draw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const drawSegment = (key, lastAngle, angle) => {
    let ctx = canvasContext
    let value = segments[key]
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, size, lastAngle, angle, false)
    ctx.lineTo(centerX, centerY)
    ctx.closePath()
    ctx.fillStyle = seg_colors[key]
    ctx.fill()
    ctx.stroke()
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((lastAngle + angle) / 2)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 1em proxima-nova'
    ctx.fillText(value.substr(0, 20), size / 2 + 20, 0)
    ctx.restore()
  }

  const drawWheel = () => {
    let ctx = canvasContext
    let lastAngle = angleCurrent
    let len = segments.length
    let PI2 = Math.PI * 2
    ctx.lineWidth = 1
    ctx.strokeStyle = '#131848'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = '1em proxima-nova'
    for (let i = 1; i <= len; i++) {
      let angle = PI2 * (i / len) + angleCurrent
      drawSegment(i - 1, lastAngle, angle)
      lastAngle = angle
    }
    ctx.beginPath()
    ctx.arc(centerX, centerY, 50, 0, PI2, false)
    ctx.closePath()
    ctx.fillStyle = '#131848'
    ctx.lineWidth = 10
    ctx.strokeStyle = '#ffffff'
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(centerX, centerY, size, 0, PI2, false)
    ctx.closePath()
    ctx.lineWidth = 10
    ctx.strokeStyle = '#131848'
    ctx.stroke()
  }

  const drawNeedle = () => {
    let ctx = canvasContext
    ctx.lineWidth = 1
    ctx.strokeStyle = '#ffffff'
    ctx.fileStyle = '#fff'
    ctx.beginPath()
    ctx.moveTo(centerX + 20, centerY - 30)
    ctx.lineTo(centerX - 20, centerY - 30)
    ctx.lineTo(centerX, centerY - 70)
    ctx.closePath()
    ctx.fill()
    let change = angleCurrent + Math.PI / 2
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1
    if (i < 0) i = i + segments.length
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'black'
    ctx.font = 'bold 1.5em proxima-nova'
    current_segment = segments[i]
    ctx.fillText(current_segment, centerX + 10, centerY + size + 50)
  }
  const clear = () => {
    let ctx = canvasContext
    ctx.clearRect(0, 0, 1000, 800)
  }
  return (
    <div id='wheel'>
      <canvas
        id='canvas'
        width='1000'
        height='800'
        style={{
          pointerEvents: isFinished ? 'none' : 'auto'
        }}
      ></canvas>
    </div>
  )
}
