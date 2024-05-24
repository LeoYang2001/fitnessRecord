import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : null
}

export const userSlice = createSlice({
    name:'LOCAL_USER',
    initialState,
    reducers: {
        setLocalUser : (state, action) => {
            state.user = action.payload
        }
    }
})

export const { setLocalUser } = userSlice.actions

export default userSlice.reducer