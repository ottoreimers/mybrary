"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function addBook(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const coverId = formData.get("cover_id") as string;
  const safeCoverId = /^\d+$/.test(coverId) ? coverId : null;
  const year = formData.get("first_publish_year") as string;

  const { error } = await supabase.from("books").insert({
    open_library_id: formData.get("open_library_id") as string,
    title: formData.get("title") as string,
    author: (formData.get("author") as string) || null,
    cover_url: safeCoverId
      ? `https://covers.openlibrary.org/b/id/${safeCoverId}-M.jpg`
      : null,
    first_publish_year: year ? Number(year) : null,
  });

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/");
  redirect("/");
}
