import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  PushPin as PinIcon,
  PushPinOutlined as UnpinIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GET_NOTES, GET_PINNED_NOTES } from '../graphql/queries/notes';
import { CREATE_NOTE, UPDATE_NOTE, PIN_NOTE, UNPIN_NOTE, DELETE_NOTE } from '../graphql/mutations/notes';

const Notes: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '', isPinned: false });
  const [error, setError] = useState('');

  const { data: notesData, loading, refetch: refetchNotes } = useQuery(GET_NOTES, {
    variables: searchQuery ? { search: { search: searchQuery } } : {},
  });

  const { data: pinnedData, refetch: refetchPinned } = useQuery(GET_PINNED_NOTES);

  const refetchAll = () => { refetchNotes(); refetchPinned(); };

  const [createNote] = useMutation(CREATE_NOTE, {
    onCompleted: () => {
      setCreateDialogOpen(false);
      setNewNote({ title: '', content: '', isPinned: false });
      refetchAll();
    },
    onError: (err) => setError(err.message),
  });

  const [updateNote] = useMutation(UPDATE_NOTE, {
    onCompleted: (data) => {
      setEditMode(false);
      setSelectedNote(data.updateNote);
      refetchAll();
    },
    onError: (err) => setError(err.message),
  });

  const [pinNote] = useMutation(PIN_NOTE, {
    onCompleted: () => refetchAll(),
    onError: (err) => setError(err.message),
  });

  const [unpinNote] = useMutation(UNPIN_NOTE, {
    onCompleted: () => refetchAll(),
    onError: (err) => setError(err.message),
  });

  const [deleteNote] = useMutation(DELETE_NOTE, {
    onCompleted: () => {
      setViewDialogOpen(false);
      setSelectedNote(null);
      refetchAll();
    },
    onError: (err) => setError(err.message),
  });

  const handleCreateNote = () => {
    createNote({ variables: { createNoteInput: newNote } });
  };

  const handleOpenNote = (note: any) => {
    setSelectedNote({ ...note });
    setEditMode(false);
    setViewDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedNote) return;
    updateNote({
      variables: {
        id: selectedNote.id,
        updateNoteInput: {
          title: selectedNote.title,
          content: selectedNote.content,
        },
      },
    });
  };

  const handleTogglePin = (noteId: string, isPinned: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPinned) {
      unpinNote({ variables: { id: noteId } });
    } else {
      pinNote({ variables: { id: noteId } });
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote({ variables: { id: noteId } });
    }
  };

  const notes = notesData?.notes || [];
  const pinnedNotes = pinnedData?.pinnedNotes || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Notes ({notes.length})
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
          New Note
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <TextField
        fullWidth
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && !searchQuery && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PinIcon fontSize="small" /> Pinned
          </Typography>
          <Grid container spacing={2}>
            {pinnedNotes.map((note: any) => (
              <Grid item xs={12} sm={6} md={4} key={note.id}>
                <Card sx={{ borderTop: '3px solid', borderColor: 'primary.main' }}>
                  <CardActionArea onClick={() => handleOpenNote(note)}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Typography variant="h6" noWrap sx={{ flex: 1 }}>{note.title}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, height: 40, overflow: 'hidden' }}>
                        {note.content?.substring(0, 100)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, pb: 1 }}>
                    <IconButton size="small" onClick={(e) => handleTogglePin(note.id, true, e)} title="Unpin">
                      <PinIcon fontSize="small" color="primary" />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Notes */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {searchQuery ? 'Search Results' : 'All Notes'}
      </Typography>

      {!loading && notes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? 'No notes match your search' : 'No notes yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "New Note" to create one.
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {notes.map((note: any) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <Card>
              <CardActionArea onClick={() => handleOpenNote(note)}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Typography variant="h6" noWrap sx={{ flex: 1 }}>{note.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, height: 40, overflow: 'hidden' }}>
                    {note.content?.substring(0, 100)}
                  </Typography>
                  {note.tags && note.tags.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                      {note.tags.map((tag: any) => (
                        <Chip key={tag.id} label={tag.name} size="small" />
                      ))}
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Updated: {new Date(note.updatedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, pb: 1 }}>
                <IconButton size="small" onClick={(e) => handleTogglePin(note.id, note.isPinned, e)} title={note.isPinned ? 'Unpin' : 'Pin'}>
                  {note.isPinned ? <PinIcon fontSize="small" color="primary" /> : <UnpinIcon fontSize="small" />}
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} title="Delete" color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Note Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Note</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} margin="normal" required autoFocus />
          <TextField fullWidth label="Content" value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} margin="normal" multiline rows={12} required />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateNote} variant="contained" disabled={!newNote.title || !newNote.content}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* View / Edit Note Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => { setViewDialogOpen(false); setEditMode(false); }} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editMode ? 'Edit Note' : selectedNote?.title}
          {!editMode && (
            <Box>
              <IconButton onClick={() => setEditMode(true)} title="Edit"><EditIcon /></IconButton>
              <IconButton onClick={() => handleTogglePin(selectedNote?.id, selectedNote?.isPinned)} title={selectedNote?.isPinned ? 'Unpin' : 'Pin'}>
                {selectedNote?.isPinned ? <PinIcon color="primary" /> : <UnpinIcon />}
              </IconButton>
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedNote && editMode ? (
            <>
              <TextField fullWidth label="Title" value={selectedNote.title} onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })} margin="normal" required autoFocus />
              <TextField fullWidth label="Content" value={selectedNote.content} onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })} margin="normal" multiline rows={15} required />
            </>
          ) : (
            <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
              {selectedNote?.content}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {editMode ? (
            <>
              <Button onClick={() => setEditMode(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit} variant="contained">Save</Button>
            </>
          ) : (
            <>
              <Button color="error" onClick={() => handleDeleteNote(selectedNote?.id)}>Delete</Button>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Notes;
