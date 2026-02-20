import { useRouter } from "next/router";
import { AppBar, Toolbar, Tabs, Tab, Typography } from "@mui/material";
import Link from "next/link";

const tabMap = {
    "/": 0,
    "/[pokemon]": 0,
    "/teamgenerator": 1,
    "/about": 2,
}

const Navigation = () => {
  const router = useRouter();
  
  const getCurrentTab = () => {
    return tabMap[router.pathname as keyof typeof tabMap] ?? 0;
  };

  const currentTab = getCurrentTab();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#2a2a2a", marginBottom: 3 }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            marginRight: 4,
            fontWeight: "bold",
            color: "#6b9bd1"
          }}
        >
          PokeDetails
        </Typography>
        
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
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
