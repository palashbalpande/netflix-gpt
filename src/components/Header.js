import { LOGO_URL, USER_ICON_URL } from "../utils/constants"
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Header = () => {
  
  const navigate = useNavigate();
  const user = useSelector(store => store.user)
  
  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/");
    }).catch((error) => {
      navigate("/error");
    });
  }

  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex justify-between">
        <img 
            className="w-44"
            src={LOGO_URL}
            alt="Logo"
        />
        { user && (
          <div className="flex p-2">
            <img className="w-12 h-12 rounded-md" 
              alt="usericon" 
              src={user?.photoURL}
            />
            <button
              onClick={handleSignOut}
              className="font-bold text-white"
            >
              Sign Out
            </button>
          </div>
        )}
    </div>
  )
}

export default Header