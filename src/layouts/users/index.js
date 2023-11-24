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
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
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
  const [companyTable, setCompanyTable] = React.useState([]);
  const [userTable, setUsers] = React.useState([]);
  const [companyForCreates, setCompanyForCreates] = React.useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalIsOpenCompany, setIsOpenCompany] = React.useState(false);
  const [company, setCompany] = React.useState(null);
  const [userName, setUserName] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [companyName, setCompanyName] = React.useState(null);
  const [companyDescription, setCompanyDescription] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [newData, setNewData] = React.useState(false);
  const newUser = () => {
    setIsOpen(true);
  };
  const newCompany = () => {
    setIsOpenCompany(true);
  };
  const saveData = () => {
    try {
      if (!userName) {
        throw new Error("set Username");
      }
      if (!password) {
        throw new Error("set password");
      }
      if (!company) {
        throw new Error("set company");
      }
      instance
        .post("/users/user/create", {
          username: userName,
          password: password,
          companyId: company.internalId,
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
  const saveDataCompany = () => {
    try {
      if (!companyName) {
        throw new Error("set Username");
      }
      instance
        .post("/users/company/create", {
          name: companyName,
          description: companyDescription,
        })
        .then(() => {
          setNewData(!newData);
          closeModalCompany();
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
  function closeModalCompany() {
    setIsOpenCompany(false);
  }
  const fetchData = () => {
    instance
      .get("/users/list")
      .then((response) => {
        setCompanyTable(response.data.companies);
        setUsers(response.data.users);
        setCompanyForCreates(response.data.companyForCreate);
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
              Create New User
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter new username, password and company to create
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  id="userName"
                  label="User Name"
                  variant="standard"
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  id="userPassword"
                  label="Password"
                  variant="standard"
                  onChange={(e) => {
                    setError(null);
                    setPassword(e.target.value);
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
                    <MDButton color="danger" fullWidth>
                      {error}
                    </MDButton>
                  </MDBox>
                </>
              )}
            </MDBox>
          </MDBox>
        </Card>
      </Modal>
      <Modal isOpen={modalIsOpenCompany} onRequestClose={closeModalCompany} style={customStyles}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="success"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Create New Company
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter new company name to create
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  id="companyName"
                  label="Company Name"
                  variant="standard"
                  onChange={(e) => {
                    setError(null);
                    setCompanyName(e.target.value);
                  }}
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  id="companyDescription"
                  label="Description"
                  variant="standard"
                  onChange={(e) => {
                    setError(null);
                    setCompanyDescription(e.target.value);
                  }}
                  fullWidth
                />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  onClick={(e) => saveDataCompany()}
                  color="success"
                  fullWidth
                >
                  Create New Company
                </MDButton>
              </MDBox>
              {error && (
                <>
                  {" "}
                  <MDBox mt={4} mb={1}>
                    <MDTypography variant="h6" color="error" verticalAlign="middle">
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
                      <MDButton onClick={(e) => newUser()}>New User</MDButton>
                    </Grid>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "internal Id", accessor: "internalId", width: "25%" },
                      { Header: "user name2", accessor: "username", width: "30%" },
                    ],
                    rows: userTable,
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="info"
              >
                <Grid container>
                  <Grid xs={8}>
                    <MDTypography variant="h6" color="white">
                      Company Table
                    </MDTypography>
                  </Grid>
                  <Grid>
                    <Grid justifyContent="flex-end" alignItems="stretch">
                      <MDButton onClick={(e) => newCompany()}>New Company</MDButton>
                    </Grid>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "internal Id", accessor: "internalId", width: "25%" },
                      { Header: "company Name", accessor: "companyName", width: "30%" },
                    ],
                    rows: companyTable,
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
