"use client";
import NotecastCard from "@/components/NotecastCard";
import { noteCastData } from "@/constants";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Page = () => {
  const trendingNotecasts = useQuery(api.notecasts.getTrendingNotecasts);
  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending NoteCasts</h1>

        <div className="notecast_grid">
          {trendingNotecasts?.map(
            ({ _id, notecastTitle, notecastDescription, imageUrl }) => (
              <NotecastCard
                key={_id}
                notecastId={_id}
                title={notecastTitle}
                description={notecastDescription}
                imgUrl={imageUrl}
              />
            )
          )}
        </div>
        {/* {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)} */}
      </section>
    </div>
  );
};

export default Page;
