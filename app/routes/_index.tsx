import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import fingersHoldingBean from '~/assets/BannerAssets/fingers_coffee_bean.png'
import whyCB from '~/assets/BannerAssets/whyCB.png'
import cbLogo from '~/assets/LettersLogo.png'
import AttentionButton from '~/components/AttentionButton';
import { Sparkles } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [{title: 'CodersBrew'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTIONS_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: [...collections.nodes],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <div className=' bg-[var(--theme-base-color)] h-[40rem] w-full grid place-content-center relative'>
        <div className=' flex flex-col items-start justify-start w-[80vw] h-full'>
          <div className=' flex flex-col items-start justify-items-start'>
            <div className=' text-7xl font-extrabold text-white'>Sip into the Season, <br/>One Brew at a Time</div>
            <div className=' md:max-w-[45rem] text-xl my-3 text-white'>
              Embrace autumn with rich, aromatic blends that warm the soul—perfect for cozy mornings, sharing with friends, and savoring the crisp days of fall.
            </div>
            <AttentionButton 
              btnTxt={"Explore our flavours"} btnHref={`/collections/coffee-powder`} size={'1.5rem'}>
              <Sparkles/>
            </AttentionButton>
          </div>
        </div>
        <div className=' absolute bottom-0 right-0 h-full'>
          <img src={fingersHoldingBean} className='h-full w-full'/>
        </div>
      </div>
      <FeaturedCollections collection={data.featuredCollection} />
      <div className=' w-full flex flex-row items-center justify-between flex-wrap md:px-40 p-20 md:py-40 bg-[var(--theme-azure-color)] text-white'>
        <div className=' md:w-1/2 '>
          <div className='text-5xl font-extrabold'>Why CodersBrew ?</div>
          <div className='text-lg mt-3 font-semibold'>
          At CodersBrew, we’re committed to crafting the perfect coffee experience with every sip. Our coffee powders are made from handpicked, premium beans blended with unique flavors like Hazelnut, Vanilla, and Caramel, giving each cup a smooth, rich taste that’s both bold and nuanced. We focus on quality at every stage, from sourcing to roasting, ensuring each blend is fresh, aromatic, and packed with flavor. Whether you’re starting your day or winding down, CodersBrew brings you the best in coffee so you can enjoy barista-quality taste right at home.
          </div>
        </div>
        <div className=' h-96'>
          <img src={whyCB} alt="" className='w-full h-full' />
        </div>
      </div>
      <RecommendedProducts products={data.recommendedProducts} />
      <div className=' w-full flex flex-row-reverse items-center justify-between flex-wrap md:px-40 p-20 md:py-40 bg-[var(--theme-purple-color)] text-white'>
        <div className=' md:w-1/2 '>
          <div className='text-5xl font-extrabold'>Our Story</div>
          <div className='text-lg mt-3 font-semibold'>
          From Kerala’s rich coffee culture, CodersBrew has grown into a favorite for coffee lovers across India. Our dedication to quality, unique flavors, and exceptional products has fueled our journey.
          </div>
          <Link to={`/pages/about-us`}>
            Know more about us
          </Link>
        </div>
        <div className=' h-96'>
          <img src={cbLogo} alt=""className='w-full h-full'/>
        </div>
      </div>
      
    </div>
  );
}



function FeaturedCollections({
  collection,
}: {
  collection: FeaturedCollectionFragment[];
}) {
  const colorPallete = ['azure','purple','base','black']
  
  if (!collection) return null;
  return(
    <div className=' w-full grid grid-cols-2 gap-0'>
      {
        collection?.map((el,k) => {
          const keyName = el?.title?.replaceAll(' ','')?.toLowerCase()
          const image = el?.image
          console.log('COLL',el,keyName)
          return(
            <Link
              className={`featured-collection-div h-[70vh] px-40 py-20 flex flex-col items-center justify-center gap-4 text-center text-white 
                bg-[var(--theme-${colorPallete[k]}-color)] border-none outline-0 mx-[-.2px] my-[-2.5px] text-center
                `}
              to={`/collections/${el?.handle}`}
            >
              <div className=' text-5xl font-bold z-1 sticky text-center w-auto collectionTitle'>{el?.title}</div>
              
              {image && 
                <div className=" h-[30vh] my-4 grid place-content-center">
                  <Image data={image} className=' h-full'/>
                </div>
              }
              <div className={`elevateBtn w-full`}>
                <div className={` w-full bg-[var(--theme-${colorPallete[k]}-color)]`}>Shop Now</div>
              </div>
            </Link>
          )
        })
      }
    </div>
  )
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products md:px-40 px-20 py-28 ">
      <div className='text-4xl font-bold my-2'>Best in Shelf</div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product  border-4 border-[var(--theme-base-color)] p-5 bg-amber-100 rounded-xl"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4>{product.title}</h4>
                      {/* <small>
                        <Money data={product.priceRange.minVariantPrice} />
                      </small> */}
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;


const FEATURED_COLLECTIONS_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, reverse: true, query: "vendor:coffeevendor") {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
