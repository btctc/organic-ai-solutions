import { jwtVerify } from "jose";

/** Verify an admin JWT from the Authorization header. Returns true if valid. */
export async function verifyAdminToken(authHeader: string | null): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? "dev-secret-change-in-production"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}
