'use client'
import SellerCard from "@/components/Cards/SellerCard"
import { ViewCategory, setCategoryView } from "@/redux/reuducer/categorySlice";
import { MenuItem, Select } from "@mui/material"
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import { IoGrid } from "react-icons/io5";
import { calculateRatingPercentages, getRoundedRating, placeholderImage, t } from "@/utils";
import { useEffect, useState } from "react";
import { IoMdStar } from "react-icons/io";
import { Progress, Rate } from "antd";
import { allItemApi, getSellerApi } from "@/utils/api";
import SellerCardSkeleton from "@/components/Skeleton/SellerCardSkeleton";
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton";
import NoData from "@/components/NoDataFound/NoDataFound";
import Link from "next/link";
import ProductCard from "@/components/Cards/ProductCard";
import ProdcutHorizontalCard from "@/components/Cards/ProdcutHorizontalCard";
import ProductHorizontalCardSkeleton from "@/components/Skeleton/ProductHorizontalCardSkeleton";
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent";
import { CurrentLanguageData } from "@/redux/reuducer/languageSlice";
import NoDataFound from "../../../../public/assets/no_data_found_illustrator.svg";
import Image from "next/image";
import SellerReviewCard from "@/components/Cards/SellerReviewCard";
import { sellerSortBy, setSellerSortBy } from "@/redux/reuducer/filterSlice";
import OpenInAppDrawer from "../SingleProductDetail/OpenInAppDrawer";


const SellerProfile = ({ id }) => {

    const dispatch = useDispatch()
    const systemSettingsData = useSelector((state) => state?.Settings);
    const view = useSelector(ViewCategory)
    const sortBy = useSelector(sellerSortBy)
    const CurrentLanguage = useSelector(CurrentLanguageData)
    const [IsReviewsActive, setIsReviewsActive] = useState(false)
    const [IsSellerDataLoading, setIsSellerDataLoading] = useState(false)
    const [IsSellerItemsLoading, setIsSellerItemsLoading] = useState(false)
    const [SellerItems, setSellerItems] = useState([])
    const [CurrentPage, setCurrentPage] = useState(1)
    const [IsSellerItemLoadMore, setIsSellerItemLoadMore] = useState(false)
    const [HasMore, setHasMore] = useState(true)
    const [ratings, setRatings] = useState({})
    const [seller, setSeller] = useState([])
    const [ReviewCurrentPage, setReviewCurrentPage] = useState(1)
    const [ReviewHasMore, setReviewHasMore] = useState(false)
    const [IsLoadMoreReview, setIsLoadMoreReview] = useState(false)
    const [IsNoUserFound, setIsNoUserFound] = useState(false)
    const [IsOpenInApp, setIsOpenInApp] = useState(false);


    useEffect(() => {
        if (window.innerWidth <= 768) {
            setIsOpenInApp(true);
        }
    }, []);



    const handleGridClick = (viewType) => {
        dispatch(setCategoryView(viewType))
    };

    const handleChange = (event) => {
        dispatch(setSellerSortBy(event.target.value))
    };

    const handleLiveAdsTabClick = () => {
        if (IsReviewsActive) {
            setIsReviewsActive(false)
        }
    }

    const handleReviewsTabClick = () => {
        if (!IsReviewsActive) {
            setIsReviewsActive(true)
        }
    }

    const getSeller = async (page) => {
        if (page === 1) {
            setIsSellerDataLoading(true)
        }
        try {
            const res = await getSellerApi.getSeller({ id: Number(id), page })
            if (res?.data.error && res?.data?.code === 103) {
                setIsNoUserFound(true)
            }
            else {
                const sellerData = res?.data?.data?.ratings
                if (page === 1) {
                    setRatings(sellerData)
                }
                else {
                    setRatings({ ...ratings, data: [...ratings?.data, ...sellerData?.data] })
                }
                setSeller(res?.data?.data?.seller)
                setReviewCurrentPage(res?.data?.data?.ratings?.current_page)
                if (res?.data?.data?.ratings?.current_page < res?.data?.data?.ratings?.last_page) {
                    setReviewHasMore(true)
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSellerDataLoading(false)
            setIsLoadMoreReview(false)
        }
    }


    useEffect(() => {
        getSeller(ReviewCurrentPage)
    }, [])

    const getSellerItems = async (page) => {
        try {
            if (page === 1) {
                setIsSellerItemsLoading(true)
            }
            const res = await allItemApi.getItems({ user_id: id, sort_by: sortBy, page, limit: 12 })
            if (page > 1) {
                // Append new data to existing sellerItems
                setSellerItems(prevItems => [...prevItems, ...res?.data?.data?.data]);
            } else {
                // Set new data if CurrentPage is 1 or initial load
                setSellerItems(res?.data?.data?.data);
            }

            setCurrentPage(res?.data?.data?.current_page)
            if (res?.data?.data.current_page === res?.data?.data.last_page) {
                setHasMore(false); // Check if there's more data
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSellerItemsLoading(false)
            setIsSellerItemLoadMore(false)
        }
    }

    useEffect(() => {
        getSellerItems()
    }, [sortBy])

    const handleLike = (id) => {
        const updatedItems = SellerItems.map((item) => {
            if (item.id === id) {
                return { ...item, is_liked: !item.is_liked };
            }
            return item;
        });
        setSellerItems(updatedItems);
    }

    const handleProdLoadMore = () => {
        setIsSellerItemLoadMore(true)
        getSellerItems(CurrentPage + 1)
    }

    const handleReviewLoadMore = () => {
        setIsLoadMoreReview(true)
        getSeller(ReviewCurrentPage + 1)
    }


    const { ratingCount, ratingPercentages } = ratings?.data?.length
        ? calculateRatingPercentages(ratings.data)
        : { ratingCount: {}, ratingPercentages: {} };

    if (IsNoUserFound) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center no_data_conatiner">
                        <div>
                            <Image loading="lazy" src={NoDataFound} alt="no_img" width={200} height={200} onError={placeholderImage} />
                        </div>
                        <div className="no_data_found_text">
                            <h3>{t('noSellerFound')}</h3>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

  
    return (

        <>
            <BreadcrumbComponent title2={seller?.name} />

            <div className="container topSpace_seller">
                <div className="row">
                    <div className="col-lg-4">
                        {
                            IsSellerDataLoading ? <SellerCardSkeleton /> : <SellerCard seller={seller} ratings={ratings} />
                        }
                    </div>
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col-12">
                                <div className="seller_profile_nav">
                                    <button onClick={handleLiveAdsTabClick} className={`sellerProfileTabs ${!IsReviewsActive && "activeSellerProfileTab"}`}>{t('liveAds')}</button>
                                    <button onClick={handleReviewsTabClick} className={`sellerProfileTabs ${IsReviewsActive && "activeSellerProfileTab"}`}>{t('reviews')}</button>
                                </div>
                            </div>
                        </div>
                        {
                            IsReviewsActive ?
                                ratings?.data?.length === 0 ?
                                    <NoData name={t('myReviews')} />
                                    :
                                    <>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="rating_seller_cont">
                                                    <div className="mainRating_cont">
                                                        <h4 className="sellerMainRating">{(seller?.average_rating).toFixed(2)}</h4>
                                                        <div className="stars_cont">
                                                            <div className="allStarsCont">
                                                                <Rate disabled value={getRoundedRating(seller?.average_rating)} allowHalf className='ratingStars' />
                                                            </div>
                                                            <p className="seller_rating">{ratings?.data?.length} {t('ratings')}</p>
                                                        </div>
                                                    </div>

                                                    <div className="ratingSeparator"></div>

                                                    <div className="ratingProgressCont">
                                                        <div className="singleProgress">
                                                            <div className="numberOfStars">
                                                                <p>5</p>
                                                                <IoMdStar size={24} />
                                                            </div>

                                                            <Progress percent={ratingPercentages?.[5] || 0} showInfo={false} strokeColor="#FA6E53" />
                                                            <p className="starsGot">{ratingCount?.[5] || 0}</p>
                                                        </div>
                                                        <div className="singleProgress">
                                                            <div className="numberOfStars">
                                                                <p>4</p>
                                                                <IoMdStar size={24} />
                                                            </div>

                                                            <Progress percent={ratingPercentages?.[4] || 0} showInfo={false} strokeColor="#FA6E53" />
                                                            <p className="starsGot">{ratingCount?.[4] || 0}</p>
                                                        </div>
                                                        <div className="singleProgress">
                                                            <div className="numberOfStars">
                                                                <p>3</p>
                                                                <IoMdStar size={24} />
                                                            </div>

                                                            <Progress percent={ratingPercentages?.[3] || 0} showInfo={false} strokeColor="#FA6E53" />
                                                            <p className="starsGot">{ratingCount?.[3] || 0}</p>
                                                        </div>
                                                        <div className="singleProgress">
                                                            <div className="numberOfStars">
                                                                <p>2</p>
                                                                <IoMdStar size={24} />
                                                            </div>

                                                            <Progress percent={ratingPercentages?.[2] || 0} showInfo={false} strokeColor="#FA6E53" />
                                                            <p className="starsGot">{ratingCount?.[2] || 0}</p>
                                                        </div>
                                                        <div className="singleProgress">
                                                            <div className="numberOfStars">
                                                                <p>1</p>
                                                                <IoMdStar size={24} />
                                                            </div>

                                                            <Progress percent={ratingPercentages?.[1] || 0} showInfo={false} strokeColor="#FA6E53" />
                                                            <p className="starsGot">{ratingCount?.[1] || 0}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="reviewsContainer">

                                                    {
                                                        ratings?.data?.map(rating => <SellerReviewCard rating={rating} key={rating?.id} />)
                                                    }

                                                </div>


                                                {
                                                    IsLoadMoreReview ? <div className="loader adListingLoader"></div>
                                                        :
                                                        ratings?.data?.length > 0 && ReviewHasMore &&
                                                        <div className="loadMore">
                                                            <button onClick={handleReviewLoadMore}> {t('loadMore')} </button>
                                                        </div>
                                                }


                                            </div>
                                        </div>
                                    </>
                                :
                                <>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="sortby_header sellerFilterTopSpace">
                                                <div className="sortby_dropdown">
                                                    <div className="sort_by_label">
                                                        <span><CgArrowsExchangeAltV size={25} /></span>
                                                        <span>{t('sortBy')}</span>
                                                    </div>

                                                    <Select
                                                        onChange={handleChange}
                                                        value={sortBy}
                                                        variant="outlined"
                                                        className="product_filter"
                                                    >
                                                        <MenuItem value="new-to-old">{t('newestToOldest')}</MenuItem>
                                                        <MenuItem value="old-to-new">{t('oldestToNewest')}</MenuItem>
                                                        <MenuItem value="price-high-to-low">{t('priceHighToLow')}</MenuItem>
                                                        <MenuItem value="price-low-to-high">{t('priceLowToHigh')}</MenuItem>
                                                        <MenuItem value="popular_items">{t('popular')}</MenuItem>
                                                    </Select>
                                                </div>
                                                <div className="gird_buttons">
                                                    <button
                                                        className={view === 'list' ? 'active' : 'deactive'}
                                                        onClick={() => handleGridClick('list')}
                                                    >
                                                        <ViewStreamIcon size={24} />
                                                    </button>
                                                    <button
                                                        className={view === 'grid' ? 'active' : 'deactive'}
                                                        onClick={() => handleGridClick('grid')}
                                                    >
                                                        <IoGrid size={24} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row product_card_card_gap">
                                        {
                                            IsSellerItemsLoading ? (
                                                Array.from({ length: 12 }).map((_, index) => (
                                                    view === "list" ? (
                                                        <div className="col-12" key={index}>
                                                            <ProductHorizontalCardSkeleton />
                                                        </div>
                                                    )
                                                        :
                                                        (
                                                            <div key={index} className="col-xxl-3 col-lg-4 col-6">
                                                                <ProductCardSkeleton />
                                                            </div>
                                                        )
                                                ))
                                            ) : (
                                                SellerItems && SellerItems.length > 0 ? (
                                                    SellerItems?.map((item, index) => (
                                                        view === "list" ? (
                                                            <div className="col-12" key={index}>
                                                                <Link href={`/product-details/${item.slug}`}>
                                                                    <ProdcutHorizontalCard data={item} handleLike={handleLike} />
                                                                </Link>
                                                            </div>
                                                        )
                                                            :
                                                            (
                                                                <div className="col-xxl-3 col-lg-4 col-6" key={index} >
                                                                    <Link href={`/product-details/${item.slug}`}>
                                                                        <ProductCard data={item} handleLike={handleLike} />
                                                                    </Link>
                                                                </div>
                                                            )
                                                    ))
                                                ) : <NoData name={t('ads')} />
                                            )
                                        }
                                        {
                                            IsSellerItemLoadMore ? <div className="loader adListingLoader"></div>
                                                :
                                                SellerItems && SellerItems.length > 0 && HasMore &&
                                                <div className="loadMore" onClick={handleProdLoadMore}>
                                                    <button> {t('loadMore')} </button>
                                                </div>
                                        }
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div >
            <OpenInAppDrawer
                IsOpenInApp={IsOpenInApp}
                OnHide={() => setIsOpenInApp(false)}
                systemSettingsData={systemSettingsData}
            />
        </>
    )
}

export default SellerProfile