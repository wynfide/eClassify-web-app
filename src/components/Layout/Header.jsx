"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoIosAddCircleOutline } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { Drawer, Select, Spin } from "antd";
import { GrLocation } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import "swiper/css";
import { getSlug, isEmptyObject, placeholderImage, t, truncate } from "@/utils";
import { BiPlanet } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { logoutSuccess, userSignUpData } from "../../redux/reuducer/authSlice";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import FirebaseData from "@/utils/Firebase";
import { settingsData } from "@/redux/reuducer/settingSlice";
import { getLanguageApi, getLimitsApi } from "@/utils/api";
import {
  CurrentLanguageData,
  setCurrentLanguage,
} from "@/redux/reuducer/languageSlice";
import LanguageDropdown from "../HeaderDropdowns/LanguageDropdown";
import { useRouter, usePathname } from "next/navigation";
import { setSearch } from "@/redux/reuducer/searchSlice";
import { isLogin } from "@/utils";
import {
  CategoryData,
  CurrentPage,
  LastPage,
  setCatCurrentPage,
  setCatLastPage,
  setCateData,
  setTreeData,
} from "@/redux/reuducer/categorySlice";
import { categoryApi } from "@/utils/api";
import { Collapse } from "antd";
import FilterTree from "../Category/FilterTree";
import { DownOutlined } from "@ant-design/icons";
import LocationModal from "../LandingPage/LocationModal";
import { saveOfferData } from "@/redux/reuducer/offerSlice";
import HeaderCategories from "./HeaderCategories";
import RegisterModal from "../Auth/RegisterModal";
import ProfileDropdown from "../Profile/ProfileDropdown";
import MailSentSucessfully from "../Auth/MailSentSucessfully";
import LoginModal from "../Auth/LoginModal";
import { getIsLoginModalOpen, toggleLoginModal } from "@/redux/reuducer/globalStateSlice";


const { Panel } = Collapse;

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const UserData = useSelector(userSignUpData);
  const systemSettings = useSelector(settingsData);
  const settings = systemSettings?.data;
  const cateData = useSelector(CategoryData);
  const catCurrentPage = useSelector(CurrentPage);
  const catLastPage = useSelector(LastPage);
  const { signOut } = FirebaseData();
  const [IsRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  // const [IsLoginModalOpen, setIsLoginModalOpen] = useState(false);


  const IsLoginModalOpen = useSelector(getIsLoginModalOpen);



  const [IsMailSentOpen, setIsMailSentOpen] = useState(false);
  const [IsLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [catId, setCatId] = useState("");
  const [slug, setSlug] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const cityData = useSelector((state) => state?.Location?.cityData);
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const headerCatSelected = getSlug(pathname);
  const [isAdListingClicked, setIsAdListingClicked] = useState(false);


  const getLanguageData = async (language_code) => {
    try {
      const res = await getLanguageApi.getLanguage({
        language_code,
        type: "web",
      });

      if (res?.data?.error === true) {
        toast.error(res?.data?.message);
      } else {
        if (show) {
          setShow(false);
        }
        dispatch(setCurrentLanguage(res?.data?.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setDefaultLanguage = async () => {
    try {
      const language_code = settings?.default_language;
      const res = await getLanguageApi.getLanguage({
        language_code,
        type: "web",
      });
      if (res?.data?.error === true) {
        toast.error(res?.data?.message);
      } else {
        dispatch(setCurrentLanguage(res?.data?.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isEmptyObject(CurrentLanguage)) {
      setDefaultLanguage();
    }
  }, []);


  // this api call only in pop cate swiper
  const getCategoriesData = async (page) => {
    try {
      const response = await categoryApi.getCategory({ page: `${page}` });
      const { data } = response.data;

      if (data && Array.isArray(data.data)) {
        if (page > 1) {
          dispatch(setCateData([...cateData, ...data.data]));
        } else {
          dispatch(setCateData(data.data));
          dispatch(setTreeData([]));
        }
      }
      dispatch(setCatLastPage(data?.last_page));
      dispatch(setCatCurrentPage(data?.current_page));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (pathname === "/" || cateData.length === 0) {
      getCategoriesData(1);
    }
  }, []);

  const translateCategories = (categories) => {

    return categories.map((category) => {
      const translation = category.translations?.find(
        (trans) => trans.language_id === CurrentLanguage.id
      );

      return {
        ...category,
        translated_name: translation ? translation.name : category.name, // Update the category name directly
        subcategories:
          category.subcategories?.length > 0
            ? translateCategories(category.subcategories) // Recursively translate subcategories
            : [], // Default to empty array if no subcategories
      };
    });
  };

  useEffect(() => {
    if (cateData.length > 0) {
      const updatedCateData = translateCategories(cateData);
      dispatch(setCateData(updatedCateData));
    }
    document.documentElement.lang = CurrentLanguage?.code?.toLowerCase() || "en";
  }, [CurrentLanguage, cateData?.length]);



  useEffect(() => {
    const categoryPathRegex = /^\/category(\/|$)/;
    if (pathname != "/products" && !categoryPathRegex.test(pathname)) {
      dispatch(setSearch(""));
      setSearchQuery("");
      setCatId("");
    }
  }, [pathname]);

  const closeDrawer = () => {
    if (show) {
      setShow(false);
    }
  };

  const openRegisterModal = () => {
    if (show) {
      setShow(false);
    }
    if (IsLoginModalOpen) {
      toggleLoginModal(false);
    }
    setIsRegisterModalOpen(true);
  };
  const openLoginModal = () => {
    if (show) {
      setShow(false);
    }
    if (IsRegisterModalOpen) {
      setIsRegisterModalOpen(false);
    }
    toggleLoginModal(true);
  };

  const openLocationEditModal = () => {
    if (show) {
      setShow(false);
    }
    setIsLocationModalOpen(true);
  };

  const handleLogout = () => {
    if (show) {
      setShow(false);
    }
    Swal.fire({
      title: `${t("areYouSure")} \u200E`,
      text: `${t("logoutConfirmation")} \u200E`,
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "Swal-confirm-buttons",
        cancelButton: "Swal-cancel-buttons",
      },
      confirmButtonText: t("yes"),
    }).then((result) => {
      if (result.isConfirmed) {
        // // Clear the recaptchaVerifier by setting it to null
        // window.recaptchaVerifier = null;

        // Perform the logout action
        logoutSuccess();
        signOut();
        // router.push("/");
        saveOfferData([]);
        toast.success(t("signOutSuccess"));
      } else {
        toast.error(t("signOutCancelled"));
      }
    });
  };

  const CloseIcon = (
    <div className="close_icon_cont">
      <MdClose size={24} color="black" />
    </div>
  );

  const handleCategoryChange = (value) => {
    if (value?.value === "") {
      setCatId("");
      return;
    }
    const category = cateData.find((item) => item?.id === Number(value.key));
    const catId = category?.id;
    const slug = category?.slug;

    if (catId) {
      setCatId(catId);
    }
    if (slug) {
      setSlug(slug);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchNav = (e) => {
    e.preventDefault();
    if (catId) {
      dispatch(setSearch(searchQuery));
      router.push(`/category/${slug}`);
    } else {
      dispatch(setSearch(searchQuery));
      router.push(`/products`);
    }
  };

  const getLimitsData = async () => {
    try {
      setIsAdListingClicked(true);
      const res = await getLimitsApi.getLimits({
        package_type: "item_listing",
      });
      if (res?.data?.error === false) {
        router.push("/ad-listing");
      } else {
        toast.error(t("purchasePlan"));
        router.push("/subscription");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsAdListingClicked(false);
    }
  };
  const handleCheckLogin = async (e) => {
    e.preventDefault();
    // Check if user profile is complete
    if (!UserData?.name || !UserData?.email) {
      return Swal.fire({
        title: t("oops"),
        text: t("youNeedToUpdateProfile"),
        icon: "warning",
        showCancelButton: false,
        customClass: { confirmButton: "Swal-confirm-buttons" },
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/profile/edit-profile");
        }
      });
    }

    // Check for free ad listing setting and route accordingly
    if (Number(settings?.free_ad_listing) === 1) {
      return router.push("/ad-listing");
    }
    // Otherwise, fetch limits data
    await getLimitsData();
    handleClose();
  };

  const handleCategoryScroll = (event) => {
    const { target } = event;
    if (
      target.scrollTop + target.offsetHeight >= target.scrollHeight &&
      catCurrentPage < catLastPage
    ) {
      getCategoriesData(catCurrentPage + 1);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <div className="left_side">
            <Link href="/">
              <Image
                src={settings?.header_logo}
                alt="logo"
                width={0}
                height={0}
                className="header_logo"
                onErrorCapture={placeholderImage}
              />
            </Link>

            <div className="select_search_cont search_lg">
              <div className="cat_select_wrapper">
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  onChange={handleCategoryChange}
                  labelInValue
                  placeholder={t("categorySelect")}
                  filterOption={true} // Disable default filter to use custom filter
                  defaultValue=""
                  className="web_ant_select"
                  onPopupScroll={handleCategoryScroll}
                >
                  <Option value="">{t("allCategories")}</Option>
                  {cateData &&
                    cateData?.map((cat, index) => (
                      <Option key={cat?.id} value={cat.name}>
                        {cat?.translated_name}
                      </Option>
                    ))}
                </Select>
              </div>
              <form className="search_cont" onSubmit={handleSearchNav}>
                <div className="srchIconinput_cont">
                  <BiPlanet size={16} color="#595B6C" className="planet" />
                  <input
                    type="text"
                    placeholder={t("searchAd")}
                    onChange={(e) => handleSearch(e)}
                    value={searchQuery}
                  />
                </div>
                <button type="submit">
                  <FaSearch size={14} />
                  <span className="srch">{t("search")}</span>
                </button>
              </form>
            </div>

            <span onClick={handleShow} id="hamburg">
              <GiHamburgerMenu size={25} />
            </span>
          </div>
          <div className="select_search_cont search_xs_xl">
            <div className="cat_select_wrapper">
              <Select
                showSearch
                style={{ width: "100%" }}
                onChange={handleCategoryChange}
                labelInValue
                placeholder={t("categorySelect")}
                filterOption={true} // Disable default filter to use custom filter
                defaultValue=""
                className="web_ant_select"
                onPopupScroll={handleCategoryScroll}
              >
                <Option value="">{t("allCategories")}</Option>
                {cateData &&
                  cateData?.map((cat, index) => (
                    <Option key={cat?.id} value={cat.name}>
                      {cat?.translated_name}
                    </Option>
                  ))}
              </Select>
            </div>
            <form className="search_cont" onSubmit={handleSearchNav}>
              <div className="srchIconinput_cont">
                <BiPlanet size={16} color="#595B6C" className="planet" />
                <input
                  type="text"
                  placeholder={t("searchAd")}
                  onChange={(e) => handleSearch(e)}
                  value={searchQuery}
                />
              </div>
              <button type="submit">
                <FaSearch size={14} />
                <span className="srch">{t("search")}</span>
              </button>
            </form>
          </div>

          {cityData?.city || cityData?.state || cityData?.country ? (
            <div
              className="home_header_location"
              onClick={openLocationEditModal}
            >
              <GrLocation size={16} />
              <p
                className="header_location"
                title={[cityData?.city, cityData?.state, cityData?.country]
                  .filter(Boolean)
                  .join(", ")}
              >
                {truncate(
                  [cityData?.city, cityData?.state, cityData?.country]
                    .filter(Boolean)
                    .join(", "),
                  12
                )}
              </p>
            </div>
          ) : (
            <div
              className="home_header_location"
              onClick={openLocationEditModal}
            >
              <GrLocation size={16} />
              <p className="header_location">{t("addLocation")}</p>
            </div>
          )}
          <div className="right_side">
            {isLogin() ? (
              <ProfileDropdown
                closeDrawer={closeDrawer}
                settings={settings}
                handleLogout={handleLogout}
                isDrawer={false}
              />
            ) : (
              <>
                <div
                  className="nav-item nav-link lg_in"
                  onClick={openLoginModal}
                >
                  {t("login")}
                </div>
                <span className="vl"></span>
                <div className="nav-item nav-link" onClick={openRegisterModal}>
                  {t("register")}
                </div>
              </>
            )}

            {isLogin() && (
              <div className="item_add">
                <button
                  className="ad_listing"
                  disabled={isAdListingClicked}
                  onClick={handleCheckLogin}
                >
                  <IoIosAddCircleOutline
                    size={18}
                    className="ad_listing_icon"
                  />
                  <span className="adlist_btn" title={t("adListing")}>
                    {truncate(t("adListing"), 12)}
                  </span>
                </button>
              </div>
            )}
            <LanguageDropdown
              getLanguageData={getLanguageData}
              settings={settings}
            />
          </div>
        </div>
      </nav>

      {cateData.length > 0 && (
        <HeaderCategories
          cateData={cateData}
          headerCatSelected={headerCatSelected}
          settings={settings}
        />
      )}

      <Drawer
        className="eclassify_drawer"
        maskClosable={false}
        title={
          <Image
            src={settings?.header_logo}
            width={195}
            height={92}
            alt="Close Icon"
            onErrorCapture={placeholderImage}
            className="header_logo"
          />
        }
        onClose={handleClose}
        open={show}
        closeIcon={CloseIcon}
      >
        <ul className="mobile_nav">
          {cityData && (
            <li className="mob_header_location" onClick={openLocationEditModal}>
              <GrLocation size={16} />
              <p>
                {[cityData?.city, cityData?.state, cityData?.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </li>
          )}
          <li className="mobile_nav_tab login_reg_nav_tab">
            {isLogin() ? (
              <ProfileDropdown
                closeDrawer={closeDrawer}
                settings={settings}
                handleLogout={handleLogout}
                isDrawer={true}
              />
            ) : (
              <>
                <li
                  className="nav-item nav-link lg_in"
                  onClick={openLoginModal}
                >
                  {t("login")}
                </li>
                <span className="vl"></span>
                <li className="nav-item nav-link" onClick={openRegisterModal}>
                  {t("register")}
                </li>
              </>
            )}
          </li>
          <li className="mobile_nav_tab">
            <LanguageDropdown
              getLanguageData={getLanguageData}
              settings={settings}
            />
          </li>

          {isLogin() && (
            <li className="mobile_nav_tab">
              <Link href={"/ad-listing"}>
                <button
                  className="ad_listing"
                  disabled={isAdListingClicked}
                  onClick={handleCheckLogin}
                >
                  <IoIosAddCircleOutline size={18} />
                  <span>{t("adListing")}</span>
                </button>
              </Link>
            </li>
          )}

          <div className="card-body">
            <Collapse
              className="all_filters"
              expandIconPosition="right"
              expandIcon={({ isActive }) => (
                <DownOutlined rotate={isActive ? 180 : 0} size={24} />
              )}
              defaultActiveKey={["1"]}
            >
              <Panel header={t("category")} key="1">
                <FilterTree show={show} setShow={setShow} />
              </Panel>
            </Collapse>
          </div>
        </ul>
      </Drawer>

      <LoginModal
        IsLoginModalOpen={IsLoginModalOpen}
        setIsLoginModalOpen={toggleLoginModal}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
        IsMailSentOpen={IsMailSentOpen}
        setIsMailSentOpen={setIsMailSentOpen}
      />

      <RegisterModal
        IsRegisterModalOpen={IsRegisterModalOpen}
        setIsLoginModalOpen={toggleLoginModal}
        CloseRegisterModal={() => setIsRegisterModalOpen(false)}
        setIsMailSentOpen={setIsMailSentOpen}
      />

      <MailSentSucessfully
        IsMailSentOpen={IsMailSentOpen}
        OnHide={() => setIsMailSentOpen(false)}
        IsLoginModalOpen={() => toggleLoginModal(true)}
      />

      <LocationModal
        IsLocationModalOpen={IsLocationModalOpen}
        OnHide={() => setIsLocationModalOpen(false)}
      />
    </>
  );
};

export default Header;
