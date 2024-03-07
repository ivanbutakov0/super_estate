const Search = () => {
	return (
		<section className='flex gap-3'>
			<form className='p-6 flex-2 h-screen border-r-2 border-slate-200 space-y-6'>
				<label className='flex gap-2 items-center'>
					<span className='text-nowrap'>Search Term:</span>
					<input
						type='text'
						id='searchTerm'
						placeholder='Search...'
						className='p-3 w-full outline-none border border-gray rounded-md'
					/>
				</label>
				<div className='flex gap-3 items-center'>
					<span>Type:</span>
					<label className='flex gap-2 items-center'>
						<input type='checkbox' id='all' className='w-5 h-5' />
						Rent & Sale
					</label>
					<label className='flex gap-2 items-center'>
						<input type='checkbox' id='rent' className='w-5 h-5' />
						Rent
					</label>
					<label className='flex gap-2 items-center'>
						<input type='checkbox' id='sale' className='w-5 h-5' />
						Sale
					</label>
					<label className='flex gap-2 items-center'>
						<input type='checkbox' id='offer' className='w-5 h-5' />
						Offer
					</label>
				</div>
				<div className='flex gap-3'>
					<span>Amenities:</span>
					<label className='flex gap-2 items-center'>
						<input type='checkbox' id='parking' className='w-5 h-5' />
						Parking
					</label>
					<label className='flex gap-2 items-center'>
						<input type='checkbox' id='furnished' className='w-5 h-5' />
						Furnished
					</label>
				</div>
				<div className='flex gap-2 items-center'>
					<span>Sort:</span>
					<select id='sort_order' className='border rounded-md p-3'>
						<option value='regularPrice_desc'>Price high to low</option>
						<option value='regularPrice_asc'>Price low to high</option>
						<option value='createdAt_desc' selected>
							Latest
						</option>
						<option value='createdAt_asc'>Oldest</option>
					</select>
				</div>
				<button className='p-3 bg-slate-700 w-full text-white uppercase rounded-md hover:bg-slate-600 transition-all'>
					SEARCH
				</button>
			</form>
			<div className='flex-1 p-6'>
				<h1>Listing results</h1>
			</div>
		</section>
	)
}
export default Search
