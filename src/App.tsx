import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import Landing from './pages/Landing';
import Survey from './pages/Survey';
import Payment from './pages/Payment';
import Preview from './pages/Preview';
import Loading from './pages/Loading';

export type Page = 'landing' | 'survey' | 'payment' | 'loading' | 'preview';

export interface SurveyData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  position: string;
  experience: string;
  education: string;
  skills: string;
  about: string;
  template: 'classic' | 'modern' | 'creative';
}

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();

  const navigate = (p: Page) => setPage(p);

  return (
    <div className="animated-bg min-h-screen">
      {/* Theme toggle (floating) */}
      <button
        className="theme-toggle fixed top-4 right-4 z-[100]"
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {page === 'landing' && <Landing navigate={navigate} />}
      {page === 'survey' && (
        <Survey
          navigate={navigate}
          surveyData={surveyData}
          setSurveyData={setSurveyData}
        />
      )}
      {page === 'payment' && <Payment navigate={navigate} />}
      {page === 'loading' && (
        <Loading navigate={navigate} surveyData={surveyData} setResumeData={setResumeData} />
      )}
      {page === 'preview' && <Preview navigate={navigate} resumeData={resumeData} />}
    </div>
  );
}
