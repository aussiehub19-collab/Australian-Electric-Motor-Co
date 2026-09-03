(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;
  navigator.modelContext.provideContext({
    tools: [
      {
        name: "search_products",
        description: "Search Australian Electric Motor Co electric dirt bikes and parts by keyword, category, or price",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            category: { type: "string" },
            max_price: { type: "number" }
          }
        },
        execute: async ({ query, category, max_price }) => {
          const params = new URLSearchParams();
          if (query) params.set('q', query);
          if (category) params.set('category', category);
          if (max_price) params.set('max_price', String(max_price));
          const res = await fetch(`https://australianelectricmotorco.com.au/api/search/?${params}`);
          return res.json();
        }
      },
      {
        name: "browse_products",
        description: "Browse products by category",
        inputSchema: {
          type: "object",
          properties: {
            category: { type: "string" }
          }
        },
        execute: async ({ category }) => {
          const url = category ? `https://australianelectricmotorco.com.au/shop/${category}/` : `https://australianelectricmotorco.com.au/shop/`;
          window.location.href = url;
          return { url };
        }
      },
      {
        name: "order_via_whatsapp",
        description: "Initiate a WhatsApp order with a technician. 10% crypto discount or Pay in 4 available. Human completes.",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string" }
          }
        },
        execute: async ({ message }) => {
          const cleanPhone = "61480031899";
          const url = message ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}` : `https://wa.me/${cleanPhone}`;
          window.open(url, '_blank');
          return { url };
        }
      },
      {
        name: "get_wholesale_info",
        description: "Get wholesale pricing tiers and station fleet information",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = `https://australianelectricmotorco.com.au/wholesale/`;
          return { url: `https://australianelectricmotorco.com.au/wholesale/` };
        }
      },
      {
        name: "compare_products",
        description: "Open the electric dirt bike comparison matrix",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = `https://australianelectricmotorco.com.au/compare/`;
          return { url: `https://australianelectricmotorco.com.au/compare/` };
        }
      },
      {
        name: "contact",
        description: "Contact Australian Electric Motor Co Queensland technicians for fitment or questions",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = `https://australianelectricmotorco.com.au/contact/`;
          return { url: `https://australianelectricmotorco.com.au/contact/` };
        }
      }
    ]
  });
})();
