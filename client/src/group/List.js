import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {lighten} from '@material-ui/core/styles/colorManipulator';
import {list, changeRowsPerPage, deleteGroup, editShow} from '../app/AppAction';
import Show from './Show';
import Edit from './Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import {connect} from 'react-redux';

function desc (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort (array, cmp) {
  const stabilizedThis = array.map ((el, index) => [el, index]);
  stabilizedThis.sort ((a, b) => {
    const order = cmp (a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map (el => el[0]);
}

function getSorting (order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc (a, b, orderBy)
    : (a, b) => -desc (a, b, orderBy);
}

const rows = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'organizer',
    numeric: false,
    disablePadding: true,
    label: 'Organizer',
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: true,
    label: 'Action',
  },
];
class FormDialog extends React.Component {
  handleClose = () => {
    this.props.handlerFromParent (false);
  };
  handleData = data => {
    this.props.handlerFromParent (this.props.handlerFromFormDialog);
  };

  render () {
    const {name, groupId, dialogShow, maxWidth} = this.props;
    let form;
    switch (dialogShow) {
      case 'show':
        form = (
          <Show
            handlerFromFormDialog={this.handleData}
            id={groupId}
            name={name}
          />
        );
        break;
      case 'edit':
        form = (
          <Edit
            handlerFromFormDialog={this.handleData}
            id={groupId}
            name={name}
          />
        );
        break;
      default:
    }

    return (
      <div>
        <Dialog
          open={this.props.open ? true : false}
          onClose={this.handleClose}
          fullWidth={true}
          maxWidth={maxWidth}
          aria-labelledby="form-dialog-title"
        >

          <DialogContent>
            {form}
          </DialogContent>

        </Dialog>

      </div>
    );
  }
}

class EnhancedTableHead extends React.Component {
  render () {
    const {onSelectAllClick, numSelected, rowCount} = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map (
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'center' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
              >
                {row.label}
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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

let EnhancedTableToolbar = props => {
  const {numSelected, classes} = props;

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
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles (toolbarStyles) (EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  rowTable: {},
  tr: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  icon: {
    margin: theme.spacing.unit * 2,
  },
});

class CEnhancedTable extends React.Component {
  state = {
    selected: [],
    order: 'desc',
    orderBy: 'id',
    data: [],
    page: 0,
    rowsPerPage: 5,
    open: false,
    groupId: null,
    dialogShow: null,
    name: null,
    maxWidth: 'sm',
  };
  constructor (props) {
    super (props);
    this.props.list ({page: 1, per_page: 5});
  }
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState ({order, orderBy});
  };
  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState (state => ({
        selected: this.props.data.map (n => n.id),
      }));
      return;
    }
    this.setState ({selected: []});
  };

  handleEdit = (event, id, name, maxWidth) => {
    event.stopPropagation ();
    this.setState ({open: true});
    this.setState ({groupId: id});
    this.setState ({dialogShow: 'edit'});
    this.setState ({name: name});
    this.setState ({maxWidth: maxWidth});
    this.props.editShow ();
  };
  handleShow = (event, id, name, maxWidth) => {
    this.setState ({open: true});
    this.setState ({groupId: id});
    this.setState ({dialogShow: 'show'});
    this.setState ({name: name});
    this.setState ({maxWidth: maxWidth});
  };

  handleClick = (event, id) => {
    const {selected} = this.state;
    const selectedIndex = selected.indexOf (id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat (selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat (selected.slice (1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat (selected.slice (0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat (
        selected.slice (0, selectedIndex),
        selected.slice (selectedIndex + 1)
      );
    }

    this.setState ({selected: newSelected});
  };

  handleChangePage = (event, page) => {
    const cacheTotalObjects = page * this.state.rowsPerPage;
    if (cacheTotalObjects >= this.props.length) {
      this.props.list ({
        page: page + 1,
        per_page: this.state.rowsPerPage,
      });
    }
    this.setState ({page});
  };

  handleChangeRowsPerPage = event => {
    this.setState ({rowsPerPage: event.target.value});
    this.setState ({page: 0});
    this.props.changeRowsPerPage ({page: 1, per_page: event.target.value});
  };
  handleDeleteClick = (event, id) => {
    event.stopPropagation ();
    let page = 0;
    if (
      Math.floor (this.props.length / this.state.rowsPerPage) >= this.state.page
    ) {
      page = Math.floor (this.props.length / this.state.rowsPerPage) + 1;
    } else {
      page = this.state.page + 1;
    }
    this.props.deleteGroup ({
      id: id,
      page: page,
      per_page: this.state.rowsPerPage,
    });
  };
  isSelected = id => this.state.selected.indexOf (id) !== -1;
  handleData = data => {
    this.setState ({
      open: data,
    });
  };
  render () {
    const {classes} = this.props;
    const {selected, order, orderBy, rowsPerPage, page} = this.state;
    const {data} = this.props;
    const emptyRows =
      rowsPerPage -
      Math.min (rowsPerPage, this.props.total_objects - page * rowsPerPage);

    return (
      <div>
        <Paper className={classes.root}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                onSelectAllClick={this.handleSelectAllClick}
                rowCount={this.props.total_objects}
              />
              <TableBody>
                {stableSort (data, getSorting (order, orderBy))
                  .slice (page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map (n => {
                    const isSelected = this.isSelected (n.id);
                    return (
                      <TableRow
                        hover={true}
                        onClick={event =>
                          this.handleShow (event, n.id, n.name, 'sm')}
                        className={classes.tr}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.id}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onClick={event => this.handleClick (event, n.id)}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {n.name}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {n.organizer}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <EditIcon
                              className={classes.icon}
                              onClick={event =>
                                this.handleEdit (event, n.id, n.name, 'sm')}
                            />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <DeleteIcon
                              className={classes.icon}
                              onClick={event =>
                                this.handleDeleteClick (event, n.id)}
                            />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 &&
                  <TableRow
                    style={{
                      height: 49 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={this.props.total_objects}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        <FormDialog
          open={this.state.open}
          handlerFromParent={this.handleData}
          groupId={this.state.groupId}
          dialogShow={this.state.dialogShow}
          name={this.state.name}
          maxWidth={this.state.maxWidth}
        />
      </div>
    );
  }
}

CEnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapDispatchToProps = dispatch => {
  return {
    list: params => dispatch (list (params)),
    changeRowsPerPage: params => dispatch (changeRowsPerPage (params)),
    deleteGroup: params => dispatch (deleteGroup (params)),
    editShow: () => dispatch (editShow ()),
  };
};
const mapStateToProps = state => {
  let groups = [];
  if (state.AppReducer.data) {
    Array.prototype.forEach.call (state.AppReducer.data, group => {
      let organizers = [];
      if (group.organizers) {
        Array.prototype.forEach.call (group.organizers, organizer => {
          organizers.push (organizer.name);
        });
      }
      groups.push ({
        id: group.id,
        name: group.name,
        organizer: organizers.join (', '),
      });
    });
  }

  const total_objects = state.AppReducer.total_objects || 0;

  return {
    data: groups,
    total_objects: total_objects,
    length: state.AppReducer.data && state.AppReducer.data.length,
  };
};
const EnhancedTable = connect (mapStateToProps, mapDispatchToProps) (
  CEnhancedTable
);
export default withStyles (styles) (EnhancedTable);
