import React, { Component } from 'react'
import GetPortfolioItems from './PortfolioItems/GetPortfolioItems'
import GetProjectTypes from './PortfolioItems/GetProjectTypes'
// import GetResumeArticle from './ResumeArticle/GetResumeArticle'

export default class Portfolio extends Component {

  render() {
    return (
      <>
        <section className="pt-page" data-id="portfolio">
          <div className="section-inner custom-page-content">
            <div className="page-header color-1">
              <h2>Portfolio</h2>
            </div>
            <div className="page-content">


              <div className="portfolio-content">

                <GetProjectTypes></GetProjectTypes>


                <div id="portfolio_grid" className="portfolio-grid portfolio-masonry masonry-grid-3">

                  <GetPortfolioItems></GetPortfolioItems>


                </div>


              </div>

            </div>
          </div>
        </section>
      </>
    )
  }
}
