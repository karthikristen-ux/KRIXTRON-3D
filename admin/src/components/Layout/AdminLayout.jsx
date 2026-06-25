import Sidebar from '../Sidebar/Sidebar'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-k-black">
      <Sidebar />
      {/* Main content area — offset by sidebar width */}
      <main className="ml-[260px] min-h-screen transition-all duration-300">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
