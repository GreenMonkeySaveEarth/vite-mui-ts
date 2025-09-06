import React, { useEffect, useState, useMemo, memo } from 'react';
import { Container, Typography, CircularProgress, List, ListItem, ListItemText, Button, Stack, Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { mockNotes } from '../mock/mockNotes';

export interface ClinicalNote {
	id: string;
	patientName: string;
	noteText: string;
	createdAt: string;
}

const ClinicalNotesPage: React.FC = () => {
	const PAGE_SIZE = 10;
	const [page, setPage] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [notes, setNotes] = useState<ClinicalNote[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchNotes = async () => {
			setLoading(true);
			setError(null);
			try {
				// mock the api return data
				const response = await fetch('/api/notes');
				if (!response.ok) {
					throw new Error('Failed to fetch notes');
				}
				// const data = await response.json();
				const data = mockNotes;
				setNotes(data);
			} catch (err: any) {
				setError(err.message || 'Unknown error');
			} finally {
				setLoading(false);
			}
		};
		fetchNotes();
	}, []);
	// Format date helper
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
		});
	};

	// Memoize filtered and paginated notes
	const filteredAndPaginatedNotes = useMemo(() => {
		// Filter notes by patient name
		const filtered = searchQuery.trim() === ''
			? notes
			: notes.filter(note =>
				note.patientName.toLowerCase().includes(searchQuery.toLowerCase())
			);

		// Reset to first page when search query changes
		if (page !== 0 && filtered.length <= page * PAGE_SIZE) {
			setPage(0);
		}

		// Paginate the filtered results
		const start = page * PAGE_SIZE;
		return {
			notes: filtered.slice(start, start + PAGE_SIZE),
			totalCount: filtered.length
		};
	}, [notes, page, searchQuery]);

	// Memoized ListItem component
	const MemoizedNoteItem = memo(({ note }: { note: ClinicalNote }) => (
		<ListItem
			divider
			component="article"
			aria-labelledby={`patient-name-${note.id}`}
			tabIndex={0}
		>
			<ListItemText
				id={`patient-name-${note.id}`}
				primary={`${note.patientName} (ID: ${note.id})`}
				primaryTypographyProps={{ component: "h3" }}
				secondary={
					<>
						<span id={`note-text-${note.id}`}>{note.noteText}</span>
						<br />
						<Typography
							variant="caption"
							color="text.secondary"
							component="time"
							dateTime={note.createdAt}
							aria-label={`Created on ${formatDate(note.createdAt)}`}
						>
							{formatDate(note.createdAt)}
						</Typography>
					</>
				}
				aria-describedby={`note-text-${note.id}`}
			/>
		</ListItem>
	));

	return (
		<Container maxWidth="md" sx={{ my: 4 }} component="main">
			<Typography variant="h1" gutterBottom fontSize="2.125rem" component="h1" id="page-title">
				Clinical Notes
			</Typography>
			{loading ? (
				<Box role="status" aria-live="assertive" aria-label="Loading clinical notes" display="flex" justifyContent="center">
					<CircularProgress aria-label="Loading" />
				</Box>
			) : error ? (
				<Typography color="error" role="alert" aria-live="assertive">{error}</Typography>
			) : (
				<>
					<Box sx={{ mb: 3 }} role="search">
						<TextField
							fullWidth
							variant="outlined"
							id="patient-name-search"
							label="Search by patient name"
							placeholder="Search by patient name"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setPage(0); // Reset to first page on new search
							}}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon aria-hidden="true" />
									</InputAdornment>
								),
							}}
							aria-label="Search by patient name"
							InputLabelProps={{
								shrink: true,
							}}
						/>
					</Box>
					<Box component="section" aria-label="Clinical notes list">
						<List
							aria-label="Clinical notes"
							aria-live="polite"
							aria-busy={loading}
						>
							{filteredAndPaginatedNotes.notes.length > 0 ? (
								filteredAndPaginatedNotes.notes.map((note) => (
									<MemoizedNoteItem key={note.id} note={note} />
								))
							) : (
								<ListItem>
									<ListItemText
										primary="No matching notes found"
										aria-live="assertive"
									/>
								</ListItem>
							)}
						</List>
					</Box>
					<Stack
						direction="row"
						spacing={2}
						justifyContent="center"
						sx={{ mt: 2 }}
						component="nav"
						aria-label="Pagination navigation"
					>
						<Button
							variant="contained"
							onClick={() => setPage(p => Math.max(p - 1, 0))}
							disabled={page === 0}
							aria-label="Go to previous page"
							aria-disabled={page === 0}
						>
							Previous
						</Button>
						<Typography
							variant="body2"
							sx={{ alignSelf: 'center' }}
							role="status"
							aria-live="polite"
							id="pagination-status"
						>
							Page {page + 1} of {Math.ceil(filteredAndPaginatedNotes.totalCount / PAGE_SIZE)}
						</Typography>
						<Button
							variant="contained"
							onClick={() => setPage(p => (p + 1 < Math.ceil(filteredAndPaginatedNotes.totalCount / PAGE_SIZE) ? p + 1 : p))}
							disabled={page + 1 >= Math.ceil(filteredAndPaginatedNotes.totalCount / PAGE_SIZE)}
							aria-label="Go to next page"
							aria-disabled={page + 1 >= Math.ceil(filteredAndPaginatedNotes.totalCount / PAGE_SIZE)}
						>
							Next
						</Button>
					</Stack>
				</>
			)}
		</Container>
	);
};

export default ClinicalNotesPage;
