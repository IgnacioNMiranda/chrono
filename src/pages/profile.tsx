import type { GetStaticPropsContext, NextPage } from 'next'
import { ProfilePage } from 'components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '../components/layout'

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'profile', 'header'])),
      // Will be passed to the page component as props
    },
  }
}

const Profile: NextPage = () => {
  return (
    <Layout>
      <ProfilePage />
    </Layout>
  )
}

export default Profile
