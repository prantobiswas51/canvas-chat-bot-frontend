import { Conversation, ChatMessage, ChannelType, ConversationStatus, ChatAttachment, Moderator } from '@/types/chat';
import { generateCanvasBotResponse } from '@/features/chat/services/chatBotEngine';

// Global Event Listener System for Real-time Chat Sync
type Listener = () => void;

let listeners: Listener[] = [];

function emitChange() {
  listeners.forEach((listener) => listener());
}

export const subscribeToChatStore = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

export const MOCK_MODERATORS: Moderator[] = [
  {
    id: 'mod-ai',
    name: 'Canvas AI Bot 🤖',
    role: 'AI Assistant',
    status: 'online',
    isAi: true,
    activeChatsCount: 4,
  },
  {
    id: 'mod-1',
    name: 'Farhan Ahmed',
    role: 'Senior Moderator',
    status: 'online',
    isAi: false,
    activeChatsCount: 4,
  },
  {
    id: 'mod-2',
    name: 'Nadia Islam',
    role: 'Sales Executive',
    status: 'online',
    isAi: false,
    activeChatsCount: 2,
  },
  {
    id: 'mod-3',
    name: 'Samiul Hasan',
    role: 'Support Specialist',
    status: 'busy',
    isAi: false,
    activeChatsCount: 5,
  },
  {
    id: 'mod-4',
    name: 'Anika Chowdhury',
    role: 'Senior Moderator',
    status: 'offline',
    isAi: false,
    activeChatsCount: 0,
  },
];

export const INITIAL_STORE_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-whatsapp-1',
    channel: 'whatsapp',
    status: 'ai_active',
    assignedModeratorId: 'mod-ai',
    assignedModerator: MOCK_MODERATORS[0],
    category: 'art_consult',
    leadSource: {
      type: 'meta_ad',
      platformName: 'Facebook Click-to-WhatsApp Ad',
      campaignName: 'Summer Canvas Brushes Promo 2026',
      adTitle: 'Premium Natural Hog Bristle Oil Brushes 🎨',
      adHeadline: 'Get 15% OFF Professional Oil Painting Brushes - Limited Stock',
      adId: 'META-AD-88419',
      adThumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
      clickTimestamp: 'Today at 10:12 AM',
    },
    customer: {
      id: 'cust-1',
      name: 'Tanvir Ahmed',
      phone: '+8801711223344',
      email: 'tanvir.art@gmail.com',
      channel: 'whatsapp',
      totalOrders: 4,
      totalSpent: 8400,
      tags: ['Oil Painter', 'Frequent Buyer'],
      tier: 'Gold VIP',
      points: 480,
      city: 'Dhaka',
      address: 'House 42, Road 7/A, Dhanmondi, Dhaka-1209',
      preferredMedium: 'Oil Painting & Heavy Acrylic',
      lastOrderNumber: '#CNV-ORD-8821',
      lastOrderStatus: 'Delivered (Steadfast Courier)',
      lastOrderDate: '28 Jul 2026',
      notes: 'Prefers express delivery. Uses natural hog bristle brushes for impasto.',
      leadSource: {
        type: 'meta_ad',
        platformName: 'Facebook Click-to-WhatsApp Ad',
        campaignName: 'Summer Canvas Brushes Promo 2026',
        adTitle: 'Premium Natural Hog Bristle Oil Brushes 🎨',
        adHeadline: 'Get 15% OFF Professional Oil Painting Brushes - Limited Stock',
        adId: 'META-AD-88419',
        adThumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
        clickTimestamp: 'Today at 10:12 AM',
      },
    },
    lastMessage: 'Which brush is best for oil painting on canvas?',
    lastMessageTime: '2 mins ago',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-whatsapp-1',
        sender: 'customer',
        senderName: 'Tanvir Ahmed',
        content: 'Hi! Which brush is best for oil painting on canvas?',
        timestamp: '10:14 AM',
      },
      {
        id: 'msg-2',
        conversationId: 'conv-whatsapp-1',
        sender: 'ai_bot',
        senderName: 'Canvas AI Bot',
        content: 'For oil painting on canvas, stiff natural Hog Bristle brushes are best as they hold heavy body oils. We recommend our "Canvas Imperial Hog Bristle Set" (৳1,150 BDT).',
        timestamp: '10:14 AM',
        referencedProducts: ['CNV-BRS-HOG8'],
        languageDetected: 'en',
      },
    ],
  },
  {
    id: 'conv-messenger-1',
    channel: 'messenger',
    status: 'ai_active',
    assignedModeratorId: 'mod-ai',
    assignedModerator: MOCK_MODERATORS[0],
    category: 'order_requests',
    leadSource: {
      type: 'meta_ad',
      platformName: 'Instagram Sponsored Ad',
      campaignName: 'Heavy Body Acrylic Wholesale Sale',
      adTitle: 'Canvas Heavy Body Acrylic Paint Set (12x75ml)',
      adHeadline: 'Artist Grade Acrylics - Buy Direct from Canvas Art BD',
      adId: 'META-AD-77210',
      adThumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
      clickTimestamp: 'Today at 10:04 AM',
    },
    customer: {
      id: 'cust-2',
      name: 'Nusrat Jahan',
      phone: '+8801812998877',
      email: 'nusrat.j@yahoo.com',
      channel: 'messenger',
      totalOrders: 12,
      totalSpent: 34500,
      tags: ['Bulk Buyer', 'Art Institute'],
      tier: 'Pro Artist',
      points: 1450,
      city: 'Chittagong',
      address: 'Institute of Fine Arts, Nasirabad, Chittagong',
      preferredMedium: 'Acrylic & Mixed Media',
      lastOrderNumber: '#CNV-ORD-8790',
      lastOrderStatus: 'Delivered (Pathao Parcel)',
      lastOrderDate: '22 Jul 2026',
      notes: 'Institutional buyer. Always inquires for bulk discounts.',
      leadSource: {
        type: 'meta_ad',
        platformName: 'Instagram Sponsored Ad',
        campaignName: 'Heavy Body Acrylic Wholesale Sale',
        adTitle: 'Canvas Heavy Body Acrylic Paint Set (12x75ml)',
        adHeadline: 'Artist Grade Acrylics - Buy Direct from Canvas Art BD',
        adId: 'META-AD-77210',
        adThumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
        clickTimestamp: 'Today at 10:04 AM',
      },
    },
    lastMessage: 'Acrylic paint set koto dam?',
    lastMessageTime: '10 mins ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-201',
        conversationId: 'conv-messenger-1',
        sender: 'customer',
        senderName: 'Nusrat Jahan',
        content: 'Acrylic paint set koto dam?',
        timestamp: '10:05 AM',
      },
      {
        id: 'msg-202',
        conversationId: 'conv-messenger-1',
        sender: 'ai_bot',
        senderName: 'Canvas AI Bot',
        content: 'Amader "Canvas Heavy Body Acrylic Paint Set (12 x 75ml)" stock-e ache! Price: ৳1,450 BDT. Ekhon 45 pcs available.',
        timestamp: '10:05 AM',
        referencedProducts: ['CNV-ACR-500'],
        languageDetected: 'banglish',
      },
    ],
  },
  {
    id: 'conv-instagram-1',
    channel: 'instagram',
    status: 'ai_active',
    assignedModeratorId: 'mod-ai',
    assignedModerator: MOCK_MODERATORS[0],
    category: 'art_consult',
    leadSource: {
      type: 'organic_social',
      platformName: 'Instagram Reel DM',
      campaignName: 'Watercolor Masterclass Reel Series',
      adTitle: 'How to Achieve Smooth Watercolor Washes 🖌️',
      adHeadline: 'Reel #14 - Canvas Fine Art Tips',
      adThumbnailUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80',
      clickTimestamp: 'Today at 09:44 AM',
    },
    customer: {
      id: 'cust-3',
      name: 'Sajid Hossain',
      phone: '+8801915664422',
      email: 'sajid.hossain@outlook.com',
      channel: 'instagram',
      totalOrders: 1,
      totalSpent: 1450,
      tags: ['Beginner'],
      tier: 'Bronze Customer',
      points: 120,
      city: 'Sylhet',
      address: 'Zindabazar Commercial Area, Sylhet',
      preferredMedium: 'Watercolors',
      lastOrderNumber: '#CNV-ORD-8650',
      lastOrderStatus: 'Delivered',
      lastOrderDate: '10 Jul 2026',
      notes: 'New watercolor artist learning washes.',
    },
    lastMessage: 'How to get a good watercolor wash?',
    lastMessageTime: '30 mins ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-301',
        conversationId: 'conv-instagram-1',
        sender: 'customer',
        senderName: 'Sajid Hossain',
        content: 'How to get a good watercolor wash?',
        timestamp: '09:45 AM',
      },
      {
        id: 'msg-302',
        conversationId: 'conv-instagram-1',
        sender: 'ai_bot',
        senderName: 'Canvas AI Bot',
        content: 'To achieve a smooth watercolor wash, use soft synthetic sable brushes with high water retention. Our "Canvas Masterstroke Synthetic Sable Set" (৳890 BDT) is built for washes.',
        timestamp: '09:45 AM',
        referencedProducts: ['CNV-BRS-SYN6'],
        languageDetected: 'en',
      },
    ],
  },
  {
    id: 'conv-custom-canvas-1',
    channel: 'whatsapp',
    status: 'ai_active',
    assignedModeratorId: 'mod-ai',
    assignedModerator: MOCK_MODERATORS[0],
    category: 'custom_canvas',
    leadSource: {
      type: 'google_ad',
      platformName: 'Google Search Ad',
      campaignName: 'Custom Size Canvas Manufacturer Dhaka',
      adTitle: 'Order Custom Stretched Canvases 36x48 Inch',
      adHeadline: '100% Heavy Duck Cotton - Custom Frame Workshop',
      adId: 'G-AD-33910',
      clickTimestamp: 'Today at 09:28 AM',
    },
    customer: {
      id: 'cust-4',
      name: 'Anika Rahman',
      phone: '+8801755443322',
      email: 'anika.artstudio@gmail.com',
      channel: 'whatsapp',
      totalOrders: 3,
      totalSpent: 6200,
      tags: ['Custom Size', 'Fine Artist'],
      tier: 'Gold VIP',
      points: 320,
      city: 'Dhaka',
      address: 'Gulshan 2, Dhaka-1212',
      preferredMedium: 'Large Canvas Oil & Acrylic',
      lastOrderNumber: '#CNV-ORD-8910',
      lastOrderStatus: 'In Production',
      lastOrderDate: '01 Aug 2026',
      notes: 'Orders custom stretched 36x48 inch heavy duck cotton canvases.',
    },
    lastMessage: '36x48 inch custom stretched canvas banano jabe?',
    lastMessageTime: '45 mins ago',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-401',
        conversationId: 'conv-custom-canvas-1',
        sender: 'customer',
        senderName: 'Anika Rahman',
        content: '36x48 inch custom stretched canvas banano jabe? Heavy 100% duck cotton gesso primed.',
        timestamp: '09:30 AM',
      },
      {
        id: 'msg-402',
        conversationId: 'conv-custom-canvas-1',
        sender: 'ai_bot',
        senderName: 'Canvas AI Bot',
        content: 'Ha, amader custom canvas workshop-e 36x48 inch 100% duck cotton heavy stretched canvas banano jabe! Production time: 2-3 days.',
        timestamp: '09:31 AM',
        languageDetected: 'banglish',
      },
    ],
  },
  {
    id: 'conv-support-1',
    channel: 'messenger',
    status: 'human_moderator',
    assignedModeratorId: 'mod-1',
    assignedModerator: MOCK_MODERATORS[1],
    category: 'support_handoff',
    leadSource: {
      type: 'meta_ad',
      platformName: 'Facebook Sponsored Ad',
      campaignName: 'Wholesale Art Supplies Bulk Deal 2026',
      adTitle: 'Bulk Watercolor Sets for Art Dealers & Schools',
      adHeadline: 'Up to 30% OFF Wholesale Quantity Discounts',
      adId: 'META-AD-44120',
      adThumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&auto=format&fit=crop&q=80',
      clickTimestamp: 'Today at 09:08 AM',
    },
    customer: {
      id: 'cust-5',
      name: 'Farhan Kabir',
      phone: '+8801833112233',
      email: 'farhan.supplies@gmail.com',
      channel: 'messenger',
      totalOrders: 8,
      totalSpent: 42000,
      tags: ['Wholesale Dealer', 'Human Handoff'],
      tier: 'Pro Artist',
      points: 1890,
      city: 'Rajshahi',
      address: 'Station Road, Rajshahi',
      preferredMedium: 'Bulk Art Supplies',
      lastOrderNumber: '#CNV-ORD-8850',
      lastOrderStatus: 'Handoff Triggered - Moderation Required',
      lastOrderDate: '02 Aug 2026',
      notes: 'Wholesale dealer. Requires custom pricing negotiation.',
    },
    lastMessage: 'I need 100 pcs watercolor sets for wholesale bulk order.',
    lastMessageTime: '1 hour ago',
    unreadCount: 2,
    messages: [
      {
        id: 'msg-501',
        conversationId: 'conv-support-1',
        sender: 'customer',
        senderName: 'Farhan Kabir',
        content: 'I need 100 pcs watercolor sets for wholesale bulk order. Can I talk to a human manager for discount?',
        timestamp: '09:10 AM',
      },
      {
        id: 'msg-502',
        conversationId: 'conv-support-1',
        sender: 'ai_bot',
        senderName: 'Canvas AI Bot',
        content: 'Thank you! For bulk order negotiations or special inquiries, I am transferring you to a human moderator right away. A team member will join shortly.',
        timestamp: '09:10 AM',
        handoffReason: 'Bulk order negotiation / Custom request',
        languageDetected: 'en',
      },
    ],
  },
];

let globalConversations: Conversation[] = [...INITIAL_STORE_CONVERSATIONS];

export const chatStore = {
  getConversations: () => globalConversations,
  getModerators: () => MOCK_MODERATORS,

  findConversationByChannel: (channel: ChannelType) => {
    return globalConversations.find((c) => c.channel === channel) || globalConversations[0];
  },

  assignModerator: (conversationId: string, moderatorId: string) => {
    const conv = globalConversations.find((c) => c.id === conversationId);
    const mod = MOCK_MODERATORS.find((m) => m.id === moderatorId);

    if (conv && mod) {
      conv.assignedModeratorId = mod.id;
      conv.assignedModerator = mod;

      if (mod.isAi) {
        conv.status = 'ai_active';
      } else {
        conv.status = 'human_moderator';
      }

      const sysMsg: ChatMessage = {
        id: `msg-sys-${Date.now()}`,
        conversationId: conv.id,
        sender: 'system',
        senderName: 'System',
        content: `👤 Chat assigned to Moderator: ${mod.name} (${mod.role})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      conv.messages.push(sysMsg);
      emitChange();
    }
  },

  // Customer sends a message through the floating simulator
  sendCustomerSimulatedMessage: (channel: ChannelType, text: string) => {
    let targetConv = globalConversations.find((c) => c.channel === channel);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!targetConv) {
      // Create new conversation for channel if missing
      targetConv = {
        id: `conv-${channel}-${Date.now()}`,
        channel: channel,
        status: 'ai_active',
        assignedModeratorId: 'mod-ai',
        assignedModerator: MOCK_MODERATORS[0],
        customer: {
          id: `cust-${Date.now()}`,
          name: channel === 'messenger' ? 'Facebook User' : channel === 'instagram' ? 'Instagram User' : 'WhatsApp Customer',
          channel: channel,
          totalOrders: 1,
          totalSpent: 1200,
          tags: ['Simulated Lead'],
        },
        lastMessage: text,
        lastMessageTime: 'Just now',
        unreadCount: 1,
        messages: [],
      };
      globalConversations.unshift(targetConv);
    }

    const custMsg: ChatMessage = {
      id: `msg-cust-${Date.now()}`,
      conversationId: targetConv.id,
      sender: 'customer',
      senderName: targetConv.customer.name,
      content: text,
      timestamp: nowTime,
    };

    targetConv.messages.push(custMsg);
    targetConv.lastMessage = text;
    targetConv.lastMessageTime = 'Just now';
    targetConv.unreadCount += 1;

    emitChange();

    // Trigger AI Bot Auto-reply if status is AI Active
    if (targetConv.status === 'ai_active') {
      setTimeout(() => {
        const botRes = generateCanvasBotResponse(text);

        const botMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          conversationId: targetConv!.id,
          sender: 'ai_bot',
          senderName: 'Canvas AI Bot',
          content: botRes.replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          referencedProducts: botRes.referencedProductSkus,
          languageDetected: botRes.languageDetected,
          handoffReason: botRes.handoffReason,
        };

        if (botRes.shouldHandoff) {
          targetConv!.status = 'human_moderator';
          // Auto-assign to senior human moderator
          const humanMod = MOCK_MODERATORS[1];
          targetConv!.assignedModeratorId = humanMod.id;
          targetConv!.assignedModerator = humanMod;

          const autoAssignMsg: ChatMessage = {
            id: `msg-auto-assign-${Date.now()}`,
            conversationId: targetConv!.id,
            sender: 'system',
            senderName: 'Canvas AI System',
            content: `🤖 AI Auto-Assigned chat to Human Moderator: ${humanMod.name} (${humanMod.role})`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          targetConv!.messages.push(autoAssignMsg);
        }

        targetConv!.messages.push(botMsg);
        targetConv!.lastMessage = botRes.replyText;
        targetConv!.lastMessageTime = 'Just now';

        emitChange();
      }, 700);
    }
  },

  // Admin Agent sends a message from Dashboard Inbox
  sendAgentMessage: (conversationId: string, text: string, attachment?: ChatAttachment) => {
    const conv = globalConversations.find((c) => c.id === conversationId);
    if (!conv) return;

    const agentMsg: ChatMessage = {
      id: `msg-agent-${Date.now()}`,
      conversationId: conv.id,
      sender: 'human_agent',
      senderName: 'You (Agent)',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment,
    };

    conv.messages.push(agentMsg);
    conv.lastMessage = attachment ? `📎 ${attachment.name}` : text;
    conv.lastMessageTime = 'Just now';
    conv.unreadCount = 0;

    emitChange();

    // Generate AI response if in AI Mode
    if (conv.status === 'ai_active') {
      setTimeout(() => {
        const botRes = generateCanvasBotResponse(text);
        const botMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          conversationId: conv.id,
          sender: 'ai_bot',
          senderName: 'Canvas AI Bot',
          content: botRes.replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          referencedProducts: botRes.referencedProductSkus,
          languageDetected: botRes.languageDetected,
          handoffReason: botRes.handoffReason,
        };

        if (botRes.shouldHandoff) {
          conv.status = 'human_moderator';
          const humanMod = MOCK_MODERATORS[1];
          conv.assignedModeratorId = humanMod.id;
          conv.assignedModerator = humanMod;
        }

        conv.messages.push(botMsg);
        conv.lastMessage = botRes.replyText;
        conv.lastMessageTime = 'Just now';

        emitChange();
      }, 800);
    }
  },

  updateStatus: (conversationId: string, newStatus: ConversationStatus) => {
    const conv = globalConversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.status = newStatus;

      if (newStatus === 'ai_active') {
        conv.assignedModeratorId = MOCK_MODERATORS[0].id;
        conv.assignedModerator = MOCK_MODERATORS[0];
      } else if (newStatus === 'human_moderator' && conv.assignedModerator?.isAi) {
        conv.assignedModeratorId = MOCK_MODERATORS[1].id;
        conv.assignedModerator = MOCK_MODERATORS[1];
      }

      emitChange();
    }
  },
};
