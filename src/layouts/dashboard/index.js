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
import Icon from "@mui/material/Icon";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useMaterialUIController, setMachines } from "context";
import Modal from "react-modal";
// Dashboard components
import DataTable from "examples/Tables/DataTable";
import axios from "axios";

function Dashboard() {
  const [controller, dispatch] = useMaterialUIController();
  const { dateMaster, machinesSelect, token } = controller;
  const [location, setLocation] = React.useState({});
  const [byWeek, setByWeek] = React.useState({});
  const [byHour, setByHour] = React.useState({});
  const [byMonth, setByMonth] = React.useState({});
  const [byDay, setByDay] = React.useState({});
  const [masterTable, setMasterTable] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [sum, setSum] = React.useState(0);
  const [modalIsOpen, setIsOpen] = React.useState(false);
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
  const saveData = (data) => {
    instance
      .put(`/machine/${data}`, { printerStatus: document.getElementById("printerStatus").value })
      .then(() => {
        setIsOpen(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsOpen(false);
      });
  };
  const handleEdit = (data) => {
    setLocation(data);
    openModal();
  };
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
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
  React.useEffect(() => {
    fetchDataWithMachine();
    return () => {
      cancel(); // This cancels the request when the component unmounts
    };
  }, [modalIsOpen]);
  return (
    <DashboardLayout>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <MDTypography variant="h3" mb={3} color="black">
          {location.location}
        </MDTypography>
        <MDInput
          mb={3}
          label="Type here..."
          id="printerStatus"
          defaultValue={location.printerStatus}
          type="number"
        />
        <MDButton onClick={(e) => saveData(location.id)}>Save</MDButton>
      </Modal>
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
