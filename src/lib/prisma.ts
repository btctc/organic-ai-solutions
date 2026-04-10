type UnsubscribeRecord = {
  email: string;
};

type LeadRecord = {
  id: string;
  source: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  consentTerms: boolean;
  consentEmail: boolean;
  consentTimestamp: string;
  chatHistory: string;
};

const unsubscribes = new Map<string, UnsubscribeRecord>();
const leads: LeadRecord[] = [];

export const prisma = {
  unsubscribe: {
    async findUnique({ where }: { where: { email: string } }) {
      const record = unsubscribes.get(where.email) ?? null;
      console.info('[prisma-stub] unsubscribe.findUnique', { email: where.email, found: Boolean(record) });
      return record;
    },
  },
  lead: {
    async create({ data }: { data: Omit<LeadRecord, 'id'> }) {
      const record: LeadRecord = {
        id: `lead_${Date.now()}_${leads.length + 1}`,
        ...data,
      };
      leads.push(record);
      console.info('[prisma-stub] lead.create', {
        id: record.id,
        email: record.email,
        source: record.source,
      });
      return record;
    },
  },
};
