import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import allJobsSlice from './features/allJobs/allJobsSlice';
export const store = configureStore({
  reducer: {
    user: userSlice,
    allJobs: allJobsSlice,
  },
});
