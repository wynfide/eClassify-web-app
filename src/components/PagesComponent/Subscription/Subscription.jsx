"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import SubscriptionCard from "@/components/Cards/SubscriptionCard";
import {
  assigFreePackageApi,
  getPackageApi,
  getPaymentSettingsApi,
} from "@/utils/api";
import { t, useIsRtl } from "@/utils";
import PaymentModal from "./PaymentModal";
import SubscriptionCardSkeleton from "@/components/Skeleton/SubscriptionCardSkeleton";
import { store } from "@/redux/store";
import toast from "react-hot-toast";
import { isLogin } from "@/utils";
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "@/redux/reuducer/authSlice";
import BankDetailsModal from "./BankDetailsModal";
import { toggleLoginModal } from "@/redux/reuducer/globalStateSlice";

const Subscription = () => {
  const AdListingRef = useRef();
  const FeaturedAdRef = useRef();
  const isRtl = useIsRtl();
  const router = useRouter();
  const settingsData = store.getState().Settings?.data;
  const UserData = store.getState().UserSignup?.data?.data;
  const [isLoading, setIsLoading] = useState(false);
  const [itemPackages, setItemPackages] = useState([]);
  const [advertisementPackage, setAdvertisementPackage] = useState([]);
  const [packageSettings, setPackageSettings] = useState([]);
  const [priceData, setPriceData] = useState({});
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const isFreeAdListing = Number(settingsData?.data?.free_ad_listing);
  const IsLoggedIn = useSelector(getIsLoggedIn);

  const getPackageSettingsData = async () => {
    try {
      const res = await getPaymentSettingsApi.getPaymentSettings();
      const { data } = res.data;
      setPackageSettings(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getItemsPackageData = async () => {
    try {
      setIsLoading(true);
      const res = await getPackageApi.getPackage({ type: "item_listing" });
      const { data } = res.data;
      setItemPackages(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const getAdvertisementPackageData = async () => {
    try {
      setIsLoading(true);
      const res = await getPackageApi.getPackage({ type: "advertisement" });
      const { data } = res.data;
      setAdvertisementPackage(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFreeAdListing === 0) {
      getItemsPackageData();
    }
    getAdvertisementPackageData();
  }, [IsLoggedIn]);
  useEffect(() => {
    if (isPaymentModal) {
      getPackageSettingsData();
    }
  }, [isPaymentModal]);

  const breakpoints = {
    0: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    430: {
      slidesPerView: 1.3,
      spaceBetween: 10,
    },
    576: {
      slidesPerView: 1.3,
    },
    768: {
      slidesPerView: 1.8,
    },
    992: {
      slidesPerView: 2.5,
    },
    1200: {
      slidesPerView: 2.8,
    },
    1400: {
      slidesPerView: 3.2,
    },
  };

  const assignPackage = async (id) => {
    try {
      const res = await assigFreePackageApi.assignFreePackage({
        package_id: id,
      });
      const data = res?.data;
      if (data?.error === true) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        router.push("/");
      }
    } catch (error) {
      toast.error(data.message);
      console.log(error);
    }
  };

  const handlePurchasePackage = (e, data) => {
    e.preventDefault();
    if (!isLogin()) {
      toggleLoginModal(true)
      return;
    }
    if (data?.final_price === 0) {
      assignPackage(data.id);
    } else {
      setIsPaymentModal(true);
      setPriceData(data);
    }
  };

  useEffect(() => {}, [isPaymentModal, priceData]);

  return (
    <section className="static_pages">
      <BreadcrumbComponent title2={t("subscription")} />
      <div className="container">
        <div className="page_content">
          <div className="subscription_cont p-0">
            <div className="sub_content">
              {itemPackages && itemPackages.length > 0 && (
                <div className="title">
                  <span>{t("adListingPlan")}</span>
                </div>
              )}
              <Swiper
                onSwiper={(swiper) => {
                  AdListingRef.current = swiper;
                }}
                dir={isRtl ? "rtl" : "ltr"}
                slidesPerView={3}
                spaceBetween={30}
                className="subscription-swiper"
                breakpoints={breakpoints}
                freeMode={true}
                modules={[FreeMode]}
                key={isRtl}
              >
                {isLoading
                  ? Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <SwiperSlide key={index}>
                          <SubscriptionCardSkeleton />
                        </SwiperSlide>
                      ))
                  : itemPackages &&
                    itemPackages.length > 0 &&
                    itemPackages.map((data, index) => (
                      <SwiperSlide key={index}>
                        <SubscriptionCard
                          data={data}
                          handlePurchasePackage={handlePurchasePackage}
                        />
                      </SwiperSlide>
                    ))}
              </Swiper>
            </div>
            <div className="sub_content">
              <div className="title">
                <span>{t("featuredAdPlan")}</span>
              </div>
              <Swiper
                onSwiper={(swiper) => {
                  FeaturedAdRef.current = swiper;
                }}
                dir={isRtl ? "rtl" : "ltr"}
                slidesPerView={3}
                spaceBetween={30}
                className="subscription-swiper"
                breakpoints={breakpoints}
                freeMode={true}
                modules={[FreeMode]}
                key={isRtl}
              >
                {isLoading
                  ? Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <SwiperSlide key={index}>
                          <SubscriptionCardSkeleton />
                        </SwiperSlide>
                      ))
                  : advertisementPackage &&
                    advertisementPackage.map((data, index) => (
                      <SwiperSlide key={index}>
                        <SubscriptionCard
                          data={data}
                          handlePurchasePackage={handlePurchasePackage}
                        />
                      </SwiperSlide>
                    ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        isPaymentModal={isPaymentModal}
        OnHide={() => setIsPaymentModal(false)}
        packageSettings={packageSettings}
        priceData={priceData}
        settingsData={settingsData}
        user={UserData}
        setItemPackages={setItemPackages}
        setAdvertisementPackage={setAdvertisementPackage}
      />

      <BankDetailsModal priceData={priceData} bankDetails={packageSettings?.bankTransfer} />
    </section>
  );
};

export default Subscription;
