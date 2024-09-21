import LessonsList from './LessonsList';
import Nav from './Nav';
import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';


type SidebarProps = {
  setPage: Function;
};

const Sidebar: React.FC<SidebarProps> = ({ setPage }) => {
  const [open, setOpen] = React.useState(false);
  
  function toggleMenu () {
    setOpen(!open);
  };

  return (
    <div>
      <Button onClick={toggleMenu}>
        <img src="./menu.png" alt="" />
      </Button>
      <Drawer open={open}>
        <div className="bg-gray-800 h-screen w-64 border border-red-500 overflow-scroll">
          <LessonsList toggleMenu={toggleMenu}/>
          <Nav setPage={setPage} toggleMenu={toggleMenu} />
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
