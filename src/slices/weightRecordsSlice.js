import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : {}
}

export const weightRecordsSlice = createSlice({
    name:'weightRecords',
    initialState,
    reducers: {
        setWeightRecords : (state, action) => {
            state.value = action.payload
        },
    }
})

export const { setWeightRecords } = weightRecordsSlice.actions

export default weightRecordsSlice.reducer