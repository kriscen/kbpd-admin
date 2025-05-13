import { createBrowserRouter } from 'react-router-dom';
import Home from '@/views/home';
import About from '@/views/about';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/detail',
    element: <About />,
  },
]);
export default router;
