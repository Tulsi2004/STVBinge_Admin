"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import './deletemovie.css'


interface Movie {
  _id: string;
  title: string;
}

const DeleteMoviePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]); // State for existing movies

  // Fetch movies from the backend
  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies`, // Adjust according to your actual endpoint
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMovies(data.data); // Adjust according to your response structure
      } else {
        console.error("Failed to fetch movies", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching movies", error);
    }
  };

  // Handle the delete movie action
  const handleDeleteMovie = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/deletemovie/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message, { position: "top-center" });
        fetchMovies(); // Refresh the movie list after deletion
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete movie", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Error deleting movie", { position: "top-center" });
    }
  };

  // Fetch the movies when the component mounts
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      <h1>Delete Movie</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>
            {movie.title}
            <button onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <ToastContainer />
      
    </div>
  );
};

export default DeleteMoviePage;
