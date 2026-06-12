import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary-100 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Page Not Found</h2>
        <p className="text-surface-500 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
