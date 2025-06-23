export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 bg-black text-white">
      <div className="flex items-center justify-center min-h-screen w-full p-4">
        <div className="flex items-center justify-center w-full">
          {children}
        </div>
      </div>
    </div>
  )
} 