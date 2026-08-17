/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  Firestore 
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

export interface FirestoreQuote {
  id?: string;
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  fenceType: string;
  linearFeet: number;
  gateType?: string;
  estimatedCost: number;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed';
  notes?: string;
  createdAt?: any;
}

export interface FirestoreJobSchedule {
  id?: string;
  title: string;
  customerName: string;
  address: string;
  jobType: 'fence_install' | 'gate_install' | 'gate_maintenance' | 'warranty_service' | 'site_survey';
  date: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: any;
}

export interface FirestoreWarranty {
  id?: string;
  customerName: string;
  address: string;
  installDate: string;
  warrantyType: string;
  warrantyDurationYears: number;
  status: 'active' | 'expired' | 'claimed';
}

// Quote Helpers
export const saveQuoteToFirestore = async (quote: Omit<FirestoreQuote, 'createdAt'> & { quoteId?: string; bom?: any; [key: string]: any }) => {
  try {
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...quote,
      createdAt: serverTimestamp()
    });

    // If customer email is present, queue Firebase Trigger Email extension document
    if (quote.email && quote.email.trim() && quote.email.includes('@')) {
      try {
        await addDoc(collection(db, 'mail'), {
          to: [quote.email.trim()],
          message: {
            subject: `208 Fence & Gate LLC - Project Estimate & Specifications (#${quote.quoteId || docRef.id})`,
            text: `Hello ${quote.customerName || 'Valued Customer'},\n\nThank you for choosing 208 Fence and Gate LLC. Your custom project estimate #${quote.quoteId || docRef.id} has been logged in our system.\n\nProject Details:\n- Fence Type / Material: ${quote.fenceType || 'Custom Fence'}\n- Linear Footage: ${quote.linearFeet || 0} LF\n- Estimated Total: $${(quote.estimatedCost || 0).toLocaleString()}\n- Status: Received (Pending On-Site Survey Verification)\n\nA 208 project specialist will review property line details and reach out shortly.\n\nBest regards,\n208 Fence and Gate LLC\nBoise Valley, Idaho\nadmin@208fenceandgate.com`,
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #040912; color: #f8fafc; padding: 24px; border-radius: 12px;">
                <h2 style="color: #38bdf8; margin-top: 0;">208 FENCE & GATE LLC</h2>
                <h3 style="color: #ffffff;">Project Estimate Confirmation</h3>
                <p>Hello <strong>${quote.customerName || 'Valued Customer'}</strong>,</p>
                <p>Your custom fence estimate <strong>#${quote.quoteId || docRef.id}</strong> has been logged to our project queue.</p>
                <div style="background-color: #0b192e; border: 1px solid #1e3a8a; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><strong>Material:</strong> ${quote.fenceType || 'Standard Specification'}</p>
                  <p style="margin: 4px 0;"><strong>Linear Footage:</strong> ${quote.linearFeet || 0} LF</p>
                  <p style="margin: 4px 0;"><strong>Estimated Investment:</strong> $${(quote.estimatedCost || 0).toLocaleString()}</p>
                  <p style="margin: 4px 0;"><strong>Status:</strong> Active / Verification Scheduled</p>
                </div>
                <p style="color: #94a3b8; font-size: 13px;">Craftsmanship guaranteed with 5-Year Workmanship Warranty. For updates, reply directly or call (208).</p>
              </div>
            `
          },
          quoteId: quote.quoteId || docRef.id,
          recipientEmail: quote.email.trim(),
          triggerSource: 'web_estimate_tool',
          status: 'queued',
          createdAt: serverTimestamp()
        });
      } catch (mailErr) {
        console.warn('Firebase trigger mail queue notice:', mailErr);
      }
    }

    return docRef.id;
  } catch (error) {
    console.error('Error saving quote to Firestore:', error);
    throw error;
  }
};

export const fetchRecentQuotes = async (): Promise<FirestoreQuote[]> => {
  try {
    const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreQuote));
  } catch (error) {
    console.warn('Could not fetch quotes from Firestore, returning empty list:', error);
    return [];
  }
};

// Schedule Helpers
export const saveScheduleToFirestore = async (schedule: Omit<FirestoreJobSchedule, 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'schedules'), {
      ...schedule,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving schedule to Firestore:', error);
    throw error;
  }
};

export const fetchJobSchedules = async (): Promise<FirestoreJobSchedule[]> => {
  try {
    const q = query(collection(db, 'schedules'), orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreJobSchedule));
  } catch (error) {
    console.warn('Could not fetch schedules from Firestore:', error);
    return [];
  }
};

// Warranty Helpers
export const saveWarrantyToFirestore = async (warranty: FirestoreWarranty) => {
  try {
    const docRef = await addDoc(collection(db, 'warranties'), warranty);
    return docRef.id;
  } catch (error) {
    console.error('Error saving warranty to Firestore:', error);
    throw error;
  }
};

export const fetchWarranties = async (): Promise<FirestoreWarranty[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'warranties'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreWarranty));
  } catch (error) {
    console.warn('Could not fetch warranties from Firestore:', error);
    return [];
  }
};
