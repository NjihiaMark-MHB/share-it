import CreatePostForm from "./components/posts/create-post-form";
import Posts from "./components/posts/posts";

export default function HomePage() {

  return (
    <section className="pt-40">
      <div className="container mx-auto px-2">
        <div className="flex content-center items-center justify-center">
          <div className="w-full lg:w-6/12 px-4">
            <CreatePostForm />
            <Posts />
          </div>
        </div>
      </div>
    </section>
  );
}
