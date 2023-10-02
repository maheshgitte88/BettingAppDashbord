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
  const [leagueData, setleagueData] = useState([]);
  const [seriesData, setseriesData] = useState([]);
  const [teams, setTeams] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/sport/leagues-series`)
      .then((response) => {
        setleagueData(response.data.leagues);
        setseriesData(response.data.series);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const extractedCategories = [];

    leagueData.forEach((league) => {
      extractedCategories.push({ id: league._id, name: league.name });
    });
    seriesData.forEach((series) => {
      extractedCategories.push({ id: series._id, name: series.name });
    });

    setCategories(extractedCategories);
  }, [leagueData, seriesData ]);

  const handleInputChange = (event) => {
    if (event.target.name === "teams") {
      setTeams(event.target.value);
    } else if (event.target.name === "scheduledTime") {
      setScheduledTime(event.target.value);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const matchData = {
      teams: teams.split(","),
      scheduledTime: scheduledTime,
      category: selectedCategory,
    };

    axios
      .post("http://localhost:4000/match/addmatch", matchData)
      .then((response) => {
        setMessage(response.data.message);
        toast.success(response.data.message);
        setTeams("");
        setScheduledTime("");
        setSelectedCategory("");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Failed to add the match. Please try again.");
      });
  };

  console.log(seriesData , leagueData , 77);

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
                <InputLabel htmlFor="category-select">Category</InputLabel>
                <Select
                  label="Category"
                  id="category-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required
                >
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name} ({category.type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
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
