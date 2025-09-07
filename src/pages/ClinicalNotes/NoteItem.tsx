import React, { memo } from 'react';
import { ListItem, ListItemText, Typography } from '@mui/material';
import { ClinicalNote } from './types';
import { formatDate } from './utils';

interface NoteItemProps {
	note: ClinicalNote;
}

const NoteItem = ({ note }: NoteItemProps) => (
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
);

export const MemoizedNoteItem = memo(NoteItem);
