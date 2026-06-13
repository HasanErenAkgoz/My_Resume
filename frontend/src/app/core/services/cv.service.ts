import { Injectable } from '@angular/core';
import { CvData } from '../models/cv.model';
import cvData from '../../../assets/data/cv.data.json';

/**
 * Provides the bilingual CV content. Content is bundled as a typed JSON import
 * so it is available identically on the server (SSR) and in the browser with
 * zero network round-trips.
 */
@Injectable({ providedIn: 'root' })
export class CvService {
  private readonly data = cvData as unknown as CvData;

  getCv(): CvData {
    return this.data;
  }
}
