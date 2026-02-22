'use client';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  avatar?: string;
  className?: string;
}

export function Message({ role, content, avatar, className = '' }: MessageProps) {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
      {!isUser && (
        <div className="shrink-0 mt-0.5">
          {avatar ? (
            <img
              src={avatar}
              alt="Agent"
              className="w-8 h-8 rounded-full object-cover object-top"
            />
          ) : (
            <div className="size-8 rounded-full bg-neutral-700 flex items-center justify-center">
              <div className="size-2 rounded-full bg-brand-accent" />
            </div>
          )}
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
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
