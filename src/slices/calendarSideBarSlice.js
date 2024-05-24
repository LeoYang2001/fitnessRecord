import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : false
}

export const calendarSideBarSlice = createSlice({
    name:'calendarSideBar',
    initialState,
    reducers: {
        setCalendarSideBar : (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setCalendarSideBar } = calendarSideBarSlice.actions

export default calendarSideBarSlice.reducer