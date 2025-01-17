import React, { useState, useEffect } from "react";
import {
  AppBar,
  Grid,
  TextField,
  Typography,
  Container,
  ThemeProvider,
  CssBaseline,
  createTheme,
  Button,
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Toolbar,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



const theme = createTheme();

const ToDoListApp = () => {
  const [state, setState] = useState({
    list: "",
    date: new Date(),
    items: [],
    searchQuery: "",
  });

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const items = data.map(item => ({
          ...item,
          date: new Date(item.date),
          timestamp: new Date(item.timestamp)
        }));
        setState(prevState => ({
          ...prevState,
          items
        }));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleAddItem = () => {
    if (state.list.trim() !== "") {
      setState({
        list: "",
        date: new Date(),
        items: [...state.items, {
          text: state.list,
          date: state.date,
          done: false,
          editable: false,
          saved: false,
          description: "",
          timestamp: new Date()
        }],
        searchQuery: "",
      });
    }
  };

  const handleDeleteItem = (index) => {
    const newItems = state.items.filter((item, i) => i !== index);
    setState({
      ...state,
      items: newItems,
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddItem();
    }
  };

  const handleDateChange = (newDate) => {
    setState({
      ...state,
      date: newDate,
    });
  };

  const handleToggleDone = (index) => {
    const newItems = state.items.map((item, i) => {
      if (i === index) {
        return { ...item, done: !item.done, editable: false };
      }
      return item;
    });
    setState({
      ...state,
      items: newItems,
    });
  };

  const handleEditItem = (index) => {
    const newItems = state.items.map((item, i) => {
      if (i === index && !item.done && !item.saved) {
        return { ...item, editable: !item.editable };
      }
      return item;
    });
    setState({
      ...state,
      items: newItems,
    });
  };

  const handleSaveItem = (index, newText) => {
    const newItems = state.items.map((item, i) => {
      if (i === index) {
        return { ...item, text: newText, editable: false, saved: true, timestamp: new Date() };
      }
      return item;
    });
    setState({
      ...state,
      items: newItems,
    });
  };

  const handleEditChange = (event, index) => {
    const { value } = event.target;
    const newItems = state.items.map((item, i) => {
      if (i === index) {
        return { ...item, text: value };
      }
      return item;
    });
    setState({
      ...state,
      items: newItems,
    });
  };

  const handleSearchChange = (event) => {
    setState({
      ...state,
      searchQuery: event.target.value,
    });
  };

  const handleDescriptionChange = (event, index) => {
    const { value } = event.target;
    const newItems = state.items.map((item, i) => {
      if (i === index) {
        return { ...item, description: value };
      }
      return item;
    });
    setState({
      ...state,
      items: newItems,
    });
  };

  const filteredItems = state.items.filter(item =>
    item.text.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: 'success' }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            To Do List
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography gutterBottom variant="h2" sx={{ fontFamily: 'Pacifico, cursive' }}>
          To Do List
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              id="search"
              name="search"
              label="Search tasks"
              variant="outlined"
              value={state.searchQuery}
              onChange={handleSearchChange}
              type="text"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="list"
              name="list"
              label="Add a task"
              variant="outlined"
              value={state.list}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              type="text"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={state.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleAddItem}
              sx={{ mt: 2, mb: 2, ml: 1, mr: 1 }}
            >
              Add Task
            </Button>
          </Grid>

          <Grid item xs={12}>
            <List>
              {filteredItems.map((item, index) => (
                <Accordion key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography variant="h6" style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
                      {item.text}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        {item.editable ? (
                          <TextField
                            value={item.text}
                            onChange={(e) => handleEditChange(e, index)}
                            fullWidth
                          />
                        ) : (
                          <Typography variant="body1">{item.text}</Typography>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          Last updated: {item.timestamp.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Description"
                          multiline
                          fullWidth
                          value={item.description}
                          onChange={(e) => handleDescriptionChange(e, index)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {!item.saved && item.editable ? (
                            <IconButton edge="end" color="primary" onClick={() => handleSaveItem(index, item.text)}>
                              <SaveIcon />
                            </IconButton>
                          ) : (
                            <IconButton edge="end" color="primary" onClick={() => handleEditItem(index)}>
                              <EditIcon />
                            </IconButton>
                          )}
                          <IconButton edge="end" color="primary" onClick={() => handleToggleDone(index)}>
                            <CheckIcon />
                          </IconButton>
                          <IconButton edge="end" color="secondary" onClick={() => handleDeleteItem(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default ToDoListApp;
