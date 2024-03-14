'use client';

import { Slider } from '@/components/ui/slider';
import { SliderRange, SliderTrack } from '@radix-ui/react-slider';
import { FC } from 'react';

interface CustomSliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

const CustomSlider: FC<CustomSliderProps> = ({ value, onChange }) => {
  // Dictates the volume value based on the slider
  const handleVolChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <Slider
      defaultValue={[1]}
      value={[value!]}
      onValueChange={handleVolChange}
      max={1}
      step={0.1}
      aria-label="volume"
    >
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
    </Slider>
  );
};

export default CustomSlider;
