import type { GetStaticPropsContext, NextPage } from 'next'
import { ChangeLogPage } from 'components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '../components/layout'

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'changelog', 'header'])),
      // Will be passed to the page component as props
    },
  }
}

const Changelog: NextPage = () => {
  return (
    <Layout>
      <ChangeLogPage />
    </Layout>
  )
}

export default Changelog
