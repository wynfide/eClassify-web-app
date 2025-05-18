'use client'
import Image from 'next/image'
import { FaRegHeart } from 'react-icons/fa6'
import { formatDate, formatPriceAbbreviated, placeholderImage, t } from '@/utils'
import { BiBadgeCheck } from 'react-icons/bi'
import { FaHeart } from "react-icons/fa6";
import { manageFavouriteApi } from "@/utils/api";
import toast from "react-hot-toast";
import { userSignUpData } from '../../redux/reuducer/authSlice';
import { useSelector } from "react-redux";
import { toggleLoginModal } from '@/redux/reuducer/globalStateSlice'



const ProdcutHorizontalCard = ({ data, handleLike }) => {

    const userData = useSelector(userSignUpData)
    const handleLikeItem = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userData) {
            toggleLoginModal(true)
        }
        else {

            try {
                const response = await manageFavouriteApi.manageFavouriteApi({ item_id: data?.id })
                if (response?.data?.error === false) {
                    toast.success(response?.data?.message)
                    handleLike(data?.id)
                }
                else {
                    toast.success(t('failedToLike'))
                }

            } catch (error) {
                console.log(error)
                toast.success(t('failedToLike'))
            }
        }

    }

    return (
        <>
            <div className='product_horizontal_card card'>
                <div className="product_img_div">
                    <Image src={data?.image} width={220} height={190} alt="Product" className="prodcut_img" onErrorCapture={placeholderImage} />
                </div>
                <div className="product_details">
                    <div className="product_featured_header">
                        {data?.is_feature ? (
                            <div className='product_featured'>
                                <BiBadgeCheck size={16} color="white" />
                                <p className="product_card_featured">{t('featured')}</p>
                            </div>
                        ) : null}
                        <div className="like_div product_card_black_heart_cont" onClick={(e) => handleLikeItem(e)}>
                            {data?.is_liked ? (
                                <button className="isLiked" >
                                    <FaHeart size={24} className="like_icon" />
                                </button>
                            ) : (

                                <button >
                                    <FaRegHeart size={24} className="like_icon" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="title_details">
                        <span className='product_card_prod_price'>{formatPriceAbbreviated(data?.price)}</span>
                        <span className='title'>
                            {data?.name}
                        </span>
                        {/* <span className='decs'>{data?.description}</span> */}
                        <p className="product_card_prod_det">
                            {data?.city}{data?.city ? "," : null}{data?.state}{data?.state ? "," : null}{data?.country}
                        </p>
                    </div>
                    <div className="post_time">
                        <span className='time_ago'>{formatDate(data?.created_at)}</span>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ProdcutHorizontalCard
