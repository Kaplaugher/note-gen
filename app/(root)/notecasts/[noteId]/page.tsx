import React from "react";

const NoteDetails = ({ params }: { params: { noteId: string } }) => {
  return <p className="text-white-1">Note Details for {params.noteId}</p>;
};

export default NoteDetails;
