import LoginPage from '@/pages/Auth/Login.jsx';
import SignupPage from '@/pages/Auth/Signup.jsx';

import HomePage from '@/pages/HomePage/Home.jsx';

import ProfilePage from '@/pages/ProfilePage/Profile.jsx';

import BlackJack from '@/pages/Blackjack/Blackjack';
import ScratchTheCardPage from '@/pages/Scratch/Scratch';
import SlotsPage from '@/pages/Slots/Slots.jsx';
import Plinko from '@/pages/Plinko/Plinko';

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

  // games
  { path: '/games/blackjack', Component: BlackJack },
  { path: '/games/scratch', Component: ScratchTheCardPage },
  { path: '/games/slots', Component: SlotsPage },
  { path: '/games/plinko', Component: Plinko },

  // terms and conditions
  { path: '/terms', Component: TermsPage },
  { path: '/privacy', Component: PrivacyPage },

  // profile
  { path: '/profile', Component: ProfilePage },

  // errors
  { path: '/not_found', Component: NotFound },
];
