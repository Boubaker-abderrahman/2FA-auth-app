
import FloatingShape from './component/FloatingShape.jsx'
import Home from './component/Home.jsx'
import LogIn from './component/LogIn.jsx'
import ResetPassword from './component/ResetPassword.jsx'
import SigneIn from './component/SigneIn.jsx'

import './App.css'
import { Navigate, Route , Routes } from 'react-router-dom'
import EmailVerification from './component/EmailVerification.jsx'
import ForgotPassword from './component/ForgotPassword.jsx'
import { useAuthStore } from './store/authStore.js'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user?.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user?.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};


function App() {

  const { isCheckingAuth, checkAuth , isAuthenticated} = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [isAuthenticated,checkAuth]);

	if (isCheckingAuth) return 'Loading...';

  return (

    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center overflow-hidden relative">
        <FloatingShape  size="w-64 h-64" color="bg-green-500" top="-5%" left='10%' delay={0} />
        <FloatingShape color='bg-emerald-500' size='w-48 h-48' top="70%" left='80%' delay={5} />
			  <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
      
    <Routes path='/' >
      <Route index element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
            
            }>
      </Route>
      <Route path='/login' element={
              <RedirectAuthenticatedUser>
                <LogIn/>
              </RedirectAuthenticatedUser>
              
              }>
      
      </Route>
      <Route path='/signin' element={
                <RedirectAuthenticatedUser>
                  <SigneIn/>
                </RedirectAuthenticatedUser>
                }>
      </Route>
      <Route path='/forgot-password' element={
                <RedirectAuthenticatedUser>
                  <ForgotPassword/>
                </RedirectAuthenticatedUser>
                  }>

                  </Route>
      <Route path='/reset-password/:token' element={
                <RedirectAuthenticatedUser>
                  <ResetPassword/>
                </RedirectAuthenticatedUser>
                
                }></Route>
      <Route path='/verify-email' element={
        <RedirectAuthenticatedUser>
          <EmailVerification/>
        </RedirectAuthenticatedUser>
        
        }></Route>
      {/* catch all routes */}
			<Route path='*' element={<Navigate to='/' replace />} />
			
    </Routes>
    <Toaster />
    </div>
    

  )

  
}

export default App
