# 🪟 Windows Setup Guide (WSL)

This guide is specifically for Windows users setting up the project using Windows Subsystem for Linux (WSL).

## 📋 Prerequisites

Before you begin, you need to have WSL installed on your Windows machine.

### Step 1: Install WSL (If Not Already Installed)

Open PowerShell as Administrator and run:

```powershell
wsl --install
```

This will install WSL 2 with Ubuntu by default. **Restart your computer** after installation.

### Step 2: Install Docker Desktop for Windows

1. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install Docker Desktop
3. **Important**: Enable WSL 2 integration:
   - Open Docker Desktop
   - Go to Settings → Resources → WSL Integration
   - Enable integration with your WSL distro (usually Ubuntu)
   - Click "Apply & Restart"

### Step 3: Verify Docker in WSL

Open WSL terminal (Ubuntu) and verify:

```bash
docker --version
docker-compose --version
```

If these commands work, you're good to go!

## 🚀 Quick Setup (Automatic)

The easiest way to set up the project:

### 1. Clone the Repository in WSL

Open your WSL terminal (Ubuntu) and run:

```bash
# Navigate to your preferred directory (e.g., home directory)
cd ~

# Clone the repository
git clone <repository-url>
cd Projeto_ES_SentryIsOverratedAnyways
```

⚠️ **Important**: Always clone and work with the project inside WSL filesystem (not in `/mnt/c/`). This provides:
- Much better file system performance
- Proper file permissions
- Faster npm install times

### 2. Run the Initialization Script

Make the script executable and run it:

```bash
chmod +x init.sh
./init.sh
```

That's it! The script will:
- ✅ Check all prerequisites
- ✅ Install all dependencies
- ✅ Set up environment files
- ✅ Start Docker containers
- ✅ Verify the installation

### 3. Access the Application

Once setup is complete, open your Windows browser and go to:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

## 🔧 Manual Setup (If Automatic Fails)

If the automatic script doesn't work, follow these steps:

### 1. Install Node.js in WSL

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install Git in WSL

```bash
sudo apt update
sudo apt install git -y
```

### 3. Clone and Setup Project

```bash
# Clone repository
git clone <repository-url>
cd Projeto_ES_SentryIsOverratedAnyways

# Copy environment file
cp env.example .env

# Install all dependencies
npm run install:all

# Start with Docker
npm run docker:up
```

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to Docker daemon"

**Solution:**
1. Make sure Docker Desktop is running on Windows
2. Verify WSL integration is enabled in Docker Desktop settings
3. Restart Docker Desktop
4. In WSL, run: `docker ps` to test connection

### Issue 2: Slow Performance

**Problem**: Files in `/mnt/c/` are very slow.

**Solution**: Always work in WSL's native filesystem:

```bash
# ❌ Bad (slow)
cd /mnt/c/Users/YourName/Projects

# ✅ Good (fast)
cd ~/Projects
```

### Issue 3: "Permission denied" errors

**Solution:**

```bash
# Fix script permissions
chmod +x init.sh

# If npm has issues
sudo chown -R $(whoami) ~/.npm
```

### Issue 4: Port Already in Use

**Solution:**

```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Or stop all Docker containers
npm run docker:down

# Then start again
npm run docker:up
```

### Issue 5: "ENOSPC" error (file watchers)

**Solution:**

```bash
# Increase file watchers limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Issue 6: Can't access localhost from Windows

**Solution:**

WSL 2 should automatically forward ports, but if it doesn't:

```bash
# Get WSL IP address
ip addr show eth0 | grep inet

# Use that IP in Windows browser
# e.g., http://172.x.x.x:5173
```

### Issue 7: Git line ending warnings

**Solution:**

```bash
# Configure git to handle line endings
git config --global core.autocrlf input
```

## 💡 WSL Pro Tips

### 1. Access WSL Files from Windows

In Windows Explorer, type: `\\wsl$\Ubuntu\home\your-username\`

Or just type: `\\wsl$` to see all WSL distros.

### 2. VS Code Integration

Install the "Remote - WSL" extension in VS Code:

```bash
# Open project in VS Code from WSL
code .
```

This opens VS Code with full WSL integration.

### 3. Better Terminal Experience

Install Windows Terminal from Microsoft Store for a much better terminal experience.

Then you can easily switch between:
- PowerShell
- Command Prompt  
- WSL (Ubuntu)
- Git Bash

### 4. Memory Management

If Docker uses too much memory, limit it in WSL:

Create/edit `~/.wslconfig` in Windows (`C:\Users\YourName\.wslconfig`):

```ini
[wsl2]
memory=4GB
processors=2
swap=2GB
```

Then restart WSL:

```powershell
# In PowerShell (as admin)
wsl --shutdown
```

### 5. Backup Your Work

Since files are in WSL, make sure to:
- Push to Git regularly
- Or backup WSL: `wsl --export Ubuntu backup.tar`

## 🎯 Recommended Workflow

1. **Open Windows Terminal**
2. **Select Ubuntu (WSL)**
3. **Navigate to project**:
   ```bash
   cd ~/Projeto_ES_SentryIsOverratedAnyways
   ```
4. **Start development**:
   ```bash
   npm run docker:up
   # or
   npm run dev
   ```
5. **Open browser** on Windows: http://localhost:5173
6. **Edit code** using VS Code with Remote-WSL extension

## 📁 Recommended Directory Structure

```
C:\Users\YourName\         (Windows)
└── (Use for Windows apps only)

\\wsl$\Ubuntu\home\yourname\   (WSL)
├── Projects\
│   └── Projeto_ES_SentryIsOverratedAnyways\    ← Work here!
│       ├── backend/
│       ├── frontend/
│       └── ...
```

## 🚀 Daily Development Workflow

```bash
# 1. Open Windows Terminal → Ubuntu (WSL)

# 2. Navigate to project
cd ~/Projeto_ES_SentryIsOverratedAnyways

# 3. Start Docker (if not running)
npm run docker:up

# 4. Check status
npm run docker:logs

# 5. Open VS Code
code .

# 6. When done for the day
npm run docker:down
```

## 🔍 Checking Everything Works

Run these commands to verify your setup:

```bash
# Check versions
node --version        # Should be v20.x or higher
npm --version         # Should be v9.x or higher
docker --version      # Should show version
git --version         # Should show version

# Check Docker
docker ps             # Should show running containers (if started)
docker info           # Should show Docker info

# Check project
cd ~/Projeto_ES_SentryIsOverratedAnyways
ls -la                # Should show project files

# Test backend
curl http://localhost:3000/api/health

# Test frontend (in browser)
# Open: http://localhost:5173
```

## 📚 Additional Resources

- [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [Docker Desktop WSL 2 Backend](https://docs.docker.com/desktop/windows/wsl/)
- [VS Code Remote - WSL](https://code.visualstudio.com/docs/remote/wsl)
- [Node.js on WSL](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)

## 🆘 Still Having Issues?

1. Check the main `README.md` for general documentation
2. Check `SETUP_GUIDE.md` for detailed setup steps
3. Try the manual setup steps above
4. Check Docker Desktop is running on Windows
5. Verify WSL integration is enabled in Docker Desktop
6. Restart WSL: `wsl --shutdown` (in PowerShell), then reopen
7. Restart Docker Desktop

## 💬 WSL Commands Cheat Sheet

```bash
# In PowerShell (Windows):
wsl                          # Enter WSL
wsl --list --verbose         # List WSL distros
wsl --shutdown              # Shutdown all WSL instances
wsl --terminate Ubuntu      # Terminate specific distro

# In WSL (Ubuntu):
cd /mnt/c/                  # Access Windows C: drive
cd ~                        # Go to WSL home directory
explorer.exe .              # Open current folder in Windows Explorer
code .                      # Open in VS Code
```

---

**Good luck! If you follow this guide, you'll have everything running in minutes!** 🚀

Remember: The `init.sh` script does all the heavy lifting for you. Just run it and you're good to go!

