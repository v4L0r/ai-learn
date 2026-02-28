# Fix "bad auth: authentication failed" (MongoDB Atlas)

"Bad auth" means the **username** or **password** in your `server/.env` do not match the database user in MongoDB Atlas.

---

## Step 1: Open Atlas

1. Go to **https://cloud.mongodb.com** and sign in.
2. Select your project and your cluster (e.g. **cluster0**).

---

## Step 2: Create or fix the database user

1. In the left sidebar click **Database Access**.
2. Either:
   - **Option A – Create a new user (easiest)**  
     - Click **+ ADD NEW DATABASE USER**.
     - **Authentication Method:** Password.
     - **Username:** e.g. `ailearn` (any name you like).
     - **Password:** click **Autogenerate Secure Password** and **Copy** it, or choose **Password** and type a simple one (e.g. `MyPass123`). **Save this password** – you’ll put it in `.env`.
     - **Database User Privileges:** **Atlas admin** or **Read and write to any database**.
     - Click **Add User**.
   - **Option B – Edit existing user**  
     - Find the user you use in the connection string (e.g. `snns`).
     - Click **Edit** → **Edit Password**.
     - Set a **new** password (e.g. `MyPass123`), copy it, then **Update User**.

---

## Step 3: Allow network access (if needed)

1. In the left sidebar click **Network Access**.
2. Click **+ ADD IP ADDRESS**.
3. Click **ALLOW ACCESS FROM ANYWHERE** (adds `0.0.0.0/0`) → **Confirm**.
4. Wait until status is **Active**.

---

## Step 4: Get the connection string

1. Click **Database** in the left sidebar.
2. On your cluster, click **Connect**.
3. Choose **Drivers** (or **Connect your application**).
4. Copy the URI. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 5: Put it in server/.env

1. Open **server/.env** (the one inside the **server** folder).
2. Set `MONGO_URI` like this (use your real username, password, and cluster host):

   **If the password has NO special characters** (e.g. `MyPass123`):
   ```env
   MONGO_URI=mongodb+srv://ailearn:MyPass123@cluster0.y2jfwou.mongodb.net/ai-learn?retryWrites=true&w=majority
   ```

   **If the password HAS special characters** (e.g. `P@ss#1`), URL-encode them in the URI:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - Example: password `P@ss#1` → in URI use `P%40ss%231`

3. Replace:
   - `<username>` with your Atlas database username (e.g. `ailearn` or `snns`).
   - `<password>` with the **exact** password you set in Atlas (or its URL-encoded form).
   - The cluster host (e.g. `cluster0.y2jfwou.mongodb.net`) with your cluster’s host.
4. Add the database name before the `?`: `/ai-learn` so the URI ends with:
   `....mongodb.net/ai-learn?retryWrites=true&w=majority`
5. Save **server/.env**.

---

## Step 6: Restart the server

From the project folder:

```powershell
cd "C:\Users\Lee tak hei\OneDrive - HKUST Connect\hackathon trial\ai-learn\server"
node index.js
```

If auth is correct, you’ll see the **Expected output** below instead of "bad auth".

---

## Checklist

- [ ] Username in `MONGO_URI` matches the Atlas database user **exactly** (case-sensitive).
- [ ] Password in `MONGO_URI` is the one you set in Atlas (no extra spaces; special chars URL-encoded).
- [ ] You edited **server/.env**, not a `.env` in another folder.
- [ ] URI includes the database name: `.../ai-learn?retryWrites=...`.
- [ ] Network Access in Atlas allows your IP (or `0.0.0.0/0` for testing).

---

# Expected output when everything works

## 1. When you start the server

Run:
```powershell
cd "C:\Users\Lee tak hei\OneDrive - HKUST Connect\hackathon trial\ai-learn\server"
node index.js
```

**Expected output (success):**
```
Using MONGO_URI: mongodb+srv://youruser:****@cluster0.xxxxx.mongodb.net/ai-learn?retryWrites=true&w=majority
MongoDB connected: cluster0-shard-00-02.xxxxx.mongodb.net
Server running on port 5000
```

- No `[dotenv@...]` message (we load .env ourselves).
- No `bad auth` or `authentication failed`.
- The process keeps running (does not exit).

---

## 2. When you open the app in the browser

- **http://localhost:5173** (or the URL from `npm run dev`) loads the app.
- You see the **Login** page or are redirected to it.
- **Register** and **Login** work; after login you see the **Dashboard** with your name and the "Submit a topic" form.
- **Log out** returns you to the login page.

---

## 3. When you run the API test script

From project root (with the server already running):
```powershell
node server/test-auth.js
```

**Expected output (success):**
```
1. Health check...
   OK { status: 200, data: { status: 'ok' } }

2. Register new user...
   OK { token: '...', user: { id: '...', name: 'Test User', email: 'test@example.com' } }

3. Login...
   OK { user: { id: '...', name: 'Test User', email: 'test@example.com' } }

4. Get me (protected)...
   OK { user: { id: '...', name: 'Test User', email: 'test@example.com' } }

Done. Auth API is working.
```

If the test user already exists, step 2 may show "FAIL (maybe user exists)" but steps 3 and 4 should still be OK.
