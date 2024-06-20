/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from "react";

import { Id } from "@/convex/_generated/dataModel";

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface TopNotecastersProps {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  podcast: {
    notecastTitle: string;
    notecastId: Id<"notecasts">;
  }[];
  totalNotecasts: number;
}

export interface NotecastProps {
  _id: Id<"notecasts">;
  _creationTime: number;
  audioStorageId: Id<"_storage"> | null;
  user: Id<"users">;
  notecastTitle: string;
  podcastDescription: string;
  audioUrl: string | null;
  imageUrl: string | null;
  imageStorageId: Id<"_storage"> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  voicePrompt: string;
  imagePrompt: string | null;
  voiceType: string;
  audioDuration: number;
  views: number;
}

export interface ProfileNotecastProps {
  notecasts: NotecastProps[];
  listeners: number;
}

export interface GenerateNotecastProps {
  voiceType: string;
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  voicePrompt: string;
  setVoicePrompt: Dispatch<SetStateAction<string>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
}

export interface LatestPodcastCardProps {
  imgUrl: string;
  title: string;
  duration: string;
  index: number;
  audioUrl: string;
  author: string;
  views: number;
  notecastId: Id<"notecasts">;
}

export interface PodcastDetailPlayerProps {
  audioUrl: string;
  notecastTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl: string;
  notecastId: Id<"notecasts">;
  imageStorageId: Id<"_storage">;
  audioStorageId: Id<"_storage">;
  authorImageUrl: string;
  authorId: string;
}

export interface AudioProps {
  title: string;
  audioUrl: string;
  author: string;
  imageUrl: string;
  notecastId: string;
}

export interface AudioContextType {
  audio: AudioProps | undefined;
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}

export interface NotecastCardProps {
  imgUrl: string;
  title: string;
  description: string;
  notecastId: Id<"notecasts">;
}

export interface CarouselProps {
  fansLikeDetail: TopNotecastersProps[];
}

export interface ProfileCardProps {
  podcastData: ProfileNotecastProps;
  imageUrl: string;
  userFirstName: string;
}

export type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};
