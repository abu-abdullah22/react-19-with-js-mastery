import { useEffect, useState } from "react"
import {useDebounce} from 'react-use'
import Search from "./components/Search"
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = 'https://api.themoviedb.org/3' ;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY ;

const API_OPTIONS = {
  method : 'GET',
  headers : {
    accept: 'application/json',
    Authorization : `Bearer ${API_KEY}`
  }
}


function App() {
  const [searchTerm, setSearchTerm] = useState('') ;
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('')
  const [movieList, setMovieList] = useState([]) ;
  const [isLoading, setIsLoading] = useState(false) 

  useDebounce(()=> setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '')=> {
    setIsLoading(true) ;
    setErrorMsg('')

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)} ` :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc` ;
      const response = await fetch(endpoint, API_OPTIONS) ;

      if(!response.ok) {
        throw new Error('Failed to fetch movies') ;
      }

      const data = await response.json() ;

      if(data.Response === 'False') {
        setErrorMsg(data.Error || 'Failed to fetch movies')
        setMovieList([])
        return ;
      }

      setMovieList(data.results || [])
    
    } catch(error) {
      console.log(`Error : ${error}`);
      setErrorMsg('Error fetching Movies try again later.')
    } finally {
      setIsLoading(false) 
    }
  }

  useEffect(()=> {
    fetchMovies(debouncedSearchTerm) ;
  },[debouncedSearchTerm]) ;

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero banner" />
          <h1>Find <span className="text-gradient">Movies </span>You'll Enjoy Without the Hassle</h1>
          <Search setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        </header>
        <section className="all-movies mt-5">
          <h2>All Movies</h2>

          {isLoading ? (<p className="text-white"><Spinner /></p>) : errorMsg ? (<p className="text-red-500">{errorMsg}</p>) : (<ul>
            {movieList.map((movie)=> (
              <p key={movie.id} className="text-white"><MovieCard key={movie.id} movie={movie}/> </p>
            ))}
          </ul>)} 
          
        </section>

       

      </div>
    </main>
  )
}

export default App
