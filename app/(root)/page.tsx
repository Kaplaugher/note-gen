import NotecastCard from "@/components/NotecastCard";
import { noteCastData } from "@/constants";
import React from "react";

const Page = () => {
  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending NoteCasts</h1>

        <div className="notecast_grid">
          {noteCastData?.map(({ id, title, description, imgURL }) => (
            <NotecastCard
              key={id}
              id={id}
              title={title}
              description={description}
              imgURL={imgURL}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
