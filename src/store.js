import { configureStore } from "@reduxjs/toolkit"
import calendarSideBarSlice from "./slices/calendarSideBarSlice"
import dietRecordsSlice from "./slices/dietRecordsSlice"
import modalSlice from "./slices/modalSlice"
import navBarSlice from "./slices/navBarSlice"
import userSlice from "./slices/userSlice"
import weightRecordsSlice from "./slices/weightRecordsSlice"

export const store = configureStore({
    reducer: {
        LOCAL_USER: userSlice,
        navBar: navBarSlice,
        modal: modalSlice,
        calendarSideBar: calendarSideBarSlice,
        weightRecords: weightRecordsSlice,
        dietRecords: dietRecordsSlice
    }
})