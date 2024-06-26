/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router components
import { useLocation } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import moment from "moment";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import "react-datepicker/dist/react-datepicker.css";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import NavigationIcon from "@mui/icons-material/Navigation";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import TextField from "@mui/material/TextField";
// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setDateMaster,
  setPlayDashboard,
  setMachines,
  setMiniSidenav,
  setMachinesSelect,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const [startDateGlobal, setstartDate] = useState(null);
  const [endDateGlobal, setEndDate] = useState(null);
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const [state, setState] = useState([]);
  const { transparentNavbar, fixedNavbar, darkMode, machines, miniSidenav } = controller;
  const route = useLocation().pathname.split("/").slice(1);

  const handlePlayDashboard = () => {
    setPlayDashboard(dispatch, true);
    setDateMaster(dispatch, { dateStart: startDateGlobal, dateEnd: endDateGlobal });
  };

  const handleChange = (event, values) => {
    const map = values.map((item) => item.id);
    setState(values);
    setMachinesSelect(dispatch, map);
  };

  useEffect(() => {
    const firstDate = moment().startOf("month").format("YYYY-MM-DD");
    const lastDate = moment().endOf("month").format("YYYY-MM-DD");
    setstartDate(firstDate);
    setEndDate(lastDate);
    setDateMaster(dispatch, { dateStart: firstDate, dateEnd: lastDate });

    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <Grid container spacing={3}>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <Grid item xs={12} md={12} lg={5}>
                <MDBox pr={1}>
                  <Autocomplete
                    multiple
                    limitTags={2}
                    id="multiple-limit-tags"
                    options={machines}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) =>
                      value === undefined || value === "" || option.id === value.id
                    }
                    onChange={handleChange}
                    getOptionLabel={(option) => option.nameWithLocation}
                    renderInput={(params) => (
                      <TextField {...params} label="Machines" placeholder="Machines" />
                    )}
                  />
                  {/* <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={machines}
                    disableCloseOnSelect
                    value={state}
                    getOptionLabel={(option) => option.nameWithLocation}
                    renderOption={(props, option, { selected }) => (
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.nameWithLocation}
                      </li>
                    )}
                    onChange={handleChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Checkboxes" placeholder="Favorites" />
                    )}
                  /> */}
                </MDBox>
              </Grid>
              <Grid item xs={12} md={12} lg={3}>
                <MDBox pr={1}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    id="outlinedStartDate"
                    label="Start Date"
                    onChange={(event) => {
                      setstartDate(event.target.value);
                    }}
                    defaultValue={startDateGlobal}
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} md={12} lg={3}>
                <MDBox pr={1}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    id="outlinedEndDate"
                    label="End Date"
                    onChange={(event) => {
                      setEndDate(event.target.value);
                    }}
                    defaultValue={endDateGlobal}
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} md={12} lg={1}>
                <Fab variant="extended" onClick={handlePlayDashboard}>
                  <NavigationIcon />
                  Play
                </Fab>
              </Grid>
            </Grid>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
