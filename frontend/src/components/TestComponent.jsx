// In your React app (e.g., App.jsx or TestComponent.jsx)
import { useEffect, useState } from 'react';

function TestComponent() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      {message ? <p>{message}</p> : <p>Loading...</p>}
    </div>
  );
}

export default TestComponent;
