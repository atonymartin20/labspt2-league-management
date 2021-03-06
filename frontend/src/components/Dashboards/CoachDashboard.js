import React, { Component } from 'react';
import DashboardNavbar from './DashboardNavbar';
import CoachCalendar from '../Calendars/CoachCalendar';
import { AppContext } from '../Context/AppContext';

class CoachDashboard extends Component {
  state = {
    admin: false,
    coach: true,
    calendar: true,
    dashboard: false
  };

  displayCoachContent = e => {
    this.setState({
      calendar: false,
      dashboard: false
    });
    this.setState({ [e.currentTarget.id]: true });
  };
  render() {
    const { calendar, dashboard } = this.state;
    return (
      // <AppContext.Consumer>
      //   {context => (
      <>
        <DashboardNavbar
          data={this.state}
          displayCoachContent={this.displayCoachContent}
          // context={context}
        />
        <div style={{ margin: '100px 80px 20px 280px' }}>
          {calendar && <CoachCalendar context={this.context} />}
          {dashboard && <div>Dashboard</div>}
        </div>
      </>
    );
    //   </AppContext.Consumer>
    // );
  }
}

CoachDashboard.contextType = AppContext;

export default CoachDashboard;
