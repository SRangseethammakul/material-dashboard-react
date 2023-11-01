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

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {
  const [byWeek, setByWeek] = React.useState({});
  const [byHour, setByHour] = React.useState({});
  const [byMonth, setByMonth] = React.useState({});
  const [count, setCount] = React.useState(0);
  const [sum, setSum] = React.useState(0);
  const fetchData = () => {
    instance
      .get("/dashboard")
      .then((response) => {
        setByWeek(response.data.getAmountWithDay);
        setByHour(response.data.getAmountWithHour);
        setByMonth(response.data.getAmountWithMonth);
        setCount(response.data.getAmount.count);
        setSum(response.data.getAmount.totalInvoiceAmount);
        console.log("Data from Axios:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const { sales, tasks } = reportsLineChartData;
  React.useEffect(() => {
    fetchData();
    return () => {
      cancel(); // This cancels the request when the component unmounts
    };
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="leaderboard" title="Income" count={sum} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Total used"
                count={count}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
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
