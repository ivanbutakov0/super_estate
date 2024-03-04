import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import About from './pages/About'
import CreateListing from './pages/CreateListing'
import Home from './pages/Home'
import Listing from './pages/Listing'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import UpdateListing from './pages/UpdateListing'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Home />} />
					<Route path='about' element={<About />} />
					<Route path='sign-in' element={<SignIn />} />
					<Route path='sign-up' element={<SignUp />} />
					<Route path='listing/:listingId' element={<Listing />} />
					<Route element={<PrivateRoute />}>
						<Route path='profile/:id' element={<Profile />} />
						<Route path='create-listing' element={<CreateListing />} />
						<Route
							path='update-listing/:listingId'
							element={<UpdateListing />}
						/>
					</Route>
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
