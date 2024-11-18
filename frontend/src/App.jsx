import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import React from 'react';


import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import FileUpload from "./components/FileUpload";  // Import FileUpload component
import PdfListPage from "./pages/PdfListPage";     // Import PdfListPage component
import CourseFilesPage from "./pages/CourseFilesPage"; // New component to view files by course
import MyNotesPage from "./pages/MyNotesPage";
import LoadingSpinner from "./components/LoadingSpinner";
import CommentsPage from "./pages/CommentsPage";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import Home from "./pages/Home";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
		<div
			className='min-h-screen bg-gradient-to-br
    from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center relative overflow-hidden'
		>

			<Routes>
				<Route
					path='/Dashboard'
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
								<Route
					path='/mynotes'
					element={
						<ProtectedRoute>
							<MyNotesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerificationPage />} />
				<Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				{/* New Routes for File Upload and Course Files */}
				<Route
					path='/upload'
					element={
						<ProtectedRoute>
							<FileUpload />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/courses/:courseNumber'
					element={
						<ProtectedRoute>
							<CourseFilesPage /> {/* Display files for a specific course */}
						</ProtectedRoute>
					}
				/>
                <Route
                     path='/comments/:fileId'
                     element={
                       <ProtectedRoute>
                         <CommentsPage /> {/* Comments page for a specific file */}
                       </ProtectedRoute>
                    }
                />
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
