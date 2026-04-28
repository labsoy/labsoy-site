import React, { memo } from "react";
import { Link } from "react-router-dom";

export const NavLink = memo(({ to, label, isActive, onClick, ...rest }) => (
  <Link
    {...rest}
    to={to}
    className={`site-header__link hover-elevate ${isActive ? "is-active" : ""}`}
    aria-current={isActive ? "page" : undefined}
    onClick={onClick}
  >
    {label}
  </Link>
));

NavLink.displayName = "NavLink";