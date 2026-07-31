import OpenAI from "openai";

import type { ChatMessage } from "@/types/chat";
import type { Property } from "@/types/property";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
const client = apiKey
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

const SYSTEM_PROMPT =
  "You are HomeGuide, the in-app assistant for a real estate website. You must answer any website-related question and property-related question. This includes: search filters, map usage, favorites, login/account, scheduling visits, EMI calculator, price history, similar properties, and navigation help. If the user asks a non-website topic, politely steer back to real estate and website help. Be friendly, concise, and practical. When matching properties are provided in context, reference them specifically by name, city, and price. If no direct property match exists, ask 1-2 clarifying questions and suggest next actions on the website. Keep responses under 180 words.";

const WEBSITE_CONTEXT = {
  pages: [
    "Home",
    "Search",
    "Map Explore",
    "Property Detail",
    "Favorites",
    "Dashboard",
    "Login",
  ],
  capabilities: [
    "Filter properties by city, type, status, budget, beds and baths",
    "Explore listings on an interactive map and open details",
    "Save favorites (login required)",
    "Schedule property visits from property detail",
    "Use EMI calculator, view price history and similar properties",
    "Chat with the property assistant for discovery and website guidance",
  ],
  supportedCities: [
    "Delhi",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Pune",
    "Chennai",
  ],
};

function localWebsiteReply(userText: string): string | null {
  const text = userText.toLowerCase();

  if (/who are you|what can you do|help|how to use/.test(text)) {
    return "I can help with both property search and website guidance. You can ask about filters, map usage, favorites, login, scheduling visits, EMI, price history, and similar properties. Tell me your city, budget, and bedrooms to start finding matches.";
  }

  if (/map|location|marker/.test(text)) {
    return "Use Map Explore to view listings by location. Click any marker to see price and quick details, then open full property details. You can also switch between map and details on smaller screens.";
  }

  if (/favorite|save/.test(text)) {
    return "You can save properties to Favorites from listing cards and property details. If not logged in, the app will ask you to sign in first. After login, open Favorites to compare saved homes.";
  }

  if (/schedule|visit|book/.test(text)) {
    return "Open any Property Detail page, choose a date and time slot in Schedule Visit, then submit your details. You can also review EMI, price history, and similar homes on the same page before booking.";
  }

  if (/emi|loan|interest|tenure/.test(text)) {
    return "The Property Detail page includes an EMI calculator. Enter loan amount, interest rate, and tenure to get an instant monthly estimate and compare affordability across homes.";
  }

  if (/city|cities|where/.test(text)) {
    return "The current supported cities are Delhi, Mumbai, Bengaluru, Hyderabad, Pune, and Chennai. You can filter by city from Home or Search.";
  }

  if (/login|account|profile|dashboard|logout/.test(text)) {
    return "Use Login to access your account. Dashboard shows your profile area and account actions like logout. Favorites and some personalized actions require login.";
  }

  if (/search|filter|type|budget|bed|bath|rent|sale|buy/.test(text)) {
    return "In Search, you can filter by city, property type, status (for sale or for rent), price range, and bedroom/bathroom needs. Share your exact budget and city, and I can suggest suitable listings now.";
  }

  return null;
}

function localPropertyReply(matchingProperties: Property[]): string {
  const lead = matchingProperties[0];
  if (lead) {
    return `I found ${matchingProperties.length} matches, including ${lead.title} in ${lead.city}. You can open details, view on map, save to favorites, or schedule a visit.`;
  }

  return "I could not find an exact match yet. Share city, budget, property type, and bedrooms, and I will narrow options for you.";
}

export async function callOpenAI(
  messages: ChatMessage[],
  matchingProperties: Property[],
): Promise<string> {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user")?.content;

  if (!client) {
    const websiteReply = latestUserMessage
      ? localWebsiteReply(latestUserMessage)
      : null;

    if (websiteReply) return websiteReply;
    return localPropertyReply(matchingProperties);
  }

  const chatMessages = messages.map((message, index) => ({
    role: message.role,
    content:
      message.content +
      (index === messages.length - 1
        ? `\n\n[WEBSITE CONTEXT]\n${JSON.stringify(
            WEBSITE_CONTEXT,
            null,
            2,
          )}\n\n[MATCHING PROPERTIES]\n${JSON.stringify(
            matchingProperties.map((property) => ({
              id: property.id,
              title: property.title,
              price: property.price,
              priceUnit: property.priceUnit,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              city: property.city,
              neighborhood: property.neighborhood,
              type: property.type,
              status: property.status,
            })),
            null,
            2,
          )}`
        : ""),
  }));

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...chatMessages],
    max_tokens: 300,
    temperature: 0.7,
  });

  return (
    response.choices[0]?.message?.content ??
    "I could not generate a response right now."
  );
}
