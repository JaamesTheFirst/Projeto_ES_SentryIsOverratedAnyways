#!/bin/bash

# =============================================================================
# Error Management Platform - Initialization Script
# =============================================================================
# This script automates the entire setup process for the project.
# Designed to work on macOS, Linux, and Windows (WSL).
#
# Usage: ./init.sh
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emoji support check
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    CHECKMARK="[OK]"
    CROSS="[X]"
    ROCKET=">>>"
    PACKAGE="[*]"
    WRENCH="[+]"
else
    CHECKMARK="✓"
    CROSS="✗"
    ROCKET="🚀"
    PACKAGE="📦"
    WRENCH="🔧"
fi

# =============================================================================
# Helper Functions
# =============================================================================

print_header() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}${CHECKMARK} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠  $1${NC}"
}

print_info() {
    echo -e "${BLUE}${WRENCH} $1${NC}"
}

print_step() {
    echo -e "${CYAN}${ROCKET} $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check version comparison
version_ge() {
    [ "$(printf '%s\n' "$1" "$2" | sort -V | head -n1)" = "$2" ]
}

# =============================================================================
# System Detection
# =============================================================================

detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if grep -qi microsoft /proc/version 2>/dev/null; then
            echo "wsl"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

OS_TYPE=$(detect_os)

# =============================================================================
# Main Script
# =============================================================================

clear
print_header "${ROCKET} Error Management Platform - Setup Script ${ROCKET}"

echo -e "${CYAN}This script will set up your development environment automatically.${NC}"
echo -e "${CYAN}Detected OS: ${YELLOW}$OS_TYPE${NC}"
echo ""

if [[ "$OS_TYPE" == "wsl" ]]; then
    print_info "Running on Windows Subsystem for Linux (WSL)"
    echo ""
fi

# =============================================================================
# Step 1: Check Prerequisites
# =============================================================================

print_header "Step 1: Checking Prerequisites"

MISSING_DEPS=()

# Check Node.js
print_step "Checking Node.js installation..."
if command_exists node; then
    NODE_VERSION=$(node -v | cut -d 'v' -f 2)
    if version_ge "$NODE_VERSION" "18.0.0"; then
        print_success "Node.js $NODE_VERSION installed"
    else
        print_warning "Node.js version $NODE_VERSION is installed but v18+ is recommended"
    fi
else
    print_error "Node.js is not installed"
    MISSING_DEPS+=("nodejs")
fi

# Check npm
print_step "Checking npm installation..."
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    print_success "npm $NPM_VERSION installed"
else
    print_error "npm is not installed"
    MISSING_DEPS+=("npm")
fi

# Check Docker
print_step "Checking Docker installation..."
if command_exists docker; then
    DOCKER_VERSION=$(docker --version | cut -d ' ' -f 3 | cut -d ',' -f 1)
    print_success "Docker $DOCKER_VERSION installed"
    
    # Check if Docker daemon is running
    if docker info >/dev/null 2>&1; then
        print_success "Docker daemon is running"
    else
        print_warning "Docker is installed but daemon is not running"
        print_info "Please start Docker Desktop or Docker service"
    fi
else
    print_error "Docker is not installed"
    MISSING_DEPS+=("docker")
fi

# Check Docker Compose
print_step "Checking Docker Compose installation..."
if command_exists docker-compose || docker compose version >/dev/null 2>&1; then
    if command_exists docker-compose; then
        COMPOSE_VERSION=$(docker-compose --version | cut -d ' ' -f 4 | cut -d ',' -f 1)
    else
        COMPOSE_VERSION=$(docker compose version --short)
    fi
    print_success "Docker Compose $COMPOSE_VERSION installed"
else
    print_error "Docker Compose is not installed"
    MISSING_DEPS+=("docker-compose")
fi

# Check Git
print_step "Checking Git installation..."
if command_exists git; then
    GIT_VERSION=$(git --version | cut -d ' ' -f 3)
    print_success "Git $GIT_VERSION installed"
else
    print_error "Git is not installed"
    MISSING_DEPS+=("git")
fi

echo ""

# Handle missing dependencies
if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    print_error "Missing dependencies: ${MISSING_DEPS[*]}"
    echo ""
    print_info "Please install the missing dependencies:"
    echo ""
    
    if [[ "$OS_TYPE" == "wsl" ]] || [[ "$OS_TYPE" == "linux" ]]; then
        echo "  For Ubuntu/Debian:"
        echo "    sudo apt update"
        [ " ${MISSING_DEPS[@]} " =~ " nodejs " ] && echo "    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
        [ " ${MISSING_DEPS[@]} " =~ " nodejs " ] && echo "    sudo apt install -y nodejs"
        [ " ${MISSING_DEPS[@]} " =~ " docker " ] && echo "    curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
        [ " ${MISSING_DEPS[@]} " =~ " git " ] && echo "    sudo apt install -y git"
    elif [[ "$OS_TYPE" == "macos" ]]; then
        echo "  For macOS (using Homebrew):"
        [ " ${MISSING_DEPS[@]} " =~ " nodejs " ] && echo "    brew install node@20"
        [ " ${MISSING_DEPS[@]} " =~ " docker " ] && echo "    brew install --cask docker"
        [ " ${MISSING_DEPS[@]} " =~ " git " ] && echo "    brew install git"
    fi
    
    echo ""
    echo "After installing, run this script again."
    exit 1
fi

print_success "All prerequisites are installed!"

# =============================================================================
# Step 2: Environment Setup
# =============================================================================

print_header "Step 2: Setting Up Environment"

print_step "Checking for .env file..."
if [ -f ".env" ]; then
    print_warning ".env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp env.example .env
        print_success "Environment file created from template"
    else
        print_info "Keeping existing .env file"
    fi
else
    cp env.example .env
    print_success "Environment file created from template"
fi

# WSL-specific network configuration
if [[ "$OS_TYPE" == "wsl" ]]; then
    print_info "Configuring for WSL environment..."
    
    # Check if Windows host can be accessed
    if command_exists powershell.exe; then
        print_success "WSL integration detected"
    fi
fi

# =============================================================================
# Step 3: Install Root Dependencies
# =============================================================================

print_header "Step 3: Installing Root Dependencies"

print_step "Installing root package dependencies..."
if npm install; then
    print_success "Root dependencies installed"
else
    print_error "Failed to install root dependencies"
    exit 1
fi

# =============================================================================
# Step 4: Install Backend Dependencies
# =============================================================================

print_header "Step 4: Installing Backend Dependencies"

print_step "Installing NestJS backend dependencies..."
cd backend

if npm install; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

cd ..

# =============================================================================
# Step 5: Install Frontend Dependencies
# =============================================================================

print_header "Step 5: Installing Frontend Dependencies"

print_step "Installing React frontend dependencies..."
cd frontend

if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# =============================================================================
# Step 6: Docker Setup
# =============================================================================

print_header "Step 6: Docker Setup"

print_step "Checking Docker daemon..."
if ! docker info >/dev/null 2>&1; then
    print_error "Docker daemon is not running"
    print_info "Please start Docker Desktop or Docker service, then run:"
    print_info "  npm run docker:up"
    echo ""
    print_warning "Skipping Docker setup for now..."
else
    print_success "Docker daemon is running"
    echo ""
    read -p "Do you want to start Docker containers now? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        print_step "Starting Docker containers..."
        echo ""
        
        # Stop any existing containers
        print_info "Stopping any existing containers..."
        docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true
        
        # Start containers
        print_info "Starting containers (this may take a few minutes)..."
        if command_exists docker-compose; then
            docker-compose up -d
        else
            docker compose up -d
        fi
        
        if [ $? -eq 0 ]; then
            print_success "Docker containers started successfully"
            echo ""
            print_info "Waiting for services to be ready..."
            sleep 5
            
            # Check backend health
            print_step "Checking backend health..."
            for i in {1..30}; do
                if curl -s http://localhost:3000/api/health >/dev/null 2>&1; then
                    print_success "Backend is healthy!"
                    break
                fi
                if [ $i -eq 30 ]; then
                    print_warning "Backend health check timed out (this is normal on first start)"
                else
                    sleep 2
                fi
            done
        else
            print_error "Failed to start Docker containers"
            print_info "You can try manually with: npm run docker:up"
        fi
    else
        print_info "Skipping Docker container startup"
        print_info "To start containers later, run: npm run docker:up"
    fi
fi

# =============================================================================
# Final Summary
# =============================================================================

print_header "${CHECKMARK} Setup Complete! ${CHECKMARK}"

echo -e "${GREEN}Your development environment is ready!${NC}"
echo ""
echo -e "${CYAN}Quick Start Commands:${NC}"
echo ""
echo -e "  ${YELLOW}Start with Docker (recommended):${NC}"
echo -e "    ${BLUE}npm run docker:up${NC}          # Start all services"
echo -e "    ${BLUE}npm run docker:logs${NC}        # View logs"
echo -e "    ${BLUE}npm run docker:down${NC}        # Stop services"
echo ""
echo -e "  ${YELLOW}Start locally (without Docker):${NC}"
echo -e "    ${BLUE}npm run dev${NC}                # Start both frontend and backend"
echo ""
echo -e "  ${YELLOW}Development URLs:${NC}"
echo -e "    Frontend:  ${GREEN}http://localhost:5173${NC}"
echo -e "    Backend:   ${GREEN}http://localhost:3000/api${NC}"
echo -e "    Health:    ${GREEN}http://localhost:3000/api/health${NC}"
echo ""

if [[ "$OS_TYPE" == "wsl" ]]; then
    echo -e "${CYAN}WSL-Specific Tips:${NC}"
    echo -e "  • Access from Windows: ${GREEN}http://localhost:5173${NC}"
    echo -e "  • Docker Desktop should have WSL 2 integration enabled"
    echo -e "  • Files are stored in WSL filesystem for better performance"
    echo ""
fi

echo -e "${CYAN}Documentation:${NC}"
echo -e "  • ${BLUE}README.md${NC}         - Full documentation"
echo -e "  • ${BLUE}SETUP_GUIDE.md${NC}    - Detailed setup guide"
echo -e "  • ${BLUE}ARCHITECTURE.md${NC}   - System architecture"
echo ""

echo -e "${GREEN}${ROCKET} Happy coding! ${ROCKET}${NC}"
echo ""

# =============================================================================
# Post-Setup Checks
# =============================================================================

print_info "Running post-setup validation..."
echo ""

# Check if node_modules exist
if [ -d "node_modules" ] && [ -d "backend/node_modules" ] && [ -d "frontend/node_modules" ]; then
    print_success "All node_modules directories present"
else
    print_warning "Some node_modules directories are missing"
fi

# Check if .env exists
if [ -f ".env" ]; then
    print_success "Environment file is configured"
else
    print_warning "Environment file is missing"
fi

echo ""
print_success "Setup validation complete!"
echo ""

# Optional: Open browser
if [[ "$OS_TYPE" == "wsl" ]]; then
    read -p "Open browser to localhost:5173? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        if command_exists powershell.exe; then
            powershell.exe -c "Start-Process 'http://localhost:5173'"
        fi
    fi
fi

exit 0

