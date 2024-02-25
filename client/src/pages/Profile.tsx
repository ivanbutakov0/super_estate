import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../redux/store'

const Profile = () => {
	const [formData, setFormData] = useState({})
	const [file, setFile] = useState<File | null>(null)
	const fileRef = useRef<HTMLInputElement | null>(null)

	const { currentUser, loading, error } = useSelector(
		(state: RootState) => state.user
	)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
	}

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		})
	}

	const handleDeleteAccount = async () => {}

	const handleSignOut = async () => {}

	const handleShowListing = async () => {}

	return (
		<section className='pt-10 px-2 max-w-lg mx-auto text-center'>
			<h1 className='text-3xl font-bold mb-10'>Profile</h1>
			<input
				type='file'
				ref={fileRef}
				onChange={e => {
					const selectedFile = e.target.files?.[0]
					if (selectedFile) {
						setFile(selectedFile)
					} else {
						console.log('No file selected')
					}
				}}
				hidden
			/>
			<img
				onClick={() => fileRef?.current?.click()}
				src={currentUser?.data.avatar}
				alt='user avatar'
				className='rounded-full w-24 h-24 object-cover inline-block mb-10 cursor-pointer hover:scale-110 transition-all'
			/>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4 mb-3'>
				<input
					type='text'
					placeholder='Username'
					name='username'
					id='username'
					required
					defaultValue={currentUser?.data.username}
					className='p-3 outline-none border border-gray rounded-md'
					onChange={handleChange}
				/>
				<input
					type='email'
					placeholder='Email'
					name='email'
					id='email'
					required
					defaultValue={currentUser?.data.email}
					className='p-3 outline-none border border-gray rounded-md'
					onChange={handleChange}
				/>
				<input
					type='password'
					placeholder='Password'
					name='password'
					id='password'
					required
					className='p-3 outline-none border border-gray rounded-md'
					onChange={handleChange}
				/>
				<button
					type='submit'
					className='p-3 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-all capitalize disabled:bg-slate-800'
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Update'}
				</button>
				<Link
					className='p-3 bg-green-600 text-white rounded-md hover:bg-green-500 transition-all capitalize disabled:bg-slate-800'
					to='/'
				>
					Create Listing
				</Link>
			</form>
			<div className='flex justify-between items-center mb-3'>
				<button
					type='button'
					className='text-red-600 hover:text-red-500 transition-all'
					onClick={handleDeleteAccount}
				>
					Delete account
				</button>
				<button
					type='button'
					className='text-red-600 hover:text-red-500 transition-all'
					onClick={handleSignOut}
				>
					Sign out
				</button>
			</div>
			<button
				type='button'
				className='text-green-600 hover:text-green-500 transition-all'
				onClick={handleShowListing}
			>
				Show listing
			</button>
			{error && <p className='text-red-500'>{error}</p>}
		</section>
	)
}
export default Profile
