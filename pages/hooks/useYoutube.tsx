import YouTube, { YouTubeProps, YouTubePlayer } from "react-youtube";
import { ReactNode, useEffect, useRef, useState } from "react";

type ReturnValues = {
  currentTime: number;
  youtubePlayer: YouTubePlayer;
  renderYoutube: () => ReactNode;
};

const useYoutube = (props: YouTubeProps): ReturnValues => {
  const youtubePlayer = useRef<YouTubePlayer>();
  const [intervalCheck, setIntervalCheck] = useState<number>(0);
  const [playerState, setPlayerState] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const _onReady: YouTubeProps["onReady"] = (event) => {
    props.onReady?.(event);
    youtubePlayer.current = event.target;
  };
  const _onStateChange: YouTubeProps["onStateChange"] = (event) => {
    props.onStateChange?.(event);
    setPlayerState(event.target.getPlayerState());
    setCurrentTime(event.target.getCurrentTime());
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setCurrentTime(youtubePlayer.current?.getCurrentTime());
      if (playerState === 1) {
        setIntervalCheck(intervalCheck + 1);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [playerState, intervalCheck]);

  const renderYoutube: ReturnValues["renderYoutube"] = () => (
    <YouTube {...props} onReady={_onReady} onStateChange={_onStateChange} />
  );

  return {
    renderYoutube,
    currentTime,
    youtubePlayer,
  };
};

export default useYoutube;
