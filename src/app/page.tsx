import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <Link href="/optimized">Optimized posts list</Link>
      <br />
      <Link href="/unoptimized">Unptimized posts list</Link>
    </main>
  );
}
