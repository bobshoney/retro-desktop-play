import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, AlertTriangle, Lock, Eye, Database, Globe } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  icon: React.ReactNode;
  text: string;
  detail: string;
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'input-validation',
    category: 'Input Validation',
    icon: <Shield className="w-4 h-4 text-blue-600" />,
    text: 'Validate all user inputs with zod schemas',
    detail: 'Use z.string().trim().max() and proper type coercion before processing any form data.',
  },
  {
    id: 'dangeroushtml',
    category: 'Input Validation',
    icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
    text: 'Avoid dangerouslySetInnerHTML with user data',
    detail: 'If HTML rendering is required, sanitize with DOMPurify. Prefer React elements over raw HTML injection.',
  },
  {
    id: 'url-encoding',
    category: 'Input Validation',
    icon: <Globe className="w-4 h-4 text-green-600" />,
    text: 'Encode user input in URLs with encodeURIComponent',
    detail: 'Never interpolate raw user strings into URLs, API calls, or query parameters.',
  },
  {
    id: 'css-injection',
    category: 'Style Safety',
    icon: <Eye className="w-4 h-4 text-purple-600" />,
    text: 'Validate CSS values from dynamic sources',
    detail: 'If config/theme data could come from users or APIs, validate color values match safe patterns (hex, rgb, named).',
  },
  {
    id: 'style-attr',
    category: 'Style Safety',
    icon: <Eye className="w-4 h-4 text-purple-600" />,
    text: 'Prefer style attributes over innerHTML for CSS',
    detail: 'Use React style props or CSS custom properties instead of injecting <style> tags with dangerouslySetInnerHTML.',
  },
  {
    id: 'api-keys',
    category: 'Secrets Management',
    icon: <Lock className="w-4 h-4 text-red-600" />,
    text: 'Never hardcode private API keys in client code',
    detail: 'Use Lovable Cloud secrets or environment variables. Only publishable keys belong in frontend code.',
  },
  {
    id: 'rls-policies',
    category: 'Data Access',
    icon: <Database className="w-4 h-4 text-orange-600" />,
    text: 'Enable RLS policies on all database tables',
    detail: 'Every table should have row-level security. Default-deny: only allow what is explicitly permitted.',
  },
  {
    id: 'server-validation',
    category: 'Data Access',
    icon: <Database className="w-4 h-4 text-orange-600" />,
    text: 'Validate inputs server-side in edge functions',
    detail: 'Client-side validation is for UX. Server-side validation is for security. Always do both.',
  },
  {
    id: 'error-handling',
    category: 'Error Handling',
    icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
    text: 'Never expose stack traces or internal errors to users',
    detail: 'Log detailed errors server-side. Show generic messages to users. Avoid console.log of sensitive data in production.',
  },
  {
    id: 'auth-checks',
    category: 'Authentication',
    icon: <Lock className="w-4 h-4 text-red-600" />,
    text: 'Protect routes and API endpoints with auth checks',
    detail: 'Verify authentication state before rendering protected content or processing API requests.',
  },
];

const SecurityChecklistApp = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  const grouped = checklistItems.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full bg-white font-[Tahoma,sans-serif] text-[11px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0054E3] to-[#2E8AEF] text-white px-3 py-2 flex items-center gap-2">
        <Shield className="w-5 h-5" />
        <div>
          <div className="font-bold text-xs">Security Hardening Checklist</div>
          <div className="text-[10px] opacity-80">Review before adding user-facing features</div>
        </div>
        <div className="ml-auto bg-white/20 rounded px-2 py-0.5 text-[10px] font-bold">
          {completedCount}/{totalCount} ({progress}%)
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Checklist */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-3">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                {items[0].icon}
                <span className="font-bold text-[11px] text-gray-700">{category}</span>
              </div>
              <div className="space-y-1">
                {items.map(item => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-2 p-1.5 rounded cursor-pointer hover:bg-blue-50 border transition-colors ${
                      checked[item.id] ? 'bg-green-50 border-green-200' : 'border-transparent'
                    }`}
                  >
                    <Checkbox
                      checked={!!checked[item.id]}
                      onCheckedChange={() => toggle(item.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold ${checked[item.id] ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {item.text}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                        {item.detail}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-[10px] text-yellow-800 flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            This checklist is for developer reference when extending the app with user input, databases, or external APIs.
            Current static implementation has no active vulnerabilities.
          </span>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SecurityChecklistApp;
