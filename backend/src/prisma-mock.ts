// Mock in-memory database
class MockDatabase {
  private data: any = {
    users: [],
    events: [],
    photos: [],
    videos: [],
    inspirations: [],
    playlists: [],
    menuItems: [],
    roomPlans: [],
    podcasts: [],
    badges: [],
    eventSites: [],
    ambassadors: [],
    disputes: [],
    contracts: [],
    invoices: [],
  };

  // Generic CRUD operations
  create(table: string, data: any) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const item = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.data[table].push(item);
    return item;
  }

  findMany(table: string, options: any = {}) {
    let items = [...this.data[table]];
    
    // Apply where filter
    if (options.where) {
      items = items.filter(item => {
        for (const [key, value] of Object.entries(options.where)) {
          if (item[key] !== value) return false;
        }
        return true;
      });
    }

    // Apply orderBy
    if (options.orderBy) {
      const [[field, order]] = Object.entries(options.orderBy);
      items.sort((a, b) => {
        if (order === 'asc') return a[field] > b[field] ? 1 : -1;
        return a[field] < b[field] ? 1 : -1;
      });
    }

    return items;
  }

  findUnique(table: string, options: any) {
    return this.data[table].find((item: any) => {
      for (const [key, value] of Object.entries(options.where)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
  }

  update(table: string, options: any) {
    const index = this.data[table].findIndex((item: any) => {
      for (const [key, value] of Object.entries(options.where)) {
        if (item[key] !== value) return false;
      }
      return true;
    });

    if (index === -1) return null;

    this.data[table][index] = {
      ...this.data[table][index],
      ...options.data,
      updatedAt: new Date()
    };

    return this.data[table][index];
  }

  delete(table: string, options: any) {
    const index = this.data[table].findIndex((item: any) => {
      for (const [key, value] of Object.entries(options.where)) {
        if (item[key] !== value) return false;
      }
      return true;
    });

    if (index === -1) return null;

    const deleted = this.data[table][index];
    this.data[table].splice(index, 1);
    return deleted;
  }

  deleteMany(table: string, options: any) {
    const initialLength = this.data[table].length;
    this.data[table] = this.data[table].filter((item: any) => {
      for (const [key, value] of Object.entries(options.where)) {
        if (item[key] === value) return false;
      }
      return true;
    });
    return { count: initialLength - this.data[table].length };
  }

  count(table: string, options: any = {}) {
    if (!options.where) return this.data[table].length;
    
    return this.data[table].filter((item: any) => {
      for (const [key, value] of Object.entries(options.where)) {
        if (item[key] !== value) return false;
      }
      return true;
    }).length;
  }
}

const mockDb = new MockDatabase();

// Create mock Prisma-like client
export const prisma = {
  eventPhoto: {
    findMany: (options: any) => mockDb.findMany('photos', options),
    create: (options: any) => mockDb.create('photos', options.data),
    findUnique: (options: any) => mockDb.findUnique('photos', options),
    update: (options: any) => mockDb.update('photos', options),
    delete: (options: any) => mockDb.delete('photos', options),
  },
  video: {
    findMany: (options: any) => mockDb.findMany('videos', options),
    create: (options: any) => mockDb.create('videos', options.data),
    findUnique: (options: any) => mockDb.findUnique('videos', options),
    update: (options: any) => mockDb.update('videos', options),
    delete: (options: any) => mockDb.delete('videos', options),
  },
  videoComment: {
    findMany: (options: any) => mockDb.findMany('videoComments', options),
    create: (options: any) => mockDb.create('videoComments', options.data),
    delete: (options: any) => mockDb.delete('videoComments', options),
    deleteMany: (options: any) => mockDb.deleteMany('videoComments', options),
  },
  inspiration: {
    findMany: (options: any) => mockDb.findMany('inspirations', options),
    create: (options: any) => mockDb.create('inspirations', options.data),
    findUnique: (options: any) => mockDb.findUnique('inspirations', options),
    update: (options: any) => mockDb.update('inspirations', options),
    delete: (options: any) => mockDb.delete('inspirations', options),
    count: (options: any) => mockDb.count('inspirations', options),
  },
  inspirationCategory: {
    findMany: (options: any) => mockDb.findMany('inspirationCategories', options),
  },
  trend: {
    findMany: (options: any) => mockDb.findMany('trends', options),
  },
  userInspiration: {
    findFirst: (options: any) => mockDb.findUnique('userInspirations', options),
    create: (options: any) => mockDb.create('userInspirations', options.data),
    delete: (options: any) => mockDb.delete('userInspirations', options),
    deleteMany: (options: any) => mockDb.deleteMany('userInspirations', options),
  },
  playlist: {
    findMany: (options: any) => mockDb.findMany('playlists', options),
    create: (options: any) => mockDb.create('playlists', options.data),
    findUnique: (options: any) => mockDb.findUnique('playlists', options),
    update: (options: any) => mockDb.update('playlists', options),
    delete: (options: any) => mockDb.delete('playlists', options),
  },
  menuItem: {
    findMany: (options: any) => mockDb.findMany('menuItems', options),
    create: (options: any) => mockDb.create('menuItems', options.data),
    findUnique: (options: any) => mockDb.findUnique('menuItems', options),
    update: (options: any) => mockDb.update('menuItems', options),
    delete: (options: any) => mockDb.delete('menuItems', options),
  },
  guestMenuChoice: {
    findMany: (options: any) => mockDb.findMany('guestMenuChoices', options),
    findFirst: (options: any) => mockDb.findUnique('guestMenuChoices', options),
    create: (options: any) => mockDb.create('guestMenuChoices', options.data),
    update: (options: any) => mockDb.update('guestMenuChoices', options),
    delete: (options: any) => mockDb.delete('guestMenuChoices', options),
  },
  roomPlan: {
    findMany: (options: any) => mockDb.findMany('roomPlans', options),
    create: (options: any) => mockDb.create('roomPlans', options.data),
    findUnique: (options: any) => mockDb.findUnique('roomPlans', options),
    update: (options: any) => mockDb.update('roomPlans', options),
    delete: (options: any) => mockDb.delete('roomPlans', options),
  },
  podcast: {
    findMany: (options: any) => mockDb.findMany('podcasts', options),
    create: (options: any) => mockDb.create('podcasts', options.data),
    findUnique: (options: any) => mockDb.findUnique('podcasts', options),
    update: (options: any) => mockDb.update('podcasts', options),
    delete: (options: any) => mockDb.delete('podcasts', options),
    count: (options: any) => mockDb.count('podcasts', options),
  },
  badge: {
    findMany: (options: any) => mockDb.findMany('badges', options),
    findUnique: (options: any) => mockDb.findUnique('badges', options),
  },
  partnerBadge: {
    findMany: (options: any) => mockDb.findMany('partnerBadges', options),
    findFirst: (options: any) => mockDb.findUnique('partnerBadges', options),
    create: (options: any) => mockDb.create('partnerBadges', options.data),
  },
  eventSite: {
    findUnique: (options: any) => mockDb.findUnique('eventSites', options),
    create: (options: any) => mockDb.create('eventSites', options.data),
    update: (options: any) => mockDb.update('eventSites', options),
  },
  event: {
    findUnique: (options: any) => mockDb.findUnique('events', options),
  },
  ambassador: {
    findMany: (options: any) => mockDb.findMany('ambassadors', options),
    create: (options: any) => mockDb.create('ambassadors', options.data),
    findUnique: (options: any) => mockDb.findUnique('ambassadors', options),
    update: (options: any) => mockDb.update('ambassadors', options),
  },
  dispute: {
    findMany: (options: any) => mockDb.findMany('disputes', options),
    create: (options: any) => mockDb.create('disputes', options.data),
    findUnique: (options: any) => mockDb.findUnique('disputes', options),
    update: (options: any) => mockDb.update('disputes', options),
  },
  contract: {
    findMany: (options: any) => mockDb.findMany('contracts', options),
    create: (options: any) => mockDb.create('contracts', options.data),
    findUnique: (options: any) => mockDb.findUnique('contracts', options),
    update: (options: any) => mockDb.update('contracts', options),
  },
  invoice: {
    findMany: (options: any) => mockDb.findMany('invoices', options),
    create: (options: any) => mockDb.create('invoices', options.data),
    findUnique: (options: any) => mockDb.findUnique('invoices', options),
    update: (options: any) => mockDb.update('invoices', options),
  },
  user: {
    findUnique: (options: any) => mockDb.findUnique('users', options),
    findMany: (options: any) => mockDb.findMany('users', options),
    create: (options: any) => mockDb.create('users', options.data),
    update: (options: any) => mockDb.update('users', options),
    delete: (options: any) => mockDb.delete('users', options),
  },
  $transaction: async (operations: any[]) => {
    return Promise.all(operations);
  },
  $disconnect: async () => {},
};
