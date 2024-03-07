import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../redux/store'

const Header = () => {
	const { currentUser } = useSelector((state: RootState) => state.user)
	const [searchTerm, setSearchTerm] = useState<string>('')
	const navigate = useNavigate()

	useEffect(() => {
		const params = new URLSearchParams(location.search)
		const searchTerm = params.get('searchTerm')
		if (searchTerm) {
			setSearchTerm(searchTerm)
		}
	}, [location.search])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const params = new URLSearchParams(window.location.search)
		params.set('searchTerm', searchTerm)
		const searchQuery = params.toString()
		navigate(`/search/?${searchQuery}`)
	}

	return (
		<header className='bg-slate-200 shadow-md'>
			<div className='flex gap-4 items-center justify-between p-4 max-w-7xl mx-auto'>
				<Link
					to='/'
					className='sm:text-2xl text-base text-slate-500 font-bold '
				>
					Super<strong className='text-slate-700 font-extrabold'>Estate</strong>
				</Link>
				<form
					onSubmit={handleSubmit}
					className='flex items-center gap-2 bg-slate-100 px-3 rounded-lg '
				>
					<input
						type='text'
						placeholder='Search...'
						className='bg-transparent outline-none py-3 md:w-64 sm:w-44 w-24 sm:text-sm text-xs'
						value={searchTerm}
						onChange={handleInputChange}
					/>
					<button>
						<Search
							size={18}
							strokeWidth={4}
							cursor={'pointer'}
							className='text-slate-600'
						/>
					</button>
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
