import React, { Component } from 'react'
import GetEmploymentItems from './EmploymentItems/GetEmploymentItems'
import GetResumeArticle from './ResumeArticle/GetResumeArticle'
import ErrorBoundary from './ErrorBoundary'
import { RESUME_ARTICLE_TITLES } from '../api'

export default class Resume extends Component {

  render() {
    return (
      <>
        <section className="pt-page" data-id="resume">
          <div className="section-inner custom-page-content">
            <div className="page-header color-1">
              <h2>Resume</h2>
            </div>
            <div className="page-content">

              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="block">
                    <div className="block-title">
                      <h3>Professional Experience</h3>
                    </div>

                    <div className="timeline">
                      <ErrorBoundary><GetEmploymentItems/></ErrorBoundary>
                    </div>
                  </div>
                </div>
              </div>
              {RESUME_ARTICLE_TITLES.map((title) => (
                <ErrorBoundary key={title}>
                  <GetResumeArticle article_title={title} />
                </ErrorBoundary>
              ))}

              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="block">
                    <div className="center download-resume">
                      <a href="assets/DafeldeckerResume.pdf" target="_blank" rel="noreferrer" className="btn btn-secondary">Download
                        Resume</a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </>
    )
  }
}
