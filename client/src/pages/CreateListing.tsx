import { useState } from 'react'

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
	imageUrls: File[]
}

const CreateListing = () => {
	const [loading, setLoading] = useState(false)
	const [uploading, setUploading] = useState(false)
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
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		console.log(formData)
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
						/>
						<button
							type='button'
							disabled={uploading}
							className='p-3 border border-green-700 rounded-md text-green-700 uppercase hover:shadow-lg transition-all'
						>
							{uploading ? 'UPLOADING...' : 'UPLOAD'}
						</button>
					</div>
					<button
						disabled={loading}
						className='bg-slate-700 hover:bg-slate-600 text-white uppercase p-3 rounded-md transition-all'
					>
						{loading ? 'Creating...' : 'Create Listing'}
					</button>
				</div>
			</form>
		</section>
	)
}
export default CreateListing
