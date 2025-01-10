declare module 'react-lazy-load-image-component' {
    import React from 'react';
  
    export interface LazyLoadImageProps {
      alt?: string;
      className?: string;
      delayMethod?: 'throttle' | 'debounce';
      delayTime?: number;
      effect?: 'blur' | 'opacity' | 'black-and-white';
      height?: string | number;
      placeholderSrc?: string;
      src: string;
      threshold?: number;
      useIntersectionObserver?: boolean;
      visibleByDefault?: boolean;
      width?: string | number;
      wrapperClassName?: string;
      afterLoad?: () => void;
      beforeLoad?: () => void;
      onClick?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
    }
  
    export const LazyLoadImage: React.FC<LazyLoadImageProps>;
  
    export default LazyLoadImage;
  }
  