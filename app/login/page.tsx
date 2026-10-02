import { login } from "./actions";
import styles from "./page.module.scss";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;

  return (
    <div className={styles.page}>
      <h1>Log in</h1>

      <form action={login} className={styles.form}>
        <label>
          Email
          <input name="email" type="email" required />
        </label>

        <label>
          Password
          <input name="password" type="password" required />
        </label>

        {error && <p>Wrong email or password.</p>}

        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
