import React, { Component } from 'react'

class GetProjectTypes extends Component {
  constructor(props){
    super(props);
    this.state = {
      error : null,
      isLoaded : false,
      projectTypes : []
    }
  }
  componentDidMount() {
    fetch("https://drupal.billdaff.com/api/getProjectTypes")
    .then( response => response.json())
    .then(
      // handle the result
      (result) => {
        this.setState({
          isLoaded : true,
          projectTypes : result
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
    const {error, isLoaded, projectTypes} = this.state;

    if(error){
      return <div>Error in loading</div>
    }else if (!isLoaded) {
      return <div>Loading ...</div>
    }else{
      let cleanTypes = ['All'];
      projectTypes.map((projectTypeValue)=>{
        var values = projectTypeValue.field_project_type.split(', ');
        values.forEach(element => {
          if(cleanTypes.indexOf(element) === -1 && element !== '') cleanTypes.push(element);
        });
        return 1;
      });
      return(

        <ul id="portfolio_filters" className="portfolio-filters">
        {
          cleanTypes.map((item, index) => (
            <li key={index} className={index === 0 ? 'active': ''}>
              <a className="filter btn btn-sm btn-link active" data-group={item.replace(/ /g, "-").toLowerCase()}>{item}</a>
            </li>
          ))
        }
        </ul>
      );
    }

  }
}

export default GetProjectTypes;

