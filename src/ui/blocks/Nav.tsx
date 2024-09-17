import Button from "../components/Button";

type NavProps = {
  setPage: Function;
};

const Nav: React.FC<NavProps> = ({ setPage }) => {
  return (
    <nav>
      <Button onClick={() => setPage("home")} text="Home" />
      <Button onClick={() => setPage("settings")} text="Settings" />
      <Button onClick={() => setPage("profile")} text="Profile" />
      <Button onClick={() => setPage("learning")} text="Learning" />
    </nav>
  );
};

export default Nav;
