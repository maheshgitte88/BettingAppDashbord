import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

const AllMatch = () => {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        // Fetch all matches from the backend API
        fetch('http://localhost:4000/match/getallmatchs')
            .then((response) => response.json())
            .then((data) => setMatches(data))
            .catch((error) => console.error(error));
    }, []);

    const handleMatchClick = (matchId) => {
        // Fetch the selected match and its questions from the backend API
        fetch(`http://localhost:4000/match/${matchId}`)
            .then((response) => response.json())
            .then((data) => setSelectedMatch(data))
            .catch((error) => console.error(error));
    };
    console.log(matches, 24)
    function getCurrentDateTime() {
        const now = new Date();

        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' }); // Full month name
        const year = now.getFullYear();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const dateTime = `${day} ${month} ${year} ${time}`;

        return dateTime;
    }

    const currentDateTime = getCurrentDateTime();

    return (
        <Box m="20px">
            <Header title="All Matches" subtitle={currentDateTime} />
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Teams</TableCell>
                                            <TableCell>Scheduled Time</TableCell>
                                            <TableCell>Number of Questions</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Active</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {matches.map((match) => (
                                            <TableRow key={match._id}>
                                                <TableCell>
                                                    <Link to={`/match-quations/${match._id}`} onClick={() => handleMatchClick(match._id)}>
                                                        {match.teams.join(' vs ')}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{new Date(match.scheduledTime).toLocaleString()}</TableCell>
                                                <TableCell>{match.questions.length}</TableCell>
                                                <TableCell>{match.categori}</TableCell>
                                                <TableCell>{match.isActive}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {selectedMatch && (
                            <Paper elevation={3}>
                                <Typography variant="h5" align="center" gutterBottom>
                                    {selectedMatch.teams.join(' vs ')}
                                </Typography>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Questions:
                                </Typography>
                                <ul>
                                    {selectedMatch.questions.map((question) => (
                                        <li key={question._id}>{question.question}</li>
                                    ))}
                                </ul>
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AllMatch;
