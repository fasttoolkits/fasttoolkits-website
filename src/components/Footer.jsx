function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-8">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} FastToolKits. Fast, free tools for everyday life.
        </p>
      </div>
    </footer>
  )
}

export default Footer
