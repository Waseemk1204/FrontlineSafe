# Database Connection Issue Fix

## Problem
The server is failing to connect to Supabase database:
```
Can't reach database server at `db.dgedwlhfupndyxeymkqf.supabase.co:5432`
```

## Possible Causes

### 1. Supabase Firewall (Most Likely)
Supabase by default blocks connections from unknown IPs. Render's IPs need to be whitelisted.

**Solution:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/dgedwlhfupndyxeymkqf
2. Navigate to **Settings** → **Database**
3. Scroll to **Connection Pooling** or **Network Restrictions**
4. Either:
   - **Option A**: Enable "Allow connections from any IP" (easiest for development)
   - **Option B**: Add Render's IP addresses to the allowlist
     - Render IPs change, so you may need to check Render's documentation
     - Or use Supabase's connection pooler which is more permissive

### 2. Connection String Format
Make sure your `DATABASE_URL` in Render is correct:

**Current format:**
```
postgresql://postgres:WD1xtCGH8kZkYtoD*@db.dgedwlhfupndyxeymkqf.supabase.co:5432/postgres
```

**Alternative formats to try:**
1. **Direct connection:**
   ```
   postgresql://postgres:WD1xtCGH8kZkYtoD*@db.dgedwlhfupndyxeymkqf.supabase.co:5432/postgres
   ```

2. **Connection pooler (port 6543):**
   ```
   postgresql://postgres:WD1xtCGH8kZkYtoD*@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

3. **Transaction pooler:**
   ```
   postgresql://postgres:WD1xtCGH8kZkYtoD*@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

### 3. Password Encoding
If your password contains special characters like `*`, they might need URL encoding:
- `*` should be `%2A`
- `@` should be `%40`
- etc.

**Example:**
```
postgresql://postgres:WD1xtCGH8kZkYtoD%2A@db.dgedwlhfupndyxeymkqf.supabase.co:5432/postgres
```

### 4. Get Correct Connection String from Supabase
1. Go to Supabase Dashboard
2. **Settings** → **Database**
3. Under **Connection string**, select **URI**
4. Copy the exact connection string shown
5. Update `DATABASE_URL` in Render with that exact string

## Quick Fix Steps

1. **Check Supabase Firewall:**
   - Dashboard → Settings → Database
   - Look for "Network Restrictions" or "IP Allowlist"
   - Enable "Allow all IPs" or add Render IPs

2. **Verify DATABASE_URL in Render:**
   - Go to Render dashboard → Your service → Environment
   - Check `DATABASE_URL` is set correctly
   - Make sure password is URL-encoded if it has special chars

3. **Test Connection:**
   - After updating, trigger a new deploy
   - Check logs for database connection success

## Current Status

The code has been updated to:
- ✅ Make database connection non-blocking (server can start even if DB fails initially)
- ✅ Log database connection errors clearly
- ✅ Fix Redis URL parsing issues

**Next:** Fix Supabase firewall settings and verify DATABASE_URL format.

