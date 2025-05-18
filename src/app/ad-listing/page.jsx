import Layout from '@/components/Layout/Layout';
import AdListing from '@/components/PagesComponent/AdListing/AdListing';
import axios from 'axios';


export const revalidate = 3600;


export const generateMetadata = async () => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}seo-settings?page=ad-listing`
        );
        const adListing = response?.data?.data[0]

        return {
            title: adListing?.title ? adListing?.title : process.env.NEXT_PUBLIC_META_TITLE,
            description: adListing?.description ? adListing?.description : process.env.NEXT_PUBLIC_META_DESCRIPTION,
            openGraph: {
                images: adListing?.image ? [adListing?.image] : [],
            },
            keywords: adListing?.keywords ? adListing?.keywords : process.env.NEXT_PUBLIC_META_kEYWORDS
        };
    } catch (error) {
        console.error("Error fetching MetaData:", error);
        return null;
    }
};


const AdListingPage = async () => {

 
    return (
        <>
            <Layout>
                <AdListing />
            </Layout>
        </>
    )
}

export default AdListingPage