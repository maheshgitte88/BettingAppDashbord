import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Box, useTheme } from "@mui/material";
import { toast } from "react-toastify";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    fetch("http://localhost:4000/user/all")
      .then((response) => response.json())
      .then((data) => {
        const usersWithId = data.map((user, index) => ({
          ...user,
          id: index + 1,
        }));
        setUsers(usersWithId);
      })
      .catch((error) => console.error(error));
  }, []);

  const columns = [
    { field: "fname", headerName: "First Name", flex: 1 },
    { field: "lname", headerName: "Last Name", flex: 1 },
    { field: "mobileNo", headerName: "Mobile Number", flex: 1 },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "depositWallet", headerName: "Deposit Wallet", flex: 1 },
    { field: "winningWallet", headerName: "Winning Wallet", flex: 1 },
    { field: "bonusWallet", headerName: "Bonus Wallet", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
  ];

  function getCurrentDateTime() {
    const now = new Date();

    const day = now.getDate();
    const month = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
    const dateTime = `${day} ${month} ${year} ${time}`;

    return dateTime;
  }

  const currentDateTime = getCurrentDateTime();
  return (
    <Box m="20px">
      <Header title="All Users" subtitle={`Upto Date : ${currentDateTime}`} />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <div style={{ height: 800, width: "100%" }}>
          <DataGrid
            rows={users}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
          />
        </div>
      </Box>
    </Box>
  );
};

export default AllUsers;
