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
import Card from "@mui/material/Card";

// @mui icons
import React from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
// Authentication layout components
import { instance, cancel } from "../../../api";
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useMaterialUIController, setToken } from "context";
function Basic() {
  const [controller, dispatch] = useMaterialUIController();
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const saveData = () => {
    try {
      instance
        .post("/users/login", {
          username: userName,
          password,
        })
        .then((response) => {
          console.log(response);
          setToken(dispatch, response.data.access_token);
          navigate("/dashboard", { replace: true });
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                label="Email"
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                label="Password"
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" onClick={(e) => saveData()} color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
