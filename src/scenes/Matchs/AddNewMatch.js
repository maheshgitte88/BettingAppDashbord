import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Header from "../../components/Header";
import { toast } from "react-toastify";

const AddNewMatch = () => {
  const [sport, setSport] = useState("");
  const [series, setSeries] = useState("");
  const [league, setLeague] = useState("");
  const [categories, setCategories] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [leagueData, setLeagueData] = useState([]);
  const [teams, setTeams] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the list of sports from your API
    axios
      .get("http://localhost:4000/sport/all-sports")
      .then((response) => {
        setCategories(response.data.sports);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (sport) {
      const id = sport;
      axios
        .get(`http://localhost:4000/sport/leagues-series/${id}`)
        .then((response) => {
          setSeriesData(response.data.series);
          setLeagueData(response.data.leagues);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [sport]);

  const handleInputChange = (event) => {
    if (event.target.name === "teams") {
      setTeams(event.target.value);
    } else if (event.target.name === "scheduledTime") {
      setScheduledTime(event.target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Create your matchData object
    const matchData = {
      teams: teams.split(","),
      scheduledTime: scheduledTime,
      category: sport,
    };
  
    // Include either series or league based on user selection
    if (series) {
      matchData.series = series;
    } else if (league) {
      matchData.league = league;
    }
  
    axios
      .post("http://localhost:4000/match/addmatch", matchData)
      .then((response) => {
        setMessage(response.data.message);
        toast.success(response.data.message);
        setTeams("");
        setScheduledTime("");
        setSport("");
        setSeries("");
        setLeague("");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Failed to add the match. Please try again.");
      });
  };
  
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // Create your matchData object and post it to your API
  //   const matchData = {
  //     teams: teams.split(","),
  //     scheduledTime: scheduledTime,
  //     category: sport,
  //     series: series, // Include selected series
  //     league: league, // Include selected league
  //   };

  //   axios
  //     .post("http://localhost:4000/match/addmatch", matchData)
  //     .then((response) => {
  //       setMessage(response.data.message);
  //       toast.success(response.data.message);
  //       setTeams("");
  //       setScheduledTime("");
  //       setSport("");
  //       setSeries("");
  //       setLeague("");
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setMessage("Failed to add the match. Please try again.");
  //     });
  // };
  console.log(seriesData, leagueData, categories, 90);
  console.log(sport, series, league, 91);
  return (
    <Box m="20px">
      <Header
        title="Add New Match"
        subtitle="Add New Match To Betting Application"
      />
      <Container maxWidth="md">
        <Box mt={4}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Teams"
                name="teams"
                value={teams}
                onChange={handleInputChange}
                required
                variant="outlined"
                helperText="Separate team names with commas"
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="sport-select">Sport</InputLabel>
                <Select
                  label="Sport"
                  id="sport-select"
                  value={sport}
                  onChange={(e) => {
                    setSport(e.target.value);
                    setSeries(""); // Reset selected series when changing sport
                    setLeague(""); // Reset selected league when changing sport
                  }}
                  required
                >
                  <MenuItem value="" disabled>
                    Select a sport
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {sport && (
              <>
                <Box mb={2}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="series-select">Series</InputLabel>
                    <Select
                      label="Series"
                      id="series-select"
                      value={series}
                      onChange={(e) => setSeries(e.target.value)}
                    >
                      <MenuItem value="" disabled>
                        Select a series
                      </MenuItem>
                      {seriesData.map((seriesItem) => (
                        <MenuItem key={seriesItem._id} value={seriesItem._id}>
                          {seriesItem.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box mb={2}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="league-select">League</InputLabel>
                    <Select
                      label="League"
                      id="league-select"
                      value={league}
                      onChange={(e) => setLeague(e.target.value)}
                    >
                      <MenuItem value="" disabled>
                        Select a league
                      </MenuItem>
                      {leagueData.map((leagueItem) => (
                        <MenuItem key={leagueItem._id} value={leagueItem._id}>
                          {leagueItem.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}
            <Box mb={2}>
              <TextField
                fullWidth
                label="Scheduled Time"
                type="datetime-local"
                name="scheduledTime"
                value={scheduledTime}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Box>
            <Button type="submit" variant="contained" color="primary">
              Add Match
            </Button>
          </form>
          {message && (
            <Typography variant="body1" color="textSecondary" mt={2}>
              {message}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default AddNewMatch;
