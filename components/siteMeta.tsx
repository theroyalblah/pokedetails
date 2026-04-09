import Head from "next/head";

const SITE_NAME = "PokeDetails";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ||
  "https://pokedetails.vercel.app").replace(/\/$/, "");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const DEFAULT_SITE_DESCRIPTION =
  "Search Pokemon and view their most popular competitive moves, items, abilities, spreads, and usage stats across Smogon singles and VGC.";

const getAbsoluteUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pathWithBase =
    BASE_PATH && !normalizedPath.startsWith(BASE_PATH)
      ? `${BASE_PATH}${normalizedPath}`
      : normalizedPath;

  return `${SITE_URL}${pathWithBase}`;
};

type SiteMetaProps = {
  title: string;
  description: string;
  path?: string;
  imageUrl?: string;
  imageAlt?: string;
  type?: "website" | "article";
};

const SiteMeta = ({
  title,
  description,
  path = "/",
  imageUrl,
  imageAlt = `${SITE_NAME} social preview`,
  type = "website",
}: SiteMetaProps) => {
  const canonicalUrl = getAbsoluteUrl(path);
  const resolvedImageUrl = imageUrl ? getAbsoluteUrl(imageUrl) : null;
  const twitterCardType = resolvedImageUrl ? "summary_large_image" : "summary";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <link rel="canonical" href={canonicalUrl} key="canonical" />

      <meta property="og:type" content={type} key="og:type" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:title" content={title} key="og:title" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      <meta property="og:url" content={canonicalUrl} key="og:url" />
      {resolvedImageUrl && (
        <>
          <meta property="og:image" content={resolvedImageUrl} key="og:image" />
          <meta
            property="og:image:alt"
            content={imageAlt}
            key="og:image:alt"
          />
        </>
      )}

      <meta name="twitter:card" content={twitterCardType} key="twitter:card" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta
        name="twitter:description"
        content={description}
        key="twitter:description"
      />
      {resolvedImageUrl && (
        <>
          <meta
            name="twitter:image"
            content={resolvedImageUrl}
            key="twitter:image"
          />
          <meta
            name="twitter:image:alt"
            content={imageAlt}
            key="twitter:image:alt"
          />
        </>
      )}
    </Head>
  );
};

export default SiteMeta;