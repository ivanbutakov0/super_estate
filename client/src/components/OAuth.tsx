import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { app } from '../firebase'
import { signInSuccess } from '../redux/user/userSlice'

const OAuth = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const handleClick = async () => {
		try {
			const provider = new GoogleAuthProvider()
			const auth = getAuth(app)

			const result = await signInWithPopup(auth, provider)

			const response = await fetch('http://localhost:3000/api/auth/google', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: result.user.displayName,
					email: result.user.email,
					photo: result.user.photoURL,
				}),
				credentials: 'include',
			})

			const data = await response.json()
			dispatch(signInSuccess(data))
			navigate('/')
		} catch (err) {
			console.log("Couldn't sign in with Google", err)
		}
	}
	return (
		<button
			type='button'
			className='p-3 bg-red-600 text-white rounded-md capitalize hover:bg-red-500 transition-all'
			onClick={handleClick}
		>
			Continue with Google
		</button>
	)
}
export default OAuth
