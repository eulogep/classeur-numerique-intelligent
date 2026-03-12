import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  Checkbox, 
  IconButton,
  Paper,
  Divider,
  Alert
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TaskIcon from '@mui/icons-material/Task';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useAuth } from '../contexts/AuthContext';
import { createTask, updateTaskDone, deleteTask as deleteTaskApi } from '../supabaseApi';

const ToDoList = ({ tasks, setTasks, contextId, contextType }) => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTask = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");

    try {
      const newTask = await createTask({
        label: input,
        context_id: contextId,
        context_type: contextType,
        user_id: user.id
      });
      setTasks(prev => [...prev, newTask]);
      setInput("");
    } catch (error) {
      setError('Erreur lors de la création de la tâche: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      try {
        await updateTaskDone(id, !task.done);
    setTasks(prev => prev.map(task => task.id === id ? { ...task, done: !task.done } : task));
      } catch (error) {
        setError('Erreur lors de la mise à jour de la tâche: ' + error.message);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskApi(id);
    setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      setError('Erreur lors de la suppression de la tâche: ' + error.message);
    }
  };

  const contextTasks = tasks.filter(task => task.context_id === contextId && task.context_type === contextType);
  const completedTasks = contextTasks.filter(task => task.done);
  const pendingTasks = contextTasks.filter(task => !task.done);

  const getContextTitle = () => {
    if (contextType === 'folder') {
      return contextId === 'root' ? 'Tâches générales' : 'Tâches du dossier';
    }
    return 'Tâches du document';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TaskIcon sx={{ mr: 2, color: '#667eea', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" component="h3" fontWeight="bold">
            {getContextTitle()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pendingTasks.length} en attente • {completedTasks.length} terminées
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Add Task Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          size="small"
            placeholder="Nouvelle tâche..."
            fullWidth
          onKeyDown={e => { if (e.key === 'Enter') addTask(); }}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#667eea'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea'
                }
              }
            }}
          />
          <Button
            variant="contained"
            onClick={addTask}
            disabled={!input.trim() || loading}
            sx={{
              bgcolor: '#667eea',
              minWidth: 48,
              '&:hover': { bgcolor: '#5a6fd8' },
              '&:disabled': { bgcolor: 'rgba(102, 126, 234, 0.3)' }
            }}
          >
            <AddIcon />
          </Button>
        </Box>
      </Paper>

      {/* Tasks List */}
      {contextTasks.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <TaskIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Aucune tâche
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ajoutez votre première tâche pour commencer
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <>
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                  EN ATTENTE ({pendingTasks.length})
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {pendingTasks.map((task, index) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      borderBottom: index < pendingTasks.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                      '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.04)' }
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => deleteTask(task.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <Checkbox
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      sx={{
                        color: '#667eea',
                        '&.Mui-checked': {
                          color: '#667eea'
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        fontWeight: 500
                      }}
                    >
                      {task.label}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <>
              {pendingTasks.length > 0 && <Divider />}
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                  TERMINÉES ({completedTasks.length})
                </Typography>
      </Box>
              <List sx={{ p: 0 }}>
                {completedTasks.map((task, index) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      borderBottom: index < completedTasks.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                      opacity: 0.7,
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.04)',
                        opacity: 1
                      }
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => deleteTask(task.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <Checkbox
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      sx={{
                        color: '#667eea',
                        '&.Mui-checked': {
                          color: '#667eea'
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        textDecoration: 'line-through',
                        color: 'text.secondary'
                      }}
                    >
                      {task.label}
                    </Typography>
          </ListItem>
        ))}
      </List>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ToDoList;
