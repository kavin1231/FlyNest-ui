import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function mediaUpload(file) {
  return new Promise((resolve, reject) => {
    if (file == null) {
      return reject("No file selected");
    }

    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.name}`;

    supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })
      .then((res) => {
        const { publicUrl } = supabase.storage.from("images").getPublicUrl(fileName).data;
        resolve(publicUrl);
      })
      .catch((err) => {
        reject("Error uploading file");
      });
  });
}
