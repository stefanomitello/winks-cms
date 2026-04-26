import { Post } from "../models/Post";

export async function seedPosts() {
  try {
    const count = await Post.countDocuments();

    if (count === 0) {
      console.log("Database vuoto, eseguo seed...");

      await Post.create([
        {
          title: "Primo post",
          body: "Contenuto del primo post",
          hashtags: ["tech", "news", "ai", "rome", "jobs"],
          author: "Brian Fox",
          status: "draft",
        },
        {
          title: "Secondo post",
          body: "Altro contenuto",
          hashtags: ["rome", "recruiter", "work", "jobs", "hiring"],
          author: "Brian Fox",
          status: "draft",
        },
        {
          title: "Terzo post",
          body: "Altro contenuto",
          hashtags: ["italy", "work", "jobs", "hiring"],
          author: "Brian Fox",
          status: "draft",
        },
        {
          title: "Quarto post",
          body: "Altro contenuto",
          hashtags: ["work", "jobs", "hiring"],
          author: "Brian Fox",
          status: "draft",
        },
        {
          title: "Quinto post",
          body: "Altro contenuto",
          hashtags: [],
          author: "Brian Fox",
          status: "draft",
        },
      ]);

      console.log("Seed completato");
    } else {
      console.log("Database già popolato, skip seed");
    }
  } catch (error) {
    console.error("Errore durante il seed:", error);
  }
}
