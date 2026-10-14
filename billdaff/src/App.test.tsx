import { render, screen } from '@testing-library/react';
import App from './App';

const responses: Record<string, unknown> = {
  employment: [
    {
      name: 'Example Agency',
      field_job_title: 'Web Developer',
      field_dates_worked: '06-2015, 08-2019',
      field_location: 'Trenton, NJ',
      description__value: '<p>Built client websites.</p>',
    },
  ],
  portfolios: [],
  getProjectTypes: [],
  'resume_articles/Education': [],
};

beforeEach(() => {
  global.fetch = jest.fn((url: string) => {
    const path = decodeURIComponent(url.split('/api/')[1]);
    const body = responses[path] ?? [{ title: path.split('/')[1], body: '<p>Article</p>' }];
    return Promise.resolve({ ok: true, json: () => Promise.resolve(body) } as Response);
  }) as jest.Mock;
});

test('renders every section', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: 'Bill Dafeldecker' })).toBeInTheDocument();
  for (const name of ['Resume', 'Portfolio', 'Contact']) {
    expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
  }
});

test('renders API content and skips an empty resume article', async () => {
  render(<App />);
  expect(await screen.findByText('Web Developer')).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: 'Notable Projects' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Education' })).not.toBeInTheDocument();
  expect(screen.queryByText('Error in loading')).not.toBeInTheDocument();
});
