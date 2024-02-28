import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { RootState } from '../redux/store'
import {
	signInFailure,
	signInStart,
	signInSuccess,
} from '../redux/user/userSlice'

const SignIn = () => {
	const [formData, setFormData] = useState({})
	const { loading, error } = useSelector((state: RootState) => state.user)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		})
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			dispatch(signInStart())
			const response = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
				credentials: 'include',
			})

			console.log('cookie set successfully')

			const data = await response.json()

			if (!data.success) {
				dispatch(signInFailure(data.message))
				return
			}

			dispatch(signInSuccess(data))
			navigate('/')
		} catch (err: any) {
			dispatch(signInFailure(err.message))
		}
	}

	return (
		<section className='pt-10 px-2 max-w-lg mx-auto text-center'>
			<h1 className='text-3xl font-bold mb-6'>Sign In</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4 mb-3'>
				<input
					type='email'
					placeholder='Email'
					name='email'
					id='email'
					required
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
					className='p-3 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-all capitalize'
				>
					{loading ? 'Loading...' : 'Sign In'}
				</button>
				<OAuth />
			</form>
			<div>
				<span>Don't have an account? </span>
				<Link to='/sign-up' className='text-sky-600'>
					Sign Up
				</Link>
			</div>
			{error && <p className='text-red-500'>{error}</p>}
		</section>
	)
}
export default SignIn
