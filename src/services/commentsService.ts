import { SocialPost } from '@/types/comments';

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-fb-1',
    platform: 'facebook',
    postTitle: '✨ New Stock Alert! Canvas Heavy Body Acrylic Paint Set (12x75ml) is back in stock. Premium satin finish for impasto & canvas artwork! 🎨',
    postImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80',
    postedAt: '2 hours ago',
    likesCount: 142,
    commentsCount: 3,
    aiAutoReplyEnabled: true,
    comments: [
      {
        id: 'cm-fb-1',
        postId: 'post-fb-1',
        platform: 'facebook',
        authorName: 'Tanvir Ahmed',
        content: 'Price koto bro? Direct home delivery offer ache naki?',
        timestamp: '1 hour ago',
        isHidden: false,
        intent: 'price_inquiry',
        replies: [
          {
            id: 'rep-1',
            author: 'Canvas AI Bot',
            content: 'Hello Tanvir! Canvas Heavy Body Acrylic Set Price: ৳1450 BDT. Dhaka & islandwide delivery available. Sent you a DM!',
            timestamp: '58 mins ago',
            isAiGenerated: true,
          },
        ],
      },
      {
        id: 'cm-fb-2',
        postId: 'post-fb-1',
        platform: 'facebook',
        authorName: 'Nusrat Jahan',
        content: 'Ei acrylic set-er shaathe kon brush set best match hobe?',
        timestamp: '40 mins ago',
        isHidden: false,
        intent: 'product_question',
        replies: [],
      },
      {
        id: 'cm-fb-3',
        postId: 'post-fb-1',
        platform: 'facebook',
        authorName: 'CryptoBot_99',
        content: 'Earn $1000 daily working from home! Click link in profile',
        timestamp: '25 mins ago',
        isHidden: true,
        intent: 'spam',
        replies: [],
      },
    ],
  },
  {
    id: 'post-[#insta-1]',
    platform: 'instagram',
    postTitle: '🎨 Smooth Watercolor Wash Reel with Canvas Artists Water Colour Pan Set 24. Which palette shade is your favorite?',
    postImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80',
    postedAt: '5 hours ago',
    likesCount: 389,
    commentsCount: 2,
    aiAutoReplyEnabled: true,
    comments: [
      {
        id: 'cm-[#insta-1]',
        postId: 'post-[#insta-1]',
        platform: 'instagram',
        authorName: 'sajid_artist',
        content: 'Watercolor pan set delivery fee koto? Sylhet e pawa jabe?',
        timestamp: '3 hours ago',
        isHidden: false,
        intent: 'price_inquiry',
        replies: [
          {
            id: 'rep-2',
            author: 'Canvas Official',
            content: 'Hi Sajid! Order over ৳2000 gets FREE Express Delivery anywhere in Bangladesh! Price: ৳2200 BDT.',
            timestamp: '2 hours ago',
            isAiGenerated: false,
          },
        ],
      },
      {
        id: 'cm-[#insta-2]',
        postId: 'post-[#insta-1]',
        platform: 'instagram',
        authorName: 'art_by_anika',
        content: 'Obsessed with the transparency of these pans! 😍 Super rich pigments.',
        timestamp: '2 hours ago',
        isHidden: false,
        intent: 'compliment',
        replies: [],
      },
    ],
  },
];

let globalPosts = [...INITIAL_SOCIAL_POSTS];

export const commentsService = {
  getPosts: () => globalPosts,

  toggleAiAutoReply: (postId: string) => {
    const post = globalPosts.find((p) => p.id === postId);
    if (post) {
      post.aiAutoReplyEnabled = !post.aiAutoReplyEnabled;
    }
  },

  addReplyToComment: (postId: string, commentId: string, replyContent: string, author: string = 'You (Moderator)') => {
    const post = globalPosts.find((p) => p.id === postId);
    if (post) {
      const comment = post.comments.find((c) => c.id === commentId);
      if (comment) {
        comment.replies.push({
          id: `rep-${Date.now()}`,
          author,
          content: replyContent,
          timestamp: 'Just now',
        });
      }
    }
  },

  toggleHideComment: (postId: string, commentId: string) => {
    const post = globalPosts.find((p) => p.id === postId);
    if (post) {
      const comment = post.comments.find((c) => c.id === commentId);
      if (comment) {
        comment.isHidden = !comment.isHidden;
      }
    }
  },

  deleteComment: (postId: string, commentId: string) => {
    const post = globalPosts.find((p) => p.id === postId);
    if (post) {
      post.comments = post.comments.filter((c) => c.id !== commentId);
      post.commentsCount = Math.max(0, post.commentsCount - 1);
    }
  },
};

export default commentsService;
