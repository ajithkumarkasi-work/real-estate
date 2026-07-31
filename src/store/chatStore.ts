import { create } from "zustand";

import { callOpenAI } from "@/services/openai";
import type { ChatMessage } from "@/types/chat";
import type { Property, PropertyFilters } from "@/types/property";

function normalizePrice(input: string) {
  const cleaned = input.replace(/[$,]/g, "").trim().toLowerCase();
  if (cleaned.endsWith("k"))
    return Number.parseFloat(cleaned.slice(0, -1)) * 1000;
  return Number.parseFloat(cleaned);
}

export function extractFilters(message: string): Partial<PropertyFilters> {
  const filters: Partial<PropertyFilters> = {};
  const bedsMatch =
    message.match(/(\d+)\s*\*(?:bed|bedroom)/i) ||
    message.match(/(\d+)\s*(?:bed|bedroom)/i);
  const priceMatch = message.match(/under\s*\$?([\d,]+k?)/i);
  const cityMap: Array<[string, string]> = [
    ["delhi", "Delhi"],
    ["mumbai", "Mumbai"],
    ["bengaluru", "Bengaluru"],
    ["hyderabad", "Hyderabad"],
    ["pune", "Pune"],
    ["chennai", "Chennai"],
  ];

  if (bedsMatch) filters.minBeds = Number.parseInt(bedsMatch[1], 10);
  if (priceMatch) filters.maxPrice = normalizePrice(priceMatch[1]);

  if (/apartment|flat/i.test(message)) filters.type = "apartment";
  if (/house|home/i.test(message)) filters.type = "house";
  if (/villa/i.test(message)) filters.type = "villa";
  if (/studio/i.test(message)) filters.type = "studio";
  if (/penthouse/i.test(message)) filters.type = "penthouse";
  if (/rent|rental/i.test(message)) filters.status = "for-rent";
  if (/buy|purchase|sale/i.test(message)) filters.status = "for-sale";

  for (const [needle, city] of cityMap) {
    if (message.toLowerCase().includes(needle)) {
      filters.city = city;
      break;
    }
  }

  return filters;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  clearMessages: () => void;
  sendMessage: (content: string, allProperties: Property[]) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  clearMessages: () => set({ messages: [] }),
  sendMessage: async (content, allProperties) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    const nextMessages = [...get().messages, userMessage];
    set({ messages: nextMessages, isLoading: true });

    try {
      const extracted = extractFilters(content);
      const matchingProperties = allProperties
        .filter((property) => {
          if (extracted.city && property.city !== extracted.city) return false;
          if (extracted.type && property.type !== extracted.type) return false;
          if (extracted.status && property.status !== extracted.status)
            return false;
          if (
            typeof extracted.minBeds === "number" &&
            property.bedrooms < extracted.minBeds
          )
            return false;
          if (
            typeof extracted.maxPrice === "number" &&
            property.price > extracted.maxPrice
          )
            return false;
          return true;
        })
        .slice(0, 5);

      const assistantContent = await callOpenAI(
        nextMessages,
        matchingProperties,
      );
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantContent,
        propertyIds: matchingProperties.map((property) => property.id),
        timestamp: new Date(),
      };
      set({ messages: [...nextMessages, assistantMessage], isLoading: false });
    } catch {
      const fallback: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I could not reach the assistant right now. Try a simpler search like 2 bed rental in Bengaluru under 40000.",
        propertyIds: [],
        timestamp: new Date(),
      };
      set({ messages: [...nextMessages, fallback], isLoading: false });
    }
  },
}));
