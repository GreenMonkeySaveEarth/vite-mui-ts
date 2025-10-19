import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Box, TextareaAutosize, CircularProgress } from '@mui/material';

const LiveTranscriptionFeedSimple: React.FC = () => {
	const [finalCaptions, setFinalCaptions] = useState<string[]>([]);
	const [partialCaption, setPartialCaption] = useState<string>('');
	const [isRecording, setIsRecording] = useState(true);
	const [isConnected, setIsConnected] = useState(false);
	const [latency, setLatency] = useState<number | null>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const latencyTimer = useRef<number | null>(null);

	useEffect(() => {
		const connectWebSocket = () => {
			const socket = new WebSocket('wss://api.abridge.ai/live');
			socketRef.current = socket;

			socket.onopen = () => {
				console.log('WebSocket connection established.');
				setIsConnected(true);
			};

			socket.onmessage = (event) => {
				const data = JSON.parse(event.data);

				if (data.isFinal) {
					// Final caption - directly update state without throttling
					setFinalCaptions((prev) => [...prev, data.text]);
				} else {
					// Partial caption
					setPartialCaption(data.text);
				}

				setIsRecording(false);

				// Measure latency
				if (latencyTimer.current) {
					setLatency(Date.now() - latencyTimer.current);
					latencyTimer.current = null;
				}
			};

			socket.onerror = (error) => {
				console.error('WebSocket error:', error);
			};

			socket.onclose = () => {
				console.log('WebSocket connection closed. Reconnecting...');
				setIsConnected(false);
				setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
			};
		};

		connectWebSocket();

		return () => {
			// Cleanup function to close WebSocket when component unmounts
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			if (socketRef.current?.readyState === WebSocket.OPEN) {
				latencyTimer.current = Date.now();
				socketRef.current.send('ping'); // Send ping to measure latency
			}
		}, 5000); // Ping every 5 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<Container maxWidth="md" sx={{ my: 4 }}>
			<Typography variant="h4" gutterBottom>
				Live Transcription Feed
			</Typography>
			<Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
				<Typography variant="body1" color="text.secondary">
					{isRecording ? 'Recording…' : 'Live transcription below:'}
				</Typography>
				{!isConnected && <Typography color="error">Disconnected</Typography>}
				{latency !== null && (
					<Typography variant="body2" color="text.secondary">
						Latency: {latency}ms
					</Typography>
				)}
				{isRecording && <CircularProgress size={20} />}
			</Box>
			<TextareaAutosize
				minRows={10}
				style={{ width: '100%', fontSize: '1rem', padding: '8px' }}
				value={`${finalCaptions.join(' ')} ${partialCaption}`}
				placeholder="Live transcription will appear here..."
				readOnly
			/>
		</Container>
	);
};

export default LiveTranscriptionFeedSimple;