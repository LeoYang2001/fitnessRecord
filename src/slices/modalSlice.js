import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : null
}

export const modalSlice = createSlice({
    name:'modal',
    initialState,
    reducers: {
        setModal : (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setModal } = modalSlice.actions

export default modalSlice.reducer