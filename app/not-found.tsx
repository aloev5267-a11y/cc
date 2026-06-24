export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-black text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Страница не найдена</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-medium">На главную</a>
      </div>
    </div>
  )
}
