import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { useStateProvider } from "@/context/StateContext";

// Dynamically import WaveSurfer with SSR disabled

const WaveSurfer = dynamic(() => import("wavesurfer.js"), { ssr: false });

function CaptureAudio({ hide }) {
  const [{ userInfo, currentChatuser, socket }, dispatch] = useStateProvider();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // Initialize WaveSurfer.js instance
  useEffect(() => {
    if (typeof window !== "undefined" && waveFormRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true,
      });
  
      setWaveForm(wavesurfer); // Save the created waveform instance
  
      // Load the audio file (optional)
      wavesurfer.load("path_to_audio_file");
  
      return () => {
        wavesurfer.destroy(); // Cleanup on unmount
      };
    }
  }, []);
  

  const handleStartRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();

        setIsRecording(true);
        recordingIntervalRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);

        mediaRecorderRef.current.ondataavailable = (event) => {
          setRecordedAudio(event.data);
          setRenderedAudio(URL.createObjectURL(event.data));
        };

        mediaRecorderRef.current.onstop = () => {
          clearInterval(recordingIntervalRef.current);
          setRecordingDuration(0);
          setIsRecording(false);
        };
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayRecording = () => {
    if (waveForm && renderedAudio) {
      waveForm.load(renderedAudio);
      waveForm.play();
      setIsPlaying(true);

      waveForm.on("audioprocess", () => {
        const currentTime = waveForm.getCurrentTime();
        setCurrentPlaybackTime(currentTime);
      });

      waveForm.on("ready", () => {
        const duration = waveForm.getDuration();
        setTotalDuration(duration);
      });
    }
  };

  const handlePauseRecording = () => {
    if (waveForm) {
      waveForm.pause();
      setIsPlaying(false);
    }
  };

  const sendRecording = async () => {
    if (socket && recordedAudio) {
      const formData = new FormData();
      formData.append("audio", recordedAudio, "audio_message.wav");

      // Send the recorded audio to the server
      socket.emit("send-audio", { audioData: formData, to: currentChatuser.id });
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash className="text-panel-header-icon" onClick={() => hide()} />
      </div>
      <div className="mx-4 py-2 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse 2-60 text-center">
            Recording <span>{formatTime(recordingDuration)}</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && <span>{formatTime(currentPlaybackTime)}</span>}
        {recordedAudio && !isPlaying && <span>{formatTime(totalDuration)}</span>}
        <audio ref={audioRef} hidden />

        <div className="mr-4">
          {!isRecording ? (
            <FaMicrophone className="text-red-500" onClick={handleStartRecording} />
          ) : (
            <FaPauseCircle className="text-red-500" onClick={handleStopRecording} />
          )}
        </div>
        <div>
          <MdSend className="text-panel-header-icon cursor-pointer mr-4" title="Send" onClick={sendRecording} />
        </div>
      </div>
    </div>
  );
}

export default CaptureAudio;
