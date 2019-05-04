import React, {Suspense, lazy} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Upload from '../csv/Upload';
import AppSaga from './AppSaga';
import sagaMiddleware from '../common/saga';
const List = lazy (() => import ('../group/List'));
const styles = theme => ({
  root: {
    flexGrow: 1,
    minHeight: 400,
    overflow: 'hidden',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
  paper: {
    maxWidth: 1000,
    margin: `${theme.spacing.unit}px auto`,
    padding: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

function App (props) {
  const {classes} = props;
  sagaMiddleware.run (AppSaga, props.store);
  return (
    <div className="App">
      <header className="App-header" />
      <Suspense fallback={<div />}>
        <div className={classes.root}>
          <Paper className={classes.paper} elevation={0}>
            <Grid container={true} wrap="nowrap" spacing={24}>
              <Upload store={props.store} />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                New
              </Button>
            </Grid>
            <List />
          </Paper>
        </div>
      </Suspense>
    </div>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles (styles) (App);
