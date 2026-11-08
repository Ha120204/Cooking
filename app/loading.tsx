export default function Loading() {
  return <main className="mx-auto min-h-screen max-w-[1200px] animate-pulse px-4 py-24"><div className="h-12 max-w-md rounded-bep-md bg-bep-dim" /><div className="mt-6 h-16 max-w-xl rounded-bep-md bg-bep-dim" /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-80 rounded-bep-md bg-bep-dim" />)}</div></main>;
}
