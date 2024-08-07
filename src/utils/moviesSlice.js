import { createSlice } from "@reduxjs/toolkit";

const moviesSlice = createSlice({
    name: "movies",
    initialState: {
        trailerVideo: null,
        nowPlayingMovies: null,
        popularMovies: null,
        topRatedMovies: null,
        upcomingMovies: null,
    },
    reducers: {
        addTrailerVideo: (state, action) => {
            state.trailerVideo = action.payload;
        },
        addNowPlayingMovies: (state, action) => {
            state.nowPlayingMovies = action.payload;
        },
        addPopularMovies: (state, action) => {
            state.popularMovies = action.payload;
        },
        addTopRatedMovies: (state, action) => {
            state.topRatedMovies = action.payload;
        },
        addUpcomingMovies: (state, action) => {
            state.upcomingMovies = action.payload;
        },
    }
})

export const { addTrailerVideo, 
    addNowPlayingMovies, 
    addPopularMovies, 
    addTopRatedMovies, 
    addUpcomingMovies } = moviesSlice.actions;

export default moviesSlice.reducer;