import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { UserAuthContext } from '../context/UserAuthContext';
import { AdminAuthContext } from '../context/AdminAuthContext';

const PastContestPhotos = ({ contestTitle, onBack }) => {
    const [photos, setPhotos] = useState([]);
    const [winner, setWinner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [voteCounts, setVoteCounts] = useState({});

    const { user } = useContext(UserAuthContext);
    const { admin } = useContext(AdminAuthContext);

    const loggedInEmail = user?.email || admin?.email;
    console.log('Logged in email:', loggedInEmail);


    useEffect(() => {
        const fetchVotesAndPhotos = async () => {
            try {
                // Fetch votes related to the contest
                const votesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/votes/fetch`, {
                    headers: {
                        'x-api-key': process.env.REACT_APP_API_KEY,
                    },
                    withCredentials: true,
                });
                const votes = votesResponse.data.filter(vote => vote.contest_title === contestTitle);

                let winnerPhoto = null;
                //const counts = {};

                if (votes.length > 0) {
                    // Count the number of votes each photo received
                    const voteCounts = votes.reduce((acc, vote) => {
                        acc[vote.photo_url] = (acc[vote.photo_url] || 0) + 1;
                        return acc;
                    }, {});
                    setVoteCounts(voteCounts);

                    // Fetch all photos for the contest
                    const photosResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/photos/fetch`, {
                        headers: {
                            'x-api-key': process.env.REACT_APP_API_KEY,
                        },
                        withCredentials: true,
                    });
                    const filteredPhotos = photosResponse.data.filter(photo => photo.contest_title === contestTitle);
                    setPhotos(filteredPhotos);

                    // Find the photo with the highest votes
                    const winnerPhotoUrl = Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b);
                    // Find the winner's details
                    winnerPhoto = filteredPhotos.find(photo => photo.photo_url === winnerPhotoUrl);
                    fetch(`${process.env.REACT_APP_API_URL}/api/contests/end`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': process.env.REACT_APP_API_KEY
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            title: contestTitle,
                            winnerPhotoUrl: winnerPhotoUrl,
                            winnerName: winnerPhoto?.uploaded_by || "Unknown"
                        })
                    });
    
                    } else {
                    // Fetch all photos for the contest if no votes
                    const photosResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/photos/fetch`, {
                        headers: {
                            'x-api-key': process.env.REACT_APP_API_KEY,
                        },
                        withCredentials: true,
                    });
                    const filteredPhotos = photosResponse.data.filter(photo => photo.contest_title === contestTitle);
                    setPhotos(filteredPhotos);
                }

                setWinner(winnerPhoto);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchVotesAndPhotos();
    }, [contestTitle]);

    if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><Spinner animation="border" role="status"><span className="sr-only"></span></Spinner></div>;
    if (error) return <div>Error loading photos: {error.message}</div>;

    return (
        <Container>
            <Button variant="secondary" onClick={onBack}>Back to Contests</Button>
            {photos.length === 0 ? (
                <div className="my-4">
                    <h2>There were no participants in this contest</h2>
                </div>
            ) : (
                <>
                    {winner && (
                        <div className="my-4">
                            <h2>Winner: {winner.uploaded_by}</h2>
                            <img src={winner.photo_url} alt="Winner" className="img-fluid" />
                        </div>
                    )}
                    <Row>
                        {photos.map(photo => (
                            <Col md={4} key={photo._id} className="mb-4">
                                <Card>
                                    <Card.Img variant="top" src={photo.photo_url} />
                                    <Card.Body>
                                        <Card.Text>Uploaded by: {photo.uploaded_by}</Card.Text>
                                        <Card.Text>Votes: {voteCounts[photo.photo_url] || 0}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
};

export default PastContestPhotos;
