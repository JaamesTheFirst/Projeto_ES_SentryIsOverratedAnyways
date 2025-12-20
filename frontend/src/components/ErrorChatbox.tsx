import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { errorsService } from '../services/errors.service';
import { ErrorComment } from '../types';
import styles from './ErrorChatbox.module.css';

interface ErrorChatboxProps {
  errorId: string;
}

export const ErrorChatbox: React.FC<ErrorChatboxProps> = ({ errorId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: comments, isLoading } = useQuery({
    queryKey: ['error-comments', errorId],
    queryFn: () => errorsService.getComments(errorId),
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => errorsService.addComment(errorId, content, isInternal && user?.role === 'admin'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-comments', errorId] });
      queryClient.invalidateQueries({ queryKey: ['errors', errorId] });
      setMessage('');
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || addCommentMutation.isPending) return;
    addCommentMutation.mutate(message.trim());
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.chatbox}>
      <div className={styles.chatboxHeader}>
        <h3>💬 Discussion</h3>
        {user?.role === 'admin' && (
          <label className={styles.internalCheckbox}>
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
            />
            <span>Internal note (admin only)</span>
          </label>
        )}
      </div>

      <div className={styles.messagesContainer}>
        {isLoading ? (
          <div className={styles.loading}>Loading messages...</div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment: ErrorComment) => (
            <div
              key={comment.id}
              className={`${styles.message} ${comment.isInternal ? styles.internalMessage : ''}`}
            >
              <div className={styles.messageHeader}>
                <span className={styles.messageAuthor}>
                  {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'Unknown'}
                  {comment.isInternal && <span className={styles.internalBadge}>🔒 Internal</span>}
                </span>
                <span className={styles.messageTime}>{formatTime(comment.createdAt)}</span>
              </div>
              <div className={styles.messageContent}>{comment.content}</div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <textarea
          ref={inputRef}
          className={styles.messageInput}
          placeholder={user?.role === 'admin' ? 'Type your message... (Check "Internal note" for admin-only messages)' : 'Type your message...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={addCommentMutation.isPending}
          rows={3}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!message.trim() || addCommentMutation.isPending}
        >
          {addCommentMutation.isPending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

