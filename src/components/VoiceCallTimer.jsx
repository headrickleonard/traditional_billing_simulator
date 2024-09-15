import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { Phone as PhoneIcon, CallEnd as CallEndIcon } from '@mui/icons-material';

const VoiceCallTimer = ({ sender, receiver, onCallEnd, isLoading, onInsufficientBalance }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleStartCall = () => {
    // In a real scenario, you'd check the balance here
    // For now, we'll just start the call
    setIsCallActive(true);
    setDuration(0);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    onCallEnd(duration);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {sender} calling {receiver}
      </Typography>
      <Typography variant="h4" gutterBottom>
        {formatTime(duration)}
      </Typography>
      {!isCallActive ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={<PhoneIcon />}
          onClick={handleStartCall}
          disabled={isLoading}
        >
          Start Call
        </Button>
      ) : (
        <Button
          variant="contained"
          color="error"
          startIcon={<CallEndIcon />}
          onClick={handleEndCall}
          disabled={isLoading}
        >
          End Call
        </Button>
      )}
      {isLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}
    </Box>
  );
};

export default VoiceCallTimer;