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
import Icon from "@mui/material/Icon";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMaterialUIController } from "context";
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
  const [controller, dispatch] = useMaterialUIController();
  const { dateMaster, machinesSelect, token } = controller;
  const [machine, setMachine] = React.useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalEditIsOpen, setEditIsOpen] = React.useState(false);
  const [companyForCreates, setCompanyForCreates] = React.useState([]);
  const [company, setCompany] = React.useState(null);
  const [id, setId] = React.useState(null);
  const [machineName, setMachineName] = React.useState(null);
  const [machineLocation, setMachineLocation] = React.useState(null);
  const [locationDetail, setLocationDetail] = React.useState(null);
  const [printerStatus, setPrinterStatus] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [newData, setNewData] = React.useState(false);
  const navigate = useNavigate();
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
        .post(
          "/machine/createMachine",
          {
            companyId: company.id,
            name: machineName,
            location: machineLocation,
            locationDetail: locationDetail,
            printerStatus: printerStatus,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          setNewData(!newData);
          closeModal();
        })
        .catch((error) => {
          if (error.response.status) {
            navigate("/authentication/sign-in", { replace: true });
          } else {
            setError(error.response.data.error.message);
            console.error("Error fetching data:", error.response.data.error.message);
          }
        });
    } catch (error) {
      setError(error.message);
    }
  };
  const updateData = () => {
    try {
      instance
        .put(
          `/machine/machine/${id}`,
          {
            name: machineName,
            location: machineLocation,
            locationDetail: locationDetail,
            printerStatus: printerStatus,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          setNewData(!newData);
          setEditIsOpen(false);
        })
        .catch((error) => {
          if (error.response.status) {
            navigate("/authentication/sign-in", { replace: true });
          } else {
            setError(error.response.data.error.message);
            console.error("Error fetching data:", error.response.data.error.message);
          }
        });
    } catch (error) {
      setError(error.message);
    }
  };
  function closeModal() {
    setIsOpen(false);
    setEditIsOpen(false);
  }
  const handleEdit = (data) => {
    const { printerStatus, name, location, locationDetail, id } = data;
    setMachineName(name);
    setMachineLocation(location);
    setLocationDetail(locationDetail);
    setPrinterStatus(printerStatus);
    setEditIsOpen(true);
    setId(id);
  };
  const fetchData = () => {
    instance
      .get("/machine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCompanyForCreates(response.data.companyForCreate);
        setMachine(response.data.machines);
      })
      .catch((error) => {
        navigate("/authentication/sign-in", { replace: true });
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
      <Modal isOpen={modalEditIsOpen} onRequestClose={closeModal} style={customStyles}>
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
              Update Machine
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Update name, location and company to create
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  id="name"
                  label="Machine Name"
                  defaultValue={machineName}
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
                  defaultValue={machineLocation}
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
                  defaultValue={locationDetail}
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
                  defaultValue={printerStatus}
                  onChange={(e) => {
                    setPrinterStatus(e.target.value);
                  }}
                  fullWidth
                />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" onClick={(e) => updateData()} color="info" fullWidth>
                  Update Machine
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
                  Create Machine
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
                      Machine Table
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
                      {
                        Header: "Action",
                        accessor: "action",
                        Cell: (row) => (
                          <MDButton onClick={(e) => handleEdit(row.row.original)}>
                            {" "}
                            <Icon>edit</Icon>
                          </MDButton>
                        ),
                      },
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
