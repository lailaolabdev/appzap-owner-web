import React, { useState, useEffect } from "react";

const ImageSlider = ({ images, autoPlayInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const sliderStyle = {
    width: "400px",
    height: "200px",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const paginationStyle = {
    position: "absolute",
    bottom: "10px",
    width: "100%",
    textAlign: "center",
  };

  const dotStyle = (index) => ({
    height: "10px",
    width: "10px",
    margin: "0 5px",
    backgroundColor: currentIndex === index ? "black" : "grey",
    display: "inline-block",
    borderRadius: "50%",
    cursor: "pointer",
  });

  return (
    <div style={sliderStyle}>
      <img src={images[currentIndex]} alt="Slide" style={imageStyle} />
      <div style={paginationStyle}>
        {images.map((_, index) => (
          <span
            key={index}
            style={dotStyle(index)}
            onClick={() => goToIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
