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
    name: 'Paywall',
    href: sitemap.paywall,
    ext: false,
    children: [
      {
        name: 'Products',
        href: sitemap.products,
        ext: false,
      },
      {
        name: 'Stripe Prices',
        href: sitemap.stripePrices,
        ext: false
      }
    ]
  },
  {
    name: 'Legal Docs',
    href: sitemap.legalDocs,
    ext: false,
  },
  {
    name: 'Go to legacy edition',
    href: `${prefixNg}/${sitePath.admin}`,
    ext: true,
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
