import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : {}
}

export const dietRecordsSlice = createSlice({
    name:'dietRecords',
    initialState,
    reducers: {
        setDietRecords : (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setDietRecords } = dietRecordsSlice.actions

export default dietRecordsSlice.reducer