export default async (id: number) => {
    const rawResult = await fetch('https://pricespy.co.nz/_internal/bff', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "query": "query productPage($id: Int!, $expertsEnabled: Boolean!, $partnerVideosEnabled: Boolean!) {\n  product(id: $id) {\n    ...productPage\n    ...productPageExpertContent @include(if: $expertsEnabled)\n    prices {\n      ...priceList\n    }\n    initialStatistics {\n      numberMainOffers\n      lowestPrice\n      highestPrice\n    }\n    relations {\n      type\n      relations {\n        name\n        sortPriority\n        selected\n      }\n    }\n    variants {\n      id\n      name\n      gtin14\n      sku\n      attributes {\n        type\n        value\n      }\n    }\n    category {\n      products(limit: 10, sort: \"popularity\", getProperties: false) {\n        nodes {\n          id\n        }\n      }\n    }\n    popularProducts(onlyFromFeaturedStores: true) {\n      ...productCarouselFields\n    }\n    trendingProducts(onlyFromFeaturedStores: true) {\n      ...productCarouselFields\n    }\n    othersVisitedProducts {\n      ...productCarouselFields\n    }\n    isExpertTopRated\n    metadata {\n      title\n      description\n    }\n    trendingProductsPageLink {\n      categoryId\n    }\n    partnerVideos(productId: $id) @include(if: $partnerVideosEnabled) {\n      __typename\n      author {\n        avatar {\n          url\n        }\n        name\n      }\n      previewImage {\n        small {\n          url\n        }\n        large {\n          url\n        }\n      }\n      title\n      videoId\n      videoUrl\n    }\n  }\n  prismicArticles(tags: [\"productpage-priceinfo\"]) {\n    nodes {\n      pathName\n    }\n  }\n}\n\nfragment productPage on Product {\n  id\n  name\n  description(html: true)\n  pathName\n  stockStatus\n  releaseDate\n  noIndex\n  userReviewSummary {\n    rating\n    count\n    countTotal\n  }\n  aggregatedRatingSummary {\n    summary {\n      rating {\n        score\n        count\n      }\n    }\n  }\n  hrefLang {\n    locale\n    url\n  }\n  coreProperties: properties(ids: \"_core_\") {\n    nodes {\n      __typename\n      id\n      name\n      type\n      pretty\n      prettyVerbose: pretty(mode: verbose)\n      prettyTable: pretty(mode: table)\n      ... on PropertyString {\n        valueId\n        categoryLink\n      }\n      ... on PropertyList {\n        values\n        valueIds\n        categoryLinks\n      }\n      ... on PropertyBoolean {\n        boolean\n      }\n    }\n  }\n  brand {\n    id\n    name\n    featured\n    logo\n    pathName\n  }\n  priceSummary {\n    regular\n    alternative\n  }\n  media {\n    count\n    first(width: _280)\n  }\n  category {\n    id\n    logo\n    name\n    pathName\n    productCollection\n    hasAdultContent\n    path {\n      id\n      name\n      pathName\n    }\n  }\n  sparkline {\n    values\n  }\n  popularity {\n    total\n    inCategory\n  }\n  productDescription {\n    preamble\n    descriptionPoints {\n      title\n      text\n    }\n    articles {\n      name\n      url\n    }\n  }\n  faqs {\n    id\n    question\n    answer\n  }\n  dealInfo {\n    dealPercentage\n    offers {\n      shopId\n      shopOfferId\n    }\n  }\n  articleContent {\n    articles {\n      __typename\n      id\n      thumbnail\n      title\n      slug\n    }\n    sponsoredArticle {\n      __typename\n      id\n      title\n      thumbnail\n      slug\n      owner {\n        name\n      }\n    }\n  }\n}\n\nfragment priceList on PriceList {\n  meta {\n    itemsTotal\n    storeStatistics {\n      totalCount\n      featuredCount\n    }\n  }\n  nodes {\n    ...priceListItem\n  }\n  mobileContracts {\n    ...mobileContract\n  }\n}\n\nfragment priceListItem on Price {\n  __typename\n  shopOfferId\n  name\n  externalUri\n  primaryMarket\n  membershipProgram {\n    name\n    requiresCompensation\n  }\n  stock {\n    status\n    statusText\n  }\n  condition\n  availability {\n    condition\n    availabilityDate\n  }\n  price {\n    inclShipping\n    exclShipping\n    originalCurrency\n  }\n  offerPrices {\n    price {\n      exclShipping\n      inclShipping\n      endDate\n    }\n    originalPrice {\n      exclShipping\n      inclShipping\n    }\n    memberPrice {\n      exclShipping\n      inclShipping\n      endDate\n    }\n  }\n  store {\n    id\n    name\n    featured\n    hasLogo\n    logo(width: _176)\n    pathName\n    providedByStore {\n      generalInformation\n    }\n    userReviewSummary {\n      rating\n      count\n      countTotal\n    }\n    market\n    marketplace\n    countryCode\n    primaryMarket\n    currency\n    payment {\n      options {\n        name\n      }\n      providers {\n        name\n      }\n    }\n  }\n  authorizedDealer\n  authorizedDealerData {\n    authorizedDealersDescription\n    authorizedDealersShortDescription\n  }\n  alternativePrices(includeMainPrice: true) {\n    __typename\n    shopOfferId\n    name\n    externalUri\n    primaryMarket\n    stock {\n      status\n      statusText\n    }\n    condition\n    availability {\n      condition\n      availabilityDate\n    }\n    price {\n      exclShipping\n      inclShipping\n      originalCurrency\n    }\n    offerPrices {\n      price {\n        exclShipping\n        inclShipping\n        endDate\n      }\n      originalPrice {\n        exclShipping\n        inclShipping\n      }\n      memberPrice {\n        exclShipping\n        inclShipping\n        endDate\n      }\n    }\n    variantInfo {\n      size\n      sizeSystem\n      colors\n    }\n    variantId\n    shipping {\n      cheapest {\n        deliveryDays {\n          min\n          max\n        }\n        shippingCost\n        carrier\n      }\n      fastest {\n        deliveryDays {\n          min\n          max\n        }\n        shippingCost\n      }\n      nodes {\n        deliveryMethod\n        carrier\n        deliveryDays {\n          min\n          max\n        }\n        shippingCost\n        sustainability\n        eligibility\n      }\n    }\n    shopHasUniqueShippings\n    ourChoiceScore\n    featuredOverride\n  }\n  variantInfo {\n    size\n    sizeSystem\n    colors\n  }\n  variantId\n  shipping {\n    cheapest {\n      deliveryDays {\n        min\n        max\n      }\n      shippingCost\n      carrier\n      sustainability\n    }\n    fastest {\n      deliveryDays {\n        min\n        max\n      }\n      shippingCost\n      carrier\n      sustainability\n    }\n    nodes {\n      deliveryMethod\n      carrier\n      deliveryDays {\n        min\n        max\n      }\n      shippingCost\n      sustainability\n      eligibility\n    }\n  }\n  shopHasUniqueShippings\n  ourChoiceScore\n  featuredOverride\n  membershipLink\n  promotion {\n    id\n    description\n    startDate\n    endDate\n    imageUrl\n    owner {\n      id\n      name\n      type\n    }\n    title\n    numberOfProducts\n  }\n}\n\nfragment mobileContract on MobileContract {\n  contractId\n  name\n  contractMonths\n  pricePerMonth\n  dataGB\n  externalUri\n  store {\n    id\n    name\n    featured\n    hasLogo\n    logo(width: _176)\n    pathName\n    providedByStore {\n      generalInformation\n    }\n    userReviewSummary {\n      rating\n      count\n      countTotal\n    }\n    market\n    marketplace\n    countryCode\n    primaryMarket\n    currency\n    payment {\n      options {\n        name\n      }\n      providers {\n        name\n      }\n    }\n  }\n}\n\nfragment productPageExpertContent on Product {\n  expertContent {\n    totalCount\n    experts {\n      name\n      avatar\n      url\n    }\n    selected {\n      ... on ProductPageExpertTest {\n        __typename\n        rating\n        date(format: \"D MMMM YYYY\")\n        title\n        plus\n        minus\n        imageWithSize {\n          src\n          alt\n        }\n        suitedForLong\n        suitedFor {\n          headline\n          text\n        }\n        url\n        expert {\n          name\n          avatar\n          url\n        }\n        category {\n          name\n        }\n      }\n      ... on ProductPageToplist {\n        __typename\n        title\n        url\n        category {\n          name\n        }\n        expert {\n          name\n          avatar\n          url\n        }\n        products {\n          id\n          plus\n          minus\n          description\n        }\n      }\n    }\n    tests {\n      ... on ProductPageExpertTest {\n        __typename\n        title\n        imageWithSize {\n          src\n          alt\n        }\n        url\n      }\n    }\n    toplists {\n      toplists {\n        __typename\n        title\n        url\n        description {\n          type\n          data\n        }\n        headlineInfo {\n          url\n        }\n        products {\n          id\n          plus\n          minus\n        }\n        imageUrl\n      }\n    }\n    guides {\n      ... on ProductPageExpertGuide {\n        __typename\n        title\n        imageUrl\n        url\n      }\n    }\n  }\n}\n\nfragment productCarouselFields on CarouselProduct {\n  id\n  name\n  pathName\n  category\n  price\n  url\n  userReviewSummary {\n    rating\n    count\n  }\n  aggregatedRating {\n    score\n    count\n  }\n  imageUrl\n  isExpertTopRated\n}",
            "variables": {
                "id": id,
                "expertsEnabled": false,
                "partnerVideosEnabled": false,
                "campaignId": 4
            },
            "operationName": "productPage"
        }),
    })

    const result = await rawResult.json()

    if (!result.data?.product?.priceSummary) {
        // Invalid data?
        return null
    }

    return {
        name: result.data.product.name,
        price: result.data.product.priceSummary.regular
    }
}
