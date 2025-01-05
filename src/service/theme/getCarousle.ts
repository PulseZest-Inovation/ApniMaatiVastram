import { getDataByDocName } from '../Firebase/getFirestore';
import { ImageCarousleType } from '@/Types/Theme/ImageCarouselType';

export const getCarousle = async (): Promise<ImageCarousleType | null> => {
  try {
    const themeSettings = await getDataByDocName<ImageCarousleType>('theme-settings', 'imageCarousel');
    return themeSettings;
  } catch (error) {
    console.error('Error fetching top header settings:', error);
    return null;
  }
};