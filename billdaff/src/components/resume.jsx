import React, { Component } from 'react'
import GetEmploymentItems from './EmploymentItems/GetEmploymentItems'
import GetResumeArticle from './ResumeArticle/GetResumeArticle'

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
                      <GetEmploymentItems/>
                    </div>
                  </div>
                </div>
              </div>
              <GetResumeArticle article_title='Education' />
              <GetResumeArticle article_title='Qualifications and Technology Experience' />
              <GetResumeArticle article_title='Notable Projects' />
              <GetResumeArticle article_title='Services and Solutions' />

              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="block">
                    <div className="center download-resume">
                      <a href="assets/DafeldeckerResume.pdf" target="_blank" className="btn btn-secondary">Download
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
