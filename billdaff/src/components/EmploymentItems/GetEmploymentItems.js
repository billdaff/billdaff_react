import React, { Component } from 'react'
import './GetEmploymentItems.css';
import Parser from 'html-react-parser';

class GetEmploymentItems extends Component {
  constructor(props){
    super(props);
    this.state = {
      error : null,
      isLoaded : false,
      employmentItems : []
    }
  }
  componentDidMount() {
    fetch("https://drupal.billdaff.com/api/employment")
    .then( response => response.json())
    .then(
      // handle the result
      (result) => {
        this.setState({
          isLoaded : true,
          employmentItems : result
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        })
      },
    )
  }
  render() {
    const {error, isLoaded, employmentItems} = this.state;

    if(error){
      return <div>Error in loading</div>
    }else if (!isLoaded) {
      return <div>Loading ...</div>
    }else{
      return(
          <div>
          {

            employmentItems.map(item => (
            <div key={item.name} className="timeline-item">
              <h4 className="item-title">{item.field_job_title}</h4>
              <span className="item-period">{cleanEmploymentDates(item.field_dates_worked)}</span>
              <span className="item-small">{item.name} - {item.field_location}</span>
              <span className="item-description">{Parser(item.description__value)}</span>
            </div>

            ))
          }
        </div>
      );
    }

    }
  }

export default GetEmploymentItems;
const cleanEmploymentDates = (dateField) => {
  var dates = dateField.split(',');
  if(dates.length === 1) return dates[0]+' to present';
  else return dates[0]+' to '+ dates[1];
}
