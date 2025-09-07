import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextareaAutosize } from '@mui/material';

const LiveTranscriptionFeed: React.FC = () => {
	const [transcription, setTranscription] = useState<string[]>([]);
	const [isRecording, setIsRecording] = useState(true);

	useEffect(() => {
		const socket = new WebSocket('wss://api.abridge.ai/live');

		socket.onopen = () => {
			console.log('WebSocket connection established.');
		};

		socket.onmessage = (event) => {
			const data = event.data;
			setTranscription((prev) => [...prev, data]);
			setIsRecording(false);
		};

		socket.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		socket.onclose = () => {
			console.log('WebSocket connection closed.');
		};

		return () => {
			socket.close();
		};
	}, []);

	return (
		<Container maxWidth="md" sx={{ my: 4 }}>
			<Typography variant="h4" gutterBottom>
				Live Transcription Feed
			</Typography>
			<Box sx={{ mb: 2 }}>
				<Typography variant="body1" color="text.secondary">
					{isRecording ? 'Recording…' : 'Live transcription below:'}
				</Typography>
			</Box>
			<TextareaAutosize
				minRows={10}
				style={{ width: '100%', fontSize: '1rem', padding: '8px' }}
				value={transcription}
				placeholder="Live transcription will appear here..."
				readOnly
			/>
		</Container>
	);
};

export default LiveTranscriptionFeed;
