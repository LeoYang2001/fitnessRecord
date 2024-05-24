import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : false
}

export const navBarSlice = createSlice({
    name:'navBar',
    initialState,
    reducers: {
        setNavBar : (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setNavBar } = navBarSlice.actions

export default navBarSlice.reducer