import { getDataByDocName } from '../Firebase/getFirestore';
import { TopHeaderType } from '@/Types/Theme/TopHeaderType';

export const getTopHeader = async (): Promise<TopHeaderType | null> => {
  try {
    const themeSettings = await getDataByDocName<TopHeaderType>('theme-settings', 'topHeader');
    return themeSettings;
  } catch (error) {
    console.error('Error fetching top header settings:', error);
    return null;
  }
};