export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-4 text-center">
        <p>© {new Date().getFullYear()} Spotavibe. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-purple-400">Twitter</a>
          <a href="#" className="hover:text-purple-400">Facebook</a>
          <a href="#" className="hover:text-purple-400">Instagram</a>
        </div>
      </footer>
    )
  }
  