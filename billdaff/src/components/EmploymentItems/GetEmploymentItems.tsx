import React, { Component } from 'react'
import './GetEmploymentItems.css';
import Parser from 'html-react-parser';
import { getJson } from '../../api';
import { EmploymentApiItem } from '../../types/api';
import { splitList } from '../../util/util';

interface GetEmploymentItemsState {
  error: Error | null;
  isLoaded: boolean;
  employmentItems: EmploymentApiItem[];
}

const startMonth = (dateField: string): number => {
  const [month, year] = splitList(dateField)[0].split('-').map(Number);
  return year * 12 + month;
};

const formatDates = (dateField: string): string => {
  const [start, end] = splitList(dateField);
  return `${start} to ${end ?? 'present'}`;
};

class GetEmploymentItems extends Component<Record<string, never>, GetEmploymentItemsState> {
  state: GetEmploymentItemsState = {
    error: null,
    isLoaded: false,
    employmentItems: [],
  };

  componentDidMount() {
    getJson<EmploymentApiItem[]>('employment')
      .then((result) => {
        const employmentItems = [...result].sort(
          (a, b) => startMonth(b.field_dates_worked) - startMonth(a.field_dates_worked)
        );
        this.setState({ isLoaded: true, employmentItems });
      })
      .catch((error: Error) => {
        this.setState({ isLoaded: true, error });
      });
  }

  render() {
    const { error, isLoaded, employmentItems } = this.state;

    if (error) {
      return <div>Error in loading</div>;
    }
    if (!isLoaded) {
      return <div>Loading ...</div>;
    }
    return (
      <div>
        {employmentItems.map((item) => (
          <div key={`${item.name}-${item.field_dates_worked}`} className="timeline-item">
            <h4 className="item-title">{item.field_job_title}</h4>
            <span className="item-period">{formatDates(item.field_dates_worked)}</span>
            <span className="item-small">{item.name} - {item.field_location}</span>
            <span className="item-description">{Parser(item.description__value)}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default GetEmploymentItems;
