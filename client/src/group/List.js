import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {lighten} from "@material-ui/core/styles/colorManipulator";
import {list} from "../app/AppAction";
import {connect} from "react-redux";

const rows = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name"
  }, {
    id: "organizer",
    numeric: false,
    disablePadding: true,
    label: "Organizer"
  }, {
    id: "action",
    numeric: true,
    disablePadding: true,
    label: "Action"
  }
];

class EnhancedTableHead extends React.Component {
  render() {
    const {onSelectAllClick, numSelected, rowCount} = this.props;

    return (<TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox indeterminate={numSelected > 0 && numSelected < rowCount} onChange={onSelectAllClick}/>
        </TableCell>
        {
          rows.map(row => (<TableCell key={row.id} align={row.numeric
              ? "center"
              : "left"} padding={row.disablePadding
              ? "none"
              : "default"}>
            {row.label}
          </TableCell>), this)
        }
      </TableRow>
    </TableHead>);
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight: theme.palette.type === "light"
    ? {
      color: theme.palette.secondary.main,
      backgroundColor: lighten(theme.palette.secondary.light, 0.85)
    }
    : {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.secondary.dark
    },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

let EnhancedTableToolbar = props => {
  const {numSelected, classes} = props;

  return (<Toolbar className={classNames(classes.root, {
      [classes.highlight]: numSelected > 0
    })}>
    <div className={classes.title}>
      {
        numSelected > 0
          ? (<Typography color="inherit" variant="subtitle1">
            {[numSelected, "selected"].join(" ")}
          </Typography>)
          : (<Typography variant="h6" id="tableTitle">
            Group
          </Typography>)
      }
    </div>
    <div className={classes.spacer}/>
    <div className={classes.actions}>
      {
        numSelected > 0 && (<Tooltip title="Delete">
          <IconButton aria-label="Delete">
            <DeleteIcon/>
          </IconButton>
        </Tooltip>)
      }
    </div>
  </Toolbar>);
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  },
  rowTable: {},
  tr: {
    "&:hover": {
      cursor: "pointer"
    }
  },
  icon: {
    margin: theme.spacing.unit * 2
  }
});

class CEnhancedTable extends React.Component {
  state = {
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 5
  };
  constructor(props) {
    super(props);
    this.props.list({page: 1, per_page: 5});
  }
  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({
        selected: this.props.data.map(n => n.id)
      }));
      return;
    }
    this.setState({selected: []});
  };

  handleShow = (event, id) => {
    console.log("show");
  };
  handleClick = (event, id) => {
    const {selected} = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    this.setState({selected: newSelected});
  };

  handleChangePage = (event, page) => {
    this.setState({page});
  };

  handleChangeRowsPerPage = event => {
    this.setState({rowsPerPage: event.target.value});
    this.props.list({page: 1, per_page: event.target.value});
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const {classes} = this.props;
    const {selected, rowsPerPage, page} = this.state;
    const {data} = this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.total_objects - page * rowsPerPage);

    return (<Paper className={classes.root}>
      <EnhancedTableToolbar numSelected={selected.length}/>
      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-labelledby="tableTitle">
          <EnhancedTableHead numSelected={selected.length} onSelectAllClick={this.handleSelectAllClick} rowCount={this.props.total_objects}/>
          <TableBody>
            {
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                const isSelected = this.isSelected(n.id);
                return (<TableRow hover={true} onClick={event => this.handleShow(event, n.id)} className={classes.tr} role="checkbox" aria-checked={isSelected} tabIndex={-1} key={n.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} onClick={event => this.handleClick(event, n.id)}/>
                  </TableCell>
                  <TableCell component="th" scope="row" padding="none">
                    {n.name}
                  </TableCell>
                  <TableCell component="th" scope="row" padding="none">
                    {n.organizer}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <EditIcon className={classes.icon}/>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <DeleteIcon className={classes.icon}/>
                    </Tooltip>
                  </TableCell>
                </TableRow>);
              })
            }
            {
              emptyRows > 0 && (<TableRow style={{
                  height: 49 * emptyRows
                }}>
                <TableCell colSpan={6}/>
              </TableRow>)
            }
          </TableBody>
        </Table>
      </div>
      <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={this.props.total_objects} rowsPerPage={rowsPerPage} page={page} backIconButtonProps={{
          "aria-label" : "Previous Page"
        }} nextIconButtonProps={{
          "aria-label" : "Next Page"
        }} onChangePage={this.handleChangePage} onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
    </Paper>);
  }
}

CEnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapDispatchToProps = dispatch => {
  return {
    list: params => dispatch(list(params))
  };
};
const mapStateToProps = state => {
  let groups = [];
  Array.prototype.forEach.call(state.AppReducer.data, group => {
    let organizers = [];
    if (group.organizers) {
      Array.prototype.forEach.call(group.organizers, organizer => {
        organizers.push(organizer.name);
      });
    }
    groups.push({id: group.id, name: group.name, organizer: organizers.join(", ")});
  });
  console.log(state.AppReducer.data);
  const total_objects = state.AppReducer.total_objects || 0;
  console.log(total_objects);
  return {data: groups, total_objects: total_objects};
};
const EnhancedTable = connect(mapStateToProps, mapDispatchToProps)(CEnhancedTable);
export default withStyles(styles)(EnhancedTable);
