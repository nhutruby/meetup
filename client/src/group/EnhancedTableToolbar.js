import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import {lighten} from '@material-ui/core/styles/colorManipulator';
import {remove} from '../app/AppAction';
import {connect} from 'react-redux';
const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight: theme.palette.type === 'light'
    ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten (theme.palette.secondary.light, 0.85),
      }
    : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

class CEnhancedTableToolbar extends React.Component {
  handleDeleteAll = (event, rowsPerPage, length, selected) => {
    event.stopPropagation ();
    this.props.remove ({
      ids: selected,
      per_page: rowsPerPage,
      length: length,
    });
    this.props.handlerFromList ([]);
  };
  render () {
    const {numSelected, selected, rowsPerPage, length, classes} = this.props;

    return (
      <Toolbar
        className={classNames (classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0
            ? <Typography color="inherit" variant="subtitle1">
                {[numSelected, 'selected'].join (' ')}
              </Typography>
            : <Typography variant="h6" id="tableTitle">
                Group
              </Typography>}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 &&
            <Tooltip title="Delete All">
              <IconButton
                aria-label="Delete All"
                onClick={event =>
                  this.handleDeleteAll (event, rowsPerPage, length, selected)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>}
        </div>
      </Toolbar>
    );
  }
}
CEnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};
const mapDispatchToProps = dispatch => {
  return {
    remove: params => dispatch (remove (params)),
  };
};
const mapStateToProps = state => {
  return {
    error: state.AppReducer.error,
  };
};

const EnhancedTableToolbar = connect (mapStateToProps, mapDispatchToProps) (
  CEnhancedTableToolbar
);

export default withStyles (toolbarStyles) (EnhancedTableToolbar);
