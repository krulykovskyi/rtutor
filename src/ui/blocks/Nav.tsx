import Button from "@mui/material/Button";
import { pageToComponent } from "../../App";

type NavProps = {
  setPage: Function;
  toggleMenu: Function;
};

const Nav: React.FC<NavProps> = ({ setPage, toggleMenu }) => {
  return (
    <nav className="flex flex-col gap-1">
      {Object.keys(pageToComponent).map((page) => (
        <Button
          variant="outlined"
          key={page}
          onClick={() => {
            setPage(page);
            toggleMenu();
          }}
        >
          {page}
        </Button>
      ))}
    </nav>
  );
};

export default Nav;
