import LoginPage from '@/pages/Auth/Login.jsx';
import SignupPage from '@/pages/Auth/Signup.jsx';

import HomePage from '@/pages/HomePage/Home.jsx';

import TermsPage from '@/pages/TermsAndConditions/Terms.jsx';
import PrivacyPage from '@/pages/TermsAndConditions/Privacy.jsx';

import NotFound from '@/pages/Utils/NotFound.jsx';



export const routes = [

  // authentication
  { path: '/', Component: LoginPage },
  { path: '/auth/login', Component: LoginPage },
  { path: '/auth/signup', Component: SignupPage },

  // main page
  { path: '/home', Component: HomePage },

  // terms and conditions
  { path: '/terms', Component: TermsPage },
  { path: '/privacy', Component: PrivacyPage },

  // errors
  { path: '/not_found', Component: NotFound },
];
