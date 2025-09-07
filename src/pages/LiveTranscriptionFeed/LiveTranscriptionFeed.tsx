import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Container, Typography, Box, TextareaAutosize, CircularProgress } from '@mui/material';

const LiveTranscriptionFeed: React.FC = () => {
	const [finalCaptions, setFinalCaptions] = useState<string[]>([]);
	const [partialCaption, setPartialCaption] = useState<string>('');
	const [isRecording, setIsRecording] = useState(true);
	const [isConnected, setIsConnected] = useState(false);
	const [latency, setLatency] = useState<number | null>(null);
	const bufferRef = useRef<string[]>([]);
	const socketRef = useRef<WebSocket | null>(null);
	const latencyTimer = useRef<number | null>(null);

	// Throttle rendering updates
	const throttledUpdate = useMemo(() => {
		let timeout: ReturnType<typeof setTimeout>;
		return () => {
			if (timeout) return;
			timeout = setTimeout(() => {
				setFinalCaptions((prev) => [...prev, ...bufferRef.current]);
				bufferRef.current = [];
				clearTimeout(timeout);
			}, 100); // Update every 100ms
		};
	}, []);

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
					// Final caption
					bufferRef.current.push(data.text);
					throttledUpdate();
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
			// This useEffect cleanup function ensures that the WebSocket is 
			// properly closed when the component unmounts, 
			// preventing memory leaks
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, [throttledUpdate]);

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

export default LiveTranscriptionFeed;
