import { NavLink } from 'react-router-dom';
import { prefixNext, prefixNg, siteRoot } from '../../data/sitemap';
import styles from './Sidebar.module.css';

export interface ILink {
  href: string;
  name: string;
}

export type NavItem = ILink & {
  children?: ILink[];
};

const extNavItems: NavItem[] = [
  {
    name: 'Admin',
    href: `${prefixNg}/${siteRoot.admin}`,
    children: [
      {
        name: 'VIP',
        href: `${prefixNg}/${siteRoot.admin}/vip`
      }
    ]
  },
  {
    name: 'Push Notification',
    href: `${prefixNg}${siteRoot.apn}`,
  },
  {
    name: 'API Access',
    href: `${prefixNg}${siteRoot.oauth}`,
    children: [
      {
        name: 'Personal Keys',
        href: `${prefixNg}/${siteRoot.oauth}/keys`
      }
    ]
  },
  {
    name: 'Wiki',
    href: `${prefixNg}${siteRoot.wiki}`
  },
  {
    name: 'Android Release',
    href: `${prefixNg}${siteRoot.android}`,
  },
  {
    name: 'Readers',
    href: `${prefixNg}${siteRoot.readers}`,
    children: [
      {
        name: 'Orders',
        href: `${prefixNg}/${siteRoot.readers}/orders`,
      },
      {
        name: 'Confirmation Failure',
        href: `${prefixNg}/${siteRoot.readers}/wh-unconfirmed`
      },
      {
        name: 'Test Account',
        href: `${prefixNg}/${siteRoot.readers}/sandbox`,
      },
    ]
  },
  {
    name: 'B2B Subscription',
    href: `${prefixNg}${siteRoot.b2b}`,
  },
];

const navItems: NavItem[] = [
  {
    name: 'Paywall',
    href: `${prefixNext}/${siteRoot.paywall}`,
  },
];

export function Sidebar() {
  return (
    <nav className={`nav flex-column ${styles.sidebar}`}>
      {
        extNavItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="nav-link"
          >
            {item.name}
          </a>

        ))
      }
      {
        navItems.map((item, index) => (
          <NavLink
            to={item.href}
            key={index}
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            {item.name}
          </NavLink>
        ))
      }
    </nav>
  );
}
