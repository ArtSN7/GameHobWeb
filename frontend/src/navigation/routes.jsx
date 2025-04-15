import LoginPage from '../pages/Auth/Login.jsx';
import SignupPage from '@/pages/Auth/Signup.jsx';

import NotFound from '../pages/Utils/NotFound.jsx';



export const routes = [

  // authentication
  { path: '/', Component: LoginPage },
  { path: '/auth/login', Component: LoginPage },
  { path: '/auth/signup', Component: SignupPage },


  // errors
  { path: '/not_found', Component: NotFound },
];
