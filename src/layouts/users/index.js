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
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const { dateMaster, machinesSelect, token } = controller;
  const [companyTable, setCompanyTable] = React.useState([]);
  const [userTable, setUsers] = React.useState([]);
  const [companyForCreates, setCompanyForCreates] = React.useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalIsOpenCompany, setIsOpenCompany] = React.useState(false);
  const [modalIsOpenCompanyEdit, setIsOpenCompanyEdit] = React.useState(false);
  const [modalIsOpenUserEdit, setIsOpenUserEdit] = React.useState(false);
  const [company, setCompany] = React.useState(null);
  const [companyId, setCompanyId] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [userName, setUserName] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [companyName, setCompanyName] = React.useState(null);
  const [companyDescription, setCompanyDescription] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [newData, setNewData] = React.useState(false);
  const newUser = () => {
    setIsOpen(true);
  };
  const handleEditCompany = (data) => {
    const { companyName, companyDescription, companyId } = data;
    setCompanyName(companyName);
    setCompanyId(companyId);
    setCompanyDescription(companyDescription);
    setIsOpenCompanyEdit(true);
  };
  const handleEditUser = (data) => {
    console.log(data);
    const { username, internalId } = data;
    setUserName(username);
    setUserId(internalId);
    setIsOpenUserEdit(true);
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
        .post(
          "/users/user/create",
          {
            username: userName,
            password: password,
            companyId: company.internalId,
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
        .post(
          "/users/company/create",
          {
            name: companyName,
            description: companyDescription,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
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
  const updateDataCompany = () => {
    try {
      if (!companyName) {
        throw new Error("set Username");
      }
      instance
        .put(
          `/users/company/update/${companyId}`,
          {
            name: companyName,
            description: companyDescription,
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
          setError(error.response.data.error.message);
          console.error("Error fetching data:", error.response.data.error.message);
        });
    } catch (error) {
      setError(error.message);
    }
  };
  const updateDataUser = () => {
    try {
      instance
        .put(
          `/users/user/update/${userId}`,
          {
            username: userName,
            password: password,
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
          setError(error.response.data.error.message);
          console.error("Error fetching data:", error.response.data.error.message);
        });
    } catch (error) {
      setError(error.message);
    }
  };
  function closeModal() {
    setIsOpen(false);
    setIsOpenCompanyEdit(false);
    setIsOpenUserEdit(false);
  }
  function closeModalCompany() {
    setIsOpenCompany(false);
  }
  const fetchData = () => {
    instance
      .get("/users/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCompanyTable(response.data.companies);
        setUsers(response.data.users);
        setCompanyForCreates(response.data.companyForCreate);
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
      <Modal isOpen={modalIsOpenCompanyEdit} onRequestClose={closeModal} style={customStyles}>
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
              Update Company
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter company name to update
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
                  defaultValue={companyName}
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
                  defaultValue={companyDescription}
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
                  onClick={(e) => updateDataCompany()}
                  color="success"
                  fullWidth
                >
                  Update Company
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
      <Modal isOpen={modalIsOpenUserEdit} onRequestClose={closeModal} style={customStyles}>
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
              Update User
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter username, password and company to update
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
                  defaultValue={userName}
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
              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  onClick={(e) => updateDataUser()}
                  color="info"
                  fullWidth
                >
                  Update User
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
                      {
                        Header: "Action",
                        accessor: "action",
                        Cell: (row) => (
                          <MDButton onClick={(e) => handleEditCompany(row.row.original)}>
                            {" "}
                            <Icon>edit</Icon>
                          </MDButton>
                        ),
                      },
                    ],
                    rows: companyTable,
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
                      { Header: "user name", accessor: "username", width: "30%" },
                      {
                        Header: "Action",
                        accessor: "action",
                        Cell: (row) => (
                          <MDButton onClick={(e) => handleEditUser(row.row.original)}>
                            {" "}
                            <Icon>edit</Icon>
                          </MDButton>
                        ),
                      },
                    ],
                    rows: userTable,
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
