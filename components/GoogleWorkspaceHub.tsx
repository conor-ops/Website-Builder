/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderKanban, 
  FileSpreadsheet, 
  Mail, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  FileText, 
  Sparkles, 
  Database, 
  Upload, 
  Plus, 
  Check, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  LogIn, 
  LogOut,
  RefreshCw,
  FolderOpen,
  Send,
  CalendarCheck
} from 'lucide-react';
import { 
  requestGoogleAccessToken, 
  getCachedToken, 
  setCachedToken, 
  listDriveFiles, 
  createDriveTextFile,
  createFenceEstimateSheet,
  sendGmailMessage,
  listCalendarEvents,
  createCalendarJobEvent,
  listGoogleTasks,
  createGoogleTask,
  completeGoogleTask,
  createClientIntakeForm,
  loadAndOpenGooglePicker,
  DriveFileItem,
  GoogleTaskItem
} from '../services/googleWorkspace';
import { 
  saveQuoteToFirestore, 
  fetchRecentQuotes, 
  saveScheduleToFirestore, 
  fetchJobSchedules,
  FirestoreQuote, 
  FirestoreJobSchedule 
} from '../services/firebase';

interface GoogleWorkspaceHubProps {
  onClose?: () => void;
}

export const GoogleWorkspaceHub: React.FC<GoogleWorkspaceHubProps> = () => {
  const [activeTab, setActiveTab] = useState<'drive' | 'sheets' | 'gmail' | 'calendar' | 'tasks' | 'forms' | 'firebase'>('drive');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [pickedFile, setPickedFile] = useState<any>(null);

  // Sheets state
  const [sheetResult, setSheetResult] = useState<{ spreadsheetId: string; spreadsheetUrl: string } | null>(null);
  const [sheetQuoteData, setSheetQuoteData] = useState({
    clientName: '',
    material: 'Western Red Cedar (6ft Privacy)',
    footage: 180,
    unitPrice: 38,
    gateQty: 1,
    gatePrice: 450
  });

  // Gmail state
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '208 Fence & Gate LLC - Formal Project Bid & Craftsmanship Warranty',
    bodyText: 'Hello,\n\nThank you for choosing 208 Fence and Gate LLC. Your custom project proposal and 5-Year Craftsmanship Warranty specifications are prepared.\n\nMaterial: Western Red Cedar Privacy\nLinear Footage: 180 LF with PostMaster Steel Posts\nScheduled Lead Time: 3-5 Business Days\n\nPlease reply or call (208) to confirm site survey access.\n\nBest regards,\n208 Fence & Gate LLC Contractor Team'
  });

  // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [eventForm, setEventForm] = useState({
    summary: '208 On-Site Fence Survey & Line Locate',
    description: 'Verify property boundary stakes, 811 utility markings, and gate swing clearance.',
    date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    time: '09:00'
  });

  // Tasks state
  const [tasks, setTasks] = useState<GoogleTaskItem[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Firebase state
  const [firestoreQuotes, setFirestoreQuotes] = useState<FirestoreQuote[]>([]);
  const [firestoreSchedules, setFirestoreSchedules] = useState<FirestoreJobSchedule[]>([]);

  useEffect(() => {
    const token = getCachedToken();
    if (token) {
      setIsConnected(true);
      loadInitialData();
    }
    loadFirestoreData();
  }, []);

  const loadFirestoreData = async () => {
    try {
      const [quotes, schedules] = await Promise.all([
        fetchRecentQuotes(),
        fetchJobSchedules()
      ]);
      setFirestoreQuotes(quotes);
      setFirestoreSchedules(schedules);
    } catch (e) {
      console.warn('Firestore initial load error:', e);
    }
  };

  const handleConnectGoogle = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      await requestGoogleAccessToken();
      setIsConnected(true);
      setStatusMessage({ type: 'success', text: 'Connected to Google Workspace successfully!' });
      await loadInitialData();
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.message || 'OAuth authorization cancelled or failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      const [files, events, taskList] = await Promise.allSettled([
        listDriveFiles(),
        listCalendarEvents(),
        listGoogleTasks()
      ]);

      if (files.status === 'fulfilled') setDriveFiles(files.value);
      if (events.status === 'fulfilled') setCalendarEvents(events.value);
      if (taskList.status === 'fulfilled') setTasks(taskList.value);
    } catch (e) {
      console.warn('Error loading workspace data:', e);
    }
  };

  // Google Drive & Picker actions
  const handleOpenPicker = () => {
    try {
      loadAndOpenGooglePicker((doc) => {
        setPickedFile(doc);
        setStatusMessage({ type: 'success', text: `Selected "${doc.name}" via Google Picker!` });
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  const handleCreateBlueprintDoc = async () => {
    setIsLoading(true);
    try {
      const newFile = await createDriveTextFile(
        `208_Fence_Blueprint_Specs_${Date.now()}.txt`,
        `208 FENCE & GATE LLC - PROJECT BLUEPRINT SPECIFICATION\nClient: ${sheetQuoteData.clientName}\nMaterial: ${sheetQuoteData.material}\nFootage: ${sheetQuoteData.footage} LF\nPost Standard: 36" depth PostMaster Structural Steel\nWarranty: 5-Year Craftsmanship Guarantee`
      );
      setDriveFiles(prev => [newFile, ...prev]);
      setStatusMessage({ type: 'success', text: `Created project blueprint file in Google Drive: ${newFile.name}` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sheets action
  const handleExportToSheets = async () => {
    setIsLoading(true);
    try {
      const subtotalMaterials = sheetQuoteData.footage * sheetQuoteData.unitPrice;
      const subtotalGate = sheetQuoteData.gateQty * sheetQuoteData.gatePrice;
      const total = subtotalMaterials + subtotalGate;

      const result = await createFenceEstimateSheet({
        title: `Quote_${sheetQuoteData.clientName.replace(/\s+/g, '_')}`,
        rows: [
          ['208 FENCE & GATE LLC - OFFICIAL ESTIMATE & MATERIALS SCHEDULE'],
          ['Project / Client:', sheetQuoteData.clientName],
          ['Date Generated:', new Date().toLocaleDateString()],
          ['Warranty Duration:', '5-Year Craftsmanship Guarantee'],
          [''],
          ['Item Description', 'Quantity / Unit', 'Unit Price ($)', 'Line Total ($)'],
          [sheetQuoteData.material, `${sheetQuoteData.footage} LF`, sheetQuoteData.unitPrice, subtotalMaterials],
          ['Automated / Heavy Gate Hardware', `${sheetQuoteData.gateQty} Unit(s)`, sheetQuoteData.gatePrice, subtotalGate],
          ['Concrete Footings & 36" Post Set', `${Math.ceil(sheetQuoteData.footage / 8) + 1} Posts`, 'Included', 0],
          [''],
          ['ESTIMATED TOTAL PROJECT INVESTMENT:', '', '', total]
        ]
      });

      setSheetResult(result);
      setStatusMessage({ type: 'success', text: 'Generated live Google Sheet for Estimate & Bill of Materials!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Gmail action
  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      await sendGmailMessage(emailForm);
      setStatusMessage({ type: 'success', text: `Proposal & Warranty email dispatched to ${emailForm.to} via Gmail!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Calendar action
  const handleCreateCalendarEvent = async () => {
    setIsLoading(true);
    try {
      const startDateTime = `${eventForm.date}T${eventForm.time}:00-06:00`;
      const endDateTime = `${eventForm.date}T${parseInt(eventForm.time.split(':')[0]) + 1}:${eventForm.time.split(':')[1]}:00-06:00`;

      await createCalendarJobEvent({
        summary: eventForm.summary,
        description: eventForm.description,
        startDateTime,
        endDateTime
      });

      // Also persist to Firebase Firestore
      await saveScheduleToFirestore({
        title: eventForm.summary,
        customerName: sheetQuoteData.clientName,
        address: 'Treasure Valley, ID',
        jobType: 'site_survey',
        date: eventForm.date,
        status: 'upcoming',
        notes: eventForm.description
      });

      setStatusMessage({ type: 'success', text: 'Appointment booked in Google Calendar and synced to Firebase!' });
      const updatedEvents = await listCalendarEvents();
      setCalendarEvents(updatedEvents);
      loadFirestoreData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Tasks action
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    setIsLoading(true);
    try {
      const newTask = await createGoogleTask({
        title: newTaskTitle,
        notes: '208 Fence & Gate Job Checklist item'
      });
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
      setStatusMessage({ type: 'success', text: 'Checklist item added to Google Tasks!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async (id?: string) => {
    if (!id) return;
    try {
      await completeGoogleTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setStatusMessage({ type: 'success', text: 'Task marked as completed!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Forms action
  const handleCreateForm = async () => {
    setIsLoading(true);
    try {
      const form = await createClientIntakeForm('Fence Style & Gate Access Intake Survey');
      setStatusMessage({ type: 'success', text: `Created new Google Form questionnaire: ${form.info?.title || 'Survey'}` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="workspace-hub" className="relative z-10 py-16 md:py-24 px-4 md:px-6 bg-[#040a15] border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00ff66] uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>Google Workspace Suite & Firebase Firestore Sync</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight">
              208 CONTRACTOR & CLIENT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93c5fd] via-[#38bdf8] to-[#00ff66]">
                WORKSPACE CLOUD HUB
              </span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-2xl">
              Connect your Google Workspace to access Drive blueprints, export instant Sheets quotes, dispatch Gmail bid agreements, sync Calendar surveys, track Tasks, and sync data in Firebase.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-[#00ff66]/40 text-xs font-mono text-[#00ff66]">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
                <span>Google Workspace Connected</span>
              </div>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                data-hover="true"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>Connect Google Workspace</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-xs font-mono ${
            statusMessage.type === 'success' 
              ? 'bg-[#00ff66]/10 border-[#00ff66]/40 text-[#00ff66]' 
              : 'bg-rose-950/40 border-rose-700/60 text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span className="flex-1">{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white font-bold">×</button>
          </div>
        )}

        {/* Workspace Hub Nav Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 mb-8">
          {[
            { id: 'drive', label: 'Drive & Picker', icon: FolderKanban },
            { id: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet },
            { id: 'gmail', label: 'Gmail Dispatch', icon: Mail },
            { id: 'calendar', label: 'Calendar Jobs', icon: CalendarIcon },
            { id: 'tasks', label: 'Job Checklist', icon: CheckSquare },
            { id: 'forms', label: 'Forms Survey', icon: FileText },
            { id: 'firebase', label: 'Firebase Firestore', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`workspace-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isTabActive
                    ? tab.id === 'firebase'
                      ? 'bg-black text-[#00ff66] border border-[#00ff66]/60 shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                      : 'bg-[#1e40af] text-white border border-[#38bdf8]/50 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                data-hover="true"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="bg-[#061220]/90 rounded-3xl border border-slate-800/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl min-h-[420px]">
          {/* TAB: GOOGLE DRIVE & PICKER */}
          {activeTab === 'drive' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-[#38bdf8]" />
                    <span>Google Drive & Picker Job Blueprints</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Store and attach CAD fence schematics, property plat maps, and site photos.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleOpenPicker}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono flex items-center gap-2 border border-slate-600 cursor-pointer"
                    data-hover="true"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Open Google Picker</span>
                  </button>
                  <button
                    onClick={handleCreateBlueprintDoc}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                    data-hover="true"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Create New Blueprint Doc</span>
                  </button>
                </div>
              </div>

              {pickedFile && (
                <div className="p-4 rounded-xl bg-[#00ff66]/10 border border-[#00ff66]/30 text-xs font-mono text-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#00ff66]" />
                    <span>Attached from Picker: <strong className="text-white">{pickedFile.name}</strong></span>
                  </div>
                  {pickedFile.url && (
                    <a href={pickedFile.url} target="_blank" rel="noreferrer" className="text-[#38bdf8] flex items-center gap-1 hover:underline">
                      <span>View File</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {driveFiles.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
                    {isConnected ? 'No recent drive files listed. Click "Create New Blueprint Doc" or open Picker to upload.' : 'Connect Google Workspace above to browse Drive files.'}
                  </div>
                ) : (
                  driveFiles.map((file) => (
                    <div key={file.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="w-4 h-4 text-[#38bdf8]" />
                        <span className="text-[10px] font-mono text-slate-500">{file.mimeType.split('.').pop()}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{file.name}</h4>
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono text-[#38bdf8] hover:underline"
                        >
                          <span>Open in Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#38bdf8]" />
                  <span>Google Sheets Estimator & Bill of Materials (BOM)</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Generate live spreadsheet breakdowns with material dimensions, labor lines, and warranty tags.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <h4 className="text-xs font-mono uppercase text-[#38bdf8] font-bold">Estimate Parameters</h4>
                  
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Client / Project Name</label>
                    <input
                      type="text"
                      value={sheetQuoteData.clientName}
                      onChange={e => setSheetQuoteData({ ...sheetQuoteData, clientName: e.target.value })}
                      placeholder="e.g. John Doe / Subdivision Project"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Fence Type</label>
                    <select
                      value={sheetQuoteData.material}
                      onChange={e => setSheetQuoteData({ ...sheetQuoteData, material: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                    >
                      <option value="Western Red Cedar (6ft Privacy)">Western Red Cedar (6ft Privacy)</option>
                      <option value="PostMaster Structural Steel Fence">PostMaster Structural Steel Fence</option>
                      <option value="Premium Virgin Vinyl Privacy">Premium Virgin Vinyl Privacy</option>
                      <option value="Powder-Coated Ornamental Wrought Iron">Powder-Coated Ornamental Wrought Iron</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Linear Footage</label>
                      <input
                        type="number"
                        value={sheetQuoteData.footage}
                        onChange={e => setSheetQuoteData({ ...sheetQuoteData, footage: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Rate ($/LF)</label>
                      <input
                        type="number"
                        value={sheetQuoteData.unitPrice}
                        onChange={e => setSheetQuoteData({ ...sheetQuoteData, unitPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleExportToSheets}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    data-hover="true"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Generate & Export to Google Sheets</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-mono uppercase text-[#00ff66] font-bold mb-3">Live Calculation Preview</h4>
                    <div className="space-y-2 text-xs font-mono text-slate-300">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span>Material Subtotal:</span>
                        <span className="text-white font-bold">${sheetQuoteData.footage * sheetQuoteData.unitPrice}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span>Gate Subtotal:</span>
                        <span className="text-white font-bold">${sheetQuoteData.gateQty * sheetQuoteData.gatePrice}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span>PostMaster Posts Needed:</span>
                        <span className="text-[#38bdf8]">{Math.ceil(sheetQuoteData.footage / 8) + 1} posts</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm text-white font-bold">
                        <span>Estimated Total:</span>
                        <span className="text-[#00ff66]">${(sheetQuoteData.footage * sheetQuoteData.unitPrice) + (sheetQuoteData.gateQty * sheetQuoteData.gatePrice)}</span>
                      </div>
                    </div>
                  </div>

                  {sheetResult && (
                    <div className="mt-4 p-4 rounded-xl bg-[#1e3a8a]/40 border border-[#38bdf8]/40">
                      <div className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#00ff66]" />
                        <span>Google Sheet Created!</span>
                      </div>
                      <a
                        href={sheetResult.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#38bdf8] hover:underline mt-1"
                      >
                        <span>Open Spreadsheet in Google Docs</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: GMAIL */}
          {activeTab === 'gmail' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#38bdf8]" />
                  <span>Gmail Proposal & Warranty Dispatch</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Send official contractor bids, schedule confirmations, and craftsmanship certificates directly via Gmail.
                </p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Recipient Email (Client)</label>
                  <input
                    type="email"
                    value={emailForm.to}
                    onChange={e => setEmailForm({ ...emailForm, to: e.target.value })}
                    placeholder="e.g. client@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Email Subject</label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Proposal & Warranty Body</label>
                  <textarea
                    rows={6}
                    value={emailForm.bodyText}
                    onChange={e => setEmailForm({ ...emailForm, bodyText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleSendEmail}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  data-hover="true"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Proposal via Gmail</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#38bdf8]" />
                  <span>Google Calendar Site Surveys & Installations</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Book on-site estimates, post-hole digging dates, and bi-annual gate checkups directly into Google Calendar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <h4 className="text-xs font-mono uppercase text-[#38bdf8] font-bold">Schedule New Appointment</h4>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Appointment Title</label>
                    <input
                      type="text"
                      value={eventForm.summary}
                      onChange={e => setEventForm({ ...eventForm, summary: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Time</label>
                      <input
                        type="time"
                        value={eventForm.time}
                        onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Scope & Notes</label>
                    <textarea
                      rows={3}
                      value={eventForm.description}
                      onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                    />
                  </div>

                  <button
                    onClick={handleCreateCalendarEvent}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    data-hover="true"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Sync to Calendar & Firebase</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-slate-800">
                  <h4 className="text-xs font-mono uppercase text-[#00ff66] font-bold mb-3">Upcoming Calendar Jobs</h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {calendarEvents.length === 0 ? (
                      <div className="py-8 text-center text-xs font-mono text-slate-500">
                        No upcoming calendar events detected. Schedule an appointment on the left!
                      </div>
                    ) : (
                      calendarEvents.map((evt) => (
                        <div key={evt.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="text-xs font-bold text-white">{evt.summary}</div>
                          <div className="text-[11px] font-mono text-[#38bdf8] mt-0.5">
                            {evt.start?.dateTime ? new Date(evt.start.dateTime).toLocaleString() : 'All Day'}
                          </div>
                          {evt.description && (
                            <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{evt.description}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GOOGLE TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#38bdf8]" />
                  <span>Google Tasks Contractor Job Checklist</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Keep site crews, post hole inspectors, and automated gate technicians synchronized on task milestones.
                </p>
              </div>

              <div className="flex gap-2 max-w-xl">
                <input
                  type="text"
                  placeholder="e.g. Call 811 Dig Line Locates for Meridian Job..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                />
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  data-hover="true"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>

              <div className="space-y-2.5 max-w-2xl">
                {tasks.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono text-slate-500">
                    No active tasks. Add pre-install checklist items above!
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="w-5 h-5 rounded-md border border-slate-600 hover:border-[#00ff66] flex items-center justify-center text-[#00ff66] transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                        </button>
                        <span className="text-xs text-slate-200 font-mono">{task.title}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-slate-800">
                        {task.status === 'completed' ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: GOOGLE FORMS */}
          {activeTab === 'forms' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#38bdf8]" />
                  <span>Google Forms Client Intake & Feedback</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Generate customer design preference questionnaires and post-installation reviews.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-xl space-y-4">
                <p className="text-xs text-slate-300 font-normal leading-relaxed">
                  Automate homeowner onboarding with structured Google Forms that collect gate motor power access specifications, pet containment heights, and HOA boundary approvals.
                </p>
                <button
                  onClick={handleCreateForm}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
                  data-hover="true"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate Intake Form via Forms API</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: FIREBASE FIRESTORE */}
          {activeTab === 'firebase' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#00ff66]" />
                    <span>Firebase Firestore Real-Time Data Collections</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Live synced collections: <code className="text-[#00ff66]">/quotes</code>, <code className="text-[#38bdf8]">/schedules</code>, and <code className="text-white">/warranties</code>.
                  </p>
                </div>

                <button
                  onClick={loadFirestoreData}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                  title="Refresh Firestore Collections"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Quotes in Firestore */}
                <div className="p-5 rounded-2xl bg-black/60 border border-[#00ff66]/30">
                  <h4 className="text-xs font-mono uppercase text-[#00ff66] font-bold mb-3 flex items-center justify-between">
                    <span>Recent Quote Submissions (/quotes)</span>
                    <span className="text-[10px] text-slate-500 font-normal">{firestoreQuotes.length} record(s)</span>
                  </h4>

                  <div className="space-y-2.5 max-h-[260px] overflow-y-auto">
                    {firestoreQuotes.length === 0 ? (
                      <div className="text-center py-6 text-xs font-mono text-slate-500">
                        No quotes in Firestore yet. Submit an estimate using the calculator above!
                      </div>
                    ) : (
                      firestoreQuotes.map((q) => (
                        <div key={q.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
                          <div className="flex justify-between font-bold text-white">
                            <span>{q.customerName}</span>
                            <span className="text-[#00ff66]">${q.estimatedCost}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {q.fenceType} • {q.linearFeet} LF
                          </div>
                          <div className="text-[10px] text-[#38bdf8] mt-1">
                            Status: {q.status}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Scheduled Jobs in Firestore */}
                <div className="p-5 rounded-2xl bg-black/60 border border-[#38bdf8]/30">
                  <h4 className="text-xs font-mono uppercase text-[#38bdf8] font-bold mb-3 flex items-center justify-between">
                    <span>Job Schedules (/schedules)</span>
                    <span className="text-[10px] text-slate-500 font-normal">{firestoreSchedules.length} record(s)</span>
                  </h4>

                  <div className="space-y-2.5 max-h-[260px] overflow-y-auto">
                    {firestoreSchedules.length === 0 ? (
                      <div className="text-center py-6 text-xs font-mono text-slate-500">
                        No schedules recorded yet. Sync an appointment from the Calendar tab!
                      </div>
                    ) : (
                      firestoreSchedules.map((s) => (
                        <div key={s.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
                          <div className="font-bold text-white">{s.title}</div>
                          <div className="text-[11px] text-[#38bdf8] mt-0.5">
                            Target Date: {s.date}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Client: {s.customerName} ({s.jobType})
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GoogleWorkspaceHub;
