import Image from "next/image"
import { RxCross2, RxEyeOpen } from "react-icons/rx";
import { BiBadgeCheck, BiHeart } from "react-icons/bi";
import { formatPriceAbbreviated, placeholderImage, t, truncate } from "@/utils";
import { IoTimerOutline } from "react-icons/io5";
import { MdOutlineDone, MdOutlineLiveTv, MdOutlineSell } from "react-icons/md";
import Link from "next/link";
import { MdAirplanemodeInactive } from "react-icons/md";
import { RiPassExpiredLine } from "react-icons/ri";

const AdsCard = ({ data, sortBy }) => {

    const isApprovedSort = sortBy === 'approved';

    return (
      <Link href={`/my-listing/${data?.slug}`} className="product_card">
        <div className="position-relative">
          <Image
            src={data?.image}
            width={220}
            height={190}
            alt="Product"
            className="product_card_prod_img"
            onErrorCapture={placeholderImage}
          />

          {data?.status === "approved" ? (
            isApprovedSort ? (
              <div className="product_card_featured_cont">
                <MdOutlineLiveTv size={16} color="white" />
                <p className="product_card_featured">{t("live")}</p>
              </div>
            ) : data?.is_feature ? (
              <div className="product_card_featured_cont">
                <BiBadgeCheck size={16} color="white" />
                <p className="product_card_featured">{t("featured")}</p>
              </div>
            ) : (
              <div className="product_card_featured_cont">
                <MdOutlineLiveTv size={16} color="white" />
                <p className="product_card_featured">{t("live")}</p>
              </div>
            )
          ) : data?.status === "review" ? (
            <div className="product_card_featured_cont">
              <IoTimerOutline size={16} color="white" />
              <p className="product_card_featured">{t("review")}</p>
            </div>
          ) : data?.status === "permanent rejected" ? (
            <div className="product_card_featured_cont reject_alert">
              <RxCross2 size={16} color="white" />
              <p className="product_card_featured">{t("permanentRejected")}</p>
            </div>
          ) : data?.status === "soft rejected" ? (
            <div className="product_card_featured_cont reject_alert">
              <RxCross2 size={16} color="white" />
              <p className="product_card_featured">{t("softRejected")}</p>
            </div>
          ) : data?.status === "inactive" ? (
            <div className="product_card_featured_cont inactive">
              <MdAirplanemodeInactive size={16} color="white" />
              <p className="product_card_featured">{t("deactivate")}</p>
            </div>
          ) : data?.status === "sold out" ? (
            <div className="product_card_featured_cont sold">
              <MdOutlineSell size={16} color="white" />
              <p className="product_card_featured">{t("soldOut")}</p>
            </div>
          ) : data?.status === "resubmitted" ? (
            <div className="product_card_featured_cont">
              <MdOutlineDone size={16} color="white" />
              <p className="product_card_featured">{t("resubmitted")}</p>
            </div>
          ) : (
            data?.status === "expired" && (
              <div className="product_card_featured_cont sold">
                <RiPassExpiredLine size={16} color="white" />
                <p className="product_card_featured">{t("expired")}</p>
              </div>
            )
          )}

          {/* <span className="deactivate_label">{t('deactivate')}</span> */}
        </div>
        <div className="product_card_prod_price_cont">
          <span className="product_card_prod_price">
            {data?.price === 0
              ? t("Free")
              : formatPriceAbbreviated(data?.price)}
          </span>

          <div className="eyeheart_cont">
            <div className="eyehearticon_cont">
              <RxEyeOpen size={14} className="eye_icon" />
              <span className="eyeheart_count">{data?.clicks}</span>
            </div>
            <div className="eyehearticon_cont">
              <BiHeart size={14} className="biHeart" />
              <span className="eyeheart_count">{data?.total_likes}</span>
            </div>
          </div>
        </div>
        <p className="product_card_prod_name">{truncate(data?.name, 30)}</p>
      </Link>
    );
}

export default AdsCard