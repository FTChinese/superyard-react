import { NavLink } from 'react-router-dom';
import { prefixNext, prefixNg, sitemap, siteRoot } from '../../data/sitemap';
import styles from './Sidebar.module.css';

export interface ILink {
  href: string;
  name: string;
  ext: boolean;
  children?: ILink[]
}

const navItems: ILink[] = [
  {
    name: 'Admin',
    href: `${prefixNg}/${siteRoot.admin}`,
    ext: true,
    children: [
      {
        name: 'VIP',
        href: `${prefixNg}/${siteRoot.admin}/vip`,
        ext: true,
      }
    ]
  },
  {
    name: 'Push Notification',
    href: `${prefixNg}/${siteRoot.apn}`,
    ext: true,
  },
  {
    name: 'API Access',
    href: `${prefixNg}/${siteRoot.oauth}`,
    ext: true,
    children: [
      {
        name: 'Personal Keys',
        href: `${prefixNg}/${siteRoot.oauth}/keys`,
        ext: true,
      }
    ]
  },
  {
    name: 'Wiki',
    href: `${prefixNg}/${siteRoot.wiki}`,
    ext: true,
  },
  {
    name: 'Android Release',
    href: `${prefixNg}/${siteRoot.android}`,
    ext: true,
  },
  {
    name: 'Readers',
    href: `${prefixNg}/${siteRoot.readers}`,
    ext: true,
    children: [
      {
        name: 'Orders',
        href: `${prefixNg}/${siteRoot.readers}/orders`,
        ext: true,
      },
      {
        name: 'Confirmation Failure',
        href: `${prefixNg}/${siteRoot.readers}/wh-unconfirmed`,
        ext: true,
      },
      {
        name: 'Test Account',
        href: `${prefixNg}/${siteRoot.readers}/sandbox`,
        ext: true,
      },
    ]
  },
  {
    name: 'B2B Subscription',
    href: `${prefixNg}/${siteRoot.b2b}`,
    ext: true,
  },
  {
    name: 'Paywall',
    href: sitemap.paywall,
    ext: false,
    children: [
      {
        name: 'Products',
        href: sitemap.products,
        ext: false,
      }
    ]
  },
];

function Anchor(
  props: {
    link: ILink;
  }
) {
  if (props.link.ext) {
    return (
      <a
        href={props.link.href}
        className="nav-link"
      >
        {props.link.name}
      </a>
    );
  }

  return (
    <NavLink
      to={props.link.href}
      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
    >
      {props.link.name}
    </NavLink>
  );
}

function NavItem(
  props: {
    link: ILink;
    children?: JSX.Element;
  }
) {
  return (
    <li className="nav-item">
      <Anchor link={props.link} />
      { props.children }
    </li>
  );
}

function Nav(
  props: {
    list: ILink[];
    indent: boolean;
  }
) {

  const items = props.list.map((item, index) => (
    <NavItem link={item} key={index}>
      { item.children && <Nav list={item.children} indent={true} />}
    </NavItem>
  ));

  return (
    <ul className={`nav flex-column${props.indent ? ' ms-3' : ''}`}>
      {items}
    </ul>
  );
}

export function Sidebar() {
  return (
    <Nav list={navItems} indent={false} />
  );
}
