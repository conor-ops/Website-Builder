# 208 Fence and Gate LLC - Website Builder & SaaS

A high-performance, responsive web application and software/IoT integration hub for **208 Fence and Gate LLC**—a professional residential fence contractor and specialized software engineering division. Featuring fully automated estimate calculation, an interactive service dispatch map, AI-powered estimates/technical assistance, Google Workspace synchronization, and real-time client satisfaction testimonials.

---

## 🚀 Key Features

- **Automated Estimate Calculator & BOM Generator**: Itemized estimates including material costs, labor, and local taxes, instantly generating a downloadable, professional PDF proposal.
- **Dynamic Maps**: Visually displays primary and expanded service corridors using the Google Maps platform.
- **AI Estimator Chatbot**: Integrated with the Gemini API to handle technical assistance, compare materials, and answer client inquiries.
- **Google Workspace Hub**: Syncs quotes, schedules jobs, triggers emails via Gmail, lists tasks, and operates files directly inside Google Drive, Sheets, Gmail, Google Calendar, and Forms.
- **Secure Cloud Storage**: Leverages Firestore and Firebase Storage for real-time customer data, review verification, and masonry project gallery.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (ESM runtime, Tailwind CSS, Lucide icons, Framer Motion)
- **Bundler & Tooling**: Vite 6, TypeScript
- **Services**: Google GenAI (Gemini 2.5), Google Maps Platform, Firebase 12 (Auth, Firestore, Storage)

---

## 📦 Getting Started & Local Setup

Follow these instructions to configure and run the project locally.

### Prerequisites
- Node.js (v18+) or Bun
- Firebase Account
- Google Cloud Platform (GCP) Account

### 1. Repository Setup

Clone this repository and install all dependencies:
```bash
git clone https://github.com/conor-ops/Website-Builder.git
cd Website-Builder
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory based on the provided `.env.example`:
```bash
cp .env.example .env
```

Populate the `.env` file with your respective API keys:
```env
# Gemini API Key (Required for AI Technical Assistant)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Maps Platform Key (Required for Service dispatch map)
GOOGLE_MAPS_PLATFORM_KEY=your_google_maps_key_here
```

### 3. Set Up Firebase

1. Head to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Register a new Web App under the project settings to retrieve your Firebase config.
3. Configure your app credentials inside `firebase-applet-config.json` in the root folder:
   ```json
   {
     "apiKey": "your-api-key",
     "authDomain": "your-app.firebaseapp.com",
     "projectId": "your-app-id",
     "storageBucket": "your-app.appspot.com",
     "messagingSenderId": "your-sender-id",
     "appId": "your-app-id"
   }
   ```
4. **Deploy Rules**: Push the custom security rules defined in `firestore.rules` using the Firebase CLI or copy them into the Rules tab in your Firestore Console.
5. **Enable authorized domains**: Under Firebase Authentication > Settings > Authorized Domains, ensure you add your localhost domains for development (`localhost`) and your production domain for deployment.

### 4. Set Up Google Cloud Platform (GCP)

1. Enable the **Google Maps JavaScript API** inside your Google Cloud Console.
2. Ensure you configure **API Key Restrictions** under GCP Credentials to restrict your maps key to your production domains to prevent unauthorized usage and quota theft.
3. If integrating Google Workspace, enable Google Drive, Sheets, Gmail, Google Calendar, and Tasks APIs and set up the OAuth Consent Screen.

---

## 🐳 Production & Redistribution Readiness

To prepare this project for a live production environment and safe public redistribution:

1. **Enable Google Cloud Budget Alerts**: Add strict consumption budgets in Google Cloud to guard against unexpected usage from the Gemini AI and Google Maps APIs.
2. **Dynamic Imports & Code Splitting**: This codebase implements optimization splits for heavyweight libraries (`jspdf` and `@vis.gl/react-google-maps`) utilizing dynamic `import()` and `React.lazy()` Suspense boundaries. This improves initial load performance dramatically.
3. **Firestore Strict Rules**: Ensure standard read/write controls are enforced as configured in the updated `firestore.rules`.
4. **Production Build**: Compile production bundles:
   ```bash
   npm run build
   ```
   Deploy the `dist/` directory to Firebase Hosting, Netlify, Vercel, or any other premium CDN.

---

## 📄 License

This software is open-sourced under the industry-compliant [MIT License](LICENSE). Feel free to redistribute, modify, and integrate it into commercial environments.
