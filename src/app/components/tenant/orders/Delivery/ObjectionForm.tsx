import { Clock, AlertTriangle } from 'lucide-react';
import { PhotoUploader } from '../PhotoUploader';

interface ObjectionFormProps {
  objectionText: string;
  setObjectionText: (text: string) => void;
}

export function ObjectionForm({ objectionText, setObjectionText }: ObjectionFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E74C3C]/30 p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-[#E74C3C]" />
        <h3 className="font-bold text-[#E74C3C]">تقديم اعتراض</h3>
      </div>
      <div className="p-3 bg-[#FDEDEC] rounded-xl mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#E74C3C]" />
          <span className="text-sm text-[#E74C3C] font-medium">مهلة الاعتراض</span>
        </div>
        <span className="font-bold text-[#E74C3C] font-mono">47:23:10</span>
      </div>
      <textarea
        value={objectionText}
        onChange={e => setObjectionText(e.target.value)}
        placeholder="اكتب وصف الاعتراض هنا..."
        rows={3}
        className="w-full p-3 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#E74C3C] resize-none transition-colors"
      />
      <PhotoUploader label="صور الاعتراض" />
      <button className="mt-4 w-full h-12 bg-[#E74C3C] text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        تقديم اعتراض
      </button>
    </div>
  );
}
