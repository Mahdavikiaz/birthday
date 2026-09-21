'use client';

import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import BackgroundEffects from '@/components/birthday/effects/BackgroundEffects';
import JourneyProgress from '@/components/birthday/JourneyProgress';
import MusicToggle from '@/components/birthday/MusicToggle';
import BirthdayCakeStage from '@/components/birthday/stages/BirthdayCakeStage';
import ChapterOneStage from '@/components/birthday/stages/ChapterOneStage';
import ChapterThreeStage from '@/components/birthday/stages/ChapterThreeStage';
import ChapterTwoStage from '@/components/birthday/stages/ChapterTwoStage';
import CompleteStage from '@/components/birthday/stages/CompleteStage';
import GiftRevealStage from '@/components/birthday/stages/GiftRevealStage';
import LandingStage from '@/components/birthday/stages/LandingStage';
import OneMoreThingStage from '@/components/birthday/stages/OneMoreThingStage';
import TrackingStage from '@/components/birthday/stages/TrackingStage';
import WishesStage from '@/components/birthday/stages/WishesStage';
import { nextStage, type StageId } from '@/lib/journey';

export default function BirthdayExperience() {
  const [stage, setStage] = useState<StageId>('landing');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  const advance = useCallback(() => setStage((current) => nextStage(current)), []);
  const restart = useCallback(() => setStage('landing'), []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    // Keyboard and screen-reader users land on the new scene, not back at the top of the document.
    containerRef.current?.focus({ preventScroll: true });
  }, [stage]);

  const renderStage = () => {
    switch (stage) {
      case 'landing':
        return <LandingStage key="landing" onNext={advance} />;
      case 'chapter1':
        return <ChapterOneStage key="chapter1" onNext={advance} />;
      case 'chapter2':
        return <ChapterTwoStage key="chapter2" onNext={advance} />;
      case 'chapter3':
        return <ChapterThreeStage key="chapter3" onNext={advance} />;
      case 'cake':
        return <BirthdayCakeStage key="cake" onNext={advance} />;
      case 'wishes':
        return <WishesStage key="wishes" onNext={advance} />;
      case 'oneMoreThing':
        return <OneMoreThingStage key="oneMoreThing" onNext={advance} />;
      case 'gift':
        return <GiftRevealStage key="gift" onNext={advance} />;
      case 'tracking':
        return <TrackingStage key="tracking" onNext={advance} />;
      case 'complete':
        return <CompleteStage key="complete" onRestart={restart} />;
      default:
        return null;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <BackgroundEffects stage={stage} />
      <MusicToggle />

      <div ref={containerRef} tabIndex={-1} className="relative z-10 outline-none">
        <AnimatePresence mode="wait" initial>
          {renderStage()}
        </AnimatePresence>
      </div>

      <JourneyProgress stage={stage} />
    </MotionConfig>
  );
}
