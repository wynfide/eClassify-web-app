"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import SubscriptionCard from "@/components/Cards/SubscriptionCard";
import {
  assigFreePackageApi,
  getPackageApi,
  getPaymentSettingsApi,
} from "@/utils/api";
import { useEffect, useRef, useState } from "react";
import { isLogin, t, useIsRtl } from "@/utils";
import PaymentModal from "./PaymentModal";
import { useRouter } from "next/navigation";
import { store } from "@/redux/store";
import toast from "react-hot-toast";
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent";
import NoData from "@/components/NoDataFound/NoDataFound";
import SubscriptionCardSkeleton from "@/components/Skeleton/SubscriptionCardSkeleton";
import Skeleton from "react-loading-skeleton";
import withRedirect from "@/components/Layout/withRedirect";
import BankDetailsModal from "./BankDetailsModal";

const ProfileSubscription = () => {
  const router = useRouter();
  const AdListingRef = useRef();
  const FeaturedAdRef = useRef();
  const isRtl = useIsRtl();
  const settingsData = store.getState().Settings?.data;
  const UserData = store.getState().UserSignup?.data?.data;
  const [isLoading, setIsLoading] = useState(false);
  const [itemPackages, setItemPackages] = useState([]);
  const [advertisementPackage, setAdvertisementPackage] = useState([]);
  const [packageSettings, setPackageSettings] = useState([]);
  const [priceData, setPriceData] = useState({});
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const isFreeAdListing = Number(settingsData?.data?.free_ad_listing);

  const [IsPaymentModalOpening, setIsPaymentModalOpening] = useState(false);

  const getPaymentSettingsData = async () => {
    try {
      setIsPaymentModalOpening(true);
      const res = await getPaymentSettingsApi.getPaymentSettings();
      const { data } = res.data;
      setPackageSettings(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsPaymentModalOpening(false);
    }
  };

  const getItemsPackageData = async () => {
    try {
      setIsLoading(true);
      const res = await getPackageApi.getPackage({ type: "item_listing" });
      const { data } = res.data;
      setItemPackages(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAdvertisementPackageData = async () => {
    try {
      setIsLoading(true);
      const res = await getPackageApi.getPackage({ type: "advertisement" });
      const { data } = res.data;
      setAdvertisementPackage(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin()) {
      if (isFreeAdListing === 0) {
        getItemsPackageData();
      }
      getAdvertisementPackageData();
    }
  }, []);

  useEffect(() => {
    if (isPaymentModal) {
      getPaymentSettingsData();
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
      slidesPerView: 1.5,
    },
    1200: {
      slidesPerView: 1.8,
    },
    1400: {
      slidesPerView: 2.2,
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
      toast.error(error.message);
      console.log(error);
    }
  };

  const handlePurchasePackage = (e, data) => {
    e.preventDefault();
    if (data?.final_price === 0) {
      assignPackage(data.id);
    } else {
      setIsPaymentModal(true);
      setPriceData(data);
    }
  };

  return (
    <>
      <BreadcrumbComponent title2={t("userSubscription")} />
      <div className="container">
        <div className="row my_prop_title_spacing">
          <h4 className="pop_cat_head">{t("subscription")}</h4>
        </div>
        <div className="row profile_sidebar">
          <ProfileSidebar />
          <div className="col-lg-9 p-0">
            <div className="subscription_cont">
              {isLoading ? (
                <>
                  <div className="sub_content">
                    <div className="title">
                      <Skeleton width={100} count={1} />
                    </div>
                    <Swiper
                      slidesPerView={2.3}
                      spaceBetween={30}
                      breakpoints={breakpoints}
                      freeMode={true}
                      modules={[FreeMode]}
                      dir={isRtl ? "rtl" : "ltr"}
                      key={isRtl}
                    >
                      {Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <SwiperSlide key={index}>
                            <SubscriptionCardSkeleton />
                          </SwiperSlide>
                        ))}
                    </Swiper>
                  </div>
                  <div className="sub_content">
                    <div className="title">
                      <Skeleton width={100} count={1} />
                    </div>
                    <Swiper
                      slidesPerView={2.3}
                      spaceBetween={30}
                      className=""
                      breakpoints={breakpoints}
                      freeMode={true}
                      modules={[FreeMode]}
                      dir={isRtl ? "rtl" : "ltr"}
                      key={isRtl}
                    >
                      {Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <SwiperSlide key={index}>
                            <SubscriptionCardSkeleton />
                          </SwiperSlide>
                        ))}
                    </Swiper>
                  </div>
                </>
              ) : (
                <>
                  {itemPackages?.length > 0 && (
                    <div className="sub_content">
                      <div className="title">
                        <span>{t("adListingPlan")}</span>
                      </div>
                      <Swiper
                        slidesPerView={2.3}
                        spaceBetween={30}
                        className="subscription-swiper"
                        breakpoints={breakpoints}
                        freeMode={true}
                        modules={[FreeMode]}
                        onSwiper={(swiper) => {
                          AdListingRef.current = swiper;
                        }}
                        dir={isRtl ? "rtl" : "ltr"}
                        key={isRtl}
                      >
                        {itemPackages?.map((data, index) => (
                          <SwiperSlide key={index}>
                            <SubscriptionCard
                              data={data}
                              handlePurchasePackage={handlePurchasePackage}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}
                  {advertisementPackage?.length > 0 && (
                    <div className="sub_content">
                      <div className="title">
                        <span>{t("featuredAdPlan")}</span>
                      </div>
                      <Swiper
                        slidesPerView={2.3}
                        spaceBetween={30}
                        className="subscription-swiper"
                        breakpoints={breakpoints}
                        freeMode={true}
                        modules={[FreeMode]}
                        onSwiper={(swiper) => {
                          FeaturedAdRef.current = swiper;
                        }}
                        dir={isRtl ? "rtl" : "ltr"}
                        key={isRtl}
                      >
                        {advertisementPackage?.map((data, index) => (
                          <SwiperSlide key={index}>
                            <SubscriptionCard
                              data={data}
                              handlePurchasePackage={handlePurchasePackage}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}
                </>
              )}
            </div>
            {!isLoading &&
              advertisementPackage?.length === 0 &&
              itemPackages?.length === 0 && <NoData name={t("packages")} />}
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
          IsPaymentModalOpening={IsPaymentModalOpening}
        />

        <BankDetailsModal priceData={priceData} bankDetails={packageSettings?.bankTransfer} />
      </div>
    </>
  );
};

export default withRedirect(ProfileSubscription);
