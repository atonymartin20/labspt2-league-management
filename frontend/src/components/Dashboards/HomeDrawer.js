import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { Link } from 'react-router-dom';

class HomeDrawer extends Component {
  state = {
    expandLeagues: false,
    expandTeams: false
  };

  handleClick = e => {
    this.setState({ [e.currentTarget.id]: !this.state[e.currentTarget.id] });
  };

  toggleLeagues = () => {
    this.setState({ expandLeagues: false });
  };

  toggleTeams = () => {
    this.setState({ expandTeams: false });
  };

  render() {
    const { leagues, teams, classes } = this.props;
    return (
      <List>
        <ListItem button key="create">
          <ListItemText primary="Create League" />
        </ListItem>
        <Divider />
        <ListItem
          button
          key="admin"
          id="expandLeagues"
          onClick={this.handleClick}
          color="inherit"
        >
          <ListItemText primary="Manage League" />
          {this.state.expandLeagues ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Divider />
        <Collapse in={this.state.expandLeagues} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {leagues.map(league => (
              <>
                <Link to="/dashboard/admin">
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={this.toggleLeagues}
                  >
                    <ListItemText primary={league.name} />
                  </ListItem>
                </Link>
                <Divider />
              </>
            ))}
          </List>
        </Collapse>
        <ListItem
          button
          key="coach"
          id="expandTeams"
          onClick={this.handleClick}
          color="inherit"
        >
          <ListItemText primary="Manage Team" />
          {this.state.expandTeams ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Divider />
        <Collapse in={this.state.expandTeams} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {teams.map(team => (
              <>
                <Link to="/dashboard/coach">
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={this.toggleTeams}
                  >
                    <ListItemText primary={team.name} />
                  </ListItem>
                </Link>
                <Divider />
              </>
            ))}
          </List>
        </Collapse>
      </List>
    );
  }
}

export default HomeDrawer;
