import { Link } from 'react-router-dom'

const SignUp = () => {
	return (
		<section className='pt-10 px-2 max-w-lg mx-auto text-center'>
			<h1 className='text-3xl font-bold mb-6'>Sign Up</h1>
			<form className='flex flex-col gap-4 mb-3'>
				<input
					type='text'
					placeholder='Username'
					name='username'
					id='username'
					required
					className='p-3 outline-none border border-gray rounded-md'
				/>
				<input
					type='email'
					placeholder='Email'
					name='email'
					id='email'
					required
					className='p-3 outline-none border border-gray rounded-md'
				/>
				<input
					type='password'
					placeholder='Password'
					name='password'
					id='password'
					required
					className='p-3 outline-none border border-gray rounded-md'
				/>
				<button
					type='submit'
					className='p-3 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-all capitalize'
				>
					Sign Up
				</button>
				<button
					type='button'
					className='p-3 bg-red-600 text-white rounded-md capitalize hover:bg-red-500 transition-all'
				>
					Continue with Google
				</button>
			</form>
			<div>
				<span>Already have an account? </span>
				<Link to='/sign-in' className='text-sky-600'>
					Sign In
				</Link>
			</div>
		</section>
	)
}
export default SignUp
