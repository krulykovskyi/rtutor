import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LessonsList from './LessonsList';
import Nav from './Nav';

type SidebarProps = {
  setPage: Function;
};

const Sidebar: React.FC<SidebarProps> = ({ setPage }) => {
  const [open, setOpen] = React.useState(false);

  function toggleMenu() {
    setOpen(!open);
  }

  return (
    <div className="absolute top-0 left-0">
      <IconButton className="" onClick={toggleMenu}>
        <MenuBookIcon />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <div className="h-screen w-64 overflow-scroll">
          <LessonsList toggleMenu={toggleMenu} />
          <Nav setPage={setPage} toggleMenu={toggleMenu} />
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
