import Link from 'next/link';

export default function CollectionCard({ collection }) {
  const handleEdit = (e) => {
    e.preventDefault();
    alert(`Editing ${collection.name}`);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    [cite_start]
    alert(`Removing ${collection.name}`);
  };

  return (
    <Link href={`/collections/${collection.id}`}>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', cursor: 'pointer', width: '200px' }}>
        [cite_start]
        <img src={collection.cover || '/default-cover.png'} alt={collection.name} width="180" />
        <h3>{collection.name}</h3>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleRemove}>Remove</button>
      </div>
    </Link>
  );
}