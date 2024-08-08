import { BG_IMG_URL } from "../utils/constants";
import GptMovieSuggestions from "./GptMovieSuggestions";
import GptSearchBar from "./GptSearchBar";

const GptSearch = () => {
  return (
    <div>
      <div className="fixed -z-10">
        <img 
          src={BG_IMG_URL}
          alt="BG_IMG"
        />
      </div>
      <GptSearchBar />
      <GptMovieSuggestions />
    </div>
  )
}

export default GptSearch;