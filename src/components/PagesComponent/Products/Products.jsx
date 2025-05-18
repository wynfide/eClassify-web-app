'use client'
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent"
import ProdcutHorizontalCard from "@/components/Cards/ProdcutHorizontalCard"
import ProductCard from "@/components/Cards/ProductCard"
import FilterCard from "@/components/ProductPageUI/FilterCard"
import { useEffect, useState } from "react"
import { IoCloseCircle, IoGrid } from "react-icons/io5"
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from "react-redux"
import { t } from "@/utils"
import { SearchData } from "@/redux/reuducer/searchSlice"
import { allItemApi } from "@/utils/api"
import ProductHorizontalCardSkeleton from "@/components/Skeleton/ProductHorizontalCardSkeleton"
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton"
import NoData from "@/components/NoDataFound/NoDataFound";
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import Link from "next/link"
import { userSignUpData } from "@/redux/reuducer/authSlice"
import { setBreadcrumbPath } from "@/redux/reuducer/breadCrumbSlice"
import { ViewCategory, setCategoryView } from "@/redux/reuducer/categorySlice"
import { getCityData } from "@/redux/reuducer/locationSlice"
import { categorySortBy, setCategorySortBy } from "@/redux/reuducer/filterSlice"
import withRedirect from "@/components/Layout/withRedirect"


const Products = () => {

    const { lat, long } = useSelector(getCityData)
    const dispatch = useDispatch()
    const search = useSelector(SearchData)
    const userData = useSelector(userSignUpData);
    const [IsLoading, setIsLoading] = useState(false)
    const [searchedData, setSearchedData] = useState([])
    const sortBy = useSelector(categorySortBy)
    const view = useSelector(ViewCategory)
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [selectedLocationKey, setSelectedLocationKey] = useState(['all_countries'])
    const [MinMaxPrice, setMinMaxPrice] = useState({
        min_price: '',
        max_price: '',
    })
    const [Country, setCountry] = useState('')
    const [State, setState] = useState('')
    const [City, setCity] = useState('')
    const [Area, setArea] = useState('')
    const [IsShowBudget, setIsShowBudget] = useState(false)
    const [DatePosted, setDatePosted] = useState('')
    const [IsFetchSingleCatItem, setIsFetchSingleCatItem] = useState(false)
    const [KmRange, setKmRange] = useState(0)
    const [IsShowKmRange, setIsShowKmRange] = useState(false)
    const [IsLoadMore, setIsLoadMore] = useState(false)


    const getProducts = async (page) => {
        let data = "";
        try {
            const params = { page, limit: 12 };

            if (sortBy) params.sort_by = sortBy;
            if (MinMaxPrice?.min_price) params.min_price = MinMaxPrice?.min_price;
            if (MinMaxPrice?.max_price) params.max_price = MinMaxPrice?.max_price;
            if (Area?.id) params.area_id = Area?.id;
            if (DatePosted) params.posted_since = DatePosted;

            // Conditionally add latitude, longitude, and radius if IsShowKmRange is true
            if (IsShowKmRange) {
                params.latitude = lat;
                params.longitude = long;
                params.radius = KmRange;
                setCountry('')
                setState('')
                setCity('')
                setArea('')
                setSelectedLocationKey([])
            } else {
                // If KmRange is 0, only add country, state, city if they are selected
                if (City) {
                    params.city = City;
                    setKmRange(0)
                } else if (State) {
                    params.state = State;
                    setKmRange(0)
                } else if (Country) {
                    params.country = Country;
                    setKmRange(0)
                }
            }

            if (search !== "") {
                params.search = search;
            }

            if (page === 1) {
                setIsLoading(true);
            }

            const res = await allItemApi.getItems(params);
            data = res?.data;
            if (data.error !== true) {
                if (page > 1) {
                    setSearchedData([...searchedData, ...data?.data?.data]);
                } else {
                    setSearchedData(data?.data?.data);
                }
                setCurrentPage(data?.data?.current_page)
                setLastPage(data?.data?.last_page)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false);
            setIsLoadMore(false)
        }
    }
    // Default view

    const handleChange = (event) => {
        dispatch(setCategorySortBy(event.target.value))
    };

    const handleGridClick = (viewType) => {
        dispatch(setCategoryView(viewType))
    };

    useEffect(() => {
        getProducts(1)
    }, [search, sortBy, IsFetchSingleCatItem])

    useEffect(() => {
        dispatch(setBreadcrumbPath([{ name: t('allCategories'), slug: '/products' }]))
    }, [])


    const clearLocation = () => {
        setCountry('')
        setState('')
        setCity('')
        setArea('')
        setSelectedLocationKey(['all_countries'])
        setIsFetchSingleCatItem((prev) => !prev)
    }

    const clearBudget = () => {
        setIsShowBudget(false)
        setMinMaxPrice({
            min_price: '',
            max_price: '',
        })
        setIsFetchSingleCatItem((prev) => !prev)
    }

    const clearDatePosted = () => {
        setDatePosted('');
        setIsFetchSingleCatItem((prev) => !prev)
    }

    const clearAll = () => {

        setSelectedLocationKey(['all_countries']);
        setCountry('');
        setState('');
        setCity('');
        setArea('')
        setMinMaxPrice({
            min_price: '',
            max_price: '',
        });
        setIsShowBudget(false);
        setIsShowKmRange(false)
        setDatePosted('');
        setKmRange(0)
        setIsFetchSingleCatItem((prev) => !prev);
    };

    const postedSince = DatePosted === 'all-time' ? t('allTime') :
        DatePosted === 'today' ? t('today') :
            DatePosted === 'within-1-week' ? t('within1Week') :
                DatePosted === 'within-2-week' ? t('within2Weeks') :
                    DatePosted === 'within-1-month' ? t('within1Month') :
                        DatePosted === 'within-3-month' ? t('within3Months') : '';

    const isClearAll = (selectedLocationKey.length === 0 || selectedLocationKey.includes('all_countries')) && !IsShowBudget && DatePosted === '' && !IsShowKmRange

    const handleLike = (id) => {
        const updatedItems = searchedData.map((item) => {
            if (item.id === id) {
                return { ...item, is_liked: !item.is_liked };
            }
            return item;
        });
        setSearchedData(updatedItems);
    }

    const handleLoadMore = () => {
        setIsLoadMore(true)
        getProducts(currentPage + 1); // Pass current sorting option
    };

    // Sorting the searchedData to prioritize items with is_feature set to true
    // const sortedSearchedData = searchedData?.sort((a, b) => b.is_feature - a.is_feature);

    const clearKmRange = () => {
        setKmRange(0)
        setIsShowKmRange(false)
        setSelectedLocationKey(['all_countries'])
        setIsFetchSingleCatItem((prev) => !prev)
    }

    return (
        <>
            <BreadcrumbComponent />
            <section className='all_products_page'>
                <div className="container">
                    <div className="all_products_page_main_content">
                        <div className="heading">
                            <h3>{search}</h3>
                        </div>
                        <div className="row" id='main_row'>
                            <div className="col-12 col-md-6 col-lg-3" id='filter_sec'>
                                <FilterCard setMinMaxPrice={setMinMaxPrice} setIsFetchSingleCatItem={setIsFetchSingleCatItem} setCountry={setCountry} setState={setState} setCity={setCity} setArea={setArea} selectedLocationKey={selectedLocationKey} setSelectedLocationKey={setSelectedLocationKey} setIsShowBudget={setIsShowBudget} DatePosted={DatePosted} setDatePosted={setDatePosted} setKmRange={setKmRange} setIsShowKmRange={setIsShowKmRange} />
                            </div>
                            <div className="col-12 col-md-6 col-lg-9" id='listing_sec'>
                                <div className="sortby_header">
                                    <div className="sortby_dropdown">
                                        <span>
                                            <CgArrowsExchangeAltV size={25} /> {t('sortBy')}{' '}
                                        </span>
                                        <Select
                                            value={sortBy}
                                            onChange={handleChange}
                                            variant="outlined"
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
                                <div className="filter_header">
                                    <div className="filterList">

                                        {
                                            (Country || State || City || Area) &&
                                            <div className="filter_item">
                                                <span>{t('location')}: {Country ? Country : State ? State : City ? City : Area.title}</span>
                                                <button onClick={clearLocation}>
                                                    <IoCloseCircle size={24} />
                                                </button>
                                            </div>
                                        }

                                        {
                                            IsShowBudget && (
                                                <div className="filter_item">
                                                    <span>{t('budget')}: {MinMaxPrice.min_price}-{MinMaxPrice.max_price}</span>
                                                    <button onClick={clearBudget} className="budget_btn">
                                                        <IoCloseCircle size={24} />
                                                    </button>
                                                </div>
                                            )
                                        }
                                        {
                                            DatePosted &&
                                            <div className="filter_item">
                                                <span>{postedSince}</span>
                                                <button onClick={clearDatePosted}>
                                                    <IoCloseCircle size={24} />
                                                </button>
                                            </div>
                                        }
                                        {
                                            IsShowKmRange &&
                                            <div className="filter_item">
                                                <span>{t("nearByKmRange")} : {KmRange} {t("km")}</span>
                                                <button onClick={clearKmRange}>
                                                    <IoCloseCircle size={24} />
                                                </button>
                                            </div>
                                        }

                                    </div>

                                    {
                                        !isClearAll &&
                                        <div className="removeAll">
                                            <button onClick={clearAll}>{t('clearAll')}</button>
                                        </div>
                                    }

                                </div>
                                <div className="listing_items">
                                    <div className="row">
                                        {
                                            IsLoading ?

                                                Array.from({ length: 12 }).map((_, index) => (
                                                    view === "list" ? (
                                                        <div className="col-12" key={index}>
                                                            <ProductHorizontalCardSkeleton />
                                                        </div>
                                                    ) : (
                                                        <div className="col-xxl-3 col-lg-4 col-6" key={index}>
                                                            <ProductCardSkeleton />
                                                        </div>
                                                    )
                                                ))

                                                :

                                                searchedData && searchedData.length > 0 ?
                                                    searchedData?.map((item, index) => (
                                                        view === "list" ? (

                                                            <div className="col-12" key={index}>
                                                                <Link href={userData?.id == item?.user_id ? `/my-listing/${item?.slug}` : `/product-details/${item.slug}`} prefetch={false}>
                                                                    <ProdcutHorizontalCard data={item} handleLike={handleLike} />
                                                                </Link>
                                                            </div>
                                                        ) : (
                                                            <div className="col-xxl-3 col-lg-4 col-6" key={index}>
                                                                <Link href={userData?.id == item?.user_id ? `/my-listing/${item?.slug}` : `/product-details/${item.slug}`} prefetch={false} target="_blank">
                                                                    <ProductCard data={item} handleLike={handleLike} />
                                                                </Link>
                                                            </div>
                                                        )
                                                    ))
                                                    :
                                                    <NoData name={t('ads')} />
                                        }

                                    </div>

                                    {
                                        IsLoadMore ?
                                            <div className="loader adListingLoader"></div>
                                            :
                                            currentPage < lastPage && searchedData && searchedData.length > 0 &&
                                            <div className="loadMore">
                                                <button onClick={handleLoadMore}> {t('loadMore')} </button>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default withRedirect(Products)