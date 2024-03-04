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
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signOutFailure,
	signOutStart,
	signOutSuccess,
	updateUserFailure,
	updateUserStart,
	updateUserSuccess,
} from '../redux/user/userSlice'
import { ListingState } from './CreateListing'

type FormDataState = {
	username?: string
	email?: string
	avatar?: string
}

type ListingsType = ListingState & {
	_id: string
	userRef: string
	createdAt: string
	updatedAt: string
}

const Profile = () => {
	const [formData, setFormData] = useState<FormDataState>({})
	const [file, setFile] = useState<File | undefined>(undefined)
	const fileRef = useRef<HTMLInputElement | null>(null)
	const [filePerc, setFilePerc] = useState(0)
	const [fileUploadError, setFileUploadError] = useState(false)
	const [updateSuccess, setUpdateSuccess] = useState(false)
	const [listings, setListings] = useState<ListingsType[]>([])
	const [listingsLoading, setListingsLoading] = useState(false)
	const [listingsError, setListingsError] = useState<any>(null)
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

	const handleDeleteAccount = async () => {
		try {
			dispatch(deleteUserStart())
			const response = await fetch(
				`/api/user/delete/${currentUser?.data._id}`,
				{
					method: 'DELETE',
					credentials: 'include',
				}
			)

			const data = await response.json()

			if (!data.success) {
				dispatch(deleteUserFailure(data.message))
				return
			}

			dispatch(deleteUserSuccess())
		} catch (error: any) {
			dispatch(deleteUserFailure(error.message))
			console.log('error', error)
		}
	}

	const handleSignOut = async () => {
		try {
			dispatch(signOutStart())
			const response = await fetch('/api/auth/signout')
			const data = await response.json()
			if (!data.success) {
				dispatch(signOutFailure(data.message))
				return
			}

			dispatch(signOutSuccess())
		} catch (error: any) {
			dispatch(signOutFailure(error.message))
		}
	}

	const handleShowListing = async () => {
		try {
			setListingsLoading(true)
			const response = await fetch(
				`/api/user/listings/${currentUser?.data._id}`
			)
			const data = await response.json()
			if (!data.success) {
				setListingsLoading(false)
				setListingsError(data.message)
			}
			setListingsError(null)
			setListingsLoading(false)
			setListings(data.data)
		} catch (error: any) {
			setListingsLoading(false)
			setListingsError(error)
		}
	}

	const handleDeleteListing = async (listingId: string) => {
		try {
			const response = await fetch(`/api/listing/delete/${listingId}`, {
				method: 'DELETE',
			})
			const data = await response.json()
			if (!data.success) {
				console.log('Delete listing error: ', data.message)
				return
			}

			setListings(prev => prev?.filter(listing => listing._id !== listingId))
			console.log(data)
		} catch (error) {
			console.log('Delete listing error: ', error)
		}
	}

	return (
		<section className='pt-10 py-4 px-2 max-w-lg mx-auto text-center'>
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
					to='/create-listing'
				>
					Create Listing
				</Link>
			</form>
			{error && <p className='text-red-500 py-2'>{error}</p>}
			{updateSuccess && (
				<p className='text-green-600 py-2'>
					User has been updated successfully!
				</p>
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
				className='text-green-600 hover:text-green-500 transition-all mb-4'
				onClick={handleShowListing}
			>
				{listingsLoading ? 'Loading...' : 'Show listings'}
			</button>
			{listingsError && (
				<p className='text-red-600 py-2 mb-4'>{listingsError}</p>
			)}
			{listings.length > 0 && (
				<div>
					<h1 className='text-2xl font-bold mb-4'>Your listings</h1>
					{listings.map((listing: ListingsType) => (
						<div
							key={listing._id}
							className='flex items-center justify-between border border-gray p-3 rounded-md'
						>
							<div className='flex items-center gap-3'>
								<Link to={`/listing/${listing._id}`}>
									<img
										src={listing.imageUrls[0]}
										alt='image of listing'
										className='w-20 object-contain'
									/>
								</Link>
								<Link to={`/listing/${listing._id}`}>
									<p className='font-bold capitalize hover:underline transition-all'>
										{listing.name}
									</p>
								</Link>
							</div>
							<div className='flex flex-col gap-1'>
								<button
									type='button'
									className='text-red-600 uppercase hover:scale-110 transition-all'
									onClick={() => handleDeleteListing(listing._id)}
								>
									Delete
								</button>
								<Link
									to={`/update-listing/${listing._id}`}
									className='text-green-600 uppercase hover:scale-110 transition-all'
								>
									Edit
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	)
}
export default Profile
