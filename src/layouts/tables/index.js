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
import React from "react";
import { useMaterialUIController } from "context";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import { instance, cancel } from "../../api";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

function Tables() {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const { dateMaster, machinesSelect, token } = controller;
  const [masterTable, setMasterTable] = React.useState([]);
  const [masterGetAmount, setMasterGetAmount] = React.useState({});
  const fetchData = () => {
    instance
      .get("/transaction/getDeposit", {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate: dateMaster.dateStart, endDate: dateMaster.dateEnd, machinesSelect },
      })
      .then((response) => {
        setMasterTable(response.data.results);
        setMasterGetAmount(response.data.getAmount);
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
  }, [machinesSelect, dateMaster]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="attach_money"
                title="Income"
                count={masterGetAmount.totalInvoiceAmount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="credit_card"
                title="Fee"
                count={masterGetAmount.totalInvoiceAmountFee}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="savings"
                title="Net Income"
                count={masterGetAmount.totalInvoiceAmountNet}
              />
            </MDBox>
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
                <MDTypography variant="h6" color="white">
                  Deposit Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "createdDate", accessor: "createdDate", width: "25%" },
                      { Header: "From", accessor: "machineLocation", width: "30%" },
                      { Header: "TRANSACTION ID", accessor: "refId", width: "30%" },
                      { Header: "STATUS", accessor: "status", width: "30%" },
                      { Header: "AMOUNT", accessor: "amount", width: "30%" },
                    ],
                    rows: masterTable,
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
