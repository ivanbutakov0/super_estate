import { createSlice } from '@reduxjs/toolkit'

export type currentUserType = {
	success: boolean
	data: {
		_id: string
		username: string
		email: string
		createdAt: string
		updatedAt: string
		avatar?: string
	}
}

export type UserState = {
	currentUser: currentUserType | null
	error: string | null
	loading: boolean
}

const initialState: UserState = {
	currentUser: null,
	error: null,
	loading: false,
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		signInStart: state => {
			state.loading = true
		},
		signInSuccess: (state, action) => {
			state.currentUser = action.payload
			state.loading = false
			state.error = null
		},
		signInFailure: (state, action) => {
			state.error = action.payload
			state.loading = false
		},
		updateUserStart: state => {
			state.loading = true
		},
		updateUserSuccess: (state, action) => {
			state.currentUser = action.payload
			state.loading = false
			state.error = null
		},
		updateUserFailure: (state, action) => {
			state.error = action.payload
			state.loading = false
		},
		deleteUserStart: state => {
			state.loading = true
		},
		deleteUserSuccess: state => {
			state.currentUser = null
			state.loading = false
			state.error = null
		},
		deleteUserFailure: (state, action) => {
			state.error = action.payload
			state.loading = false
		},
	},
})

export const {
	signInStart,
	signInSuccess,
	signInFailure,
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	deleteUserFailure,
} = userSlice.actions

export default userSlice.reducer
