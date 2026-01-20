import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ============================================
// SafeWalk Database Functions
// ============================================

import { and } from "drizzle-orm";
import { 
  sessions, 
  positions, 
  smsLogs, 
  userPreferences,
  type InsertSession,
  type InsertPosition,
  type InsertSmsLog,
  type InsertUserPreferences,
  type Session,
  type Position,
  type SmsLog,
  type UserPreferences,
} from "../drizzle/schema";

/**
 * Créer ou mettre à jour une session
 */
export async function upsertSession(data: InsertSession): Promise<Session | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert session: database not available");
    return null;
  }

  try {
    const existing = await db.select().from(sessions).where(eq(sessions.id, data.id)).limit(1);
    
    if (existing.length > 0) {
      await db.update(sessions).set(data).where(eq(sessions.id, data.id));
      const updated = await db.select().from(sessions).where(eq(sessions.id, data.id)).limit(1);
      return updated[0] || null;
    } else {
      await db.insert(sessions).values(data);
      const created = await db.select().from(sessions).where(eq(sessions.id, data.id)).limit(1);
      return created[0] || null;
    }
  } catch (error) {
    console.error("[Database] Error upserting session:", error);
    return null;
  }
}

/**
 * Récupérer une session par ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Error getting session:", error);
    return null;
  }
}

/**
 * Récupérer les sessions d'un utilisateur
 */
export async function getUserSessions(userId: number, limit: number = 10): Promise<Session[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(sessions).where(eq(sessions.userId, userId)).limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Error getting user sessions:", error);
    return [];
  }
}

/**
 * Sauvegarder une position GPS
 */
export async function savePosition(data: InsertPosition): Promise<Position | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save position: database not available");
    return null;
  }

  try {
    await db.insert(positions).values(data);
    const saved = await db.select().from(positions).where(eq(positions.id, data.id)).limit(1);
    return saved[0] || null;
  } catch (error) {
    console.error("[Database] Error saving position:", error);
    return null;
  }
}

/**
 * Récupérer les positions d'une session
 */
export async function getSessionPositions(sessionId: string): Promise<Position[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(positions).where(eq(positions.sessionId, sessionId));
    return result;
  } catch (error) {
    console.error("[Database] Error getting session positions:", error);
    return [];
  }
}

/**
 * Sauvegarder un log SMS
 */
export async function saveSmsLog(data: InsertSmsLog): Promise<SmsLog | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save SMS log: database not available");
    return null;
  }

  try {
    await db.insert(smsLogs).values(data);
    const saved = await db.select().from(smsLogs).where(eq(smsLogs.id, data.id)).limit(1);
    return saved[0] || null;
  } catch (error) {
    console.error("[Database] Error saving SMS log:", error);
    return null;
  }
}

/**
 * Mettre à jour le statut d'un SMS
 */
export async function updateSmsStatus(
  smsId: string,
  status: 'pending' | 'sent' | 'delivered' | 'failed',
  updates?: { sentAt?: Date; deliveredAt?: Date; failureReason?: string }
): Promise<SmsLog | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const updateData: any = { status, updatedAt: new Date() };
    if (updates?.sentAt) updateData.sentAt = updates.sentAt;
    if (updates?.deliveredAt) updateData.deliveredAt = updates.deliveredAt;
    if (updates?.failureReason) updateData.failureReason = updates.failureReason;

    await db.update(smsLogs).set(updateData).where(eq(smsLogs.id, smsId));
    const updated = await db.select().from(smsLogs).where(eq(smsLogs.id, smsId)).limit(1);
    return updated[0] || null;
  } catch (error) {
    console.error("[Database] Error updating SMS status:", error);
    return null;
  }
}

/**
 * Récupérer les SMS logs d'une session
 */
export async function getSessionSmsLogs(sessionId: string): Promise<SmsLog[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(smsLogs).where(eq(smsLogs.sessionId, sessionId));
    return result;
  } catch (error) {
    console.error("[Database] Error getting session SMS logs:", error);
    return [];
  }
}

/**
 * Créer ou mettre à jour les préférences utilisateur
 */
export async function upsertUserPreferences(data: InsertUserPreferences): Promise<UserPreferences | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user preferences: database not available");
    return null;
  }

  try {
    const existing = await db.select().from(userPreferences).where(eq(userPreferences.userId, data.userId)).limit(1);
    
    if (existing.length > 0) {
      await db.update(userPreferences).set(data).where(eq(userPreferences.userId, data.userId));
      const updated = await db.select().from(userPreferences).where(eq(userPreferences.userId, data.userId)).limit(1);
      return updated[0] || null;
    } else {
      await db.insert(userPreferences).values(data);
      const created = await db.select().from(userPreferences).where(eq(userPreferences.userId, data.userId)).limit(1);
      return created[0] || null;
    }
  } catch (error) {
    console.error("[Database] Error upserting user preferences:", error);
    return null;
  }
}

/**
 * Récupérer les préférences d'un utilisateur
 */
export async function getUserPreferences(userId: number): Promise<UserPreferences | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Error getting user preferences:", error);
    return null;
  }
}
