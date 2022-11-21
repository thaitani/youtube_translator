import { useQuery } from "react-query";
import { ResponseType } from "../api/captions";

type CaptionsProps = {
  videoId: string;
};

export type CaptionInfo = {
  baseUrl: string;
  simpleText: string;
  vssId: string;
};

const useCaptions = ({ videoId }: CaptionsProps): CaptionInfo[] | undefined => {
  const { data: captions } = useQuery(["captions", videoId], () =>
    fetch(`/api/captions?videoId=${videoId}`, {
      method: "GET",
    }).then((value) => value.json() as Promise<ResponseType>)
  );
  return captions?.captionTracks?.map<CaptionInfo>((e) => {
    return {
      baseUrl: e.baseUrl,
      simpleText: e.name.simpleText,
      vssId: e.vssId,
    };
  });
};

export default useCaptions;
