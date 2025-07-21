import Link from 'next/link';

export default function MovieCard({ movie }) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
        <img src={movie.cover || 'https://via.placeholder.com/150'} alt={movie.title} width="150" />
        <h3>{movie.title}</h3>
      </div>
    </Link>
  );
}