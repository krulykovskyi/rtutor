import React from "react";
import NavLink from "../components/NavLink";

type MenuProps = {
  pages: string[];
  setPage: Function;
};

const Menu: React.FC<MenuProps> = ({ pages, setPage }) => {
  return (
    <div className="menu">
      <nav className="nav">
        {pages.map((page) => (
          <NavLink />
        ))}
      </nav>
    </div>
  );
};

export default Menu;
