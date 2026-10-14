export interface EmploymentApiItem {
  name: string;
  field_job_title: string;
  field_dates_worked: string;
  field_location: string;
  description__value: string;
}

export interface PortfolioApiItem {
  title: string;
  field_portfolio_images: string[];
  field_project_type: string;
  body: string;
  field_technologies: string;
}

export interface PortfolioImageApiItem {
  field_media_image?: string;
}

export interface ProjectTypeApiItem {
  field_project_type: string;
}

export interface ResumeArticleApiItem {
  title: string;
  body: string;
}
