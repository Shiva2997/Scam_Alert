import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="mt-4 inline-block font-semibold text-brand underline underline-offset-4">
        Go to the home page
      </Link>
    </div>
  )
}
