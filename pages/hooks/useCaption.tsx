import { useQuery } from "react-query";
import { CaptionInfo } from "./useCaptions";

type Caption = {
  startTime: string;
  endTime: string;
  caption: string;
};

const useCaption = ({
  caption,
}: {
  caption: CaptionInfo | undefined;
}): Caption[] | undefined => {
  const { data } = useQuery(
    ["caption", caption],
    () => caption && fetch(caption.baseUrl).then((value) => value.text())
  );
  if (data) {
    return [
      ...data
        .replaceAll(/&amp;#39;/g, "'")
        .matchAll(/<text start="(.*?)" dur="(.*?)">(.*?)<\/text>/g),
    ].map((e) => {
      const startTime = Number(e[1]);
      const duration = Number(e[2]);
      const endTime = startTime + duration;
      return {
        startTime: startTime.toFixed(2),
        endTime: endTime.toFixed(2),
        caption: e[3],
      };
    });
  }
};

export default useCaption;
