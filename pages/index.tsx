import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useQuery } from "react-query";
import YouTube, { YouTubeProps, YouTubePlayer } from "react-youtube";
import { useEffect, useRef, useState } from "react";
import { Box, Text, Flex, Input, Select } from "@chakra-ui/react";

export default function Home() {
  const youtubePlayer = useRef<YouTubePlayer>();
  const [intervalCheck, setIntervalCheck] = useState<number>(0);
  const [playerState, setPlayerState] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoId, setVideoId] = useState<string>("FaLBcSMVVuU");
  const [lan, setLan] = useState<string>("");

  const _onReady: YouTubeProps["onReady"] = (event) => {
    youtubePlayer.current = event.target;
  };
  const _onStateChange: YouTubeProps["onStateChange"] = (event) => {
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

  const { data } = useQuery(`captions-${videoId}`, () =>
    fetch(`/api/captions?videoId=${videoId}`, {
      method: "GET",
    }).then((value) => value.json())
  );

  const { data: cap } = useQuery(
    `${videoId}${lan}`,
    () => lan && fetch(lan).then((value) => value.text())
  );

  return (
    <Box className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Input
          id="videoId"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
        ></Input>
        {data && (
          <Select onChange={(e) => setLan(e.target.value)}>
            <option key="" value=""></option>
            {data.map((e: any) => (
              <option key={e.vssId} value={e.baseUrl}>
                {e.vssId}
              </option>
            ))}
          </Select>
        )}
        <YouTube
          videoId={videoId}
          onReady={_onReady}
          onStateChange={_onStateChange}
        />
        <Box>{currentTime}</Box>
        <Box>
          {cap &&
            [
              ...cap.matchAll(/<text start="(.*?)" dur="(.*?)">(.*?)<\/text>/g),
            ].map((e) => (
              <Flex key={e[0]}>
                <Box flex="1">{e[1]}</Box>
                <Box flex="1">{e[2]}</Box>
                <Box flex="5">
                  <Text>{e[3]}</Text>
                </Box>
              </Flex>
            ))}
        </Box>
      </main>

      <footer className={styles.footer}></footer>
    </Box>
  );
}
