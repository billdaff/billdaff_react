import React, { Component } from 'react'
import './GetPortfolioItems.css';
import { GetTechnologies } from '../../util/util.js'
import Parser from 'html-react-parser';


class GetPortfolioItems extends Component {
  constructor(props){
    super(props);
    this.state = {
      error : null,
      isLoaded : false,
      portfolioItems : []
    }
  }
  async componentDidMount() {
    let that = this;
    let portfolioItems = [];
    await new Promise(async (resolve, reject) => {
      const portfoilioResponse = await fetch("https://drupal.billdaff.com/api/portfolios");
      const empResonse = await fetch("https://drupal.billdaff.com/api/getEmployers");
      const empJson = await empResonse.json();
      const portfolioJson = await portfoilioResponse.json();
      await Promise.allSettled([
        portfoilioResponse,
        empResonse
      ]);
      await Promise.allSettled([
        empJson,
        portfolioJson
      ]); 
      await new Promise(async (resolve, reject) => {
        portfolioJson.forEach(async (portfolioItem,index) => {
          empJson.forEach(empItem => {
            if(portfolioItem.field_employer === empItem.tid){
              portfolioItem.field_employer = empItem.name;
            }
          });
          if(portfolioItem.field_portfolio_images[0] !== undefined){
            let imgResponse = await fetch("https://drupal.billdaff.com/api/getPortfolioImages/"+portfolioItem.field_portfolio_images[0]);
            let imgJson = await imgResponse.json();
            var [imgSrc, imgAlt] = imgJson[0].field_media_image !== undefined ? imgJson[0].field_media_image.split('||') : '';
            portfolioItem.clean_field_portfolio_images = {imgSrc : imgSrc, imgAlt: imgAlt};
            let nextIndex = await (portfolioJson[index+1] !== undefined ? portfolioJson[index+1] : portfolioJson[0]);
            let prevIndex = await (portfolioJson[index-1] !== undefined ? portfolioJson[index-1] : portfolioJson[portfolioJson.length-1]);
            portfolioItem.next_item = (nextIndex !== undefined ) ? nextIndex.title.replace(/[\s.]/g, '-').toLowerCase() : '';
            portfolioItem.prev_item = (prevIndex !== undefined ) ? prevIndex.title.replace(/[\s.]/g, '-').toLowerCase() : '';
            portfolioItem.field_project_type = '["all",'+portfolioItem.field_project_type.split(', ').map(s => '"'+s.replace(/[\s.]/g, '-').toLowerCase()+'"') +']';
            portfolioItems.push(portfolioItem);
            if(portfolioItems.length == portfolioJson.length) resolve();
          }
        });
      });
      resolve();
    });
    this.setState({
      isLoaded : true,
      portfolioItems : portfolioItems
    });
    timeout()
    function timeout() {
        setTimeout(function () {
          that.setState({
              isLoaded : true,
              portfolioItems : portfolioItems
            });
            timeout();
        }, 3000);
    }
  }
  render() {
    const {error, isLoaded, portfolioItems} = this.state;
    if(error){
      return <div>Error in loading</div>
    }else if (!isLoaded) {
      return <div>Loading ...</div>
    }else{
      return (
        <>
        {
          portfolioItems.map((item, index) =>
            <>
              <figure key={'figure-'+index} className="item" data-groups={ item.field_project_type }>
                <a className="ajax-page-load" href={'#'+item.title.replace(/[\s.]/g, '-').toLowerCase()}>
                  <img className="portfolio-thumb" src={item.clean_field_portfolio_images !== undefined ? 'https://drupal.billdaff.com/'+item.clean_field_portfolio_images.imgSrc : ''} alt={item.field_portfolio_images !== undefined ? 'https://drupal.billdaff.com/'+item.clean_field_portfolio_images.imgAlt : ''} />
                    <div>
                      <h5 className="name">{item.title}</h5>
                      <small>{item.field_project_type}</small>
                      <i className="fa fa-file-text-o"></i>
                    </div>
                </a>
              </figure>
              <div key={'portfolio-'+index} id={'page-ajax-loaded-' + item.title.replace(/[\s.]/g, '-').toLowerCase()} className="page-ajax-loaded animated rotateInDownRight hide">
                <div id="ajax-page" className="ajax-page-content">
                  <div className="ajax-page-wrapper">
                    <div className="ajax-page-nav">
                        <div className="nav-item ajax-page-prev-next" >
                          <a className="ajax-page-load" href={'#'+item.prev_item} data-close={item.title.replace(/[\s.]/g, '-').toLowerCase()}><i className="zmdi zmdi-chevron-left"></i></a>
                        </div>
                        <div className="nav-item ajax-page-prev-next" >
                          <a className="ajax-page-load" href={'#'+item.next_item} data-close={item.title.replace(/[\s.]/g, '-').toLowerCase()}><i className="zmdi zmdi-chevron-right"></i></a>
                        </div>
                        <div className="nav-item ajax-page-close-button" data-close={item.title.replace(/[\s.]/g, '-').toLowerCase()}>
                            <a  href="#"><i className="zmdi zmdi-close"></i></a>
                        </div>
                    </div>

                    <div className="ajax-page-title">
                        <h1 id={item.title.replace(/[\s.]/g, '-').toLowerCase()}>{item.title}</h1>
                    </div>

                    <div className="row">
                        {/* <div className="col-sm-12 portfolio-block">
                            <div className="owl-carousel portfolio-page-carousel">
                                <div className="item">
                                    <img src={item.clean_field_portfolio_images.imgSrc} alt={item.clean_field_portfolio_images.imgAlt} />
                                </div>
                            </div>
                        </div> */}

                        <div className="col-12 portfolio-block">
                            <div className="block-title">
                                <h3>Description</h3>
                            </div>
                            {Parser(item.body)}
                            <div className="tags-block">
                                <div className="block-title">
                                    <h3>Technology</h3>
                                </div>
                                <ul className="tags">
                                  {Parser(GetTechnologies(item.field_technologies))}
                                </ul>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
        </>
      );
    }

  }
}
export default GetPortfolioItems;

