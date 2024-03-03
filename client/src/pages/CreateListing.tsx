import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../redux/store'

interface FormDataState {
	name: string
	description: string
	address: string
	type: string
	parking: boolean
	furnished: boolean
	offer: boolean
	bedrooms: number
	bathrooms: number
	regularPrice: number
	discountPrice: number
	imageUrls: string[]
}

const CreateListing = () => {
	const { currentUser } = useSelector((state: RootState) => state.user)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<any>(null)
	const [uploading, setUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [files, setFiles] = useState<File[]>([])
	const navigate = useNavigate()
	const [formData, setFormData] = useState<FormDataState>({
		imageUrls: [],
		name: '',
		description: '',
		address: '',
		type: 'rent',
		bedrooms: 1,
		bathrooms: 1,
		regularPrice: 0,
		discountPrice: 0,
		offer: false,
		parking: false,
		furnished: false,
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setLoading(true)
		try {
			const response = await fetch('/api/listing/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					userRef: currentUser?.data._id,
				}),
			})
			const data = await response.json()
			if (!data.success) {
				setError(data.message)
				setLoading(false)
			}
			setLoading(false)
			navigate('/')
		} catch (error: any) {
			setLoading(false)
			setError(error.message)
		}
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.id]: e.target.value })

		if (e.target.id === 'sell' || e.target.id === 'rent') {
			setFormData({
				...formData,
				type: e.target.id,
			})
		} else if (e.target.type === 'checkbox') {
			setFormData({
				...formData,
				[e.target.id]: (e.target as HTMLInputElement).checked,
			})
		} else {
			setFormData({
				...formData,
				[e.target.id]: e.target.value,
			})
		}
	}

	const handleImageUpload = () => {
		if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
			setUploading(true)
			const promises: Promise<string>[] = []

			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]))
			}
			Promise.all(promises)
				.then((urls: string[]) => {
					setFormData({
						...formData,
						imageUrls: formData.imageUrls.concat(urls),
					})
					setUploading(false)
					setUploadError(null)
				})
				.catch((error: any) => {
					setUploading(false)
					setUploadError('Image upload failed (2mb max per image)')
				})
		} else {
			setUploadError('Max number of images reached (6)')
			setUploading(false)
		}
	}

	const storeImage = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const storage = getStorage()
			const fileName = new Date().getTime() + file.name
			const storageRef = ref(storage, fileName)
			const uploadTask = uploadBytesResumable(storageRef, file)
			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					console.log('Upload is ' + progress + '% done')
				},
				error => {
					reject(error)
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						resolve(downloadURL)
					})
				}
			)
		})
	}

	const handleDeleteImage = (index: number) => {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((_, i) => i !== index),
		})
	}

	return (
		<section className='pt-10 px-2 max-w-4xl mx-auto text-center'>
			<h1 className='text-3xl font-bold mb-10'>Create Listing</h1>
			<form onSubmit={handleSubmit} className='flex gap-5 justify-between'>
				<div className='flex flex-1 flex-col gap-3'>
					<input
						type='text'
						id='name'
						minLength={5}
						maxLength={50}
						placeholder='Name'
						required
						value={formData.name}
						className='p-3 outline-none border border-gray rounded-md'
						onChange={handleChange}
					/>
					<textarea
						id='description'
						placeholder='Description'
						rows={3}
						required
						value={formData.description}
						className='p-3 border border-gray rounded-md'
						onChange={handleChange}
					/>
					<input
						type='text'
						id='address'
						placeholder='Address'
						required
						value={formData.address}
						className='p-3 outline-none border border-gray rounded-md'
						onChange={handleChange}
					/>
					<div className='flex gap-3'>
						<label className='flex gap-2 items-center'>
							<input
								type='checkbox'
								id='sell'
								checked={formData.type === 'sell'}
								className='w-5 h-5'
								onChange={handleChange}
							/>
							Sell
						</label>
						<label className='flex gap-2 items-center'>
							<input
								type='checkbox'
								id='rent'
								checked={formData.type === 'rent'}
								className='w-5 h-5'
								onChange={handleChange}
							/>
							Rent
						</label>
						<label className='flex gap-2 items-center'>
							<input
								type='checkbox'
								id='parking'
								checked={formData.parking}
								className='w-5 h-5'
								onChange={handleChange}
							/>
							Parking spot
						</label>
						<label className='flex gap-2 items-center'>
							<input
								type='checkbox'
								id='furnished'
								checked={formData.furnished}
								className='w-5 h-5'
								onChange={handleChange}
							/>
							Furnished
						</label>
					</div>
					<label className='flex gap-2 items-center'>
						<input
							type='checkbox'
							id='offer'
							checked={formData.offer}
							className='w-5 h-5'
							onChange={handleChange}
						/>
						Offer
					</label>
					<div className='flex gap-8'>
						<label className='flex gap-2 items-center'>
							<input
								type='number'
								id='bedrooms'
								value={formData.bedrooms}
								className='w-24 p-3 outline-none border border-gray rounded-md'
								onChange={handleChange}
							/>
							Beds
						</label>
						<label className='flex gap-2 items-center'>
							<input
								type='number'
								id='bathrooms'
								value={formData.bathrooms}
								className='w-24 p-3 outline-none border border-gray rounded-md'
								onChange={handleChange}
							/>
							Baths
						</label>
					</div>
					<label className='flex gap-2 items-center'>
						<input
							type='number'
							id='regularPrice'
							value={formData.regularPrice}
							className='w-36 p-3 outline-none border border-gray rounded-md'
							onChange={handleChange}
						/>
						Regular price
						{formData.type === 'rent' ? <span>($ / month)</span> : ''}
					</label>
					{formData.offer && (
						<label className='flex gap-2 items-center'>
							<input
								type='number'
								id='discountPrice'
								value={formData.discountPrice}
								className='w-36 p-3 outline-none border border-gray rounded-md'
								onChange={handleChange}
							/>
							Discount price
							{formData.type === 'rent' ? <span>($ / month)</span> : ''}
						</label>
					)}
				</div>
				<div className='flex flex-col flex-1 gap-3'>
					<span className='text-left'>
						<strong>Images:</strong> The first image will be the cover (max 6)
					</span>
					<div className='flex gap-3'>
						<input
							type='file'
							id='images'
							accept='image/*'
							multiple
							className='cursor-pointer border border-gray p-3 rounded-md'
							onChange={e => {
								const newFiles = e.target.files
								if (newFiles) {
									setFiles([...newFiles])
								}
							}}
						/>
						<button
							type='button'
							disabled={uploading}
							className='p-3 border border-green-700 rounded-md text-green-700 uppercase hover:shadow-lg transition-all'
							onClick={handleImageUpload}
						>
							{uploading ? 'UPLOADING...' : 'UPLOAD'}
						</button>
					</div>
					<p className='text-red-600'>{uploadError ? uploadError : ''}</p>
					{formData.imageUrls.length > 0
						? formData.imageUrls.map((url, index) => (
								<div
									key={url}
									className='flex items-center justify-between border border-gray p-3 rounded-md'
								>
									<img
										src={url}
										alt='listing image'
										className='w-20 h-20 object-contain rounded-md'
									/>
									<button
										type='button'
										className='uppercase p-3 text-red-600 hover:scale-110 transition-all'
										onClick={() => handleDeleteImage(index)}
									>
										delete
									</button>
								</div>
						  ))
						: ''}
					<button
						disabled={loading}
						className='bg-slate-700 hover:bg-slate-600 text-white uppercase p-3 rounded-md transition-all'
					>
						{loading ? 'Creating...' : 'Create Listing'}
					</button>
					<p className='text-red-600'>{error ? error : ''}</p>
				</div>
			</form>
		</section>
	)
}
export default CreateListing
