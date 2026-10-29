import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import Landing from './pages/Landing';
import Survey from './pages/Survey';
import Payment from './pages/Payment';
import Preview from './pages/Preview';
import Loading from './pages/Loading';

export type Page = 'landing' | 'survey' | 'payment' | 'loading' | 'preview';
export type Plan = 'free' | 'pro' | 'pro_plus' | 'premium';

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
  plan: Plan;
}

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();

  const navigate = (p: Page) => setPage(p);

  return (
    <div className="animated-bg min-h-screen">
      {page === 'landing' && <Landing navigate={navigate} />}
      {page === 'survey' && (
        <Survey
          navigate={navigate}
          surveyData={surveyData}
          setSurveyData={setSurveyData}
        />
      )}
      {page === 'payment' && <Payment navigate={navigate} surveyData={surveyData} />}
      {page === 'loading' && (
        <Loading navigate={navigate} surveyData={surveyData} setResumeData={setResumeData} />
      )}
      {page === 'preview' && <Preview navigate={navigate} resumeData={resumeData} surveyData={surveyData} />}
    </div>
  );
}
