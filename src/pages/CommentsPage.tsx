import React, { useState } from 'react';
import { SocialPost, SocialPlatform, CommentIntent } from '@/types/comments';
import commentsService from '@/services/commentsService';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  EyeOff,
  Eye,
  Trash2,
  Send,
  Bot,
  Sparkles,
  Search,
  CheckCircle,
  Mail,
} from 'lucide-react';

export const CommentsPage: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>(commentsService.getPosts());
  const [selectedPostId, setSelectedPostId] = useState<string>(posts[0]?.id || '');
  const [platformFilter, setPlatformFilter] = useState<'all' | SocialPlatform>('all');
  const [intentFilter, setIntentFilter] = useState<'all' | CommentIntent>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleAi = (postId: string) => {
    commentsService.toggleAiAutoReply(postId);
    setPosts([...commentsService.getPosts()]);
    showToast('AI Auto-reply settings updated!');
  };

  const handleAddReply = (postId: string, commentId: string) => {
    const text = replyTextMap[commentId];
    if (!text || !text.trim()) return;

    commentsService.addReplyToComment(postId, commentId, text.trim(), 'Canvas Official');
    setPosts([...commentsService.getPosts()]);
    setReplyTextMap((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
    showToast('Reply published successfully to comment!');
  };

  const handleUseAiSuggestion = (commentId: string, suggestion: string) => {
    setReplyTextMap((prev) => ({ ...prev, [commentId]: suggestion }));
  };

  const handleToggleHide = (postId: string, commentId: string) => {
    commentsService.toggleHideComment(postId, commentId);
    setPosts([...commentsService.getPosts()]);
    showToast('Comment visibility toggled.');
  };

  const handleDelete = (postId: string, commentId: string) => {
    commentsService.deleteComment(postId, commentId);
    setPosts([...commentsService.getPosts()]);
    showToast('Comment deleted.');
  };

  const handleSendDm = (authorName: string) => {
    showToast(`Private message (DM) conversation initiated with ${authorName}!`);
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
    const matchesSearch = p.postTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const selectedPost = posts.find((p) => p.id === selectedPostId) || filteredPosts[0] || posts[0];

  const getIntentBadge = (intent: CommentIntent) => {
    switch (intent) {
      case 'price_inquiry':
        return <Badge variant="indigo" size="sm">💰 Price Inquiry</Badge>;
      case 'product_question':
        return <Badge variant="warning" size="sm">❓ Product Question</Badge>;
      case 'compliment':
        return <Badge variant="success" size="sm">❤️ Compliment</Badge>;
      case 'spam':
        return <Badge variant="danger" size="sm">🚨 Spam Alert</Badge>;
      default:
        return null;
    }
  };

  // Stats calculation
  const totalCommentsCount = posts.reduce((acc, p) => acc + p.comments.length, 0);
  const totalAiRepliesCount = posts.reduce(
    (acc, p) => acc + p.comments.reduce((cAcc, c) => cAcc + c.replies.filter((r) => r.isAiGenerated).length, 0),
    0
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#F81B57] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header & Summary Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#F81B57]" />
            Social Comments Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage, reply, hide, and automate AI responses for Facebook Page & Instagram post comments.
          </p>
        </div>

        {/* Metric Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">Total Comments</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{totalCommentsCount}</span>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-3 py-2 rounded-xl text-center">
            <span className="text-[10px] text-indigo-600 dark:text-indigo-300 uppercase block font-mono flex items-center gap-1 justify-center">
              <Bot className="w-3 h-3 text-indigo-500" />
              AI Auto-Replies
            </span>
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{totalAiRepliesCount}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Platform Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Channels' },
            { id: 'facebook', label: 'Facebook Page' },
            { id: 'instagram', label: 'Instagram Reels' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPlatformFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                platformFilter === tab.id
                  ? 'bg-[#F81B57] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search post caption..."
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#F81B57]"
          />
        </div>
      </div>

      {/* Main Grid: Left Posts Sidebar | Right Comments Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Posts Column */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Social Posts ({filteredPosts.length})
          </h2>

          {filteredPosts.map((post) => {
            const isSelected = post.id === selectedPost?.id;

            return (
              <Card
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                className={`p-3.5 cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-[#F81B57] bg-pink-50/20 dark:bg-pink-950/10 shadow-sm'
                    : 'hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex gap-3 items-start">
                  {post.postImage && (
                    <img
                      src={post.postImage}
                      alt="Post Thumbnail"
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                          post.platform === 'facebook'
                            ? 'bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400'
                            : 'bg-pink-100 dark:bg-pink-950 text-[#F81B57]'
                        }`}
                      >
                        {post.platform}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{post.postedAt}</span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium line-clamp-2 leading-snug">
                      {post.postTitle}
                    </p>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-indigo-500" />
                          {post.likesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-[#F81B57]" />
                          {post.commentsCount}
                        </span>
                      </div>

                      {/* AI Auto-Reply Switch */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleAi(post.id);
                        }}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-colors cursor-pointer border ${
                          post.aiAutoReplyEnabled
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                        }`}
                        title="Toggle AI Auto Reply for this post"
                      >
                        <Bot className="w-3 h-3" />
                        {post.aiAutoReplyEnabled ? 'AI Active' : 'AI Off'}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Comments Management Feed */}
        <div className="lg:col-span-7 space-y-4">
          {selectedPost ? (
            <Card className="p-5 space-y-5">
              {/* Selected Post Banner */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl flex gap-3 items-center">
                {selectedPost.postImage && (
                  <img
                    src={selectedPost.postImage}
                    alt="Selected Post"
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span className="uppercase text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                        {selectedPost.platform}
                      </span>
                      Active Post Feed
                    </span>
                    <span className="text-[10px] text-slate-400">{selectedPost.postedAt}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {selectedPost.postTitle}
                  </p>
                </div>
              </div>

              {/* Comments Section Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#F81B57]" />
                  Comments Thread ({selectedPost.comments.length})
                </h3>

                {/* Intent Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-400 mr-1">Intent:</span>
                  {(['all', 'price_inquiry', 'product_question', 'compliment', 'spam'] as const).map((it) => (
                    <button
                      key={it}
                      onClick={() => setIntentFilter(it)}
                      className={`px-2 py-0.5 rounded capitalize text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                        intentFilter === it
                          ? 'bg-[#F81B57] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {it.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {selectedPost.comments
                  .filter((c) => intentFilter === 'all' || c.intent === intentFilter)
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-xl border transition-all ${
                        comment.isHidden
                          ? 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-60'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 shadow-xs'
                      }`}
                    >
                      {/* Author Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                            {comment.authorName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {comment.authorName}
                              {getIntentBadge(comment.intent)}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">{comment.timestamp}</span>
                          </div>
                        </div>

                        {/* Comment Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleSendDm(comment.authorName)}
                            title="Send Private Message (DM)"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 cursor-pointer transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleHide(selectedPost.id, comment.id)}
                            title={comment.isHidden ? 'Unhide Comment' : 'Hide Comment'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/60 cursor-pointer transition-colors"
                          >
                            {comment.isHidden ? <Eye className="w-3.5 h-3.5 text-amber-500" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(selectedPost.id, comment.id)}
                            title="Delete Comment"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Comment Content Body */}
                      <p className="text-xs text-slate-800 dark:text-slate-200 mt-2.5 leading-relaxed pl-10 font-normal">
                        {comment.content}
                      </p>

                      {/* Published Replies Sub-thread */}
                      {comment.replies.length > 0 && (
                        <div className="ml-10 mt-3 pl-3 border-l-2 border-indigo-500/40 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg text-xs space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                  {reply.isAiGenerated && <Bot className="w-3 h-3 text-[#F81B57]" />}
                                  {reply.author}
                                </span>
                                <span className="text-slate-400 font-mono">{reply.timestamp}</span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 leading-snug">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Toggle Bar */}
                      <div className="ml-10 mt-3">
                        {activeReplyId === comment.id ? (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            {/* AI Quick Suggestions */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                              <span className="font-mono text-indigo-500 flex items-center gap-1 font-semibold">
                                <Sparkles className="w-3 h-3 text-[#F81B57]" />
                                AI Suggestions:
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUseAiSuggestion(
                                    comment.id,
                                    'Hello! Canvas Heavy Body Acrylic Set price is ৳1450 BDT. Dhaka & nationwide delivery available. Check DM!'
                                  )
                                }
                                className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 cursor-pointer"
                              >
                                💰 Send Price & Delivery Info
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUseAiSuggestion(
                                    comment.id,
                                    'Thank you so much for your appreciation! 🎨 Happy painting!'
                                  )
                                }
                                className="px-2 py-0.5 rounded bg-pink-50 dark:bg-pink-950 text-[#F81B57] hover:bg-pink-100 cursor-pointer"
                              >
                                ❤️ Thank Customer
                              </button>
                            </div>

                            {/* Reply Input */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={replyTextMap[comment.id] || ''}
                                onChange={(e) =>
                                  setReplyTextMap((prev) => ({ ...prev, [comment.id]: e.target.value }))
                                }
                                placeholder="Type your comment reply..."
                                className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-[#F81B57]"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddReply(selectedPost.id, comment.id)}
                                className="bg-[#F81B57] hover:bg-pink-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Send className="w-3 h-3" />
                                Reply
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveReplyId(comment.id)}
                            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Reply to comment
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-xs text-slate-500">
              Select a post from the left sidebar to manage comments.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;
