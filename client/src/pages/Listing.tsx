import { Armchair, Bath, BedDouble, MapPin, ParkingSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SwiperCore from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ListingType } from './Profile'

const Listing = () => {
	SwiperCore.use([Navigation])
	const [listingData, setListingData] = useState<ListingType | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const params = useParams()

	useEffect(() => {
		const fetchListing = async () => {
			const listingId = params.listingId
			try {
				setLoading(true)
				const response = await fetch(`/api/listing/${listingId}`)
				const data = await response.json()
				if (!data.success) {
					setLoading(false)
					console.log(data.message)
				}
				const listing = data.data
				setLoading(false)
				setListingData(listing)
			} catch (error) {
				setLoading(false)
				console.log(error)
			}
		}
		fetchListing()
	}, [])

	return (
		<section className='pb-5'>
			{loading && (
				<p className='text-lg font-bold capitalize text-center'>Loading...</p>
			)}
			<Swiper navigation className='mb-5'>
				{listingData?.imageUrls.map(url => (
					<SwiperSlide key={url}>
						<div
							className='h-[550px]'
							style={{
								background: `url(${url}) center no-repeat`,
								backgroundSize: 'cover',
							}}
						></div>
					</SwiperSlide>
				))}
			</Swiper>
			<div className='flex flex-col gap-4 max-w-4xl mx-auto p-5'>
				<h1 className='text-xl font-bold capitalize'>{listingData?.name}</h1>
				<div className='flex items-center gap-3'>
					<MapPin width={15} height={15} stroke='#15803d' />
					<p className='font-medium text-slate-600 text-sm'>
						{listingData?.description}
					</p>
				</div>
				<div className='flex gap-3 items-center '>
					<p className='bg-red-900 text-white p-1 text-center w-full max-w-48 rounded-md'>
						{listingData?.type === 'rent' ? 'For Rent' : 'For Sale'}
					</p>
					{listingData?.offer && (
						<p className='bg-green-900 text-white p-1 text-center w-full max-w-48 rounded-md'>
							${listingData?.discountPrice} discount
						</p>
					)}
				</div>
				<p className='text-slate-800'>
					<strong>Description</strong> - {listingData?.description}
				</p>
				<ul className='flex gap-6 text-green-800 font-medium mb-10'>
					<li className='flex items-center gap-1'>
						<BedDouble width={20} height={20} />
						<p>
							{listingData?.bedrooms}{' '}
							{Number(listingData?.bedrooms) > 1 ? 'beds' : 'bed'}
						</p>
					</li>
					<li className='flex items-center gap-1'>
						<Bath width={20} height={20} />
						<p>
							{listingData?.bathrooms}{' '}
							{Number(listingData?.bathrooms) > 1 ? 'baths' : 'bath'}
						</p>
					</li>
					<li className='flex items-center gap-1'>
						<ParkingSquare width={20} height={20} />
						<p>{listingData?.parking ? 'Parking' : 'No parking'}</p>
					</li>
					<li className='flex items-center gap-1'>
						<Armchair width={20} height={20} />
						<p>{listingData?.furnished ? 'Furnished' : 'Not furnished'}</p>
					</li>
				</ul>
				<button
					type='button'
					className='p-3 bg-slate-600 text-white capitalize w-full rounded-md hover:bg-slate-500 transition-all'
				>
					Contact landlord
				</button>
			</div>
		</section>
	)
}
export default Listing
