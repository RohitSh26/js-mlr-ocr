import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import logo from './logo.svg';
import './App.css';

import HomeComponent from "./components/Home";

import HeaderCompnent from './Layout/Header'


import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


function App() {

  const classes = useStyles();

  

  return (
    <div className="App">
      <HeaderCompnent />
      

      
      <Router>
        <Switch>
          <Route exact path='/' component={HomeComponent}>
          
          </Route>
         
        </Switch>
      </Router>


   




    </div>
  );
}

export default App
