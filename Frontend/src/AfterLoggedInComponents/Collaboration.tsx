import React, { useState } from "react";
import Search from "../assets/search.png";
import Add from "../assets/add.gif"
import Time from "../assets/time.gif"

type CollaborationType = {
  setAddTeambtn: React.Dispatch<React.SetStateAction<boolean>>;
};

 const Collaboration: React.FC<CollaborationType> = ({ setAddTeambtn }) => {
  //  const [searchQuery, setSearchQuery] = useState("");
  //  const handleSearch = () => {
  //    if (searchQuery.trim()) {
  //      console.log("Searching for:", searchQuery);
  //      // Add your search logic here
  //    }
  //  };
  //  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //    if (e.key === "Enter") {
  //      handleSearch();
  //    }
  //  };
  const [ChatDiv, setChatDiv]=useState(false);

   return (
     <>
       <div className="flex flex-col md:flex-row justify-center items-start gap-4 px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
         {/* Left Panel - Search Section */}
         <div
           className={`flex flex-col justify-start items-center w-full  lg:w-[25%] h-screen  lg:h-[500px] xl:h-[600px] 2xl:h-[800px]  bg-white/20 backdrop-blur-md shadow-lg rounded-xl border border-white/10 p-4 sm:p-6 ${ChatDiv ? "hidden" : "flex"}`}
         >
           {/* Search Bar */}
           <div className="flex items-center bg-white rounded-full shadow-lg h-14 px-2 py-2 w-full mt-2">
             <img
               src={Search}
               alt="search"
               className="w-3 h-3 sm:w-4 sm:h-4  shrink-0 mr-1"
             />
             <input
               type="text"
               placeholder="Search Team"
               //  value={searchQuery}
               //  onChange={(e) => setSearchQuery(e.target.value)}
               //  onKeyPress={handleKeyPress}
               className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-xs sm:text-base min-w-0"
             />
             <button
               //  onClick={handleSearch}
               className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full ml-2 transition-colors cursor-pointer text-xs sm:text-sm  whitespace-nowrap"
             >
               Search
             </button>
             <img
               src={Add}
               alt="add team"
               className="w-12 cursor-pointer rounded-full lg:hidden 2xl:flex"
               onClick={() => setAddTeambtn(true)}
             />
           </div>
         </div>

         {/* Right Panel - Content Section - Hidden on mobile and tablet, visible on laptop+ */}
         <div
           className={`lg:flex items-center justify-center w-full h-[500px] xl:h-[600px] 2xl:h-[800px] bg-white/20 backdrop-blur-md shadow-lg rounded-xl border border-white/10 ${ChatDiv ? "flex" : "hidden"}`}
         >
           <div className="relative w-60 h-20 bg-green-500 font-bold text-white rounded-2xl transition-transform animate-bounce px-4 py-4">
             Feature Coming Soon
             <span className="font-extrabold">!!</span>
             <img
               src={Time}
               alt="time_icon"
               className="absolute left-40 -bottom-10 w-[80px] h-[80px] rounded-full"
             />
           </div>
         </div>
       </div>
     </>
   );
 };

export default Collaboration