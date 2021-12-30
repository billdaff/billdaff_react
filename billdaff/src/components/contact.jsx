import React, { Component } from 'react'

export default class Contact extends Component {
  render() {
    return (
      <>
        <section className="pt-page" data-id="contact">
          <div className="section-inner custom-page-content">
            <div className="page-header color-1">
              <h2>Contact</h2>
            </div>
            <div className="page-content">

              <div className="row">
                <div className="col-sm-6 col-md-6">
                  <div className="block-title">
                    <h3>Working with <span>You</span></h3>
                  </div>
                  <p>I look forward to working with you to build whatever site/solution that you need.

                    Please feel free to contact me to get started.
                  </p>
                </div>
                <div className="col-sm-6 col-md-6">
                  <div className="block-title">
                    <h3>Get in <span>Touch</span></h3>
                  </div>

                  <div className="contact-info-block">
                    <div className="ci-icon">
                      <i className="fa fa-map-marker"></i>
                    </div>
                    <div className="ci-text">
                      <h5>Brick NJ, USA</h5>
                    </div>
                  </div>
                  <div className="contact-info-block">
                    <div className="ci-icon">
                      <i className="fa fa-envelope"></i>
                    </div>
                    <div className="ci-text">
                      <h5>billdafeldecker@gmail.com</h5>
                    </div>
                  </div>
                  <div className="contact-info-block">
                    <div className="ci-icon">
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="ci-text">
                      <h5>Freelance Available</h5>
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
