import Post from "./post";

type PostProps = {
	params: {
		postId: string;
	};
}

export default function PostPage({params} : PostProps) {
  return (
    <section className="pt-40">
      <div className="container mx-auto px-2">
        <div className="flex content-center items-center justify-center">
          <div className="w-full lg:w-6/12 px-4">
			<Post postId={params.postId}/>
		  </div>
        </div>
      </div>
    </section>
  );
}
