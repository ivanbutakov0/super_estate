import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { RootState } from '../redux/store'

const PrivateRoute = () => {
	const { currentUser } = useSelector((state: RootState) => state.user)
	const navigate = useNavigate()

	if (!currentUser) {
		navigate('/sign-in')
	}
	return <Outlet />
}
export default PrivateRoute
