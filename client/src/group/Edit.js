import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  container: {
    display: 'flex',
  },
});

class CEdit extends React.Component {
  handleClose = () => {
    this.props.handlerFromFormDialog (false);
  };

  render () {
    const {classes} = this.props;

    return (
      <div>
        <DialogTitle id="form-dialog-title">Group</DialogTitle>
        <form
          ref={form => (this.formEl = form)}
          onSubmit={this.submitHandler}
          noValidate
        >
          <TextField
            id="outlined-password-input"
            label="Name"
            className={classes.textField}
            value={this.props.name}
            margin="normal"
            variant="outlined"
          />
          <Typography component="pre">
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button color="primary" variant="contained">
                Edit
              </Button>
            </DialogActions>
          </Typography>

        </form>
      </div>
    );
  }
}
CEdit.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles (styles) (CEdit);
