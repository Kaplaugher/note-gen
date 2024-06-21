"use client";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import NotecastCard from "@/components/NotecastCard";
import NotecastDetailPlayer from "@/components/NotecastDetailPlayer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";

const NoteDetails = ({
  params: { notecastId },
}: {
  params: { notecastId: Id<"notecasts"> };
}) => {
  const notecast = useQuery(api.notecasts.getNotecastById, {
    notecastId: notecastId,
  });
  const similarNotecasts = useQuery(api.notecasts.getnotecastByVoiceType, {
    notecastId: notecastId,
  });

  if (!similarNotecasts || !notecast) {
    return <LoaderSpinner />;
  }

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currenty Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{notecast?.views}</h2>
        </figure>
      </header>

      {/* <NotecastDetailPlayer /> */}

      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        {notecast?.notecastDescription}
      </p>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">
            {notecast?.voicePrompt}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
          <p className="text-16 font-medium text-white-2">
            {notecast?.imagePrompt}
          </p>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar notecasts</h1>
        {similarNotecasts && similarNotecasts.length > 0 ? (
          <div className="notecast_grid">
            {similarNotecasts?.map(
              ({ _id, notecastTitle, notecastDescription, imageUrl }) => (
                <NotecastCard
                  key={_id}
                  imgUrl={imageUrl as string}
                  title={notecastTitle}
                  description={notecastDescription}
                  notecastId={_id}
                />
              )
            )}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar notecasts found"
              buttonLink="/discover"
              buttonText="Discover more notecasts"
            />
          </>
        )}
      </section>
    </section>
  );
};

export default NoteDetails;
