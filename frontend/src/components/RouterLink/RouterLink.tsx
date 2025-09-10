import React from 'react';
import { Link } from 'react-router';

type RouterLinkProps = {
  children: React.ReactNode;
  href: string;
} & React.ComponentProps<'a'>;

const RouterLink = ({ children, href, ...props }: RouterLinkProps) => {
  return (
    <>
      <Link style={{ color: 'var(--text-default)' }} to={href} {...props}>
        {children}
      </Link>
    </>
  );
};

export default RouterLink;
