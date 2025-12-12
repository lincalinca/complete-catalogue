import React from "react";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, ...rest }, ref) => (
    <a ref={ref} href={href} className={className} {...rest}>
      {children}
    </a>
  )
);

Link.displayName = "LinkMock";

export default Link;
