import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import { Card, Box, CardContent, Button, Typography, IconButton, Grid, Container, Stack, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import withAuth from '../utils/withAuth';

function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history || []);
            } catch (err) {
                console.error("Failed to load history:", err);
            }
        }

        fetchHistory();
    }, [])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${day}/${month}/${year} at ${hours}:${minutes}`;
    }

    return (
        <Box sx={{ minHeight: '90vh', bgcolor: '#F8FAFC', py: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">
                <Stack spacing={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            onClick={() => navigate("/home")}
                            sx={{ 
                                bgcolor: '#fff', 
                                border: '1px solid rgba(15,23,42,0.08)',
                                boxShadow: '0 4px 12px rgba(15,23,42,0.04)',
                                '&:hover': { bgcolor: '#EFF2FF' }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography sx={{ fontWeight: 900, fontSize: { xs: 28, md: 36 } }}>
                            Meeting History
                        </Typography>
                    </Box>

                    {meetings.length !== 0 ? (
                        <Grid container spacing={3}>
                            {meetings.map((meeting, index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={meeting._id || index}>
                                    <Card 
                                        variant="outlined" 
                                        sx={{ 
                                            borderRadius: '16px', 
                                            bgcolor: '#fff', 
                                            border: '1px solid rgba(15,23,42,0.06)',
                                            boxShadow: '0 10px 30px rgba(15,23,42,0.02)',
                                            transition: 'transform 180ms ease, box-shadow 180ms ease',
                                            '&:hover': { 
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 16px 40px rgba(15,23,42,0.08)',
                                                borderColor: 'rgba(109,74,255,0.2)'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Stack spacing={2.5}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(109,74,255,0.08)', display: 'grid', placeItems: 'center', color: '#6D4AFF' }}>
                                                        <VpnKeyIcon sx={{ fontSize: 18 }} />
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ color: 'rgba(15,23,42,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                            Meeting Code
                                                        </Typography>
                                                        <Typography sx={{ fontWeight: 800, color: '#0F172A', fontSize: 16 }}>
                                                            {meeting.meetingCode}
                                                        </Typography>
                                                    </Box>
                                                </Box>
 
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(6,182,212,0.08)', display: 'grid', placeItems: 'center', color: '#06B6D4' }}>
                                                        <CalendarTodayIcon sx={{ fontSize: 18 }} />
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ color: 'rgba(15,23,42,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                            Joined On
                                                        </Typography>
                                                        <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 14 }}>
                                                            {formatDate(meeting.date)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
 
                                                <Button 
                                                    onClick={() => navigate(`/${meeting.meetingCode}`)}
                                                    variant="contained" 
                                                    fullWidth
                                                    startIcon={<VideoCallIcon />}
                                                    sx={{ 
                                                        borderRadius: '10px', 
                                                        py: 1.2, 
                                                        minHeight: 48,
                                                        fontWeight: 700,
                                                        background: '#6D4AFF',
                                                        '&:hover': { background: '#5B3FE6' }
                                                    }}
                                                >
                                                    Rejoin Call
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Paper 
                            sx={{ 
                                p: 6, 
                                textAlign: 'center', 
                                border: '1px dashed rgba(15,23,42,0.12)', 
                                borderRadius: '16px',
                                bgcolor: 'rgba(255,255,255,0.5)'
                            }}
                        >
                            <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 16 }}>
                                No meeting history found. Try joining or hosting a meeting!
                            </Typography>
                            <Button 
                                onClick={() => navigate("/home")}
                                variant="outlined" 
                                sx={{ mt: 3, borderRadius: '10px', px: 4, py: 1.2, minHeight: 48, borderColor: 'rgba(15,23,42,0.12)', color: '#0F172A', width: { xs: '100%', sm: 'auto' } }}
                            >
                                Back to Dashboard
                            </Button>
                        </Paper>
                    )}
                </Stack>
            </Container>
        </Box>
    )
}

export default withAuth(History);