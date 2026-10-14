import React, { Component } from 'react'
import { getJson } from '../../api';
import { ProjectTypeApiItem } from '../../types/api';
import { slugify, splitList } from '../../util/util';

interface GetProjectTypesState {
  error: Error | null;
  isLoaded: boolean;
  projectTypes: ProjectTypeApiItem[];
}

class GetProjectTypes extends Component<Record<string, never>, GetProjectTypesState> {
  state: GetProjectTypesState = {
    error: null,
    isLoaded: false,
    projectTypes: [],
  };

  componentDidMount() {
    getJson<ProjectTypeApiItem[]>('getProjectTypes')
      .then((projectTypes) => {
        this.setState({ isLoaded: true, projectTypes });
      })
      .catch((error: Error) => {
        this.setState({ isLoaded: true, error });
      });
  }

  render() {
    const { error, isLoaded, projectTypes } = this.state;

    if (error) {
      return <div>Error in loading</div>;
    }
    if (!isLoaded) {
      return <div>Loading ...</div>;
    }
    const filters = Array.from(
      new Set(['All', ...projectTypes.flatMap((projectType) => splitList(projectType.field_project_type))])
    );
    return (
      <ul id="portfolio_filters" className="portfolio-filters">
        {filters.map((filter, index) => (
          <li key={filter} className={index === 0 ? 'active' : ''}>
            <button type="button" className="filter btn btn-sm btn-link" data-group={slugify(filter)}>
              {filter}
            </button>
          </li>
        ))}
      </ul>
    );
  }
}

export default GetProjectTypes;
