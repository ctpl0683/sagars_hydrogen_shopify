import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import LogoAsset from '~/assets/YellowFullLogo.png'
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import Instagram from '~/assets/icons8-instagram.svg'
import Facebook from '~/assets/icons8-facebook.svg'
import Twitter from '~/assets/icons8-twitter.svg'
import coffeebeanRain from '~/assets/BannerAssets/coffeebeanrain2.png'

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            {footer?.menu && header.shop.primaryDomain?.url && (
              <FooterMenu
                menu={footer.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            )}
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu bg-[var(--theme-black-color)] h-[30vh] flex w-full flex-row flex-wrap items-start justify-between pt-16 px-28 relative" role="navigation">
      <div>
        <img src={LogoAsset} alt="Logo" srcSet="" className='w-60' />
      </div>
      <div className='grid md:grid-cols-2 md:gap-4'>
      {(FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
      </div>
      <div className='flex flex-col items-end justify-items-start text-white'>
        <div className='flex flex-row items-center justify-between footer-icon'>
          <div><img src={Twitter} alt="twitter" srcSet="" /></div>
          <div><img src={Facebook} alt="facebook" srcSet="" /></div>
          <div><img src={Instagram} alt="instagram" srcSet="" /></div>
        </div>
        {/* <div className='w-full border-b-white my-2'>
          <div>Email</div>
          <div>Subscribe</div>
        </div> */}
      </div>
      <div className=' absolute w-full left-0 bottom-0'>
        <img src={coffeebeanRain} alt="" className='w-full h-full'/>
      </div>
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
