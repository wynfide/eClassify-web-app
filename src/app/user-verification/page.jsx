import Layout from "@/components/Layout/Layout"
import UserVerification from "@/components/PagesComponent/UserVerification/UserVerification"

export const metadata = {
    title: process.env.NEXT_PUBLIC_META_TITLE,
    description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
    keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
    openGraph: {
        title: process.env.NEXT_PUBLIC_META_TITLE,
        description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
        keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
    },
}

const UserVerificationPage = () => {
    return (
        <Layout>
            <UserVerification />
        </Layout>
    )
}

export default UserVerificationPage