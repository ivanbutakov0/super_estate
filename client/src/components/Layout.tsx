import { Outlet } from 'react-router-dom'
import Header from './Header'

const Layout = () => {
	return (
		<div className='bg-slate-50 min-h-screen'>
			<Header />
			<main>
				<Outlet />
			</main>
		</div>
	)
}
export default Layout
