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
import Grid from "@mui/material/Grid";
import { instance, cancel } from "../../api";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Select from "@mui/material/Select";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { useMaterialUIController, setMachines } from "context";

// Dashboard components
import DataTable from "examples/Tables/DataTable";

function Dashboard() {
  const [controller, dispatch] = useMaterialUIController();
  const { dateMaster, machinesSelect } = controller;
  const [byWeek, setByWeek] = React.useState({});
  const [byHour, setByHour] = React.useState({});
  const [byMonth, setByMonth] = React.useState({});
  const [byDay, setByDay] = React.useState({});
  const [masterTable, setMasterTable] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [sum, setSum] = React.useState(0);
  const fetchData = () => {
    instance
      .get("/dashboard", {
        params: { startDate: dateMaster.dateStart, endDate: dateMaster.dateEnd, machinesSelect },
      })
      .then((response) => {
        setMachines(dispatch, response.data.machines);
        setByWeek(response.data.getAmountWithDay);
        setByHour(response.data.getAmountWithHour);
        setByMonth(response.data.getAmountWithMonth);
        setCount(response.data.getAmount.count);
        setSum(response.data.getAmount);
        setByDay(response.data.sumPerDay);
        setMasterTable(response.data.masterTable.dataRawTables);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchDataWithMachine = () => {
    instance
      .get("/dashboard", {
        params: { startDate: dateMaster.dateStart, endDate: dateMaster.dateEnd, machinesSelect },
      })
      .then((response) => {
        setByWeek(response.data.getAmountWithDay);
        setByHour(response.data.getAmountWithHour);
        setByMonth(response.data.getAmountWithMonth);
        setCount(response.data.getAmount.count);
        setSum(response.data.getAmount);
        setByDay(response.data.sumPerDay);
        setMasterTable(response.data.masterTable.dataRawTables);
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
  }, [dateMaster]);
  React.useEffect(() => {
    fetchDataWithMachine();
    return () => {
      cancel(); // This cancels the request when the component unmounts
    };
  }, [machinesSelect]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Income"
                count={sum.totalInvoiceAmount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Total Print"
                count={count}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="assistant_photo"
                title="Fee"
                count={sum.totalInvoiceAmountFee}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="attach_money"
                title="Net Income"
                count={sum.totalInvoiceAmountNet}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <DataTable
                table={{
                  columns: [
                    { Header: "Location", accessor: "location", width: "25%" },
                    { Header: "Total Amount", accessor: "totalAmount", width: "30%" },
                    { Header: "Printer Status", accessor: "printerStatus", width: "30%" },
                  ],
                  rows: masterTable,
                }}
              />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Show By Hour"
                  description="Show By Hour"
                  date="updated 4 min ago"
                  chart={byHour}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="primary"
                  title="Show By Day"
                  description="Show By Day"
                  date="just updated"
                  chart={byDay}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Show By Week"
                  description="Show By Week"
                  date="campaign sent 2 days ago"
                  chart={byWeek}
                />
              </MDBox>
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Show By Month"
                  description="Show By Month"
                  date="just updated"
                  chart={byMonth}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
