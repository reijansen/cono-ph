export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="app-container py-6 sm:py-8">
        <div className="flex flex-col gap-2 pt-4 text-xs text-brand-700 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; ConoPH, {currentYear}</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}
