import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

const SignUp = () => {
	const [formData, setFormData] = useState({})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<any>(null)
	const navigate = useNavigate()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		})
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			setLoading(true)
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})

			const data = await response.json()

			if (!data.success) {
				setError(data.message)
				setLoading(false)
				return
			}

			setLoading(false)
			setError(null)
			navigate('/sign-in')
		} catch (error) {
			setError(error)
		}
	}

	return (
		<section className='pt-10 px-2 max-w-lg mx-auto text-center'>
			<h1 className='text-3xl font-bold mb-6'>Sign Up</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4 mb-3'>
				<input
					type='text'
					placeholder='Username'
					name='username'
					id='username'
					required
					className='p-3 outline-none border border-gray rounded-md'
					onChange={handleChange}
				/>
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
					className='p-3 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-all capitalize disabled:bg-slate-800'
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Sign Up'}
				</button>
				<OAuth />
			</form>
			<div>
				<span>Already have an account? </span>
				<Link to='/sign-in' className='text-sky-600'>
					Sign In
				</Link>
			</div>
			{error && <p className='text-red-500'>{error}</p>}
		</section>
	)
}
export default SignUp
