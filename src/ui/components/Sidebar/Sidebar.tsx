import Menu from "./Menu";
import Logo from "./Logo";

export default function Sidebar() {
  return (
    <div className="flex flex-col justify-between p-1 w-16 h-screen rounded-full  items-center ">
      <Menu />
      <Logo />
    </div>
  )
};
