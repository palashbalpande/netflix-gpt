import { useDispatch, useSelector } from "react-redux";
import lang from "../utils/languageConstants";
import { useRef, useState } from "react";
import openai from "../utils/openai";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResults } from "../utils/gptSlice";

const GptSearchBar = () => {

    const langKey =useSelector((store) => store.config.lang);
    const searchText = useRef(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const searchMovieTMDB = async (movie) => {
        try {
            const data = await fetch(
                'https://api.themoviedb.org/3/search/movie?query=' + 
                    movie + 
                    '&include_adult=false&language=en-US&page=1', 
                API_OPTIONS
            );
            const json = await data.json();
            return json.results;
        } catch(error) {
            console.error("Error Fetching movie from TMDB: ", error);
            return [];
        }
    }

    const handleGptSearchClick = async () => {

        setLoading(true);
        setErrorMessage("");

        //Make an API call to GPT/Gemini API and get Movie Results

        const gptQuery = "Act as a Movie Recommendation system and suggest some movies for the query: " +
            searchText.current.value +
            ". only give me names of 5 distinct movies, comma separated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";
        try {
            const gptResults = await openai.generateContent(gptQuery);
            const response = gptResults.response;
            const text = await response.text();
            console.log(text);
            if(!text) {
                setErrorMessage("No response from AI, Please try again later");
                setLoading(false);
                return;
            } 

            const gptMovies = text.split(","); 

            const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
            const tmdbResults = await Promise.all(promiseArray);
            console.log(tmdbResults);

            dispatch(addGptMovieResults({ movieNames: gptMovies, movieResults: tmdbResults }));

        } catch (error) {
            setErrorMessage("An error occured. Please try again later or check your Internet connection");    
            console.error("Error during GPT Search: ", error);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="pt-[10%] flex justify-center">
        <form className="w-1/2 bg-black grid grid-cols-12 rounded-md"
            onSubmit={(e) => e.preventDefault()}
        >
            <input
                ref={searchText} 
                type="text" 
                className="p-4 m-4 col-span-9 rounded-md" 
                placeholder={lang[langKey].gptSearchPlaceholder} 
            />
            <button className="py-2 px-4 m-4 col-span-3 bg-red-700 text-white rounded-lg"
                onClick={handleGptSearchClick}
            >
                {lang[langKey].search}
            </button>
        </form>
    </div>
  )
}

export default GptSearchBar