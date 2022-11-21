// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type ResponseType = {
  captionTracks: CaptionTrack[];
};

export type CaptionTrack = {
  baseUrl: string;
  name: Name;
  vssId: string;
  languageCode: string;
  isTranslatable: boolean;
  kind?: string;
};

export type Name = {
  simpleText: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const method = req.method;
  switch (method) {
    case "GET": {
      const videoId = req.query["videoId"];

      const response = await fetch(
        "https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
        {
          method: "post",
          headers: [["content-type", "application/json"]],
          body: JSON.stringify({
            context: {
              client: {
                clientName: "WEB",
                clientVersion: "2.20201021.03.00",
              },
            },
            videoId: videoId,
          }),
        }
      );
      if (response.ok) {
        const json = await response.json();
        res.status(200).json(json.captions.playerCaptionsTracklistRenderer);
      }
    }
  }

  res.status(500);
}
