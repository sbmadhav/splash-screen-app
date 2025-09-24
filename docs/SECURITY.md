# 🔐 Secure API Key Management for GitHub Pages

## Overview

This guide explains how to securely pass your Unsplash API key to GitHub Pages deployment while maintaining security best practices.

## ⚠️ Security Considerations

### Why API Keys Need Special Handling

- **Client-side exposure**: In GitHub Pages (static sites), environment variables with `NEXT_PUBLIC_` prefix become part of the client-side bundle
- **Public repositories**: Anyone can inspect the built files
- **Browser visibility**: API keys are visible in browser developer tools

### Security Trade-offs

Since this is a static site deployment:
- ✅ **Acceptable**: Unsplash API keys have read-only access to public images
- ✅ **Rate limited**: Unsplash enforces rate limits per key
- ❌ **Avoid**: Never expose write-access or sensitive API keys client-side

## 🛡️ Secure Implementation Methods

### Method 1: GitHub Repository Secrets (Recommended)

**Step 1: Add API Key to Repository Secrets**
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
5. Value: Your Unsplash API key
6. Click **Add secret**

**Step 2: Use in GitHub Actions**
The workflow file (`.github/workflows/nextjs.yml`) is already configured:

```yaml
- name: Build with Next.js
  env:
    NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: ${{ secrets.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY }}
  run: ${{ steps.detect-package-manager.outputs.runner }} next build
```

### Method 2: Environment-based Deployment

Use the secure deployment script:

```bash
# Set the API key temporarily
export NEXT_PUBLIC_UNSPLASH_ACCESS_KEY="your_key_here"

# Run the secure deployment script
./scripts/secure-deploy.sh

# Unset the API key
unset NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
```

### Method 3: API Key Rotation

For enhanced security, regularly rotate your API key:

1. **Generate new key** from Unsplash Developer Console
2. **Update GitHub secret** with new key
3. **Test deployment** to ensure it works
4. **Revoke old key** from Unsplash

## 🔍 Verification

### Check if API Key is Working

1. **Development**: Look for console logs showing Unsplash API calls
2. **Production**: Images load from Unsplash URLs (not local fallbacks)
3. **Network tab**: See requests to `api.unsplash.com`

### Fallback Behavior

If no API key is provided, the app gracefully falls back to:
- Local background images (28 high-quality images included)
- Picsum Photos API (public, no authentication needed)

## 🚫 What NOT to Do

- ❌ Don't commit API keys to version control
- ❌ Don't put API keys in `.env.local` files that get committed
- ❌ Don't share API keys in issues or pull requests
- ❌ Don't use write-access API keys for client-side apps

## 📝 Best Practices

1. **Use dedicated API keys** for each deployment environment
2. **Monitor usage** through Unsplash Developer Dashboard
3. **Set up rate limiting** alerts if available
4. **Document key ownership** in your team
5. **Regular security audits** of exposed keys

## 🆘 Emergency Response

If an API key is compromised:

1. **Immediately revoke** the key from Unsplash Developer Console
2. **Generate new key** and update GitHub secrets
3. **Redeploy** the application
4. **Review logs** for any unauthorized usage
5. **Update team** about the incident

## 📊 Monitoring

Monitor your API key usage:
- **Unsplash Dashboard**: Track requests per hour/day
- **GitHub Actions logs**: Check deployment success
- **Application logs**: Monitor fallback behavior
- **User reports**: Watch for image loading issues

---

*Remember: For Unsplash API, the security risk is relatively low since it's read-only access to public images, but following these practices ensures good security hygiene.*
