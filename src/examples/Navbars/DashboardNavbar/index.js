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
import "react-datepicker/dist/react-datepicker.css";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import NavigationIcon from "@mui/icons-material/Navigation";
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
import { navbar, navbarContainer, navbarRow } from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setDateMaster,
  setPlayDashboard,
  setMachines,
  setMachinesSelect,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [startDateGlobal, setstartDate] = useState(null);
  const [endDateGlobal, setEndDate] = useState(null);
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const [state, setState] = useState([]);
  const { transparentNavbar, fixedNavbar, darkMode, machines } = controller;
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
            <MDBox pr={1}>
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={machines}
                disableCloseOnSelect
                value={state}
                getOptionLabel={(option) => option.location}
                getOptionSelected={(option, value) => option.id === value.id}
                renderOption={(props, option, { selected }) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.location}
                  </li>
                )}
                onChange={handleChange}
                style={{ width: 500 }}
                renderInput={(params) => (
                  <TextField {...params} label="Checkboxes" placeholder="Favorites" />
                )}
              />
            </MDBox>
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
            <Fab variant="extended" onClick={handlePlayDashboard}>
              <NavigationIcon sx={{ mr: 1 }} />
              Play
            </Fab>
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
