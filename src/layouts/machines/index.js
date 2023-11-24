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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Modal from "react-modal";
import MDInput from "components/MDInput";
import Autocomplete from "@mui/material/Autocomplete";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import TextField from "@mui/material/TextField";
import { instance, cancel } from "../../api";
const customStyles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    outline: "none",
    bgcolor: "background.paper",
    p: 4,
  },
};
function Tables() {
  const [machine, setMachine] = React.useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [companyForCreates, setCompanyForCreates] = React.useState([]);
  const [company, setCompany] = React.useState(null);
  const [machineName, setMachineName] = React.useState(null);
  const [machineLocation, setMachineLocation] = React.useState(null);
  const [locationDetail, setLocationDetail] = React.useState(null);
  const [printerStatus, setPrinterStatus] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [newData, setNewData] = React.useState(false);
  const newMachine = () => {
    setIsOpen(true);
  };
  const saveData = () => {
    try {
      if (!machineName) {
        throw new Error("set machineName");
      }
      if (!machineLocation) {
        throw new Error("set machineLocation");
      }
      if (!printerStatus) {
        throw new Error("set printerStatus");
      }
      instance
        .post("/machine/createMachine", {
          companyId: company.id,
          name: machineName,
          location: machineLocation,
          locationDetail: locationDetail,
          printerStatus: printerStatus,
        })
        .then(() => {
          setNewData(!newData);
          closeModal();
        })
        .catch((error) => {
          setError(error.response.data.error.message);
          console.error("Error fetching data:", error.response.data.error.message);
        });
    } catch (error) {
      setError(error.message);
    }
  };
  function closeModal() {
    setIsOpen(false);
  }
  const fetchData = () => {
    instance
      .get("/machine")
      .then((response) => {
        setCompanyForCreates(response.data.companyForCreate);
        setMachine(response.data.machines);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  React.useEffect(() => {
    fetchData();
    return () => {
      cancel(); // This cancels the request when the component unmounts
    };
  }, []);
  React.useEffect(() => {
    fetchData();
    return () => {
      cancel(); // This cancels the request when the component unmounts
    };
  }, [newData]);
  return (
    <DashboardLayout>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Create New Machine
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter new name, location and company to create
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  id="name"
                  label="Machine Name"
                  variant="standard"
                  onChange={(e) => {
                    setMachineName(e.target.value);
                  }}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  id="name"
                  label="Machine Location"
                  variant="standard"
                  onChange={(e) => {
                    setMachineLocation(e.target.value);
                  }}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  id="locationDetail"
                  label="Location Detail"
                  variant="standard"
                  onChange={(e) => {
                    setLocationDetail(e.target.value);
                  }}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="number"
                  id="printerStatus"
                  label="Printer Status"
                  variant="standard"
                  onChange={(e) => {
                    setPrinterStatus(e.target.value);
                  }}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                {" "}
                <Autocomplete
                  options={companyForCreates}
                  id="autoSelect"
                  autoSelect
                  onChange={(event, newValue) => {
                    setCompany(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Company" variant="standard" />
                  )}
                />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" onClick={(e) => saveData()} color="info" fullWidth>
                  Create User
                </MDButton>
              </MDBox>
              {error && (
                <>
                  {" "}
                  <MDBox mt={4} mb={1}>
                    <MDTypography variant="h6" color="error" fullWidth verticalAlign="middle">
                      {error}
                    </MDTypography>
                  </MDBox>
                </>
              )}
            </MDBox>
          </MDBox>
        </Card>
      </Modal>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <Grid container>
                  <Grid xs={8}>
                    <MDTypography variant="h6" color="white">
                      User Table
                    </MDTypography>
                  </Grid>
                  <Grid>
                    <Grid justifyContent="flex-end" alignItems="stretch">
                      <MDButton onClick={(e) => newMachine()}>New Machine</MDButton>
                    </Grid>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Machine Name", accessor: "name", width: "25%" },
                      { Header: "Location", accessor: "location", width: "30%" },
                      { Header: "company name", accessor: "companyName", width: "30%" },
                    ],
                    rows: machine,
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Tables;
