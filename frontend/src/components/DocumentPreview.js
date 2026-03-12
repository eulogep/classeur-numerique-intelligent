import React from "react";
import { Box, Typography, Chip, Button, Paper } from "@mui/material";

const DocumentPreview = ({ doc, onClose, onShowToDo }) => {
  if (!doc) return null;
  return (
    <Paper elevation={4} sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{doc.fileName}</Typography>
        <Button size="small" onClick={onClose}>Fermer</Button>
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Type: {doc.type} | Date: {doc.date || '---'}
      </Typography>
      <Box sx={{ mb: 1 }}>
        {doc.tags && doc.tags.map(tag => (
          <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
        ))}
      </Box>
      <Button variant="outlined" onClick={onShowToDo} sx={{ mb: 2 }}>
        Voir la To-Do liée à ce document
      </Button>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Aperçu du texte OCR :</Typography>
        <Paper variant="outlined" sx={{ p: 1, mt: 1, maxHeight: 120, overflow: 'auto', bgcolor: '#f9f9fa' }}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{doc.text || "(Pas de texte OCR)"}</Typography>
        </Paper>
      </Box>
    </Paper>
  );
};

export default DocumentPreview;
