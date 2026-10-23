# Aura: Your Wellness Companion

A calming, supportive space and app designed to help users with mindfulness, stress relief, and overall wellness.

---

<a id="system-architecture"></a>
## 🏗️ System Architecture

The checked-in UI includes local wellness tools and browser storage. `App.tsx` imports `getAIResponse` and `getPlaylist` from `components/services/geminiService`, but that module is not present in the current repository tree. The dashed path identifies the unresolved AI integration instead of presenting it as a working hosted service.

```mermaid
flowchart TD
    U["User check-in, mood or message"] --> UI["React and TypeScript application"]
    UI --> TOOLS["Breathing, meditation and progress views"]
    UI --> STATE["Mood, check-in and theme state"]
    STATE --> LOCAL["Browser localStorage"]
    UI -. "referenced import" .-> CONNECTOR["Gemini service integration"]
    CONNECTOR -. "module absent in current tree" .-> MISSING["Integration required before AI chat can run"]
    class U entry
    class UI,TOOLS,STATE process
    class LOCAL system
    class CONNECTOR,MISSING pending
    classDef entry fill:#EAF2FF,stroke:#5275AD,color:#1E3556
    classDef process fill:#F0EBFA,stroke:#8870B2,color:#3B2856
    classDef system fill:#FFF2DA,stroke:#AA8440,color:#51401E
    classDef output fill:#E3F4EC,stroke:#4C8A72,color:#234C3B
    classDef pending fill:#F8E9E7,stroke:#AD706A,color:#653C37,stroke-dasharray:5 5
```

<details>
<summary><strong>Follow the implementation</strong></summary>

| Stage | Source |
| --- | --- |
| Application orchestration | [App.tsx](App.tsx) |
| Chat display | [components/ChatWindow.tsx](components/ChatWindow.tsx) |
| Mood persistence | [utils/moodStorage.ts](utils/moodStorage.ts) |
| Declared dependencies | [package.json](package.json) |

</details>

## ✨ Features

- Calming user interface with minimal distractions.  
- Guided breathing, meditation, or other wellness exercises.  
- UX “quiet space” loader or splash screen while the app initializes.  
- Personalized routines / progress tracking (optional).  
- (You can add: notifications, reminders, soundscapes, mood tracking, etc.)

---

## 🛠️ Tech Stack

- Frontend: Web app (HTML, CSS, JavaScript / React / Vue / etc.)  
- Backend / Hosting: Deployed to Google Cloud Run.  
- Data storage / State management: (e.g., Firestore / SQLite / local storage)  
- (Optional: any third-party APIs or libraries, e.g., for guided meditation audio, analytics.)

---

---

## About the developer

Built by **Pallavi Vholgade**. Explore my AI / ML projects, experience, and skills in my [portfolio](https://pallavi-portfolio-preview.vercel.app).

[LinkedIn](https://www.linkedin.com/in/pallavi-vholgade-05565b24b) · [Email](mailto:pallavivhalgade@gmail.com)
