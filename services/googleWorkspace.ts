/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import firebaseConfig from '../firebase-applet-config.json';

const CLIENT_ID = firebaseConfig.oAuthClientId || '46911070890-qhrav8pqedlj0mpi3ql83st1ppo1bjkt.apps.googleusercontent.com';
const API_KEY = firebaseConfig.apiKey || '';

export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly'
];

export interface WorkspaceUser {
  email?: string;
  name?: string;
  picture?: string;
}

let cachedAccessToken: string | null = null;
let tokenClient: any = null;

// Initialize Google Identity Services Token Client
export const initTokenClient = (onSuccess: (token: string) => void, onError?: (err: any) => void) => {
  if (typeof window === 'undefined') return;

  const checkGsi = () => {
    if ((window as any).google?.accounts?.oauth2) {
      try {
        tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: WORKSPACE_SCOPES.join(' '),
          callback: (response: any) => {
            if (response.error !== undefined) {
              console.error('OAuth error:', response);
              if (onError) onError(response);
              return;
            }
            cachedAccessToken = response.access_token;
            if (onSuccess) onSuccess(response.access_token);
          },
        });
      } catch (err) {
        console.error('Failed to init token client:', err);
      }
    } else {
      setTimeout(checkGsi, 300);
    }
  };

  checkGsi();
};

export const requestGoogleAccessToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (cachedAccessToken) {
      resolve(cachedAccessToken);
      return;
    }

    if (!tokenClient) {
      initTokenClient(
        (token) => resolve(token),
        (err) => reject(err)
      );
    }

    if (tokenClient) {
      try {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (e) {
        reject(e);
      }
    } else {
      reject(new Error('Google Identity Services client is not initialized yet.'));
    }
  });
};

export const getCachedToken = () => cachedAccessToken;
export const setCachedToken = (token: string | null) => { cachedAccessToken = token; };

// Helper for authenticated Google API requests
async function googleApiFetch(url: string, options: RequestInit = {}) {
  const token = cachedAccessToken || await requestGoogleAccessToken();
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// ---------------- Google Drive API ----------------
export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  createdTime?: string;
}

export const listDriveFiles = async (queryParam = "trashed = false"): Promise<DriveFileItem[]> => {
  const res = await googleApiFetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryParam)}&fields=files(id,name,mimeType,webViewLink,iconLink,createdTime)&pageSize=15`
  );
  return res.files || [];
};

export const createDriveJobFolder = async (folderName: string): Promise<DriveFileItem> => {
  return await googleApiFetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    })
  });
};

export const createDriveTextFile = async (name: string, content: string): Promise<DriveFileItem> => {
  return await googleApiFetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    body: JSON.stringify({
      name,
      mimeType: 'text/plain'
    })
  });
};

// ---------------- Google Sheets API ----------------
export interface SheetExportData {
  title: string;
  rows: (string | number)[][];
}

export const createFenceEstimateSheet = async (data: SheetExportData): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const spreadsheet = await googleApiFetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        title: `208 Fence & Gate - ${data.title}`
      },
      sheets: [
        {
          properties: {
            title: 'Estimate & Materials'
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: data.rows.map(row => ({
                values: row.map(val => ({
                  userEnteredValue: typeof val === 'number' ? { numberValue: val } : { stringValue: String(val) }
                }))
              }))
            }
          ]
        }
      ]
    })
  });

  return {
    spreadsheetId: spreadsheet.spreadsheetId,
    spreadsheetUrl: spreadsheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheet.spreadsheetId}/edit`
  };
};

// ---------------- Gmail API ----------------
export interface SendEmailPayload {
  to: string;
  subject: string;
  bodyText: string;
}

export const sendGmailMessage = async ({ to, subject, bodyText }: SendEmailPayload) => {
  // Construct raw RFC 2822 email format
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    bodyText
  ];
  const rawMessage = messageParts.join('\r\n');
  const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return await googleApiFetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    body: JSON.stringify({
      raw: encodedMessage
    })
  });
};

export const listRecentGmailThreads = async () => {
  const res = await googleApiFetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8');
  return res.messages || [];
};

// ---------------- Google Calendar API ----------------
export interface CalendarEventPayload {
  summary: string;
  description: string;
  location?: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
}

export const listCalendarEvents = async () => {
  const now = new Date().toISOString();
  const res = await googleApiFetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=10&singleEvents=true&orderBy=startTime`
  );
  return res.items || [];
};

export const createCalendarJobEvent = async (event: CalendarEventPayload) => {
  return await googleApiFetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    body: JSON.stringify({
      summary: event.summary,
      description: event.description,
      location: event.location || 'Boise, ID',
      start: {
        dateTime: event.startDateTime,
        timeZone: 'America/Boise'
      },
      end: {
        dateTime: event.endDateTime,
        timeZone: 'America/Boise'
      }
    })
  });
};

// ---------------- Google Tasks API ----------------
export interface GoogleTaskItem {
  id?: string;
  title: string;
  notes?: string;
  due?: string;
  status?: 'needsAction' | 'completed';
}

export const listGoogleTasks = async (): Promise<GoogleTaskItem[]> => {
  const listsRes = await googleApiFetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists');
  const defaultList = listsRes.items?.[0]?.id || '@default';
  const tasksRes = await googleApiFetch(`https://tasks.googleapis.com/tasks/v1/lists/${defaultList}/tasks?maxResults=15`);
  return tasksRes.items || [];
};

export const createGoogleTask = async (task: { title: string; notes?: string; due?: string }) => {
  return await googleApiFetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
    method: 'POST',
    body: JSON.stringify({
      title: task.title,
      notes: task.notes,
      due: task.due
    })
  });
};

export const completeGoogleTask = async (taskId: string) => {
  return await googleApiFetch(`https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'completed'
    })
  });
};

// ---------------- Google Forms API ----------------
export const createClientIntakeForm = async (title: string) => {
  return await googleApiFetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    body: JSON.stringify({
      info: {
        title: `208 Fence & Gate - ${title}`,
        documentTitle: title
      }
    })
  });
};

// ---------------- Google Picker API ----------------
export const loadAndOpenGooglePicker = (onPick: (doc: any) => void) => {
  const token = cachedAccessToken;
  if (!token) {
    throw new Error('Please connect your Google Account first to open Google Picker.');
  }

  const gapi = (window as any).gapi;
  if (!gapi) {
    throw new Error('Google API script is not loaded yet.');
  }

  gapi.load('picker', {
    callback: () => {
      const google = (window as any).google;
      if (!google?.picker) {
        throw new Error('Google Picker library failed to initialize.');
      }

      const view = new google.picker.View(google.picker.ViewId.DOCS);
      view.setMimeTypes('image/png,image/jpeg,application/pdf,image/webp');

      const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setAppId(CLIENT_ID.split('-')[0])
        .setOAuthToken(token)
        .addView(view)
        .addView(new google.picker.DocsUploadView())
        .setDeveloperKey(API_KEY)
        .setCallback((data: any) => {
          if (data.action === google.picker.Action.PICKED) {
            const documents = data[google.picker.Response.DOCUMENTS];
            if (documents && documents.length > 0) {
              onPick(documents[0]);
            }
          }
        })
        .build();

      picker.setVisible(true);
    }
  });
};
