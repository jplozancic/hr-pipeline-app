import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from '../components/shared/Layout';
import { NotFoundPage } from '../pages/NotFoundPage';
import { CandidateListPage } from '../pages/CandidateListPage';
import { CandidateDetailPage } from '../pages/CandidateDetailPage';

/**
 * Application routing configuration.
 * Defines the main application layout and defines routes for listing and viewing candidates.
 * Fallbacks to a 404 Not Found page for unknown routes.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        // Start users on the candidate list by default
        element: <Navigate to="/candidates" replace />,
      },
      {
        path: 'candidates',
        element: <CandidateListPage />,
      },
      {
        path: 'candidate/:id',
        element: <CandidateDetailPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);