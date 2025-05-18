"use client";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { placeholderImage, useIsRtl } from "@/utils";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { userSignUpData } from "@/redux/reuducer/authSlice";
import { useSelector } from "react-redux";

const OfferSlider = ({ sliderData }) => {
  const swiperRef = useRef();
  const isRtl = useIsRtl();
  const userData = useSelector(userSignUpData);

  const swipePrev = () => {
    if (swiperRef?.current) {
      swiperRef.current.slidePrev();
    }
  };

  const swipeNext = () => {
    if (swiperRef?.current) {
      swiperRef.current.slideNext();
    }
  };

  const breakpoints = {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 1.2,
    },
    1400: {
      slidesPerView: 1.5,
    },
  };

  return (
    <div className="offer_slider pop_categ_mrg_btm my-0">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {sliderData && sliderData.length > 0 && (
              <div className="offer_slider_swiper">
                <Swiper
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  dir={isRtl ? "rtl" : "ltr"}
                  spaceBetween={20}
                  slidesPerView={1}
                  modules={[Navigation, Autoplay]}
                  breakpoints={breakpoints}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    stopOnLastSlide: false,
                  }}
                  slideToClickedSlide={true}
                  key={isRtl}
                >
                  {sliderData.map((ele, index) => {
                    let href;
                    if (ele?.model_type === "App\\Models\\Item") {
                      if (userData && userData?.id === ele?.model?.user_id) {
                        href = `/my-listing/${ele?.model?.slug}`;
                      } else {
                        // Otherwise, link to the product details page
                        href = `/product-details/${ele?.model?.slug}`;
                      }
                    } else if (ele?.model_type === null) {
                      href = ele?.third_party_link;
                    } else if (ele?.model_type === "App\\Models\\Category") {
                      href = `/category/${ele.model.slug}`;
                    } else {
                      href = "/";
                    }
                    return (
                      <SwiperSlide key={index}>
                        <Link
                          href={href}
                          target={ele?.model_type === null ? "_blank" : ""}
                        >
                          <Image
                            src={ele.image}
                            width={983}
                            height={493}
                            alt={ele.id}
                            className="offer_slider_img"
                            onError={placeholderImage}
                          />
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                {sliderData.length > 1 && (
                  <>
                    <button
                      className="pop_cat_btns pop_cat_left_btn"
                      onClick={swipePrev}
                    >
                      <RiArrowLeftLine size={24} color="white" />
                    </button>
                    <button
                      className="pop_cat_btns pop_cat_right_btn"
                      onClick={swipeNext}
                    >
                      <RiArrowRightLine size={24} color="white" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSlider;
