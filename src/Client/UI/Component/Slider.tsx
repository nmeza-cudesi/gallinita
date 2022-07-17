import { Img } from '@chakra-ui/image';
import { Box } from '@chakra-ui/layout';
import React, { useEffect, useRef, useState } from 'react'
import { IPromocion } from '../../../Model/Promotion';
import "./Slider.css";


export const Slider = (promocion: any) => {
  var slideIndex = 0;
  const promociones = promocion.promocion
  function showSlides(limpiar: boolean) {
    let timer
    if (!limpiar) {
      var i;
      var slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
      var dots = document.getElementsByClassName("dot") as HTMLCollectionOf<HTMLElement>;
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;
      if (slideIndex > slides.length) { slideIndex = 1 }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].className += " active";


      timer = setTimeout(showSlides, 4000); // Change image every 4 seconds
    } else {
      clearTimeout(timer);
    }
  }
  const promocionesActivas = promociones.filter((val: IPromocion) => val.PRT_STATUS == "1")
  useEffect(() => {
    if (promocionesActivas.length > 0) {
      showSlides(false);
      return () => {
        showSlides(true)
      }
    }
  })
  if (promocionesActivas.length > 0) return (
    <>
      <Box className="slideshow-container">
        { promocionesActivas.map((val: IPromocion, idx: number) =>
        
          <Box key={idx} className="mySlides fade">
            <Box className="numbertext">{idx+1} / {promocionesActivas.length}</Box>
            <Img src={val.PRT_IMAGE} height={{base:"223px",sm:"380px",md:"500px"}} objectFit="cover" width="100%" />
            <Box className="text">{val.PRT_TITLE}</Box>
          </Box>
        ) }
      </Box>
      <br />

      <Box style={{ textAlign: "center" }}>
        {promocionesActivas.map((val: IPromocion, idx: number) =>
          <span key={idx} className="dot"></span>
        )}
      </Box>
    </>
  )
  return (<></>)
}
