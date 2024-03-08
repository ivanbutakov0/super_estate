import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ListingType } from '../pages/Profile'

const ListingItem = ({ listing }: { listing: ListingType }) => {
	console.log(listing.type)
	return (
		<article className='rounded-md shadow-md w-full sm:w-[330px] hover:shadow-lg transition-all overflow-hidden'>
			<Link to={`/listing/${listing._id}`}>
				<img
					src={listing.imageUrls[0]}
					alt='listing image'
					className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-all'
				/>
			</Link>
			<Link to={`/listing/${listing._id}`}>
				<div className='p-3 space-y-2'>
					<h3 className='text-lg font-bold'>{listing.name}</h3>
					<div className='flex items-center gap-2'>
						<MapPin width={15} height={15} stroke='#15803d' />
						<p className='text-slate-600 text-xs'>{listing?.address}</p>
					</div>
					<p className='text-slate-700 text-sm'>{listing.description}</p>
					<p className='text-slate-500 font-bold'>
						{listing.type === 'rent'
							? `$${listing.regularPrice} / month`
							: `$${listing.regularPrice}`}
					</p>
					<div className='flex items-center gap-3 text-xs text-slate-800 font-bold'>
						<span>{listing.bedrooms} Beds</span>
						<span>{listing.bathrooms} Baths</span>
					</div>
				</div>
			</Link>
		</article>
	)
}
export default ListingItem
