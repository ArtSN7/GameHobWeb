import LoginPage from '../pages/Auth/Login.jsx';

import NotFound from '../pages/Utils/NotFound.jsx';



export const routes = [

  { path: '/', Component: LoginPage },
  { path: '/not_found', Component: NotFound },
];
