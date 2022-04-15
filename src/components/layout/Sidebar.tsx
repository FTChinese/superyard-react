import { NavLink } from 'react-router-dom';
import { prefixNg, sitemap, sitePath } from '../../data/sitemap';

export interface ILink {
  href: string;
  name: string;
  ext: boolean;
  children?: ILink[]
}

const navItems: ILink[] = [
  {
    name: 'Admin',
    href: `${prefixNg}/${sitePath.admin}`,
    ext: true,
    children: [
      {
        name: 'VIP',
        href: `${prefixNg}/${sitePath.admin}/vip`,
        ext: true,
      }
    ]
  },
  {
    name: 'Push Notification',
    href: `${prefixNg}/${sitePath.apn}`,
    ext: true,
  },
  {
    name: 'API Access',
    href: `${prefixNg}/${sitePath.oauth}`,
    ext: true,
    children: [
      {
        name: 'Personal Keys',
        href: `${prefixNg}/${sitePath.oauth}/keys`,
        ext: true,
      }
    ]
  },
  {
    name: 'Wiki',
    href: `${prefixNg}/${sitePath.wiki}`,
    ext: true,
  },
  {
    name: 'Android Release',
    href: `${prefixNg}/${sitePath.android}`,
    ext: true,
  },
  {
    name: 'Readers',
    href: `${prefixNg}/${sitePath.readers}`,
    ext: true,
    children: [
      {
        name: 'Orders',
        href: `${prefixNg}/${sitePath.readers}/orders`,
        ext: true,
      },
      {
        name: 'Confirmation Failure',
        href: `${prefixNg}/${sitePath.readers}/wh-unconfirmed`,
        ext: true,
      },
      {
        name: 'Test Account',
        href: `${prefixNg}/${sitePath.readers}/sandbox`,
        ext: true,
      },
    ]
  },
  {
    name: 'B2B Subscription',
    href: `${prefixNg}/${sitePath.b2b}`,
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
    <ul className={`nav flex-column${props.indent ? ' ms-3 ' : ''}`}>
      {items}
    </ul>
  );
}

export function Sidebar() {
  return (
    <div className="sidebar">
      <Nav list={navItems} indent={false} />
    </div>
  );
}
