import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn, formatTime } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface Props {
  playerRef: React.MutableRefObject<ReactPlayer | null>;
  playTime: number;
  setPlayTime: (value: number) => void;
  playerReady: boolean;
}
export const VideoPlaySlider = ({
  playerRef,
  playTime,
  setPlayTime,
  playerReady,
}: Props) => {
  const [currentlySeeking, setCurrentlySeeking] = useState(false);
  const [playSliderValue, setPlaySliderValue] = useState(0);

  useEffect(() => {
    if (playerRef.current) {
      const player = playerRef.current;
      const interval = setInterval(() => {
        if (!currentlySeeking) {
          setPlayTime(player.getCurrentTime());
          setPlaySliderValue(player.getCurrentTime());
        }
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentlySeeking, playerRef, setPlayTime, playerReady]);

  useEffect(() => {
    if (!currentlySeeking) {
      setPlaySliderValue(playTime);
    }
  }, [playTime, currentlySeeking]);

  const handlePlaySliderChange = (value: number) => {
    setPlaySliderValue(value);
  };

  const handlePlaySliderValueCommit = (value: number) => {
    setCurrentlySeeking(false);
    if (playerRef.current) {
      const playing =
        playerRef.current.getInternalPlayer().getPlayerState() === 1;
      playerRef.current.seekTo(value);
      if (playing) {
        playerRef.current.getInternalPlayer().playVideo();
      }
    }
  };

  return (
    <div>
      <Label className='mb-1'>
        Play Time: {formatTime(Math.floor(playSliderValue))} /{' '}
        {formatTime(Math.floor(playerRef.current?.getDuration() || 0))}
      </Label>
      <SliderPrimitive.Root
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          'pb-2',
        )}
        min={0}
        max={playerRef.current?.getDuration() || 0}
        value={[playSliderValue]}
        onValueChange={([val]) => handlePlaySliderChange(val)}
        onValueCommit={([val]) => handlePlaySliderValueCommit(val)}
        onPointerDown={() => setCurrentlySeeking(true)}
      >
        <SliderPrimitive.Track className='relative h-4 w-full grow overflow-hidden rounded-full bg-primary/20'>
          <SliderPrimitive.Range className='absolute h-full bg-primary' />
        </SliderPrimitive.Track>
      </SliderPrimitive.Root>
    </div>
  );
};
