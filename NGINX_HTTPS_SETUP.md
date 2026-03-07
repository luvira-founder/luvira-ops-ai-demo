# Nginx HTTPS Setup Guide

This guide shows how to set up nginx as a reverse proxy with SSL for your backend.

## Prerequisites

- Domain name pointed to your VPS (A record)
- Nginx already installed (you have it running)
- Port 80 and 443 open in firewall (you already have these)

## Step 1: Create Nginx Configuration

Create a new nginx config file:

```bash
sudo nano /etc/nginx/sites-available/luvira-ops-backend
```

Add this configuration (replace `your-domain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/luvira-ops-backend /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Step 2: Install Certbot (if not installed)

```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

## Step 3: Obtain SSL Certificate

```bash
# Get SSL certificate (replace your-domain.com)
sudo certbot --nginx -d your-domain.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to share email with EFF
# - Certbot will automatically configure nginx for HTTPS
```

Certbot will:
- Obtain SSL certificate from Let's Encrypt
- Automatically update nginx config
- Set up auto-redirect from HTTP to HTTPS
- Configure SSL settings

## Step 4: Update Docker Deployment (More Secure)

Now that nginx is handling external traffic, update Docker to only listen on localhost.

Edit the GitHub Actions workflow:

```bash
nano .github/workflows/deploy.yml
```

Change the Docker run command from:
```yaml
-p 8080:8080 \
```

To:
```yaml
-p 127.0.0.1:8080:8080 \
```

This makes the container only accessible via localhost (more secure).

## Step 5: Close Port 8080 to Public (Optional but Recommended)

Since nginx is now the only public entry point:

```bash
# Remove public access to port 8080
sudo ufw delete allow 8080/tcp

# Port 8080 will still work via localhost for nginx
```

## Step 6: Test Your Setup

```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://your-domain.com

# Test HTTPS
curl https://your-domain.com/docs

# Test the API
curl -X POST https://your-domain.com/ingest \
  -H "Content-Type: application/json" \
  -d '{"service_name":"test","error_rate":0.9,"message":"test"}'
```

## Step 7: Auto-Renewal

Certbot sets up auto-renewal automatically. Test it:

```bash
# Test renewal
sudo certbot renew --dry-run

# Check certbot timer
sudo systemctl status certbot.timer
```

## Final Nginx Configuration (After Certbot)

After running certbot, your config will look like this:

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = your-domain.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name your-domain.com;
    return 404;
}
```

## Troubleshooting

### Nginx test fails
```bash
sudo nginx -t
# Fix any syntax errors shown
```

### SSL certificate fails
```bash
# Check DNS is pointing to your VPS
dig your-domain.com

# Make sure port 80 is accessible
curl -I http://your-domain.com
```

### Backend not accessible through nginx
```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check if backend is running
docker ps | grep luvira-ops-backend

# Test backend directly
curl localhost:8080/docs
```

### Check SSL certificate status
```bash
sudo certbot certificates
```

## Summary

- **HTTP (port 80)**: Auto-redirects to HTTPS
- **HTTPS (port 443)**: Nginx → localhost:8080 → Docker container
- **Direct access to port 8080**: Blocked from public (only localhost)
- **SSL certificate**: Auto-renews every 90 days

Your API will be accessible at: `https://your-domain.com`
