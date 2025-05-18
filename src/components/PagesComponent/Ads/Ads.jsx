"use client";
import AdsCard from "@/components/Cards/AdsCard";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import AdsCardSkeleton from "@/components/Skeleton/AdsCardSkeleton";
import { placeholderImage, t } from "@/utils";
import { getMyItemsApi } from "@/utils/api";
import { MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { isLogin } from "@/utils";
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent";
import NoDataFound from "../../../../public/assets/no_data_found_illustrator.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { CurrentLanguageData } from "@/redux/reuducer/languageSlice";
import {
  selectSortBy,
  selectStatus,
  setAdsSortBy,
  setAdsStatus,
} from "@/redux/reuducer/filterSlice";
import withRedirect from "@/components/Layout/withRedirect";

const Ads = () => {
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const dispatch = useDispatch();
  const [MyItems, setMyItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [IsLoading, setIsLoading] = useState(true);
  const sortBy = useSelector(selectSortBy);
  const Status = useSelector(selectStatus);
  const [IsLoadMore, setIsLoadMore] = useState(false);
  const [totalAdsCount, setTotalAdsCount] = useState(0);

  const getMyItemsData = async (page) => {
    try {
      const params = {
        page,
        sort_by: sortBy,
        limit: 12,
      };
      if (Status !== "all") {
        params.status = Status;
      }
      const res = await getMyItemsApi.getMyItems(params);
      const data = res?.data;
      setTotalAdsCount(data?.data?.total);
      if (data?.error === false) {
        // If it's a load more operation
        if (page !== undefined && page > 1) {
          setMyItems((prevData) => [...prevData, ...data?.data?.data]);
        } else {
          // Initial load or reload
          setMyItems(data?.data?.data);
        }
        // Set pagination data and stop loading states
        setCurrentPage(data?.data?.current_page);
        setLastPage(data?.data?.last_page);
      } else {
        console.log("Error in response: ", data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // Ensure loading states are stopped in both success and error cases
      setIsLoading(false);
      setIsLoadMore(false);
    }
  };

  useEffect(() => {
    if (isLogin()) {
      getMyItemsData();
    }
  }, [sortBy, Status]);

  const handleChange = (event) => {
    dispatch(setAdsSortBy(event.target.value));
  };
  const handleStatusChange = (event) => {
    dispatch(setAdsStatus(event.target.value));
  };

  const handleLoadMore = () => {
    setIsLoadMore(true);
    getMyItemsData(currentPage + 1); // Pass current sorting option
  };

  const NoAds = () => {
    return (
      <div className="col-12 text-center no_data_conatiner">
        <div>
          <Image
            loading="lazy"
            src={NoDataFound}
            alt="no_img"
            width={200}
            height={200}
            onError={placeholderImage}
          />
        </div>
        <div className="no_data_found_text">
          <h3>{t("noAdsFound")}</h3>
          <span className="maxwidth">{t("noAdsAvailable")}</span>
        </div>
      </div>
    );
  };
  return (
    <>
      <BreadcrumbComponent title2={t("ads")} />
      <div className="container">
        <div className="row my_prop_title_spacing">
          <div className="col-12">
            <h4 className="pop_cat_head">{t("myAds")}</h4>
          </div>
        </div>
        <div className="row profile_sidebar">
          <ProfileSidebar />
          <div className="col-lg-9 p-0">
            <div className="row">
              <div className="col-12">
                <div
                  className="drop_ad_count"
                  style={{
                    justifyContent:
                      MyItems?.length > 0 ? "space-between" : "flex-end",
                  }}
                >
                  {MyItems && MyItems?.length > 0 && (
                    <p className="ad_count">
                      {t("totalAds")} {totalAdsCount}
                    </p>
                  )}
                  <div className="sortby_drop_cont">
                    <span className="sort_by_label">
                      <span>
                        <CgArrowsExchangeAltV size={25} />
                      </span>
                      <span>{t("sortBy")}</span>
                    </span>
                    <Select
                      value={sortBy}
                      onChange={handleChange}
                      variant="outlined"
                      className="ads_select"
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "right",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "right",
                        },
                        getContentAnchorEl: null,
                      }}
                    >
                      <MenuItem value="new-to-old">
                        {t("newestToOldest")}
                      </MenuItem>
                      <MenuItem value="old-to-new">
                        {t("oldestToNewest")}
                      </MenuItem>
                      <MenuItem value="price-high-to-low">
                        {t("priceHighToLow")}
                      </MenuItem>
                      <MenuItem value="price-low-to-high">
                        {t("priceLowToHigh")}
                      </MenuItem>
                      <MenuItem value="popular_items">{t("popular")}</MenuItem>
                    </Select>
                    <Select
                      value={Status}
                      onChange={handleStatusChange}
                      variant="outlined"
                      className="ads_select"
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "right",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "right",
                        },
                        getContentAnchorEl: null,
                      }}
                    >
                      <MenuItem value="all">{t("all")}</MenuItem>
                      <MenuItem value="review">{t("review")}</MenuItem>
                      <MenuItem value="approved">{t("live")}</MenuItem>
                      <MenuItem value="soft rejected">
                        {t("softRejected")}
                      </MenuItem>
                      <MenuItem value="permanent rejected">
                        {t("permanentRejected")}
                      </MenuItem>
                      <MenuItem value="inactive">{t("deactivate")}</MenuItem>
                      <MenuItem value="featured">{t("featured")}</MenuItem>
                      <MenuItem value="sold out">{t("soldOut")}</MenuItem>
                      <MenuItem value="resubmitted">
                        {t("resubmitted")}
                      </MenuItem>
                      <MenuItem value="expired">{t("expired")}</MenuItem>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="row ad_card_wrapper">
              {IsLoading ? (
                Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="col-xxl-3 col-lg-4 col-6">
                    <AdsCardSkeleton />
                  </div>
                ))
              ) : MyItems && MyItems?.length > 0 ? (
                MyItems.map((item) => (
                  <div key={item?.id} className="col-xxl-3 col-lg-4 col-6">
                    <AdsCard data={item} sortBy={sortBy} />
                  </div>
                ))
              ) : (
                <NoAds />
              )}
            </div>
            {IsLoadMore ? (
              <div className="loader"></div>
            ) : (
              currentPage < lastPage &&
              MyItems &&
              MyItems.length > 0 && (
                <div className="loadMore">
                  <button onClick={handleLoadMore}> {t("loadMore")} </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default withRedirect(Ads);
