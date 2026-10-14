import React, { Component } from 'react'
import './GetResumeArticle.css';
import Parser from 'html-react-parser';
import { getJson } from '../../api';
import { ResumeArticleApiItem } from '../../types/api';

interface GetResumeArticleProps {
  article_title: string;
}

interface GetResumeArticleState {
  error: Error | null;
  isLoaded: boolean;
  resumeArticle: ResumeArticleApiItem | undefined;
}

class GetResumeArticle extends Component<GetResumeArticleProps, GetResumeArticleState> {
  state: GetResumeArticleState = {
    error: null,
    isLoaded: false,
    resumeArticle: undefined,
  };

  componentDidMount() {
    getJson<ResumeArticleApiItem[]>(`resume_articles/${encodeURIComponent(this.props.article_title)}`)
      .then((result) => {
        this.setState({ isLoaded: true, resumeArticle: result[0] });
      })
      .catch((error: Error) => {
        this.setState({ isLoaded: true, error });
      });
  }

  render() {
    const { error, isLoaded, resumeArticle } = this.state;

    if (error) {
      return <div>Error in loading</div>;
    }
    if (!isLoaded) {
      return <div>Loading ...</div>;
    }
    if (!resumeArticle) {
      return null;
    }
    return (
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <div className="block">
            <div className="block-title">
              <h3>{resumeArticle.title}</h3>
            </div>
            <div className="block-body">
              {Parser(resumeArticle.body)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GetResumeArticle;
