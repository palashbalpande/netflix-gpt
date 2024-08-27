import { useDispatch, useSelector } from "react-redux";
import lang from "../utils/languageConstants";
import { useEffect, useRef, useState } from "react";
import openai from "../utils/openai";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResults } from "../utils/gptSlice";

const GptSearchBar = () => {

    const langKey =useSelector((store) => store.config.lang);
    const searchText = useRef(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [loadingTextIndex, setLoadingTextIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const loadingTextOptions = ["Loading..⌛", "Connecting..🔗", "Exploring..🔍", "Unleashing..🔥", "Revealing..🎭"];

    const suggestions = [
        "Action-packed Thrillers",
        "Epic Historical Dramas",
        "Comedy Blockbusters"
    ];
    
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
            if(!text) {
                setErrorMessage("No response from AI, Please try again later");
                setLoading(false);
                return;
            } 

            const gptMovies = text.split(","); 

            const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
            const tmdbResults = await Promise.all(promiseArray);

            dispatch(addGptMovieResults({ movieNames: gptMovies, movieResults: tmdbResults }));

        } catch (error) {
            setErrorMessage("An error occured. Please try again later or check your Internet connection");    
            console.error("Error during GPT Search: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingTextIndex((prevIndex) => (prevIndex + 1) % loadingTextOptions.length);
        } ,1000)

        return () => clearInterval(interval);
        // eslint-disable-next-line
    } ,[]);

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

    const handleSuggestionClick = (suggestion) => {
        searchText.current.value = suggestion;  
    }

  return (
    <div className="pt-[40%] md:pt-[10%] flex justify-center flex-wrap">

        <form className="w-full md:w-1/2 bg-black grid grid-cols-12 rounded-md"
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
                {loading ? loadingTextOptions[loadingTextIndex] + " " : lang[langKey].search}
            </button>
        </form>
        {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}
        <p className="text-white text-sm mb-4 opacity-80">
            {lang[langKey].gptSearchTag}
        </p>

        <div className="w-full mt-8 md:w-3/3  bg-black bg-opacity-0 rounded-xl p-1 shadow-lg">
            <div className="flex flex-wrap justify-center gap-4">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        className="bg-gray-800 border border-white hover:bg-gray-700 text-white py-2 px-4 rounded-lg focus:outline-none transition duration-300 ease-in-out"
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>

    </div>
  )
}

export default GptSearchBar