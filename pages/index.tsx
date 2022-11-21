import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useQuery } from "react-query";
import { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Input,
  Select,
  Container,
  VStack,
  HStack,
  Tag,
  Stack,
  Grid,
  GridItem,
  Button,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import useYoutube from "./hooks/useYoutube";
import useCaptions, { CaptionInfo } from "./hooks/useCaptions";
import useCaption from "./hooks/useCaption";

export default function Home() {
  const [videoId, setVideoId] = useState<string>("FaLBcSMVVuU");
  const [selectedCaption, setSelectedCaption] = useState<CaptionInfo>();

  const { renderYoutube, currentTime, youtubePlayer } = useYoutube({
    videoId,
  });
  const captions = useCaptions({ videoId });
  const caption = useCaption({ caption: selectedCaption });

  const seekTo = (time: number) => {
    youtubePlayer.current.seekTo(time);
  };

  return (
    <Container>
      <Head>
        <title>Youtube Translator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VStack>
        <HStack>
          <Input
            id="videoId"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
          ></Input>
          {captions && (
            <Select
              onChange={(e) => {
                setSelectedCaption(
                  captions.find((v) => e.target.value === v.vssId)
                );
              }}
            >
              <option key="" value=""></option>
              {captions.map((e) => (
                <option key={e.vssId} value={e.vssId}>
                  {e.simpleText}
                </option>
              ))}
            </Select>
          )}
        </HStack>
        {renderYoutube()}
        <Divider></Divider>
        <Stack>
          {caption &&
            caption.map((e) => {
              return (
                <Grid key={e.startTime} templateColumns="1fr 4fr" gap={8}>
                  <Button h={8} onClick={() => seekTo(Number(e.startTime))}>
                    {e.startTime}
                  </Button>
                  <Text>{e.caption}</Text>
                </Grid>
              );
            })}
        </Stack>
      </VStack>
    </Container>
  );
}
