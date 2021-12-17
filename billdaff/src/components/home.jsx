import React, { Component } from 'react'

export default class Home extends Component {
  render() {
    return (
      <div>
        <section class="pt-page" data-id="home">
          <div class="section-inner start-page-content">
            <div class="page-header">
              <div class="row">
                <div class="col-sm-4 col-md-4 col-lg-4">
                  <div class="photo">
                    <img src="images/photo.png" alt=""/>
                  </div>
                </div>

                <div class="col-sm-8 col-md-8 col-lg-8">
                  <div class="title-block">
                    <h1>Bill Dafeldecker</h1>
                    <div class="owl-carousel text-rotation">
                      <div class="item">
                        <div class="sp-subtitle">Web Designer</div>
                      </div>
                      <div class="item">
                        <div class="sp-subtitle">Frontend-developer</div>
                      </div>
                      <div class="item">
                        <div class="sp-subtitle">Backend-developer</div>
                      </div>
                      <div class="item">
                        <div class="sp-subtitle">Solutions-developer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="page-content">
              <div class="row">

                <div class="col-sm-6 col-md-6 col-lg-6">
                  <div class="about-me">
                    <div class="block-title">
                      <h3>About <span>Me</span></h3>
                    </div>
                    <p>Hello! I’m Bill Dafeldecker. I'm constantly looking for new and exciting projects to create and develop. I like to look for the newest technologies to utilize that will bring the most benefit to a project.</p>
                  </div>
                  <div class="download-resume">
                    <a href="" class="btn btn-secondary">Download Resume</a>
                  </div>
                </div>

                <div class="col-sm-6 col-md-6 col-lg-6">
                  <ul class="info-list">
                    <li><span class="title">Age</span><span id="age" class="value"></span></li>
                    <li><span class="title">Residence</span><span class="value">USA</span></li>
                    <li><span class="title">Address</span><span class="value">Brick, NJ</span></li>
                    <li><span class="title">e-mail</span><span class="value"><a
                      href="mailto:billdafeldecker@gmail.com">billdafeldecker@gmail.com</a></span></li>
                    <li><span class="title">Freelance</span><span class="value available">Available</span></li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
