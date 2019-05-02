import React, {useState} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {connect} from "react-redux";
import {upload} from "../app/AppAction";
import LinearProgress from "@material-ui/core/LinearProgress";
const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  progress: {
    margin: theme.spacing.unit * 1
  },
  root: {
    flexGrow: 1
  }
});
const FUpload = props => {
  const {classes} = props;
  const handleUpload = e => {
    e.preventDefault();
    props.upload(e.target.files[0]);
  };
  return (<div className={classes.root}>
    {props.uploading && <LinearProgress color="secondary"/>}
    <input type="file" accept=".csv" id="csv" name="csv" className={classes.input} onChange={handleUpload}/>
    <label htmlFor="csv">
      <Button raised="true" component="span" className={classes.button} variant="contained">
        Upload CSV
      </Button>
    </label>
  </div>);
};
FUpload.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapDispatchToProps = dispatch => {
  return {
    upload: file => dispatch(upload(file))
  };
};
const mapStateToProps = state => {
  return {uploading: state.AppReducer.uploading};
};
const Upload = connect(mapStateToProps, mapDispatchToProps)(FUpload);

export default withStyles(styles)(Upload);
