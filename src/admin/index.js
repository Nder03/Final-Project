import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function AdminPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const querySnapshot = await getDocs(collection(db, "movies"));
      const moviesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMovies(moviesData);
    };
    fetchMovies();
  }, []);

  const handleAddMovie = () => {
    alert("Opening form to add a new movie.");
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm(`Are you sure you want to delete movie ${movieId}?`)) {
      await deleteDoc(doc(db, "movies", movieId));
      setMovies(movies.filter(movie => movie.id !== movieId));
    }
  };

  return (
    <div>
      <h1>Admin - Manage Movies</h1>
      <button onClick={handleAddMovie}>Add New Movie</button>
      <hr />
      {movies.map(movie => (
        <div key={movie.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <img src={movie.cover} alt={movie.title} width="50" />
          <span>{movie.title}</span>
          <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}