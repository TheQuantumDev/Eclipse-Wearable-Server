import { type Request, type Response } from "express";

interface AdminCheckBody {
  code?: string;
}

// Store failed attempts
const failedAttempts = new Map<
  string,
  { attempts: number; lastAttempt: number; lockedUntil: number }
>();

const MAX_ATTEMPTS = 5; // Maximum attempts the admin can use to log in
const LOCKOUT_DURATION = 60 * 1000; // Lock down duration of 1 minute if all attempts are wrong
const ATTEMPT_RESET_TIME = 15 * 60 * 1000; // Reset the attempts after 1 minute

// Get the client IP so it can be blocked for the duration of the lock down
function getClientIP(req: Request): string {
  const forwarded = req.get("x-forwarded-for");
  if (forwarded) return Object(forwarded.split(",")[0]).trim();
  return req.ip || "unknown";
}

// Restore attempts after duration of lock down if reached
function cleanupAttempts() {
  const now = Date.now();
  for (const [ip, data] of failedAttempts.entries()) {
    if (now - data.lastAttempt > ATTEMPT_RESET_TIME) {
      failedAttempts.delete(ip);
    }
  }
}

export const handleAdminCheck = (req: Request, res: Response) => {
  const body = req.body as AdminCheckBody | undefined;
  const { code } = body ?? {};
  const clientIP = getClientIP(req);
  const now = Date.now();

  cleanupAttempts(); // Calling the cleanup attempts function

  const currentData = failedAttempts.get(clientIP);
  if (currentData && currentData.lockedUntil && now < currentData.lockedUntil) {
    const remainingTime = Math.ceil((currentData.lockedUntil - now) / 1000);
    return res.status(429).json({
      success: false,
      locked: true,
      message: `Too many failed attempts. Please try again in ${remainingTime} seconds.`,
      remainingTime,
    });
  }

  if (
    currentData &&
    currentData.lockedUntil &&
    now >= currentData.lockedUntil
  ) {
    failedAttempts.delete(clientIP);
  }

  /* 
  * If the code is correct, remove all failed attempts
  * and give the admin access to admin panel
  */
  if (code === process.env.ADMIN_CODE) {
    failedAttempts.delete(clientIP);
    return res.json({ success: true });
  }

  const data = failedAttempts.get(clientIP) || {
    attempts: 0,
    lastAttempt: now,
    lockedUntil: 0,
  };
  data.attempts += 1;
  data.lastAttempt = now;

  if (data.attempts >= MAX_ATTEMPTS) {
    data.lockedUntil = now + LOCKOUT_DURATION;
    failedAttempts.set(clientIP, data);
    return res.status(429).json({
      success: false,
      locked: true,
      message: "Too many failed attempts. You are locked out for 1 minute.",
      remainingTime: LOCKOUT_DURATION / 1000,
    });
  }

  failedAttempts.set(clientIP, data);
  const attemptsLeft = MAX_ATTEMPTS - data.attempts;
  return res.json({
    success: false,
    attempts: data.attempts,
    attemptsLeft,
    message: `Incorrect passcode. ${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} remaining.`,
  });
};
