# 👋 Welcome to the Team!

## Error Management Platform - Getting Started

Hi! Welcome to the project. This guide will get you up and running in **less than 5 minutes**.

---

## 📋 What You Need

Before starting, make sure you have these installed:

### Windows Users (Most of Us!)

1. **WSL 2** (Windows Subsystem for Linux)
   - Open PowerShell as Administrator
   - Run: `wsl --install`
   - Restart your computer

2. **Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop/
   - During installation, ensure "Use WSL 2 based engine" is checked
   - After install: Settings → Resources → WSL Integration → Enable for Ubuntu

3. **That's it!** Node.js and Git will be installed automatically by our script.

### Mac/Linux Users

1. **Docker Desktop** (Mac) or Docker (Linux)
2. **Node.js 20+** from https://nodejs.org/
3. **Git** (usually pre-installed)

---

## 🚀 Setup (The Easy Way)

### For Windows (WSL):

Open **Windows Terminal** or **Ubuntu** app and run:

```bash
# Navigate to your workspace
cd ~

# Clone the repository
git clone <repository-url>
cd Projeto_ES_SentryIsOverratedAnyways

# Run the magic setup script
chmod +x init.sh
./init.sh
```

### For Mac/Linux:

```bash
# Clone the repository
git clone <repository-url>
cd Projeto_ES_SentryIsOverratedAnyways

# Run the setup script
chmod +x init.sh
./init.sh
```

### What the Script Does:

The `init.sh` script will:
1. ✅ Check if you have everything needed
2. ✅ Install Node.js (if missing on Linux/WSL)
3. ✅ Install all project dependencies
4. ✅ Create environment files
5. ✅ Start Docker containers
6. ✅ Test that everything works

**Just follow the prompts!** The script will tell you exactly what to do if anything is missing.

---

## 🎯 Verify It Works

After setup, open your browser and go to:

**http://localhost:5173**

You should see the project homepage with a green "API is running!" message.

If you see this, **congratulations!** You're all set up. 🎉

---

## 📖 Daily Workflow

### Starting Your Work Day

```bash
# 1. Open your terminal (WSL for Windows)
cd ~/Projeto_ES_SentryIsOverratedAnyways

# 2. Start the services
npm run docker:up

# 3. Open in your browser
# http://localhost:5173
```

### During Development

- **Frontend**: Runs on http://localhost:5173
- **Backend**: Runs on http://localhost:3000/api
- **Database**: PostgreSQL on port 5432

Changes to code will automatically reload (hot reload enabled).

### Ending Your Work Day

```bash
# Stop all services
npm run docker:down
```

---

## 💻 Recommended Tools

### VS Code Setup

1. Install **Visual Studio Code**: https://code.visualstudio.com/

2. For Windows, install these extensions:
   - "Remote - WSL" (essential!)
   - "Docker"
   - "ESLint"
   - "Prettier"

3. Open project in VS Code from WSL:
   ```bash
   cd ~/Projeto_ES_SentryIsOverratedAnyways
   code .
   ```

### Terminal (Windows)

Install **Windows Terminal** from the Microsoft Store for a much better terminal experience.

---

## 📁 Project Structure

```
Projeto_ES_SentryIsOverratedAnyways/
├── backend/              # NestJS API (TypeScript)
│   ├── src/
│   └── package.json
├── frontend/             # React UI (TypeScript)
│   ├── src/
│   └── package.json
├── docker-compose.yml    # Docker configuration
├── init.sh              # Setup script (run this first!)
└── README.md            # Full documentation
```

---

## 🔧 Useful Commands

```bash
# Start everything
npm run docker:up

# Stop everything  
npm run docker:down

# View logs (helpful for debugging)
npm run docker:logs

# Run both frontend & backend locally (without Docker)
npm run dev

# Run backend only
cd backend && npm run start:dev

# Run frontend only
cd frontend && npm run dev
```

---

## 🐛 Troubleshooting

### "Cannot connect to Docker daemon"
**Fix**: Start Docker Desktop on Windows

### "Port 3000 (or 5173) is already in use"
```bash
npm run docker:down  # Stop containers
npm run docker:up    # Start again
```

### On Windows: Very slow file operations
**Issue**: You're working in `/mnt/c/` (Windows filesystem)

**Fix**: Work in WSL's native filesystem:
```bash
# Move your project to WSL
cd ~
git clone <repository-url>
```

### "Permission denied" when running init.sh
```bash
chmod +x init.sh
```

### Script says Node.js is missing (Linux/WSL)
The script will tell you the exact commands to run. Usually:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - One-page reference
- **[WINDOWS_SETUP.md](WINDOWS_SETUP.md)** - Detailed Windows/WSL guide  
- **[README.md](README.md)** - Complete project documentation
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture

---

## 🤝 Getting Help

1. **Read the error message** - The init.sh script provides helpful error messages
2. **Check the docs** - Start with QUICKSTART.md or WINDOWS_SETUP.md
3. **Ask the team** - We're here to help!
4. **Check Docker Desktop** - Make sure it's running
5. **Restart everything** - Often fixes random issues:
   ```bash
   npm run docker:down
   npm run docker:up
   ```

---

## 🎓 Learning Resources

New to the stack? Here are some resources:

- **TypeScript**: https://www.typescriptlang.org/docs/
- **NestJS** (Backend): https://docs.nestjs.com/
- **React** (Frontend): https://react.dev/
- **Docker**: https://docs.docker.com/get-started/

---

## ✅ Checklist for Your First Day

- [ ] WSL/Docker installed (Windows users)
- [ ] Repository cloned
- [ ] `init.sh` script run successfully
- [ ] Browser shows project at http://localhost:5173
- [ ] VS Code installed with Remote-WSL extension (Windows)
- [ ] Read QUICKSTART.md
- [ ] Can start/stop containers with npm commands
- [ ] Introduced yourself to the team! 👋

---

## 🎉 You're Ready!

That's it! You're now set up and ready to contribute. 

**Remember**: 
- Your workflow is: `clone → ./init.sh → npm run docker:up → start coding`
- Changes auto-reload (no need to restart)
- Ask for help if you need it!

**Happy coding!** 🚀

---

*Last updated: October 2024*

