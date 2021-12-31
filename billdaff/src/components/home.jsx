import React, { Component } from 'react'
import { getAge } from '../util/util.js'

export default class Home extends Component {
  render() {
    return (
      <>
        <section className="pt-page" data-id="home">
          <div className="section-inner start-page-content">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="photo">
                    <img src="images/photo.png" alt=""/>
                  </div>
                </div>

                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="title-block">
                    <h1>Bill Dafeldecker</h1>
                    <div className="owl-carousel text-rotation">
                      <div className="item">
                        <div className="sp-subtitle">Web Designer</div>
                      </div>
                      <div className="item">
                        <div className="sp-subtitle">Frontend-developer</div>
                      </div>
                      <div className="item">
                        <div className="sp-subtitle">Backend-developer</div>
                      </div>
                      <div className="item">
                        <div className="sp-subtitle">Solutions-developer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="page-content">
              <div className="row">

                <div className="col-sm-6 col-md-6 col-lg-6">
                  <div className="about-me">
                    <div className="block-title">
                      <h3>About <span>Me</span></h3>
                    </div>
                    <p>Hello! I’m Bill Dafeldecker. I'm constantly looking for new and exciting projects to create and develop. I like to look for the newest technologies to utilize that will bring the most benefit to a project.</p>
                  </div>
                  <div className="download-resume">
                    <a href="assets/DafeldeckerResume.pdf" target="_blank" className="btn btn-secondary">Download Resume</a>
                  </div>
                </div>

                <div className="col-sm-6 col-md-6 col-lg-6">
                  <ul className="info-list">
                    <li><span className="title">Age</span><span id="age" className="value">{ getAge() }</span></li>
                    <li><span className="title">Residence</span><span className="value">USA</span></li>
                    <li><span className="title">Address</span><span className="value">Brick, NJ</span></li>
                    <li><span className="title">E-mail</span><span className="value"><a href="mailto:billdafeldecker@gmail.com">billdafeldecker@gmail.com</a></span></li>
                    <li><span className="title">Github</span><span className="value available"><a href="https://github.com/billdaff" target="_blank">https://github.com/billdaff</a></span></li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </section>
      </>
    )
  }
}
