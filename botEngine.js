/**
 * Sous Chef Bot — Shared Rule-Based Engine
 * Works identically in Node.js (Telegram) and browser (web).
 */

// ─── Knowledge Base ────────────────────────────────────────────────────────

const RECIPES = [
  {
    keywords: ["chicken", "garlic", "pasta"],
    name: "Garlic Chicken Pasta",
    ingredients: ["300g pasta", "2 chicken breasts", "4 garlic cloves", "olive oil", "salt", "pepper", "parsley"],
    steps: [
      "Cook pasta according to package directions. Reserve ½ cup pasta water.",
      "Season chicken with salt and pepper, then cook in olive oil over medium-high heat for 6–7 min per side.",
      "Slice chicken. In the same pan, sauté minced garlic 1 min until fragrant.",
      "Toss in drained pasta, splash of pasta water, and sliced chicken.",
      "Garnish with fresh parsley and serve hot."
    ]
  },
  {
    keywords: ["egg", "eggs", "toast", "bread"],
    name: "Classic Scrambled Eggs on Toast",
    ingredients: ["3 eggs", "2 tbsp butter", "2 slices bread", "salt", "pepper", "chives (optional)"],
    steps: [
      "Crack eggs into a bowl, season with salt and pepper, whisk well.",
      "Melt butter in a non-stick pan over low heat.",
      "Add eggs and stir continuously with a spatula — do NOT rush on high heat.",
      "Remove from heat just before they look fully set (carry-over heat finishes them).",
      "Serve immediately on toasted bread, topped with chives."
    ]
  },
  {
    keywords: ["tomato", "tomatoes", "onion", "onions", "rice"],
    name: "Simple Tomato Rice",
    ingredients: ["1 cup rice", "2 tomatoes (chopped)", "1 onion (diced)", "2 garlic cloves", "chicken or vegetable stock", "olive oil", "cumin", "salt"],
    steps: [
      "Sauté diced onion in olive oil until translucent (~4 min).",
      "Add garlic and cumin, cook 1 min.",
      "Stir in chopped tomatoes, cook until they break down (~5 min).",
      "Add rice and toast 2 min, stirring.",
      "Pour in stock (2:1 ratio), bring to boil, then cover and simmer 18 min.",
      "Fluff with a fork and serve."
    ]
  },
  {
    keywords: ["banana", "oats", "oatmeal"],
    name: "Banana Oatmeal",
    ingredients: ["1 cup rolled oats", "2 cups milk or water", "1 ripe banana", "pinch of salt", "honey", "cinnamon"],
    steps: [
      "Bring milk/water and salt to a gentle boil.",
      "Stir in oats and reduce to medium-low heat.",
      "Mash banana and stir into oats.",
      "Cook 5 min, stirring occasionally.",
      "Serve topped with honey and a sprinkle of cinnamon."
    ]
  },
  {
    keywords: ["lemon", "fish", "salmon", "butter"],
    name: "Lemon Butter Salmon",
    ingredients: ["2 salmon fillets", "2 tbsp butter", "1 lemon (juiced)", "2 garlic cloves", "salt", "pepper", "fresh dill"],
    steps: [
      "Pat salmon dry and season both sides with salt and pepper.",
      "Melt butter in a skillet over medium-high heat.",
      "Place salmon skin-side up and cook 4 min. Flip.",
      "Add garlic and cook another 3 min, basting with melted butter.",
      "Squeeze lemon over the fillets and garnish with dill."
    ]
  }
];

const SUBSTITUTIONS = {
  "buttermilk": "Mix 1 cup regular milk + 1 tbsp white vinegar or lemon juice. Let sit 5 min — it curdles into a perfect buttermilk substitute.",
  "eggs": "Use ¼ cup unsweetened applesauce, ¼ cup mashed banana, or 1 tbsp ground flaxseed + 3 tbsp water (let sit 5 min) per egg in baking.",
  "butter": "Substitute equal amounts of coconut oil, vegetable oil (use ¾ the amount), or unsweetened applesauce in baking.",
  "heavy cream": "Mix ¾ cup whole milk + ¼ cup melted butter, or use full-fat coconut cream as a dairy-free option.",
  "flour": "Use a 1:1 gluten-free flour blend, or almond flour for denser baked goods (may need binding agents).",
  "sugar": "Use ¾ cup honey or maple syrup per 1 cup sugar (reduce liquids in recipe by 3 tbsp). Or use coconut sugar 1:1.",
  "breadcrumbs": "Use crushed crackers, panko, rolled oats, or crushed cornflakes as a 1:1 substitute.",
  "sour cream": "Plain Greek yogurt works perfectly 1:1 in both cooking and baking.",
  "wine": "For white wine: use chicken/vegetable stock + a squeeze of lemon. For red wine: use beef stock + a splash of red wine vinegar.",
  "baking powder": "Use ¼ tsp baking soda + ½ tsp cream of tartar per 1 tsp baking powder."
};

const TECHNIQUES = {
  "brown butter": {
    title: "How to Brown Butter (Beurre Noisette)",
    steps: [
      "Use a light-coloured saucepan so you can watch the colour change easily.",
      "Cut butter into even pieces and melt over medium heat, stirring occasionally.",
      "It will foam up first — keep stirring gently.",
      "Watch carefully: the foam will subside and milk solids will turn golden-brown specks at the bottom.",
      "Once you smell a nutty, toasty aroma and see amber colour, remove from heat IMMEDIATELY.",
      "Pour into a cool bowl to stop cooking. It goes from perfect to burnt in seconds.",
      "Use in cookies, pasta, vegetables, or drizzle over fish."
    ]
  },
  "caramelize": {
    title: "How to Caramelize Onions",
    steps: [
      "Slice onions thinly and evenly.",
      "Heat butter + olive oil in a wide pan over LOW heat.",
      "Add onions with a pinch of salt — the salt draws out moisture.",
      "Stir every 5–10 min. Do NOT rush with high heat; it takes 30–45 min.",
      "When deeply golden and very soft, deglaze with a splash of balsamic or wine (optional).",
      "Great on burgers, pizzas, soups, or sandwiches."
    ]
  },
  "poach": {
    title: "How to Poach an Egg",
    steps: [
      "Fill a saucepan with ~3 inches of water and bring to a gentle simmer (not a rolling boil).",
      "Add 1 tsp white vinegar — helps the whites hold together.",
      "Crack egg into a small cup first.",
      "Create a gentle whirlpool in the water with a spoon, then slide the egg into the centre.",
      "Cook 3–4 min for a runny yolk.",
      "Lift out with a slotted spoon and blot on a paper towel."
    ]
  },
  "sear": {
    title: "How to Properly Sear Meat",
    steps: [
      "Pat meat DRY with paper towels — moisture is the enemy of a good sear.",
      "Season generously with salt and pepper right before cooking.",
      "Heat a heavy pan (cast iron preferred) over HIGH heat until smoking.",
      "Add a high smoke-point oil (avocado, canola, or refined coconut).",
      "Place meat away from you and DO NOT move it for 2–3 min.",
      "Flip once. Finish in the oven for thicker cuts.",
      "Rest meat 5–10 min before cutting to retain juices."
    ]
  },
  "dice": {
    title: "How to Dice an Onion",
    steps: [
      "Cut off the top of the onion, leaving the root end intact.",
      "Halve through the root. Peel both halves.",
      "Place flat-side down. Make horizontal cuts toward the root (don't cut through it).",
      "Make vertical cuts from tip to root.",
      "Finally, slice crosswise — uniform dice falls away.",
      "The root holds everything together until the very end."
    ]
  }
};

// ─── Intent Detection ───────────────────────────────────────────────────────

const GREETINGS = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "howdy", "sup", "hiya"];
const FAREWELLS = ["bye", "goodbye", "see you", "later", "take care", "ciao", "farewell", "thanks bye"];
const THANKS    = ["thank", "thanks", "thank you", "thx", "cheers", "appreciate"];

const MEDICAL_TRIGGERS = [
  "diabetes", "diabetic", "allergy", "allergic", "anaphylaxis", "celiac", "crohn",
  "ibs", "irritable bowel", "kidney disease", "heart disease", "chemotherapy",
  "medication", "prescription", "doctor", "physician", "medical", "clinical diet",
  "spoiled", "food poisoning", "mold", "mould", "rotten"
];

const OFF_TOPIC_TRIGGERS = [
  "weather", "stock", "news", "politics", "sports", "movie", "music", "travel",
  "fix my", "repair", "wifi", "internet", "computer", "phone", "laptop",
  "relationship", "mental health", "depression", "anxiety", "legal", "law",
  "finance", "insurance", "mortgage"
];

function normalise(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
}

function hasAny(text, words) {
  return words.some(w => text.includes(w));
}

// ─── Session State ──────────────────────────────────────────────────────────

function createSession() {
  return { failCount: 0 };
}

// ─── Core Response Logic ────────────────────────────────────────────────────

function getResponse(rawInput, session) {
  const input = normalise(rawInput);

  // — Greetings
  if (hasAny(input, GREETINGS)) {
    session.failCount = 0;
    return {
      text: "👋 Hey there! I'm **Sous Chef Bot**, your Smart Kitchen Assistant.\n\nI can help you with:\n• 🍽️ Recipe suggestions based on what's in your fridge\n• 👨‍🍳 Step-by-step cooking technique guides\n• 🔄 Ingredient substitutions & conversions\n\nWhat can I cook up for you today?",
      type: "greeting"
    };
  }

  // — Farewells
  if (hasAny(input, FAREWELLS)) {
    session.failCount = 0;
    return { text: "Happy cooking! 🍳 Come back anytime you need kitchen help. Bon appétit!", type: "farewell" };
  }

  // — Thanks
  if (hasAny(input, THANKS) && input.split(" ").length < 6) {
    session.failCount = 0;
    return { text: "You're very welcome! 😊 Let me know if you need anything else from the kitchen.", type: "thanks" };
  }

  // — Guardrail: Medical / Safety
  if (hasAny(input, MEDICAL_TRIGGERS)) {
    session.failCount = 0;
    return {
      text: "I appreciate you asking, but questions about medical diets, severe allergies, food safety hazards, or clinical nutrition are outside what I can safely advise on.\n\n🩺 **Please consult a registered dietitian, allergist, or your healthcare provider** for personalised guidance.\n\nIf you need to speak with a human culinary expert directly, you can reach us on WhatsApp: **+01157864766**\n\nIs there anything else I can help you with in the kitchen — like a recipe or cooking technique?",
      type: "escalation"
    };
  }

  // — Guardrail: Off-Topic
  if (hasAny(input, OFF_TOPIC_TRIGGERS)) {
    session.failCount = 0;
    return {
      text: "That's a bit outside my kitchen! 🍴 I'm only able to help with cooking, recipes, ingredients, and culinary techniques.\n\nFor other queries, please contact our team on WhatsApp: **+01157864766**\n\nCan I help you with something food-related instead?",
      type: "escalation"
    };
  }

  // — Help / Menu
  if (input.match(/\bhelp\b|\bwhat can you\b|\bwhat do you\b|\bmenu\b|\boptions\b/)) {
    session.failCount = 0;
    return {
      text: "Here's what I can do for you:\n\n**🍽️ Recipe Suggestions** — Tell me your ingredients and I'll suggest a recipe.\n*Try: \"I have chicken, garlic, and pasta\"*\n\n**👨‍🍳 Cooking Techniques** — Ask how to do anything in the kitchen.\n*Try: \"How do I brown butter?\" or \"How do I sear meat?\"*\n\n**🔄 Substitutions** — No buttermilk? No problem.\n*Try: \"What can I substitute for eggs?\"*",
      type: "help"
    };
  }

  // — Substitution Intent
  if (input.match(/substitut|replace|instead of|out of|don.t have|swap/)) {
    for (const [ingredient, advice] of Object.entries(SUBSTITUTIONS)) {
      if (input.includes(ingredient)) {
        session.failCount = 0;
        return {
          text: `**Substitution for ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}:**\n\n${advice}\n\n_Need another substitution or a recipe? Just ask!_`,
          type: "substitution"
        };
      }
    }
    // Slot not filled
    session.failCount = 0;
    return {
      text: "Sure! What ingredients do you have on hand, or what specific recipe/cooking topic do you need help with?",
      type: "slot_fill"
    };
  }

  // — Technique Intent
  for (const [key, technique] of Object.entries(TECHNIQUES)) {
    if (input.includes(key)) {
      session.failCount = 0;
      const stepsText = technique.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
      return {
        text: `**${technique.title}**\n\n${stepsText}\n\n_Got questions or want a recipe using this technique? Ask away!_`,
        type: "technique"
      };
    }
  }

  if (input.match(/\bhow (do|to|can)\b|\bstep(s| by step)\b|\btechnique\b|\bguide\b|\bexplain\b/)) {
    session.failCount = 0;
    return {
      text: "Sure! What ingredients do you have on hand, or what specific recipe/cooking topic do you need help with?",
      type: "slot_fill"
    };
  }

  // — Recipe Intent (ingredient matching)
  const ingredientHits = RECIPES.map(recipe => ({
    recipe,
    score: recipe.keywords.filter(k => input.includes(k)).length
  })).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

  if (ingredientHits.length > 0) {
    session.failCount = 0;
    const best = ingredientHits[0].recipe;
    const ingredientList = best.ingredients.map(i => `• ${i}`).join("\n");
    const stepsList = best.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
    return {
      text: `Great news — here's a recipe for you! 🎉\n\n**${best.name}**\n\n**You'll Need:**\n${ingredientList}\n\n**Steps:**\n${stepsList}\n\n_Need a substitution for any ingredient or want another recipe? Just ask!_`,
      type: "recipe"
    };
  }

  // — Vague recipe/cooking intent but no slot filled
  if (input.match(/recipe|cook|make|prepare|dish|meal|food|eat|ingredient/)) {
    session.failCount = 0;
    return {
      text: "Sure! What ingredients do you have on hand, or what specific recipe/cooking topic do you need help with?",
      type: "slot_fill"
    };
  }

  // — Fallback
  session.failCount = (session.failCount || 0) + 1;

  if (session.failCount >= 2) {
    session.failCount = 0;
    return {
      text: "It seems I'm having trouble understanding what you need. 😔\n\nLet me connect you with a **human culinary expert** who can help you better!\n\n💬 Chat with us on WhatsApp: **+01157864766**\n\nI hope you get the help you need. Happy cooking! 🍴",
      type: "escalation"
    };
  }

  return {
    text: "Sorry, I didn't quite catch that. Could you tell me what ingredients or recipe you're asking about, or try phrasing it in a different way?",
    type: "fallback"
  };
}

// ─── Export (Node.js) / Global (browser) ───────────────────────────────────

if (typeof module !== "undefined" && module.exports) {
  module.exports = { getResponse, createSession };
} else {
  window.BotEngine = { getResponse, createSession };
}
