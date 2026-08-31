import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectip } from "../../features/ipSlice";
import { selectid } from "../../features/idSlice";

const WebRecod = ({ notes, setnotes, reload, setreload }) => {
  const ip = useSelector(selectip);
  const id = useSelector(selectid);

  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const bufferRef = useRef(notes?.note || ""); // keep latest text locally

  const staffID = sessionStorage.getItem("staffID");
  const getid = JSON.parse(staffID);

  // Keep bufferRef updated when notes change externally
  useEffect(() => {
    bufferRef.current = notes?.note || "";
  }, [notes]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("🎤 Speech recognition started");
      setError("");
    };

    recognition.onresult = async (event) => {
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + " ";
        }
      }

      if (finalText.trim()) {
        // ✅ Always append to latest buffer, not stale state
        bufferRef.current = (bufferRef.current + " " + finalText.trim()).trim();

        // ✅ Update displayed notes
        setnotes(bufferRef.current);

        try {
          // ✅ Save immediately on each transcription
          await axios.post(`http://${ip?.ip}:7700/ClinicalNote`, {
            note: bufferRef.current,
            uid: id?.id,
            staffid: getid?._id,
          });
          setreload((r) => r + 1);
        } catch (err) {
          console.error("❌ Error saving note:", err);
          setError("Error saving note.");
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log("🛑 Speech recognition ended");
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    // return () => {
    //   recognition.stop();
    // };
  }, []); // dependencies only if identifiers change

  const startRecording = () => {
    if (!recognitionRef.current || isRecording) return;
    try {
      recognitionRef.current.start();
      setIsRecording(true);
      setError("");
    } catch (err) {
      console.error("Start error:", err);
      setError("Unable to start recording");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={{ margin: "20px 0" }}>
      {isSupported ? (
        <>
          <h3>Online Transcription</h3>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: isRecording ? "red" : "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isRecording ? "⏹️ Stop Recording" : "🎤 Start Recording"}
          </button>

          {isRecording && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              🎙️ Listening... Speak now!
            </p>
          )}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </>
      ) : (
        <p style={{ color: "red" }}>
          Speech recognition is not supported on this browser.
        </p>
      )}
    </div>
  );
};

export default WebRecod;
