import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SwiperCore from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import ListingItem from '../components/ListingItem'
import { ListingType } from './Profile'

const Home = () => {
	const [offerListings, setOfferListings] = useState<ListingType[]>([])
	const [rentListings, setRentListings] = useState<ListingType[]>([])
	const [saleListings, setSaleListings] = useState<ListingType[]>([])
	SwiperCore.use([Navigation])

	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const response = await fetch('/api/listing/?offer=true&limit=4')
				const data = await response.json()
				setOfferListings(data.data)
				fetchRentListings()
			} catch (error) {
				console.log(error)
			}
		}

		const fetchRentListings = async () => {
			try {
				const response = await fetch('/api/listing/?type=rent&limit=4')
				const data = await response.json()
				setRentListings(data.data)
				fetchSaleListings()
			} catch (error) {
				console.log(error)
			}
		}

		const fetchSaleListings = async () => {
			try {
				const response = await fetch('/api/listing/?type=sale&limit=4')
				const data = await response.json()
				setSaleListings(data.data)
			} catch (error) {
				console.log(error)
			}
		}

		fetchOfferListings()
	}, [])

	return (
		<section>
			<div className='px-4 py-28 max-w-6xl mx-auto'>
				<h1 className='text-slate-700 font-bold text-3xl sm:text-6xl max-w-[650px] mb-5'>
					Find you next <span className='text-slate-500'>perfect</span> place
					with ease
				</h1>
				<p className='mb-4 text-slate-500 text-sm max-w-[450px]'>
					Super Estate will help you find your home fast, easy and comfortable.
					Our expert support are always available.
				</p>
				<Link
					to='/search'
					className='text-sm font-bold text-blue-800 hover:text-blue-700 transition-all'
				>
					Let's Start now...
				</Link>
			</div>
			{/* Swiper */}
			<Swiper navigation className='mb-10'>
				{offerListings &&
					offerListings.length > 0 &&
					offerListings.map(listing => (
						<SwiperSlide key={listing._id}>
							<Link to={`/listing/${listing._id}`}>
								<div
									style={{
										background: `url(${listing.imageUrls[0]}) center no-repeat`,
										backgroundSize: 'cover',
									}}
									className='h-[500px]'
								></div>
							</Link>
						</SwiperSlide>
					))}
			</Swiper>
			<div className='px-4 pb-10 max-w-6xl mx-auto'>
				<h2 className='text-xl text-slate-600 font-semibold'>Recent offers</h2>
				<Link
					to={'/search?offer=true'}
					className='text-sm text-blue-800 inline-block mb-5 hover:underline'
				>
					Show more offers
				</Link>
				<div className='flex flex-wrap gap-3'>
					{offerListings &&
						offerListings.length > 0 &&
						offerListings.map(listing => (
							<ListingItem listing={listing} key={listing._id} />
						))}
				</div>
			</div>
			<div className='px-4 pb-10 max-w-6xl mx-auto'>
				<h2 className='text-xl text-slate-600 font-semibold'>
					Recent places for rent
				</h2>
				<Link
					to={'/search?type=rent'}
					className='text-sm text-blue-800 inline-block mb-5 hover:underline'
				>
					Show more places for rent
				</Link>
				<div className='flex flex-wrap gap-3'>
					{rentListings &&
						rentListings.length > 0 &&
						rentListings.map(listing => (
							<ListingItem listing={listing} key={listing._id} />
						))}
				</div>
			</div>
			<div className='px-4 pb-10 max-w-6xl mx-auto'>
				<h2 className='text-xl text-slate-600 font-semibold'>
					Recent places for sale
				</h2>
				<Link
					to={'/search?type=sale'}
					className='text-sm text-blue-800 inline-block mb-5 hover:underline'
				>
					Show more places for sale
				</Link>
				<div className='flex flex-wrap gap-3'>
					{saleListings &&
						saleListings.length > 0 &&
						saleListings.map(listing => (
							<ListingItem listing={listing} key={listing._id} />
						))}
				</div>
			</div>
		</section>
	)
}
export default Home
