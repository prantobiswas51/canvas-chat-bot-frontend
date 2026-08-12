import { MOCK_INVENTORY } from '@/services/inventoryService';

export interface BotResponseResult {
  replyText: string;
  shouldHandoff: boolean;
  handoffReason?: string;
  referencedProductSkus?: string[];
  languageDetected: 'en' | 'bn' | 'banglish';
}

/**
 * Detect language (Bengali, Banglish, or English)
 */
function detectLanguage(text: string): 'en' | 'bn' | 'banglish' {
  const bnRegex = /[\u0980-\u09FF]/;
  if (bnRegex.test(text)) return 'bn';

  const banglishKeywords = ['koto', 'dam', 'bhalo', 'lagbe', 'ache', 'apnader', 'nibo', 'kivabe', 'dorkar'];
  const lower = text.toLowerCase();
  if (banglishKeywords.some((word) => lower.includes(word))) {
    return 'banglish';
  }

  return 'en';
}

/**
 * Core AI Customer Service & Art Consultant Engine for "Canvas"
 */
export function generateCanvasBotResponse(userPrompt: string): BotResponseResult {
  const lang = detectLanguage(userPrompt);
  const promptLower = userPrompt.toLowerCase().trim();

  // 1. Human Handoff Triggers (Bulk order, discounts, custom negotiation, unknown complex queries)
  const bulkOrHandoffKeywords = [
    'bulk', 'wholesale', 'discount', 'negotiate', 'dealer', 'distributor', 
    '50 pcs', '100 pcs', 'human', 'agent', 'moderator', 'talk to person',
    'kom dam', 'bises chhar', 'bhalobhabe kotha'
  ];

  if (bulkOrHandoffKeywords.some((kw) => promptLower.includes(kw))) {
    let reply = '';
    if (lang === 'bn') {
      reply = 'ধন্যবাদ! পাইকারি বা বাল্ক অর্ডারের জন্য আপনাকে আমাদের একজন হিউম্যান মডারেটরের কাছে ট্রান্সফার করা হচ্ছে। শীঘ্রই একজন প্রতিনিধি যোগ দেবেন।';
    } else if (lang === 'banglish') {
      reply = 'Dhonnobad! Bulk ba wholesale order-er jonno apnake amader human moderator-er kache transfer kora hochhe. Khub shighro-i ekjon kotha bolben.';
    } else {
      reply = 'Thank you! For bulk order negotiations or special inquiries, I am transferring you to a human moderator right away. A team member will join shortly.';
    }

    return {
      replyText: reply,
      shouldHandoff: true,
      handoffReason: 'Bulk order negotiation / Custom request',
      languageDetected: lang,
    };
  }

  // 2. Real-time Product & Inventory Price / Availability Queries
  const productMatches = MOCK_INVENTORY.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(promptLower);
    const catMatch = item.category.toLowerCase().includes(promptLower);
    const tagMatch = item.tags.some((t) => promptLower.includes(t.toLowerCase()));
    return nameMatch || catMatch || tagMatch;
  });

  const isPriceOrStockQuery = [
    'price', 'cost', 'how much', 'available', 'stock', 'dam', 'koto', 'ache naki', 'bickri'
  ].some((kw) => promptLower.includes(kw));

  if (isPriceOrStockQuery || (productMatches.length > 0 && (promptLower.includes('paint') || promptLower.includes('brush') || promptLower.includes('canvas')))) {
    if (productMatches.length > 0) {
      const topProd = productMatches[0];
      let reply = '';

      if (lang === 'bn') {
        reply = `আমাদের "Canvas ${topProd.name}" টি স্টকে আছে! মূল্য: ৳${topProd.price} BDT। বর্তমানে ${topProd.stock} টি উপলব্ধ রয়েছে।`;
      } else if (lang === 'banglish') {
        reply = `Amader "${topProd.name}" stock-e ache! Price: ৳${topProd.price} BDT. Ekhon ${topProd.stock} pcs available.`;
      } else {
        reply = `We have the "${topProd.name}" in stock! Price: ৳${topProd.price} BDT. Current inventory: ${topProd.stock} units.`;
      }

      return {
        replyText: reply,
        shouldHandoff: false,
        referencedProductSkus: [topProd.sku],
        languageDetected: lang,
      };
    }
  }

  // 3. Art Consultation Queries
  if (promptLower.includes('brush') && (promptLower.includes('oil') || promptLower.includes('tail'))) {
    let reply = '';
    if (lang === 'bn') {
      reply = 'অয়েল পেইন্টিংয়ের জন্য শক্ত ন্যাচারাল হগ ব্রিসল (Hog Bristle) ব্রাশ সেরা। আমাদের "Canvas Imperial Hog Bristle Brush Set (৳1,150)" অয়েল রঙের জন্য নিখুঁত।';
    } else if (lang === 'banglish') {
      reply = 'Oil painting-er jonno stiff natural Hog Bristle brush shobcheye bhalo. Amader "Canvas Imperial Hog Bristle Set (৳1,150 BDT)" ideal!';
    } else {
      reply = 'For oil painting on canvas, stiff natural Hog Bristle brushes are best as they hold heavy body oils. We recommend our "Canvas Imperial Hog Bristle Set" (৳1,150 BDT).';
    }

    return {
      replyText: reply,
      shouldHandoff: false,
      referencedProductSkus: ['CNV-BRS-HOG8'],
      languageDetected: lang,
    };
  }

  if (promptLower.includes('wash') || (promptLower.includes('watercolor') && promptLower.includes('brush'))) {
    let reply = '';
    if (lang === 'bn') {
      reply = 'স্মুথ ওয়াটারকালার ওয়াশের জন্য বেশি পানি ধরে রাখতে পারে এমন সফট সিন্থেটিক সেবল ব্রাশ ব্যবহার করুন। আমাদের "Canvas Masterstroke Sable Set (৳890)" চমৎকার রেসপন্স দেয়।';
    } else if (lang === 'banglish') {
      reply = 'Smooth watercolor wash-er jonno high water retention sable brush drorkar. Amader "Canvas Masterstroke Synthetic Sable Set (৳890 BDT)" try korte paren.';
    } else {
      reply = 'To achieve a smooth watercolor wash, use soft synthetic sable brushes with high water retention. Our "Canvas Masterstroke Synthetic Sable Set" (৳890 BDT) is built for washes.';
    }

    return {
      replyText: reply,
      shouldHandoff: false,
      referencedProductSkus: ['CNV-BRS-SYN6'],
      languageDetected: lang,
    };
  }

  if (promptLower.includes('acrylic') || promptLower.includes('canvas paint')) {
    let reply = '';
    if (lang === 'bn') {
      reply = 'ক্যানভাসে দ্রুত শুকানোর টেক্সচার্ড পেইন্টিংয়ের জন্য হেভি বডি অ্যাক্রিলিক আদর্শ। "Canvas Heavy Body Acrylic Set (12x75ml) - ৳1,450 BDT" ট্রাই করে দেখতে পারেন।';
    } else if (lang === 'banglish') {
      reply = 'Canvas-e quick-drying texture-er jonno Heavy Body Acrylic best. Try "Canvas Heavy Body Acrylic Set (৳1,450 BDT)".';
    } else {
      reply = 'For vibrant canvas artwork with quick drying time, Heavy Body Acrylics are ideal. We offer the "Canvas Heavy Body Acrylic Set (12x75ml)" at ৳1,450 BDT.';
    }

    return {
      replyText: reply,
      shouldHandoff: false,
      referencedProductSkus: ['CNV-ACR-500'],
      languageDetected: lang,
    };
  }

  // 4. Fallback Friendly Response
  let fallbackReply = '';
  if (lang === 'bn') {
    fallbackReply = 'ক্যানভাস আর্ট সাপ্লাইজে আপনাকে স্বাগতম! আমি আর্ট কনসালটেন্ট AI। ওয়াটারকালার, অয়েল পেইন্ট, অ্যাক্রিলিক বা ক্যানভাসের সঠিক পণ্য ও দাম জানতে আমাকে বলুন!';
  } else if (lang === 'banglish') {
    fallbackReply = 'Canvas Art Supplies-e apnake shagotom! Ami apnader Art Consultant AI. Acrylic, watercolor, oil paint ba brush-er dam/stock jante bolun!';
  } else {
    fallbackReply = 'Welcome to Canvas Art Supplies! I am your AI Art Consultant. How can I help you choose the right paints, brushes, or canvases today?';
  }

  return {
    replyText: fallbackReply,
    shouldHandoff: false,
    languageDetected: lang,
  };
}
