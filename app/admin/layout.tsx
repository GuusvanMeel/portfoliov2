export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" min-h-screen bg-[#111] text-white">
      <div className="max-w-5xl mx-auto py-10 px-6">
        {children}
      </div>
    </div>
  );
}