import { GenerateNotecastProps } from "@/types";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { v4 as uuidv4 } from "uuid";
import { generateUploadUrl } from "@/convex/files";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";

// logic to generate notecast
const useGenerateNotecast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GenerateNotecastProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getNotecastAudio = useAction(api.openai.generateAudioAction);
  const getAudioUrl = useMutation(api.notecasts.getUrl);

  const generateNotecast = async () => {
    setIsGenerating(true);
    setAudio("");
    if (!voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate a notecast",
      });
      return setIsGenerating(false);
    }
    try {
      const response = await getNotecastAudio({
        voice: voiceType,
        input: voicePrompt,
      });
      // generate the file
      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `notecast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });
      // upload the file
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any)
        .storageId as Id<"_storage">;
      setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Successfully generated a notecast",
      });
    } catch (error) {
      toast({
        title: "Error generating notecast",
        variant: "destructive",
      });

      console.log("Error generating notecast", error);
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateNotecast,
  };
};

const GenerateNotecast = (props: GenerateNotecastProps) => {
  const { isGenerating, generateNotecast } = useGenerateNotecast(props);
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generateNotecast}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GenerateNotecast;
