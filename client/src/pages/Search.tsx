import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListingType } from './Profile'

type searchFormData = {
	searchTerm: string
	type: string
	offer: boolean
	parking: boolean
	furnished: boolean
	sort: string
	order: string
}

const Search = () => {
	const navigate = useNavigate()
	const [listings, setListings] = useState<ListingType[] | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [showMore, setShowMore] = useState<boolean>(false)
	const [searchFormData, setSearchFormData] = useState<searchFormData>({
		searchTerm: '',
		type: 'all',
		offer: false,
		parking: false,
		furnished: false,
		sort: 'regularPrice',
		order: 'desc',
	})

	useEffect(() => {
		const params = new URLSearchParams(location.search)
		const searchTermFromUrl = params.get('searchTerm')
		const typeFromUrl = params.get('type')
		const parkingFromUrl = params.get('parking')
		const furnishedFromUrl = params.get('furnished')
		const offerFromUrl = params.get('offer')
		const sortFromUrl = params.get('sort')
		const orderFromUrl = params.get('order')

		if (
			searchTermFromUrl ||
			typeFromUrl ||
			parkingFromUrl ||
			furnishedFromUrl ||
			offerFromUrl ||
			sortFromUrl ||
			orderFromUrl
		) {
			setSearchFormData({
				searchTerm: searchTermFromUrl || '',
				type: typeFromUrl || 'all',
				parking: parkingFromUrl === 'true',
				furnished: furnishedFromUrl === 'true',
				offer: offerFromUrl === 'true',
				sort: sortFromUrl || 'regularPrice',
				order: orderFromUrl || 'desc',
			})
		}

		const fetchListings = async () => {
			try {
				setLoading(true)

				const searchQuery = params.toString()
				const response = await fetch(`/api/listing/?${searchQuery}`)
				const data = await response.json()

				if (!data.success) {
					setLoading(false)
					setError(data.message)
					return
				}

				const listings = data.data
				if (listings.length > 8) {
					setShowMore(true)
				} else {
					setShowMore(false)
				}

				setListings(listings)
				setError(null)
				setLoading(false)
			} catch (error: any) {
				setLoading(false)
				setError(error.message)
			}
		}

		fetchListings()
	}, [location.search])

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLSelectElement>
	) => {
		if (
			e.target.id === 'all' ||
			e.target.id === 'rent' ||
			e.target.id === 'sale'
		) {
			setSearchFormData({
				...searchFormData,
				type: e.target.id,
			})
		} else if (e.target.type === 'checkbox') {
			setSearchFormData({
				...searchFormData,
				[e.target.id]: (e.target as HTMLInputElement).checked,
			})
		} else if (e.target.id === 'sort_order') {
			console.log('sort: ', typeof e.target.value.split('_')[0])
			const sort = e.target.value.split('_')[0] || 'created_at'
			const order = e.target.value.split('_')[1] || 'desc'

			setSearchFormData({
				...searchFormData,
				sort,
				order,
			})
		} else {
			setSearchFormData({
				...searchFormData,
				[e.target.id]: e.target.value,
			})
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const params = new URLSearchParams()
		params.set('searchTerm', searchFormData.searchTerm)
		params.set('type', searchFormData.type)
		params.set('offer', searchFormData.offer.toString())
		params.set('parking', searchFormData.parking.toString())
		params.set('furnished', searchFormData.furnished.toString())
		params.set('sort', searchFormData.sort)
		params.set('order', searchFormData.order)
		const searchQuery = params.toString()
		navigate(`/search/?${searchQuery}`)
	}

	return (
		<section className='flex gap-3'>
			<form
				onSubmit={handleSubmit}
				className='p-6 flex-2 h-screen border-r-2 border-slate-200 space-y-6'
			>
				<label className='flex gap-2 items-center'>
					<span className='text-nowrap'>Search Term:</span>
					<input
						type='text'
						id='searchTerm'
						placeholder='Search...'
						value={searchFormData.searchTerm}
						className='p-3 w-full outline-none border border-gray rounded-md'
						onChange={handleChange}
					/>
				</label>
				<div className='flex gap-3 items-center'>
					<span>Type:</span>
					<label className='flex gap-2 items-center'>
						<input
							type='checkbox'
							id='all'
							className='w-5 h-5'
							checked={searchFormData.type === 'all'}
							onChange={handleChange}
						/>
						Rent & Sale
					</label>
					<label className='flex gap-2 items-center'>
						<input
							type='checkbox'
							id='rent'
							className='w-5 h-5'
							checked={searchFormData.type === 'rent'}
							onChange={handleChange}
						/>
						Rent
					</label>
					<label className='flex gap-2 items-center'>
						<input
							type='checkbox'
							id='sale'
							className='w-5 h-5'
							checked={searchFormData.type === 'sale'}
							onChange={handleChange}
						/>
						Sale
					</label>
					<label className='flex gap-2 items-center'>
						<input
							type='checkbox'
							id='offer'
							className='w-5 h-5'
							checked={searchFormData.offer}
							onChange={handleChange}
						/>
						Offer
					</label>
				</div>
				<div className='flex gap-3'>
					<span>Amenities:</span>
					<label className='flex gap-2 items-center'>
						<input
							type='checkbox'
							id='parking'
							className='w-5 h-5'
							checked={searchFormData.parking}
							onChange={handleChange}
						/>
						Parking
					</label>
					<label className='flex gap-2 items-center'>
						<input
							type='checkbox'
							id='furnished'
							className='w-5 h-5'
							checked={searchFormData.furnished}
							onChange={handleChange}
						/>
						Furnished
					</label>
				</div>
				<div className='flex gap-2 items-center'>
					<span>Sort:</span>
					<select
						id='sort_order'
						className='border rounded-md p-3'
						defaultValue='regularPrice_desc'
						onChange={handleChange}
					>
						<option value='regularPrice_desc'>Price high to low</option>
						<option value='regularPrice_asc'>Price low to high</option>
						<option value='createdAt_desc'>Latest</option>
						<option value='createdAt_asc'>Oldest</option>
					</select>
				</div>
				<button className='p-3 bg-slate-700 w-full text-white uppercase rounded-md hover:bg-slate-600 transition-all'>
					SEARCH
				</button>
			</form>
			<div className='flex-1 p-6'>
				<h1>Listing results</h1>
				<div className='flex flex-wrap gap-4'>
					{error && <p>{error}</p>}
					{loading && (
						<p className='text-xl text-slate-700 text-center w-full'>
							Loading...
						</p>
					)}
					{!loading && listings?.length === 0 && (
						<p className='text-xl text-slate-700'>No listings found</p>
					)}

					{/* {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

					{showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )} */}
				</div>
			</div>
		</section>
	)
}
export default Search
