import { Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../redux/store'

const Header = () => {
	const { currentUser, loading, error } = useSelector(
		(state: RootState) => state.user
	)

	console.log(currentUser)

	return (
		<header className='bg-slate-200 shadow-md'>
			<div className='flex gap-4 items-center justify-between p-4 max-w-7xl mx-auto'>
				<Link
					to='/'
					className='sm:text-2xl text-base text-slate-500 font-bold '
				>
					Super<strong className='text-slate-700 font-extrabold'>Estate</strong>
				</Link>
				<form className='flex items-center gap-2 bg-slate-100 px-3 rounded-lg '>
					<input
						type='text'
						placeholder='Search...'
						className='bg-transparent outline-none py-3 md:w-64 sm:w-44 w-24 sm:text-sm text-xs'
					/>
					<Search
						size={18}
						strokeWidth={4}
						cursor={'pointer'}
						className='text-slate-600'
					/>
				</form>
				<nav>
					<ul className='flex gap-4'>
						<li className='sm:inline hidden'>
							<Link to='/' className='hover:underline'>
								Home
							</Link>
						</li>
						<li className='sm:inline hidden'>
							<Link to='/about' className='hover:underline'>
								About
							</Link>
						</li>
						<li className='hover:scale-110 transition-all'>
							{currentUser ? (
								<Link to={`/profile/${currentUser.data._id}`}>
									<img
										src={currentUser.data.avatar || ''}
										alt=''
										className='rounded-full w-8 h-8 object-cover'
									/>
								</Link>
							) : (
								<Link to='/sign-in'>Sign In</Link>
							)}
						</li>
					</ul>
				</nav>
			</div>
		</header>
	)
}
export default Header
