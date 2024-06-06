import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import LibraryBooksSharpIcon from '@mui/icons-material/LibraryBooksSharp';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalLibrarySharpIcon from '@mui/icons-material/LocalLibrarySharp';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AltRouteSharpIcon from '@mui/icons-material/AltRouteSharp';
import WorkSharpIcon from '@mui/icons-material/WorkSharp';
import ConstructionSharpIcon from '@mui/icons-material/ConstructionSharp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/UserStore';
import { useState } from 'react';
import { supabase } from '../SupabaseClient';

const drawerWidth = 240;

const SideDrawer = () => {
  const navigate = useNavigate();
  const logOut = useUserStore((state) => state.logOut);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleNavigate = (index: number) => {
    setSelectedTabIndex(index);
    switch (index) {
      case 0:
        navigate('/dashboard/books');
        break;
      case 1:
        navigate('/dashboard/courses');
        break;
      case 2:
        navigate('/dashboard/learning-paths');
        break;
      case 3:
        navigate('/dashboard/job-roles');
        break;
      case 4:
        navigate('/dashboard/skills');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logOut();

    navigate('/');
  };

  const drawer = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <List>
        {['Library', 'Courses', 'Learning Paths', 'Job Roles', 'Skills'].map(
          (text, index) => (
            <ListItem
              key={text}
              style={{
                backgroundColor:
                  index === selectedTabIndex ? '#1876D2' : 'transparent',
                color: index === selectedTabIndex ? 'white' : 'black'
              }}
            >
              <ListItemButton
                onClick={() => {
                  handleNavigate(index);
                }}
              >
                <ListItemIcon>
                  {index === 0 ? (
                    <LibraryBooksSharpIcon
                      style={{
                        color: index === selectedTabIndex ? 'white' : 'black'
                      }}
                    />
                  ) : index === 1 ? (
                    <LocalLibrarySharpIcon
                      style={{
                        color: index === selectedTabIndex ? 'white' : 'black'
                      }}
                    />
                  ) : index === 2 ? (
                    <AltRouteSharpIcon
                      style={{
                        color: index === selectedTabIndex ? 'white' : 'black'
                      }}
                    />
                  ) : index === 3 ? (
                    <WorkSharpIcon
                      style={{
                        color: index === selectedTabIndex ? 'white' : 'black'
                      }}
                    />
                  ) : (
                    <ConstructionSharpIcon
                      style={{
                        color: index === selectedTabIndex ? 'white' : 'black'
                      }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Veripol Content Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default SideDrawer;
