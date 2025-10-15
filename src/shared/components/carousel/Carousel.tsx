import { Box, HStack, IconButton } from "@chakra-ui/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Children, ReactNode, useEffect, useRef, useState } from "react";

interface CarouselProps {
  children: ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  height?: string | number;
}

export default function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  showControls = true,
  height = "auto",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const prevTotalSlidesRef = useRef<number>(0);

  const childrenArray = Children.toArray(children);
  const totalSlides = childrenArray.length;

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayInterval, currentIndex]);

  const resetAutoPlay = () => {
    if (autoPlay && autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, autoPlayInterval);
    }
  };

  const handlePrevClick = () => {
    handlePrev();
    resetAutoPlay();
  };

  const handleNextClick = () => {
    handleNext();
    resetAutoPlay();
  };

  // Effect to handle slide changes when items are added or removed
  useEffect(() => {
    const prevTotal = prevTotalSlidesRef.current;

    // Skip on initial render
    if (prevTotal === 0) {
      prevTotalSlidesRef.current = totalSlides;
      return;
    }

    // Item was added - move to last slide
    if (totalSlides > prevTotal) {
      setCurrentIndex(totalSlides - 1);
    }
    // Item was removed - move back one slide if we're at or past the removed item
    else if (totalSlides < prevTotal && currentIndex >= totalSlides) {
      setCurrentIndex(Math.max(0, totalSlides - 1));
    }

    prevTotalSlidesRef.current = totalSlides;
  }, [totalSlides, currentIndex]);

  return (
    <Box position="relative" width="100%" height={height} overflow="hidden">
      {/* Carousel Container */}
      <Box
        display="flex"
        transition="transform 0.5s ease-in-out"
        transform={`translateX(-${currentIndex * 100}%)`}
        height="100%"
      >
        {childrenArray.map((child, index) => (
          <Box
            key={index}
            minWidth="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {child}
          </Box>
        ))}
      </Box>

      {/* Navigation Controls */}
      {showControls && totalSlides > 1 && (
        <>
          {/* Previous Button */}
          <IconButton
            aria-label="Previous slide"
            icon={<IconChevronLeft size={16} />}
            position="absolute"
            left={4}
            top="50%"
            transform="translateY(-50%)"
            onClick={handlePrevClick}
            size="sm"
            zIndex={2}
          />

          {/* Next Button */}
          <IconButton
            aria-label="Next slide"
            icon={<IconChevronRight size={16} />}
            position="absolute"
            right={4}
            top="50%"
            transform="translateY(-50%)"
            onClick={handleNextClick}
            size="sm"
            zIndex={2}
          />
        </>
      )}

      {/* Indicators */}
      {totalSlides > 1 && (
        <HStack
          position="absolute"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          spacing={2}
          zIndex={2}
        >
          {childrenArray.map((_, index) => (
            <Box
              key={index}
              width={currentIndex === index ? "24px" : "8px"}
              height="8px"
              borderRadius="full"
              bg={currentIndex === index ? "gray.500" : "gray.500"}
              opacity={currentIndex === index ? 1 : 0.5}
              cursor="pointer"
              transition="all 0.3s ease"
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  resetAutoPlay();
                }
              }}
            />
          ))}
        </HStack>
      )}
    </Box>
  );
}
