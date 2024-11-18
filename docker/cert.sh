#!/bin/bash

DOMAIN="quizerplay.com"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

# Check if the SSL certificate exists
if [ ! -f "$CERT_PATH" ]; then
    echo "SSL certificate not found. Generating new certificate for $DOMAIN..."
    certbot --nginx --agree-tos --preferred-challenges http -d $DOMAIN
else
    echo "SSL certificate already exists. Checking if renewal is needed..."
    certbot renew --quiet
fi
