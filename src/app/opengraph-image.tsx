import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-white">
        <h1 tw="text-6xl text-center" style={{ fontFamily: 'Comic Sans MS', color: 'red' }}>
          {PROJECT_TITLE}
        </h1>
        <h3 tw="text-2xl text-center" style={{ fontFamily: 'Arial', color: 'blue' }}>
          {PROJECT_DESCRIPTION}
        </h3>
        <div tw="absolute inset-0 flex items-center justify-center opacity-20">
          <div tw="text-9xl" style={{ transform: 'rotate(-15deg)', color: 'rgba(255,215,0,0.5)' }}>🔥</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
