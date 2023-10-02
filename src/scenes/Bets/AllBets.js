import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { Box } from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const AllBets = () => {
  const [bets, setBets] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetch("http://localhost:4000/bet/allbets")
      .then((response) => response.json())
      .then((data) => setBets(data))
      .catch((error) => console.error(error));
  }, []);

  const columns = [
    { field: "_id", headerName: "Bet ID", flex: 1 },
    {
      field: "matchId",
      headerName: "Match",
      cellClassName: "name-column--cell",
      flex: 1,
      valueGetter: (params) => params.row.matchId?.teams[0] || "",
    },
    { field: "question", headerName: "Question", flex: 1.5 },
    { field: "option", headerName: "Option", flex: 1 },
    { field: "betAmount", headerName: "Betted", flex: 1 },
    { field: "winningAmount", headerName: "Reward if Won", flex: 1 },
    {
      field: "userId",
      headerName: "User",
      flex: 1,
      valueGetter: (params) => params.row.userId?.username || "",
    },
    { field: "createdAt", headerName: "Date & Time", flex: 1 },
    { field: "Result", headerName: "Winner or Loser", flex: 1 },
    {
      field: "questionId",
      headerName: "Correct Option",
      flex: 1,
      valueGetter: (params) => params.row.questionId?.correctOption || "",
    },
  ];

  const getRowId = (row) => row._id;

  return (
    <Box m="20px">
      <Header
        title="All Bets"
        subtitle="List of All Bets"
      />
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
        <div style={{ height: 980, width: "100%" }}>
          <DataGrid
            rows={bets}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
          />
        </div>
      </Box>
    </Box>
  );
};

export default AllBets;
