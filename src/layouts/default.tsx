import Navbar from "@/components/navbar";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />

      <main className="container pt-6 mx-auto">{children}</main>
    </div>
  );
}
