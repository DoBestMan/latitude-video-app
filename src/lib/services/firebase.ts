import { db } from '$lib/firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import type { WatchSegment } from '$lib/types';

export class WatchSegmentService {
  private static COLLECTION = 'watchSegments';

  static async saveSegments(segments: WatchSegment[]): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), { segments });
      return docRef.id;
    } catch (error) {
      console.error('Error saving watch segments:', error);
      throw error;
    }
  }

  static async getHistory(): Promise<WatchSegment[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.COLLECTION));
      return querySnapshot.docs.map(doc => doc.data().segments).flat();
    } catch (error) {
      console.error('Error loading watch data:', error);
      throw error;
    }
  }
} 