import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {connect} from 'react-redux';
import {newGroup} from '../app/AppAction';
const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  container: {
    display: 'flex',
  },
  error: {
    textAlign: 'center',
    color: 'red',
  },
});

class CNew extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      name: '',
      nameError: null,
    };
    this.handleValidate = this.handleValidate.bind (this);
    this.handleChange = this.handleChange.bind (this);
    this.handleSubmit = this.handleSubmit.bind (this);
  }
  handleClose = () => {
    this.props.handlerFromFormDialog (false);
  };

  handleChange = e => {
    this.setState ({[e.target.id]: e.target.value});
    this.handleValidate ();
  };
  handleValidate = () => {
    const formEl = this.formEl;
    const formLength = formEl.length;
    this.setState ({nameError: null});
    if (formEl.checkValidity () === false) {
      for (let i = 0; i < formLength; i++) {
        const elem = formEl[i];
        if (elem.nodeName.toLowerCase () !== 'button') {
          if (!elem.validity.valid) {
            switch (elem.name) {
              case 'name':
                this.setState ({nameError: elem.validationMessage});
                break;
              default:
            }
          }
        }
      }
      return false;
    } else {
      return true;
    }
  };
  handleSubmit = event => {
    event.preventDefault ();
    if (this.handleValidate ()) {
      this.props.newGroup ({
        name: this.state.name,
        per_page: this.props.rowsPerPage,
      });
    }
  };

  componentDidUpdate (oldProps) {
    if (this.props.error === false) {
      this.props.handlerFromFormDialog (false);
    }
  }
  render () {
    const {classes} = this.props;

    return (
      <div>
        <DialogTitle id="form-dialog-title">Group</DialogTitle>

        <form
          ref={form => (this.formEl = form)}
          onSubmit={this.handleSubmit}
          noValidate
        >
          {this.state.nameError &&
            <div className={classes.error}>
              <label> {this.state.nameError}</label>
            </div>}
          {this.props.error &&
            <div className={classes.error}>
              <label>{this.props.error.join (', ')}</label>
            </div>}
          <TextField
            id="name"
            name="name"
            label="Name"
            className={classes.textField}
            value={this.state.name}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
            required={true}
          />
          <Typography component="pre">
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                name="submit"
              >
                New
              </Button>
            </DialogActions>
          </Typography>
        </form>
      </div>
    );
  }
}
CNew.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapDispatchToProps = dispatch => {
  return {
    newGroup: params => dispatch (newGroup (params)),
  };
};
const mapStateToProps = state => {
  return {
    error: state.AppReducer.error,
  };
};
const New = connect (mapStateToProps, mapDispatchToProps) (CNew);

export default withStyles (styles) (New);
