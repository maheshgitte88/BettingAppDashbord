import { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
const socket = io.connect("http://localhost:4000");

const AddMatchQuestionForm = ({ matchId }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [ratios, setRatios] = useState([]);
  const [data, setData] = useState([]);

  const handleOptionChange = (e, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = e.target.value;
    setOptions(updatedOptions);
  };

  const handleRatioChange = (e, index) => {
    const updatedRatios = [...ratios];
    updatedRatios[index] = parseFloat(e.target.value);
    setRatios(updatedRatios);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
    setRatios([...ratios, 1]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    const updatedRatios = ratios.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    setRatios(updatedRatios);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuestion = {
      matchId,
      question,
      options,
      ratios
    };
    try {
      socket.emit("send_data", { newQuestion });
      const response = await axios.post(
        `http://localhost:4000/question/add/${matchId}`,
        newQuestion
      );
      toast.success("Question Added successfully");
    } catch (error) {
      toast.error("Error Adding Question");
    }
  };

  useEffect(() => {
    socket.on("receive_data", (data) => {
      setData(data);
    });
  }, [data]);

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add a New Question
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Question"
              variant="outlined"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Options:</Typography>
            {options.map((option, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  variant="outlined"
                  value={option}
                  onChange={(e) => handleOptionChange(e, index)}
                />
                <TextField
                  type="number"
                  label="Ratio"
                  variant="outlined"
                  value={ratios[index]}
                  onChange={(e) => handleRatioChange(e, index)}
                />
                <IconButton
                  color="secondary"
                  onClick={() => handleRemoveOption(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddOption}
            >
              Add Option
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
export default AddMatchQuestionForm;
