import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { app } from '../firebase'
import { RootState } from '../redux/store'
import {
	updateUserFailure,
	updateUserStart,
	updateUserSuccess,
} from '../redux/user/userSlice'

type FormDataState = {
	username?: string
	email?: string
	avatar?: string
}

const Profile = () => {
	const [formData, setFormData] = useState<FormDataState>({})
	const [file, setFile] = useState<File | undefined>(undefined)
	const fileRef = useRef<HTMLInputElement | null>(null)
	const [filePerc, setFilePerc] = useState(0)
	const [fileUploadError, setFileUploadError] = useState(false)
	const [updateSuccess, setUpdateSuccess] = useState(false)
	const dispatch = useDispatch()
	const { currentUser, loading, error } = useSelector(
		(state: RootState) => state.user
	)

	useEffect(() => {
		if (file) {
			handleFileUpload(file)
		}
	}, [file])

	const handleFromSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			dispatch(updateUserStart())
			const response = await fetch(
				`/api/user/update/${currentUser?.data._id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				}
			)
			const data = await response.json()
			if (!data.success) {
				dispatch(updateUserFailure(data.message))
				return
			}
			dispatch(updateUserSuccess(data))
			setUpdateSuccess(true)
		} catch (error: any) {
			dispatch(updateUserFailure(error.message))
		}
	}

	const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		})
	}

	// handle Image upload to the state
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0]
		if (selectedFile) {
			setFile(selectedFile)
		} else {
			console.log('no file')
		}
	}

	//handle File upload to the firebase
	const handleFileUpload = async (file: File) => {
		const storage = getStorage(app)
		const fileName = new Date().getTime() + file.name
		const storageRef = ref(storage, fileName)
		const uploadTask = uploadBytesResumable(storageRef, file)

		uploadTask.on(
			'state_changed',
			snapshot => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				setFilePerc(Math.round(progress))

				switch (snapshot.state) {
					case 'paused':
						console.log('Upload is paused')
						break
					case 'running':
						console.log('Upload is running')
						break
				}
			},
			error => {
				setFileUploadError(true)
				console.log('error', error)
			},
			async () => {
				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
				setFormData({ ...formData, avatar: downloadURL })
			}
		)
	}

	const handleDeleteAccount = async () => {}

	const handleSignOut = async () => {}

	const handleShowListing = async () => {}

	return (
		<section className='pt-10 px-2 max-w-lg mx-auto text-center'>
			<h1 className='text-3xl font-bold mb-10'>Profile</h1>
			<div className='relative'>
				<input type='file' ref={fileRef} onChange={handleImageUpload} hidden />
				<img
					onClick={() => fileRef?.current?.click()}
					src={formData.avatar || currentUser?.data?.avatar}
					alt='user avatar'
					className='rounded-full w-24 h-24 object-cover inline-block mb-12 cursor-pointer hover:scale-110 transition-all'
				/>
				<p className='mb-4 absolute bottom-0 left-0 right-0'>
					{fileUploadError ? (
						<span className='text-red-600'>Upload Failed</span>
					) : filePerc > 0 && filePerc < 100 ? (
						`${filePerc}%`
					) : filePerc === 100 ? (
						<span className='text-green-600'>Success image upload</span>
					) : (
						''
					)}
				</p>
			</div>
			<form onSubmit={handleFromSubmit} className='flex flex-col gap-4 mb-3'>
				<input
					type='text'
					placeholder='Username'
					name='username'
					id='username'
					required
					defaultValue={currentUser?.data.username}
					className='p-3 outline-none border border-gray rounded-md'
					onChange={handleInputChange}
				/>
				<input
					type='email'
					placeholder='Email'
					name='email'
					id='email'
					required
					defaultValue={currentUser?.data.email}
					className='p-3 outline-none border border-gray rounded-md'
					onChange={handleInputChange}
				/>
				<input
					type='password'
					placeholder='Password'
					name='password'
					id='password'
					className='p-3 outline-none border border-gray rounded-md'
					onChange={handleInputChange}
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
			{error && <p className='text-red-500 py-2'>{error}</p>}
			{updateSuccess && (
				<p className='text-green-600 py-2'>User is updated successfully!</p>
			)}
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
		</section>
	)
}
export default Profile
