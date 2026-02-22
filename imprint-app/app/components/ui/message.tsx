'use client';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  className?: string;
}

export function Message({ role, content, className = '' }: MessageProps) {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
      {!isUser && (
        <div className="size-6 shrink-0 rounded-full bg-neutral-700 flex items-center justify-center mt-0.5">
          <div className="size-2 rounded-full bg-brand-accent" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? 'bg-neutral-700 text-neutral-50'
            : 'bg-neutral-800 text-neutral-100'
        }`}
      >
        <p className="font-inter text-[13.5px] leading-[20px]">{content}</p>
      </div>
    </div>
  );
}
