import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from "swiper";

import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// http://via.placeholder.com/640x360
export const Promotion = (): JSX.Element => {

  const promotions = [
    "http://via.placeholder.com/640x360",
    "http://via.placeholder.com/640x360",
    "http://via.placeholder.com/640x360",

  ]

  return (<>
    <div className="w-full pt-3">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="font-slate-200"
      >
        {promotions.map((p, index) => <SwiperSlide key={`item${index}`} className="carousel-item relative w-full">
          <img src={p} className="w-full h-50 w-full" />
        </SwiperSlide>)}
      </Swiper>

    </div>
  </>);
}