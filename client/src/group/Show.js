import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {connect} from 'react-redux';
import {show} from '../app/AppAction';
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
});

class CShow extends React.Component {
  constructor (props) {
    super (props);
    if (this.props.meets.length === 0) {
      this.props.show (this.props.id);
    }
  }
  handleClose = () => {
    this.props.handlerFromFormDialog (false);
  };
  render () {
    const {classes, name} = this.props;
    return (
      <div>
        <DialogTitle id="form-dialog-title">{name}</DialogTitle>
        {this.props &&
          this.props.meets.length > 0 &&
          <Paper className={classes.root}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell align="right">Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.meets.map (row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.first_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.last_name}
                    </TableCell>
                    <TableCell align="right">{row.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>}
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>

      </div>
    );
  }
}
CShow.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapDispatchToProps = dispatch => {
  return {
    show: id => dispatch (show (id)),
  };
};
const mapStateToProps = state => {
  let meets = [];
  state.AppReducer.data.forEach (i => {
    if (i.id === state.AppReducer.id && i.meets) {
      i.meets.forEach (j => {
        meets.push ({
          first_name: j.user.first_name,
          last_name: j.user.last_name,
          role: j.role.name,
          id: j._id,
        });
      });
    }
  });
  return {
    meets: meets,
  };
};
const Show = connect (mapStateToProps, mapDispatchToProps) (CShow);
export default withStyles (styles) (Show);
