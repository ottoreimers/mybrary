import { addBook } from "./actions";
import Image from "next/image";

type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

async function searchBooks(query: string): Promise<OpenLibraryDoc[]> {
  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set(
    "fields",
    "key,title,author_name,first_publish_year,cover_i",
  );
  url.searchParams.set("limit", "10");

  const res = await fetch(url, {
    headers: {
      "User-Agent": `mybrary (${process.env.OPEN_LIBRARY_CONTACT ?? "no contact set"})`,
    },
  });

  if (!res.ok) {
    throw new Error(`Open Library returned ${res.status}`);
  }

  const data = await res.json();
  return data.docs;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const results = q ? await searchBooks(q) : [];

  return (
    <div>
      <h1>Find a book</h1>

      <form>
        <input name="q" defaultValue={q} placeholder="Title, author or ISBN" />
        <button type="submit">Search</button>
      </form>

      <ul>
        {results.map((book) => (
          <li key={book.key}>
            {book.cover_i && (
              <Image
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt=""
                width={60}
                height={90}
              />
            )}
            <strong>{book.title}</strong>
            {book.author_name && <> by {book.author_name.join(", ")}</>}
            {book.first_publish_year && <> ({book.first_publish_year})</>}
            <form action={addBook}>
              <input type="hidden" name="open_library_id" value={book.key} />
              <input type="hidden" name="title" value={book.title} />
              <input
                type="hidden"
                name="author"
                value={book.author_name?.join(", ") ?? ""}
              />
              <input type="hidden" name="cover_id" value={book.cover_i ?? ""} />
              <input
                type="hidden"
                name="first_publish_year"
                value={book.first_publish_year ?? ""}
              />
              <button type="submit">Save</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
