import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import {
  Button,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";
import AddMatchQuestionForm from "./AddMatchQuestionForm";
import { toast } from 'react-toastify';

const socket = io.connect("http://localhost:4000");

export default function MatchQuations({ matchId }) {
  const [match, setMatch] = useState([]);
  const [data, setData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  const { id } = useParams();

  useEffect(() => {
    socket.on("receive_data", (data) => {
      setData(data);
    });

    const fetchMatch = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/match/${id}`);
        setMatch([response.data]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMatch();
    updateCorrectOption();
  }, [id, data]);

  const updateCorrectOption = async (questionId, option) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/question/${questionId}`,
        {
          correctOption: option,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updateCorrectOptionStatus = async (questionId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/bet/decide-winning-bets/${questionId}`,
        {
          status: "Correct",
        }
      );
      // Handle success or display a success message
    } catch (error) {
      console.error(error);
      // Handle error or display an error message
    }
  };

  const handleOptionChange = (questionId, option) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionId]: option,
    }));
  };
  const handleDeleteQuestion = async (questionId) => {
    try {
        console.log(questionId , 87)
      const response = await axios.delete(
        `http://localhost:4000/question/${questionId}`
      );
      const res=response.data.message
      toast.success(`${res}`);
    } catch (error) {
        toast.error('Error deleting question');
    }
  };
  console.log(match, 65);

  return (
    <Box m="20px">
      {match.map((match) => (
        <article key={match._id}>
          <Header
            title={match.teams.join(" vs ")}
            subtitle={new Date(match.scheduledTime).toLocaleString()}
          />
          <div className="d-flex p-2 ">
            <Button
              variant="contained"
              color="primary"
              //   className="btn btn-primary"
              style={{ color: "red", backgroundColor: "yellow" }}
              onClick={() => updateCorrectOptionStatus(match._id)}
            >
              Set Correct
            </Button>

            {/* <AddMatchQuestionForm matchId={match._id} /> */}
          </div>

          <AddMatchQuestionForm matchId={match._id} />

          {match.questions.length > 0 && (
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Question</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Time & Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Choice Option</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Active</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Winning Ratio</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Options</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Set Correct</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status/Correct Option</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {match.questions.map((question) => (
                    <TableRow key={question._id}>
                      <TableCell>{question.question}</TableCell>
                      <TableCell>{question.createdAt}</TableCell>
                      <TableCell>
                        result
                        <Select
                          value={selectedOptions[question._id] || ""}
                          onChange={(event) =>
                            handleOptionChange(question._id, event.target.value)
                          }
                        >
                          {question.options.map((option) => (
                            <MenuItem key={option} value={option}
                            onClick={() => {
                              // updateCorrectOptionStatus(question._id);
                              updateCorrectOption(question._id, option);
                            }}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>{question.isActive ? "Yes" : "No"}</TableCell>
                      <TableCell>{question.winningRatio.join(", ")}</TableCell>
                      <TableCell>{question.options.join(", ")}</TableCell>
                      <TableCell><Button   variant="contained"
                          color="secondary" onClick={() => updateCorrectOptionStatus(question._id)} >Set Result</Button></TableCell>
                      <TableCell>{question.correctOption}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteQuestion(question._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </article>
      ))}
    </Box>
  );
}
