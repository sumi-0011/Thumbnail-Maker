import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function ErrorPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-white">
      <div className="rounded-lg bg-white bg-opacity-10 p-8 text-center backdrop-blur-md">
        {/* <FailIcon className="mx-auto mb-4 h-24 w-24 animate-bounce text-yellow-300" /> */}
        <div className="flex items-center justify-center">
          <img
            src="https://avahrjwyynzeocqpyfhw.supabase.co/storage/v1/object/public/3d-fluent-emojis//smileys&emotion/crying_face/3D/crying_face_3d.png"
            alt="sorry"
            className="h-24 w-24"
          />
        </div>
        <h1 className="mb-4 mt-4 text-4xl font-bold">
          Oops, something went wrong!
        </h1>
        <p className="mb-6 text-xl">Sorry, an unexpected error has occurred.</p>
        <p className="mb-8 text-lg">Don't worry, we're on it!</p>
        <Button
          asChild
          className="bg-white text-purple-600 hover:bg-purple-100"
        >
          <Link to="/" className="inline-flex items-center">
            <span className="mr-2">🏠</span> Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
