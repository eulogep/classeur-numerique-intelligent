import React from "react";
import { Box, TextField, Chip, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const years = Array.from({ length: 8 }, (_, i) => (2025 - i).toString());
const types = ["scolaire", "administratif", "personnel", "inconnu"];

const DocumentSearchBar = ({ search, setSearch, year, setYear, type, setType, tags, setTags, allTags }) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
    <TextField
      label="Recherche"
      variant="outlined"
      size="small"
      value={search}
      onChange={e => setSearch(e.target.value)}
      sx={{ minWidth: 180 }}
    />
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Année</InputLabel>
      <Select
        value={year}
        label="Année"
        onChange={e => setYear(e.target.value)}
      >
        <MenuItem value="">Toutes</MenuItem>
        {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
      </Select>
    </FormControl>
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel>Type</InputLabel>
      <Select
        value={type}
        label="Type"
        onChange={e => setType(e.target.value)}
      >
        <MenuItem value="">Tous</MenuItem>
        {types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
      </Select>
    </FormControl>
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
      {allTags.map(tag => (
        <Chip
          key={tag}
          label={tag}
          color={tags.includes(tag) ? "primary" : "default"}
          onClick={() => setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])}
          size="small"
          sx={{ cursor: 'pointer' }}
        />
      ))}
    </Box>
  </Box>
);

export default DocumentSearchBar;
