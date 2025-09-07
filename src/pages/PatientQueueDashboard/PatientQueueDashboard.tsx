import React, { useMemo, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box } from '@mui/material';
import { patientsSeed } from './mockPatients';
import { Patient } from './types';

const PatientQueueDashboard: React.FC = () => {
	const [patients, setPatients] = useState<Patient[]>(patientsSeed);
	const [sortAscending, setSortAscending] = useState(true);

	const sortedPatients = useMemo(() => {
		return [...patients].sort((a, b) =>
			sortAscending ? a.priority - b.priority : b.priority - a.priority
		);
	}, [patients, sortAscending]);

	const toggleSortOrder = () => {
		setSortAscending(!sortAscending);
	};

	return (
		<Container maxWidth="md" sx={{ my: 4 }}>
			<Typography variant="h4" gutterBottom>
				Patient Queue Dashboard
			</Typography>
			<Box sx={{ mb: 2 }}>
				<Button variant="contained" onClick={toggleSortOrder}>
					Sort by Priority ({sortAscending ? 'Ascending' : 'Descending'})
				</Button>
			</Box>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Priority</TableCell>
						<TableCell>Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedPatients.map((patient) => (
						<TableRow
							key={patient.id}
							sx={{
								backgroundColor:
									patient.status === 'in-progress' ? 'lightyellow' : 'inherit',
							}}
						>
							<TableCell>{patient.name}</TableCell>
							<TableCell>{patient.priority}</TableCell>
							<TableCell>{patient.status}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Container>
	);
};

export default PatientQueueDashboard;
