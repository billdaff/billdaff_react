import React, { Component } from 'react'
import './GetResumeArticle.css';
import Parser from 'html-react-parser';

class GetResumeArticle extends Component {
  constructor(props){
    super(props);
    this.state = {
      error : null,
      isLoaded : false,
      resumeArticle : []
    }
  }
  componentDidMount() {
    fetch("https://drupal.billdaff.com/api/resume_articles/"+this.props.article_title)
    .then( response => response.json())
    .then(
      // handle the result
      (result) => {
        this.setState({
          isLoaded : true,
          resumeArticle : result
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
    const {error, isLoaded, resumeArticle} = this.state;

    if(error){
      return <div>Error in loading</div>
    }else if (!isLoaded) {
      return <div>Loading ...</div>
    }else{
      return(
        <div key={resumeArticle[0].title} className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <div className="block">
              <div className="block-title">
                <h3>{resumeArticle[0].title}</h3>
              </div>
              <div className="block-body">
                { Parser(resumeArticle[0].body) }
              </div>
            </div>
          </div>
        </div>
      );
    }

    }
  }

export default GetResumeArticle;

