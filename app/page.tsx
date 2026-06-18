
import AdminButton from "./AdminButton";
import WindowManager from "./window/WindowManager";

export default function Home() {
   return (
    <main className="h-screen overflow-hidden bg-teal-700">
        <AdminButton />

        <WindowManager />
      
    </main>
  );
}