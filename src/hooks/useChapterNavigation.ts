/**
 * useChapterNavigation Hook
 * 
 * Manages navigation between landing page chapters
 * Handles URL synchronization, progress tracking, and navigation logic
 * 
 * @example
 * const { currentChapter, goToChapter, nextChapter, progress } = useChapterNavigation(6);
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { smoothScrollToElement } from '@/lib/smoothScroll';

export interface ChapterNavigationContext {
  currentChapter: number;
  totalChapters: number;
  goToChapter: (chapter: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  progress: number; // 0-100
  canGoNext: boolean;
  canGoPrev: boolean;
  chapterHash: string;
}

const CHAPTER_NAMES = [
  'hero',
  'problem',
  'magic',
  'power',
  'trust',
  'closer',
] as const;

export function useChapterNavigation(totalChapters: number = 6): ChapterNavigationContext {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentChapter, setCurrentChapter] = useState(1);

  // Sync current chapter with URL hash
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const chapterIndex = CHAPTER_NAMES.indexOf(hash as any);
      if (chapterIndex !== -1) {
        setCurrentChapter(chapterIndex + 1);
      }
    }
  }, [location.hash]);

  const goToChapter = useCallback((chapter: number) => {
    if (chapter < 1 || chapter > totalChapters) return;
    
    setCurrentChapter(chapter);
    const chapterName = CHAPTER_NAMES[chapter - 1];
    navigate(`#${chapterName}`, { replace: true });
    
    // Scroll to chapter using custom smooth scroll with luxurious easing
    const chapterElement = document.getElementById(chapterName);
    
    if (chapterElement) {
      smoothScrollToElement(chapterElement, {
        duration: 1200, // Slower, more premium feel
        easing: 'easeInOutCubic',
      });
    }
  }, [totalChapters, navigate]);

  const nextChapter = useCallback(() => {
    if (currentChapter < totalChapters) {
      goToChapter(currentChapter + 1);
    }
  }, [currentChapter, totalChapters, goToChapter]);

  const prevChapter = useCallback(() => {
    if (currentChapter > 1) {
      goToChapter(currentChapter - 1);
    }
  }, [currentChapter, goToChapter]);

  const progress = (currentChapter / totalChapters) * 100;
  const canGoNext = currentChapter < totalChapters;
  const canGoPrev = currentChapter > 1;
  const chapterHash = CHAPTER_NAMES[currentChapter - 1];

  return {
    currentChapter,
    totalChapters,
    goToChapter,
    nextChapter,
    prevChapter,
    progress,
    canGoNext,
    canGoPrev,
    chapterHash,
  };
}
