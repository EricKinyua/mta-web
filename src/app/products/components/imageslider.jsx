import React from 'react'

const ImageSlider = ({item}) => {
  return (
    <div className="image-container">
      <img src={item.images[0].path} alt="drum" />
    </div>
  )
}

export default ImageSlider