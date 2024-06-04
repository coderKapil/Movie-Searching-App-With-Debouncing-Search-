import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { API_URL } from "./context";
const SingleMovie = () => {
  // with the help of usepramas hook we can get the parameter which we want to extract from url
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [movie, setMovie] = useState("");

  const getMovies = async (url) => {
    setIsLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.Response === "True") {
        setIsLoading(false);
        // this time only data will be passed bcs we are getting a single object
        setMovie(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // applying debouncing here first we will delay the function inside useffect and then cleanup that timeout with clearTimeout function and now at the end we will get the output this will reduces the load on our server
    let timerID = setTimeout(() => {
      // here we have pass i which represent id bcs now we want to fetch a single movie data based on id
      getMovies(`${API_URL}&i=${id}`);
    }, 500);

    // Cleanup function
    return () => clearTimeout(timerID);
  }, [id]);

  //  agar movie load ho raha hai to loading mileaga
  if (isLoading) {
    return (
      <div className="movie-section">
        <div className="loading">Loading...</div>
      </div>
    );
  }
  //  else humko seedha movie ka data mileaga
  return (
    <>
      <section className="movie-section">
        <div className="movie-card">
          {/* in case u want to add some caption wuth the image */}
          <figure>
            <img src={movie.Poster} alt="poster" />
          </figure>

          <div className="card-content">
            <p className="title">{movie.Title}</p>
            <p className="card-text">{movie.Released}</p>
            <p className="card-text">{movie.Genre}</p>
            <p className="card-text">{movie.imdbRating} / 10</p>
            <p className="card-text">{movie.Country}</p>
            <NavLink to="/" className="back-btn">Go Back</NavLink>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleMovie;
