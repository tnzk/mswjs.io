import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

import ogImageUrl from '../../static/og-image.png'

const GET_METADATA = graphql`
  query {
    site {
      siteMetadata {
        siteUrl
        title
        description
        twitterAccount
      }
    }
  }
`

interface TwitterSEO {
  card?: 'summary' | 'summary_large_image'
  description?: string
}

interface OpenGraphSEO {
  type?: string
  siteName?: string
}

interface Props {
  title: string
  socialTitle?: string
  titleTemplate?: string
  description?: string
  keywords?: string[]
  socialDescription?: string
  twitter?: TwitterSEO
  og?: OpenGraphSEO
  lang?: string
}

export const MetaTags: React.FC<Props> = ({
  lang = 'en',
  title,
  titleTemplate,
  socialTitle,
  description,
  socialDescription,
  keywords,
  og,
  twitter,
  children,
}) => {
  const { site } = useStaticQuery(GET_METADATA)
  const { siteMetadata } = site

  const metaTitle = socialTitle || title
  const metaDescription = description || siteMetadata.description
  const template = titleTemplate || `%s - ${siteMetadata.title}`

  const ogImageFullUrl =
    process.env.NODE_ENV === 'development'
      ? ogImageUrl
      : siteMetadata.siteUrl + ogImageUrl

  const ogSeo = Object.assign(
    {},
    {
      type: 'website',
      title: metaTitle,
      siteName: siteMetadata.title,
    },
    og,
  )

  const twitterSeo = Object.assign(
    {},
    {
      card: 'summary_large_image',
      title: metaTitle,
      description: socialDescription || metaDescription,
    },
    twitter,
  )

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={template}
    >
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, shrink-to-fit=no"
      />

      {/* Description */}
      <meta name="description" content={metaDescription} />

      {/* Keywords */}
      {keywords ? <meta name="keywords" content={keywords.join(',')} /> : null}

      {/* OpenGraph */}
      <meta property="og:type" content={ogSeo.type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:site_name" content={ogSeo.siteName} />
      <meta
        property="og:description"
        content={socialDescription || metaDescription}
      />
      <meta property="og:image" content={ogImageFullUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterSeo.card} />
      <meta name="twitter:image" content={ogImageFullUrl} />
      <meta name="twitter:title" content={twitterSeo.title} />
      <meta name="twitter:description" content={twitterSeo.description} />
      <meta name="twitter:site" content={siteMetadata.twitterAccount} />
      <meta name="twitter:creator" content={siteMetadata.twitterAccount} />

      {children}
    </Helmet>
  )
}
