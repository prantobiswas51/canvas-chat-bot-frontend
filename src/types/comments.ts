export type SocialPlatform = 'facebook' | 'instagram';

export type CommentIntent = 'price_inquiry' | 'product_question' | 'compliment' | 'spam';

export interface SocialReply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isAiGenerated?: boolean;
}

export interface SocialComment {
  id: string;
  postId: string;
  platform: SocialPlatform;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  isHidden: boolean;
  isDeleted?: boolean;
  intent: CommentIntent;
  replies: SocialReply[];
}

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  postTitle: string;
  postImage?: string;
  postedAt: string;
  likesCount: number;
  commentsCount: number;
  aiAutoReplyEnabled: boolean;
  comments: SocialComment[];
}
