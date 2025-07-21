import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { useAuth } from '@/AuthContext';
import { collection, getDocs, doc, updateDoc, arrayUnion, addDoc, query, where } from 'firebase/firestore';
import MovieCard from '@/components/MovieCard';
import Modal from '@/components/Modal';

export default function MovieList() {
  const { currentUser } = useAuth();
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedMovies, setSelectedMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      const querySnapshot = await getDocs(collection(db, "movies"));
      const moviesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllMovies(moviesData);
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const results = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(results);
  }, [searchTerm, allMovies]);
  
  useEffect(() => {
    if (isModalOpen && currentUser) {
      const fetchCollections = async () => {
        const q = query(collection(db, "collections"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        setCollections(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchCollections();
    }
  }, [isModalOpen, currentUser]);

  const handleSelectMovie = (movieId) => {
    setSelectedMovies(prevSelected =>
      prevSelected.includes(movieId)
        ? prevSelected.filter(id => id !== movieId) 
        : [...prevSelected, movieId]
    );
  };
  
  const handleAddToExistingCollection = async (collectionId) => {
    const collectionRef = doc(db, "collections", collectionId);
    await updateDoc(collectionRef, {
      movies: arrayUnion(...selectedMovies)
    });
    alert(`Added ${selectedMovies.length} movies to collection!`);
    cleanupAfterBulkAdd();
  };

  const handleCreateAndAddToCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    await addDoc(collection(db, "collections"), {
      name: newCollectionName,
      userId: currentUser.uid,
      movies: selectedMovies
    });
    alert(`Created collection "${newCollectionName}" and added ${selectedMovies.length} movies!`);
    cleanupAfterBulkAdd();
  };
  
  const cleanupAfterBulkAdd = () => {
    setSelectedMovies([]);
    setIsModalOpen(false);
    setNewCollectionName('');
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Add {selectedMovies.length} movies to a collection</h2>
        <hr/>
        <h3>Your Collections</h3>
        {collections.map(c => (
          <button key={c.id} onClick={() => handleAddToExistingCollection(c.id)}>
            {c.name}
          </button>
        ))}
        <hr/>
        <h3>Or, Create a New Collection</h3>
        <form onSubmit={handleCreateAndAddToCollection}>
          <input type="text" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} placeholder="New collection name"/>
          <button type="submit">Create and Add</button>
        </form>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Movies</h1>
        {selectedMovies.length > 0 && (
          <button onClick={() => setIsModalOpen(true)} disabled={!currentUser}>
            {currentUser ? `Add ${selectedMovies.length} Selected to Collection` : 'Login to Add'}
          </button>
        )}
      </div>
      <input type="text" placeholder="Search for a movie..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '0.5rem', width: '100%', marginBottom: '2rem' }}/>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {filteredMovies.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie}
            onSelect={handleSelectMovie}
            isSelected={selectedMovies.includes(movie.id)}
          />
        ))}
      </div>
    </div>
  );
}