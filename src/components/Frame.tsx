"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { config } from "~/components/providers/WagmiProvider";
import { truncateAddress } from "~/lib/truncateAddress";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";

const DREAMING_GIF = "https://example.com/path-to-dreaming-teenager.gif"; // Replace with actual GIF URL
const CONFETTI_GIF = "https://example.com/path-to-confetti-animation.gif"; // Replace with actual GIF URL

function PopArtInterface({ stage, selectedArtist, pfpUrl }: { stage: string, selectedArtist?: string, pfpUrl?: string }) {
  switch (stage) {
    case 'initial':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl" style={{ fontFamily: 'Comic Sans MS', color: 'red' }}>
              WHAAAM!
            </CardTitle>
            <CardDescription className="text-xl">
              The only frame that makes your PFP pop!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div 
                className="w-48 h-48 bg-blue-200 relative" 
                style={{ 
                  border: '4px solid black',
                  boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
                  backgroundImage: 'linear-gradient(45deg, yellow 25%, cyan 75%)'
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                  YOUR PFP
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'dreaming':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl" style={{ fontFamily: 'Comic Sans MS' }}>
              "When I grow up..."
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <img 
                src={DREAMING_GIF} 
                alt="Dreaming teenager" 
                className="w-48 h-48 rounded-full border-4 border-black"
              />
              <p className="text-xl text-center" style={{ fontFamily: 'Arial', color: 'blue' }}>
                "All I want is to make it POP!"
              </p>
            </div>
          </CardContent>
        </Card>
      );

    case 'result':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl" style={{ fontFamily: 'Impact', color: 'purple' }}>
              POP ART MASTERPIECE!
            </CardTitle>
            <CardDescription className="text-lg">
              In the style of {selectedArtist}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <img 
                src={pfpUrl} 
                alt="Pop art PFP" 
                className="w-64 h-64 rounded-full border-4 border-black"
                style={{ 
                  filter: 'contrast(150%) saturate(200%)',
                  transform: 'rotate(5deg)'
                }}
              />
              <img
                src={CONFETTI_GIF}
                alt="Confetti"
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            </div>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [stage, setStage] = useState<'initial' | 'dreaming' | 'result'>('initial');
  const [selectedArtist, setSelectedArtist] = useState<string>();
  const [pfpUrl, setPfpUrl] = useState<string>();

  const handleMakePop = useCallback(async () => {
    // Simulate artistic processing
    setStage('dreaming');
    
    // Get user's PFP from Farcaster context
    const userPfp = context?.user.profileImage;
    setPfpUrl(userPfp);

    // Randomly select an artist style
    const artists = ['Andy Warhol', 'David Hockney', 'Roy Lichtenstein'];
    const selected = artists[Math.floor(Math.random() * artists.length)];
    setSelectedArtist(selected);

    // Simulate processing delay
    setTimeout(() => {
      setStage('result');
    }, 3000);
  }, [context]);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      sdk.actions.ready({});
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      paddingTop: context?.client.safeAreaInsets?.top ?? 0,
      paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
      paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
      paddingRight: context?.client.safeAreaInsets?.right ?? 0,
    }}>
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700 dark:text-gray-300">
          {PROJECT_TITLE}
        </h1>
        
        <PopArtInterface stage={stage} selectedArtist={selectedArtist} pfpUrl={pfpUrl} />

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleMakePop}
            className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-500 transition-colors"
            style={{
              fontFamily: 'Comic Sans MS',
              border: '3px solid black',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.2)'
            }}
          >
            {stage === 'initial' ? 'MAKE ME POP!' : 'GENERATING...'}
          </button>
        </div>
      </div>
    </div>
  );
}
