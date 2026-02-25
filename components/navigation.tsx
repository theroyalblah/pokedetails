import { useRouter } from "next/router";
import { AppBar, Toolbar, Tabs, Tab, Typography, IconButton, Menu, MenuItem, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useState } from "react";

const tabMap = {
    "/": 0,
    "/[pokemon]": 0,
    "/teamgenerator": 1,
    "/about": 2,
}

const Navigation = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const getCurrentTab = () => {
    return tabMap[router.pathname as keyof typeof tabMap] ?? 0;
  };

  const currentTab = getCurrentTab();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#2a2a2a", marginBottom: 3 }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: "bold",
            color: "#6b9bd1"
          }}
        >
          PokeDetails
        </Typography>
        
        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Tabs 
            value={currentTab} 
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#6b9bd1",
              },
            }}
          >
            <Tab 
              label="Details" 
              component={Link}
              href="/"
              disabled={currentTab === 0}
              sx={{
                color: "#e0e0e0",
                "&.Mui-selected": {
                  color: "#6b9bd1",
                },
                "&.Mui-disabled": {
                  color: "#6b9bd1",
                  opacity: 1,
                },
              }}
            />
            <Tab 
              label="Team Generator" 
              component={Link}
              href="/teamgenerator"
              disabled={currentTab === 1}
              sx={{
                color: "#e0e0e0",
                "&.Mui-selected": {
                  color: "#6b9bd1",
                },
                "&.Mui-disabled": {
                  color: "#6b9bd1",
                  opacity: 1,
                },
              }}
            />
            <Tab 
              label="About" 
              component={Link}
              href="/about"
              disabled={currentTab === 2}
              sx={{
                color: "#e0e0e0",
                "&.Mui-selected": {
                  color: "#6b9bd1",
                },
                "&.Mui-disabled": {
                  color: "#6b9bd1",
                  opacity: 1,
                },
              }}
            />
          </Tabs>
        </Box>

        {/* Mobile Navigation */}
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ color: "#e0e0e0" }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "#2a2a2a",
                color: "#e0e0e0",
              },
            }}
          >
            <MenuItem
              component={Link}
              href="/"
              onClick={handleMenuClose}
              disabled={currentTab === 0}
              sx={{
                "&.Mui-disabled": {
                  color: "#6b9bd1",
                  opacity: 1,
                },
              }}
            >
              Details
            </MenuItem>
            <MenuItem
              component={Link}
              href="/teamgenerator"
              onClick={handleMenuClose}
              disabled={currentTab === 1}
              sx={{
                "&.Mui-disabled": {
                  color: "#6b9bd1",
                  opacity: 1,
                },
              }}
            >
              Team Generator
            </MenuItem>
            <MenuItem
              component={Link}
              href="/about"
              onClick={handleMenuClose}
              disabled={currentTab === 2}
              sx={{
                "&.Mui-disabled": {
                  color: "#6b9bd1",
                  opacity: 1,
                },
              }}
            >
              About
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
