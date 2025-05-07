import { useState } from 'react';
import { X, Search, Plus, Home, Compass, Film, Tv, ChevronDown, ChevronRight, Heart, Settings as SettingsIcon, BookmarkPlus } from 'lucide-react';
import { CreatePostButton } from './CreatePostButton.jsx';

export default function MovieBrowser() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [exploreExpanded, setExploreExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('movies');
  const [searchQuery, setSearchQuery] = useState('');
  
  const movies = [
    {
      id: 1,
      title: "Inception",
      image: "./images/movie1.jpg",
      genre: "Action, Adventure, Sci-Fi",
      platforms: ["Netflix", "HBO Max"],
      rating: 4.8,
      year: 2010,
      director: "Christopher Nolan",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      image: "./images/movie1.jpg",
      genre: "Drama",
      platforms: ["Netflix", "Amazon Prime"],
      rating: 4.9,
      year: 1994,
      director: "Frank Darabont",
      description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
    },
    {
      id: 3,
      title: "The Dark Knight",
      image: "./images/movie1.jpg",
      genre: "Action, Crime, Drama",
      platforms: ["HBO Max"],
      rating: 4.9,
      year: 2008,
      director: "Christopher Nolan",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
    },
    {
      id: 4,
      title: "Pulp Fiction",
      image: "./images/movie1.jpg",
      genre: "Crime, Drama",
      platforms: ["Amazon Prime", "Netflix"],
      rating: 4.7,
      year: 1994,
      director: "Quentin Tarantino",
      description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
    },
    {
      id: 5,
      title: "The Godfather",
      image: "./images/movie1.jpg",
      genre: "Crime, Drama",
      platforms: ["Netflix", "Paramount+"],
      rating: 4.9,
      year: 1972,
      director: "Francis Ford Coppola",
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
    },
    {
      id: 6,
      title: "Interstellar",
      image: "./images/movie1.jpg",
      genre: "Adventure, Drama, Sci-Fi",
      platforms: ["Paramount+"],
      rating: 4.7,
      year: 2014,
      director: "Christopher Nolan",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
    },
    {
      id: 7,
      title: "The Matrix",
      image: "./images/movie1.jpg",
      genre: "Action, Sci-Fi",
      platforms: ["HBO Max", "Amazon Prime"],
      rating: 4.8,
      year: 1999,
      director: "Lana Wachowski, Lilly Wachowski",
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
    },
    {
      id: 8,
      title: "Parasite",
      image: "./images/movie1.jpg",
      genre: "Comedy, Drama, Thriller",
      platforms: ["Hulu"],
      rating: 4.8,
      year: 2019,
      director: "Bong Joon Ho",
      description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan."
    }
  ];

  const toggleExplore = () => {
    setExploreExpanded(!exploreExpanded);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const addToWatchlist = (e, movie) => {
    e.stopPropagation(); // Prevent modal from closing
    // In a real app, this would add the movie to a watchlist
    console.log(Added ${movie.title} to watchlist);
    // You could show a toast notification here
    alert(Added ${movie.title} to watchlist);
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-pink-800/20 via-black to-orange-300/20">
        <div className="flex items-center">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-800 to-orange-300 flex items-center">
            <img src="./images/logo.png" alt="RateIt Logo" className="w-20 h-14"/>
            RateIt
          </div>
        </div>
        
        {/* Centered search bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl">
          <div className="relative transition-all duration-300 hover:scale-105">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search movies"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full py-2 pl-10 pr-4 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
            />
          </div>
        </div>
        
        <CreatePostButton />
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800">
          <nav className="p-2">
            <ul>
              <li className="mb-2">
                <a href="#" className="flex items-center p-3 rounded-md hover:bg-gradient-to-r hover:from-pink-800/30 hover:to-orange-300/30 transition duration-300 transform hover:translate-x-1">
                  <Home size={20} className="mr-3 text-orange-300" />
                  <span>Home</span>
                </a>
              </li>
              <li className="mb-2">
                <button 
                  onClick={toggleExplore}
                  className="w-full flex items-center justify-between p-3 rounded-md hover:bg-gradient-to-r hover:from-pink-800/30 hover:to-orange-300/30 transition duration-300 transform hover:translate-x-1"
                >
                  <div className="flex items-center">
                    <Compass size={20} className="mr-3 text-pink-500" />
                    <span>Explore</span>
                  </div>
                  {exploreExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                </button>
                
                {exploreExpanded && (
                  <div className="ml-6 mt-1 space-y-1 animate-fadeIn">
                    <button 
                      className={flex items-center p-2 rounded-md w-full text-left ${activeSection === 'movies' ? 'bg-gradient-to-r from-pink-800/40 to-orange-300/40' : 'hover:bg-gray-800'} transition duration-200}
                      onClick={() => setActiveSection('movies')}
                    >
                      <Film size={16} className="mr-2 text-orange-300" />
                      <span>Movies</span>
                    </button>
                    <button 
                      className={flex items-center p-2 rounded-md w-full text-left ${activeSection === 'tvshows' ? 'bg-gradient-to-r from-pink-800/40 to-orange-300/40' : 'hover:bg-gray-800'} transition duration-200}
                      onClick={() => setActiveSection('tvshows')}
                    >
                      <Tv size={16} className="mr-2 text-pink-400" />
                      <span>TV Shows</span>
                    </button>
                  </div>
                )}
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center p-3 rounded-md hover:bg-gradient-to-r hover:from-pink-800/30 hover:to-orange-300/30 transition duration-300 transform hover:translate-x-1">
                  <Heart size={20} className="mr-3 text-pink-500" />
                  <span>Recommendations</span>
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center p-3 rounded-md hover:bg-gradient-to-r hover:from-pink-800/30 hover:to-orange-300/30 transition duration-300 transform hover:translate-x-1">
                  <SettingsIcon size={20} className="mr-3 text-orange-300" />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Movie grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-700/20 border border-gray-800 hover:border-orange-300/30 cursor-pointer group"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="p-3">
                  <div className="rounded-lg overflow-hidden mb-3 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full object-cover aspect-[2/3]" 
                    />
                  </div>
                  
                  <div className="px-1">
                    <h3 className="font-medium text-center text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-700 group-hover:to-orange-300 transition-all duration-300">{movie.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-400 text-sm">{movie.year}</span>
                      <span className="text-yellow-400 text-sm">{movie.rating}⭐</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for movie details */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg w-full max-w-3xl relative border border-gray-800">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:scale-110 transition-all duration-300 z-20"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col md:flex-row">
              {/* Left side - Image */}
              <div className="w-full md:w-2/5">
                <div className="relative h-full">
                  <img
                    src={selectedMovie.image}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Right side - Content */}
              <div className="w-full md:w-3/5 p-5 md:p-6">
                <div className="flex items-center mb-2">
                  <span className="flex items-center text-yellow-400 mr-3">
                    <span className="text-lg font-semibold">{selectedMovie.rating}</span>
                    ⭐
                  </span>
                  <span className="text-gray-400">{selectedMovie.year}</span>
                </div>
                
                <h2 className="text-2xl font-bold mb-3">{selectedMovie.title}</h2>
                
                <div className="mb-4">
                  <h3 className="text-base font-medium mb-1">Genre</h3>
                  <p className="text-gray-300 text-sm">{selectedMovie.genre}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-base font-medium mb-1">Director</h3>
                  <p className="text-gray-300 text-sm">{selectedMovie.director}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-base font-medium mb-1">Synopsis</h3>
                  <p className="text-gray-300 text-sm">{selectedMovie.description}</p>
                </div>
                
                <div className="mb-5">
                  <h3 className="text-base font-medium mb-1">Available on</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.platforms.map((platform, index) => (
                      <span key={index} className="bg-gray-800 rounded-md px-3 py-1 text-xs">{platform}</span>
                    ))}
                  </div>
                </div>
                
                {/* Add to Watchlist Button */}
                <div>
                  <button 
                    onClick={(e) => addToWatchlist(e, selectedMovie)}
                    className="w-full bg-gradient-to-r from-pink-800 to-orange-300 text-white px-4 py-2 rounded-md hover:from-pink-900 hover:to-orange-400 transition duration-300 font-medium"
                  >
                    Add to Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}