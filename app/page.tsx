import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import styles from "./page.module.scss";

const statusLabels = {
  want_to_read: "Want to read",
  reading: "Reading",
  read: "Read",
} as const;

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: books, error } = await supabase
    .from("books")
    .select("id, title, author, status, rating, cover_url")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return (
      <div className={styles.page}>
        <p>Could not load books.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1>Mybrary</h1>
      {books.length === 0 ? (
        <p>No books yet.</p>
      ) : (
        <ul className={styles.list}>
          {books.map((book) => (
            <li key={book.id} className={styles.item}>
              {book.cover_url && (
                <Image
                  src={book.cover_url}
                  alt={`Cover of ${book.title}`}
                  width={60}
                  height={90}
                  className={styles.cover}
                />
              )}
              <div className={styles.text}>
                <strong>{book.title}</strong>
                {book.author && <> by {book.author}</>}
                {" · "}
                {statusLabels[book.status as keyof typeof statusLabels]}
                {book.rating && <> · {"★".repeat(book.rating)}</>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
