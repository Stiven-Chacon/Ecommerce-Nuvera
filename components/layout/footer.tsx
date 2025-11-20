export function Footer() {
  return (
    <footer >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Nuvera. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
