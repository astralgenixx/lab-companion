#!/bin/bash
# deploy.sh — Deploy Lab Companion to GitHub Pages
# Prerequisites: git, GitHub account, GitHub CLI (gh) optional

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "🚀 Lab Companion — Deploy to GitHub Pages"
echo "========================================="
echo ""

# Check if gh CLI is installed
if command -v gh &>/dev/null; then
  USE_GH=true
  echo "✓ GitHub CLI (gh) detected — will use it for setup"
else
  USE_GH=false
  echo "ℹ gh CLI not found. You can install it: brew install gh"
  echo "  Proceeding with manual git setup..."
fi

# Initialize git if not already
if [ ! -d ".git" ]; then
  git init
  git checkout -b main 2>/dev/null || git checkout -b main
  echo "✓ Git repo initialized"
else
  echo "✓ Git repo already exists"
fi

# Get repo name
REPO_NAME=$(basename "$DIR")
echo ""
echo "Your app directory is: $REPO_NAME"
echo ""
echo "To deploy to GitHub Pages:"
echo ""
echo "1. Create a GitHub repo named: $REPO_NAME"
echo "   Visit: https://github.com/new"
echo ""
echo "2. Run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
echo "   git add -A"
echo '   git commit -m "Initial commit: Lab Companion PWA"'
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages:"
echo "   Go to: https://github.com/YOUR_USERNAME/$REPO_NAME/settings/pages"
echo "   Source: Deploy from a branch"
echo "   Branch: main, / (root)"
echo "   Save"
echo ""
echo "4. Wait 1-2 minutes. Your app will be at:"
echo "   https://YOUR_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "5. Open that URL on your Android phone in Chrome."
echo "   Chrome will show 'Install app' or 'Add to Home screen'."
echo "   Tap it — Lab Companion will install as a native app!"
echo ""

# If gh is available, offer to do it automatically
if [ "$USE_GH" = true ]; then
  echo "---"
  echo "Want me to set this up automatically with gh?"
  echo "You'll need to be logged in (gh auth login)."
  read -p "Proceed? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    gh auth status &>/dev/null || gh auth login
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push 2>/dev/null || {
      echo "Repo may already exist. Pushing..."
      git remote add origin "https://github.com/$(gh api user --jq .login)/$REPO_NAME.git" 2>/dev/null || true
      git push -u origin main
    }
    echo ""
    echo "✓ Pushed to GitHub!"
    echo "Now enable GitHub Pages at:"
    echo "  https://github.com/$(gh api user --jq .login)/$REPO_NAME/settings/pages"
    echo ""
    USERNAME=$(gh api user --jq .login)
    echo "📱 Your app will be at: https://$USERNAME.github.io/$REPO_NAME/"
    echo "   Open this URL on your Android phone in Chrome → Install!"
  fi
fi
