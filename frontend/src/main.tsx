import React, { FormEvent, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';

type Status = 'todo' | 'in_progress' | 'done';
type Task = { id: string; title: string; description: string; status: Status; created_date: string };

const API = 'http://localhost:8000/api';
const theme = createTheme({
  palette: {
    primary: { main: '#1d4ed8' },
    background: { default: '#f4f7fb' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
});

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>('todo');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDescription, setDraftDescription] = useState('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/tasks`);
      if (!response.ok) throw new Error('API request failed');
      setTasks(await response.json());
      setError('');
    } catch {
      setError('Could not connect to the API. Is FastAPI running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    const response = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status }),
    });

    if (!response.ok) {
      setError('Could not create task.');
      return;
    }

    setTitle('');
    setDescription('');
    setStatus('todo');
    setError('');
    loadTasks();
  };

  const changeStatus = async (id: string, next: Status) => {
    await fetch(`${API}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    loadTasks();
  };

  const removeTask = async (id: string) => {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setDraftTitle(task.title);
    setDraftDescription(task.description);
  };

  const saveEdit = async () => {
    if (!editingTask || !draftTitle.trim()) return;

    await fetch(`${API}/tasks/${editingTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: draftTitle,
        description: draftDescription,
      }),
    });

    setEditingTask(null);
    loadTasks();
  };

  const totalTasks = tasks.length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                PRODUCTIVITY
              </Typography>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
                Task Manager
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Keep your work organized and moving forward.
              </Typography>
            </Box>
            <Paper elevation={0} sx={{ px: 3, py: 2, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{totalTasks}</Typography>
              <Typography variant="caption">tasks</Typography>
            </Paper>
          </Box>

          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Create a task
              </Typography>
              <Box component="form" onSubmit={addTask} sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label="Task title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  multiline
                  minRows={3}
                  fullWidth
                />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      value={status}
                      label="Status"
                      onChange={(event: SelectChangeEvent<Status>) => setStatus(event.target.value as Status)}
                    >
                      <MenuItem value="todo">To do</MenuItem>
                      <MenuItem value="in_progress">In progress</MenuItem>
                      <MenuItem value="done">Done</MenuItem>
                    </Select>
                  </FormControl>
                  <Button type="submit" variant="contained" size="large" sx={{ ml: 'auto' }}>
                    Add task
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {error && <Alert severity="error">{error}</Alert>}

          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Your tasks
              </Typography>

              {loading ? (
                <Typography color="text.secondary">Loading tasks…</Typography>
              ) : tasks.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa' }}>
                  <Typography color="text.secondary">No tasks yet. Create your first one above.</Typography>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  {tasks.map((task) => (
                    <Card key={task.id} variant="outlined" sx={{ bgcolor: '#fff' }}>
                      <CardContent>
                        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 2 }}>
                          <Box>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                              <Typography variant="h6" component="h3">
                                {task.title}
                              </Typography>
                              <Chip
                                label={task.status.replace('_', ' ')}
                                color={task.status === 'done' ? 'success' : task.status === 'in_progress' ? 'warning' : 'default'}
                                size="small"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {task.description || 'No description'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Created {new Date(task.created_date).toLocaleString()}
                            </Typography>
                          </Box>

                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                              <InputLabel id={`status-${task.id}`}>Status</InputLabel>
                              <Select
                                labelId={`status-${task.id}`}
                                value={task.status}
                                label="Status"
                                onChange={(event: SelectChangeEvent<Status>) => changeStatus(task.id, event.target.value as Status)}
                              >
                                <MenuItem value="todo">To do</MenuItem>
                                <MenuItem value="in_progress">In progress</MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                              </Select>
                            </FormControl>
                            <Button variant="contained" color="secondary" onClick={() => openEditDialog(task)}>
                              Edit
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => removeTask(task.id)}>
                              Delete
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>

      <Dialog open={Boolean(editingTask)} onClose={() => setEditingTask(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Task title"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={draftDescription}
              onChange={(event) => setDraftDescription(event.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTask(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>Save changes</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
