import React, { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectip } from "../../features/ipSlice";
import { selectid } from "../../features/idSlice";

export default function Recorder({ notes, setnotes, reload, setreload }) {
  const ip = useSelector(selectip);
  const id = useSelector(selectid);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribe, setisTranscribe] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const staffID = sessionStorage.getItem("staffID");
  const getid = JSON.parse(staffID);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = async () => {
      setIsRecording(false);
      setisTranscribe(true);
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      try {
        const res = await axios.post(`http://${ip?.ip}:7700/transcribe`, formData);

        if (res.data.transcript) {
          const updatedNotes = (notes?.note || "") + " " + res.data.transcript;
          setnotes(updatedNotes);

          await axios.post(`http://${ip?.ip}:7700/ClinicalNote`, {
            note: updatedNotes,
            uid: id?.id,
            staffid: getid?._id,
          });

          setreload((r) => r + 1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setisTranscribe(false);
      }
    };

    mediaRecorderRef.current.stop();
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <h3>Offline Transcription</h3>
      <button
        style={{
          padding: "10px",
          margin: "0 10px 0 0",
          backgroundColor: "green",
          color: "white",
          border: "none",
        }}
        onClick={startRecording}
        disabled={isRecording}
      >
        {isRecording ? "Listening..." : "Start Recording"}
      </button>
      <button
        style={
          isRecording
            ? { padding: "10px", backgroundColor: "red", color: "white", border: "none" }
            : { padding: "10px" }
        }
        onClick={stopRecording}
        disabled={!isRecording}
      >
        Stop & Transcribe
      </button>

      <div>
        {isRecording && (
          <span style={{ color: "red", fontWeight: "bold" }}>● Recording</span>
        )}
        {isTranscribe && (
          <span style={{ color: "green", fontWeight: "bold" }}>
            ● TRANSCRIBING ...
          </span>
        )}
      </div>
    </div>
  );
}
