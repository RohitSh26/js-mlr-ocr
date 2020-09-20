import React, { useRef, useEffect } from 'react'

const CanvasComponent = (props) => {
  
  const canvasRef = useRef(null)
  
  
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const image = new Image();
    image.src = URL.createObjectURL(props.img);
    image.onload = () => {
        props.draw(context, props.img)
    }
    
    
    //Our draw came here
    // const render = () => {

        

    // }
    // render()
    
  }, [props.draw, props.img])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default CanvasComponent