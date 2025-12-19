#!/bin/bash

# =============================================================================
# Fix Permissions Script for WSL/Ubuntu
# =============================================================================
# This script fixes permission issues that can occur when running npm/vite
# in WSL or Ubuntu environments, particularly when files were created by
# different users or with incorrect permissions.
#
# Usage: ./scripts/fix-permissions.sh
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ  $1${NC}"
}

print_step() {
    echo -e "${CYAN}→ $1${NC}"
}

# Get the project root directory (parent of scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

print_header "🔧 Fixing Permissions for Vite/Node Modules"

# Get current user
CURRENT_USER=$(whoami)
CURRENT_UID=$(id -u)
CURRENT_GID=$(id -g)

print_info "Current user: $CURRENT_USER (UID: $CURRENT_UID, GID: $CURRENT_GID)"
echo ""

# Function to fix permissions for a directory
fix_permissions() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir" ]; then
        print_warning "$name directory does not exist: $dir"
        return
    fi
    
    print_step "Fixing permissions for $name..."
    
    # Change ownership to current user
    if sudo chown -R "$CURRENT_USER:$CURRENT_USER" "$dir" 2>/dev/null; then
        print_success "Changed ownership of $name"
    else
        print_warning "Could not change ownership (may need sudo). Trying without sudo..."
        chown -R "$CURRENT_USER:$CURRENT_USER" "$dir" 2>/dev/null || true
    fi
    
    # Set proper permissions (read/write/execute for owner, read/execute for group/others)
    chmod -R u+rwX,go+rX "$dir" 2>/dev/null || true
    
    print_success "Fixed permissions for $name"
}

# Fix root node_modules
print_step "Fixing root node_modules..."
if [ -d "node_modules" ]; then
    fix_permissions "node_modules" "root node_modules"
else
    print_info "Root node_modules does not exist (this is normal if using workspaces)"
fi

# Fix backend node_modules
print_step "Fixing backend node_modules..."
if [ -d "backend/node_modules" ]; then
    fix_permissions "backend/node_modules" "backend node_modules"
else
    print_warning "Backend node_modules does not exist. Run 'npm install' in backend directory first."
fi

# Fix frontend node_modules and .vite cache
print_step "Fixing frontend node_modules..."
if [ -d "frontend/node_modules" ]; then
    fix_permissions "frontend/node_modules" "frontend node_modules"
    
    # Specifically fix .vite directory if it exists
    if [ -d "frontend/node_modules/.vite" ]; then
        print_step "Fixing .vite cache directory..."
        fix_permissions "frontend/node_modules/.vite" ".vite cache"
        
        # Remove any problematic temp directories
        print_step "Cleaning up Vite temp directories..."
        find "frontend/node_modules/.vite" -type d -name "deps_temp_*" -exec rm -rf {} + 2>/dev/null || true
        print_success "Cleaned up Vite temp directories"
    fi
else
    print_warning "Frontend node_modules does not exist. Run 'npm install' in frontend directory first."
fi

# Fix the entire frontend directory to ensure Vite can write
print_step "Fixing frontend directory permissions..."
fix_permissions "frontend" "frontend directory"

# Clean up any existing Vite cache in frontend root
if [ -d "frontend/.vite" ]; then
    print_step "Fixing frontend .vite cache..."
    fix_permissions "frontend/.vite" "frontend .vite cache"
fi

echo ""
print_header "✅ Permission Fix Complete!"

print_success "All permissions have been fixed!"
echo ""
print_info "You can now try running the project again:"
echo ""
echo -e "  ${CYAN}npm run dev${NC}              # Run both frontend and backend"
echo -e "  ${CYAN}cd frontend && npm run dev${NC}  # Run frontend only"
echo ""

print_info "If you still encounter permission issues, try:"
echo ""
echo -e "  ${CYAN}1. Remove and reinstall node_modules:${NC}"
echo -e "     ${BLUE}cd frontend${NC}"
echo -e "     ${BLUE}rm -rf node_modules${NC}"
echo -e "     ${BLUE}npm install${NC}"
echo ""
echo -e "  ${CYAN}2. Clear Vite cache:${NC}"
echo -e "     ${BLUE}cd frontend${NC}"
echo -e "     ${BLUE}rm -rf node_modules/.vite${NC}"
echo ""

exit 0

