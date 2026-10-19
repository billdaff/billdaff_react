import React, { Component } from 'react'
import './GetPortfolioItems.css';
import Parser from 'html-react-parser';
import { API_ORIGIN, getJson } from '../../api';
import { PortfolioApiItem, PortfolioImageApiItem } from '../../types/api';
import { slugify, splitList } from '../../util/util';

interface PortfolioImage {
  src: string;
  alt: string;
}

interface PortfolioItem {
  title: string;
  slug: string;
  prevSlug: string;
  nextSlug: string;
  projectTypes: string;
  groups: string;
  body: string;
  technologies: string[];
  image: PortfolioImage | undefined;
}

interface GetPortfolioItemsState {
  error: Error | null;
  isLoaded: boolean;
  portfolioItems: PortfolioItem[];
}

const getPortfolioImage = async (mediaId: string | undefined): Promise<PortfolioImage | undefined> => {
  if (mediaId === undefined) {
    return undefined;
  }
  try {
    const [media] = await getJson<PortfolioImageApiItem[]>(`getPortfolioImages/${mediaId}`);
    const [src, alt = ''] = media?.field_media_image?.split('||') ?? [];
    return src ? { src: `${API_ORIGIN}/${src}`, alt } : undefined;
  } catch {
    return undefined;
  }
};

class GetPortfolioItems extends Component<Record<string, never>, GetPortfolioItemsState> {
  state: GetPortfolioItemsState = {
    error: null,
    isLoaded: false,
    portfolioItems: [],
  };

  async componentDidMount() {
    try {
      const portfolios = await getJson<PortfolioApiItem[]>('portfolios');
      const slugs = portfolios.map((portfolio) => slugify(portfolio.title));
      const portfolioItems = await Promise.all(
        portfolios.map(async (portfolio, index): Promise<PortfolioItem> => ({
          title: portfolio.title,
          slug: slugs[index],
          prevSlug: slugs[(index - 1 + slugs.length) % slugs.length],
          nextSlug: slugs[(index + 1) % slugs.length],
          projectTypes: portfolio.field_project_type,
          groups: JSON.stringify(['all', ...splitList(portfolio.field_project_type).map(slugify)]),
          body: portfolio.body,
          technologies: splitList(portfolio.field_technologies),
          image: await getPortfolioImage(portfolio.field_portfolio_images[0]),
        }))
      );
      // The Shuffle grid (public/js/main.js) can only lay out items that exist,
      // so initialize it after they've rendered rather than on document ready.
      this.setState({ isLoaded: true, portfolioItems }, () => window.initPortfolioGrid?.());
    } catch (error) {
      this.setState({ isLoaded: true, error: error as Error });
    }
  }

  render() {
    const { error, isLoaded, portfolioItems } = this.state;

    if (error) {
      return <div>Error in loading</div>;
    }
    if (!isLoaded) {
      return <div>Loading ...</div>;
    }
    return (
      <>
        {portfolioItems.map((item) => (
          <React.Fragment key={item.slug}>
            <figure className="item" data-groups={item.groups}>
              <a className="ajax-page-load" href={'#' + item.slug}>
                {item.image && <img className="portfolio-thumb" src={item.image.src} alt={item.image.alt} />}
                <div>
                  <h5 className="name">{item.title}</h5>
                  <small>{item.projectTypes}</small>
                  <i className="fa fa-file-text-o"></i>
                </div>
              </a>
            </figure>
            <div id={'page-ajax-loaded-' + item.slug} className="page-ajax-loaded animated rotateInDownRight hide">
              <div className="ajax-page-content">
                <div className="ajax-page-wrapper">
                  <div className="ajax-page-nav">
                    <div className="nav-item ajax-page-prev-next">
                      <a className="ajax-page-load" href={'#' + item.prevSlug} data-close={item.slug} aria-label="Previous project">
                        <i className="zmdi zmdi-chevron-left"></i>
                      </a>
                    </div>
                    <div className="nav-item ajax-page-prev-next">
                      <a className="ajax-page-load" href={'#' + item.nextSlug} data-close={item.slug} aria-label="Next project">
                        <i className="zmdi zmdi-chevron-right"></i>
                      </a>
                    </div>
                    <div className="nav-item ajax-page-close-button" data-close={item.slug}>
                      <a href={'#' + item.slug} aria-label="Close project">
                        <i className="zmdi zmdi-close"></i>
                      </a>
                    </div>
                  </div>

                  <div className="ajax-page-title">
                    <h1 id={item.slug}>{item.title}</h1>
                  </div>

                  <div className="row">
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
                          {item.technologies.map((technology) => (
                            <li key={technology}><span>{technology}</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </>
    );
  }
}

export default GetPortfolioItems;
