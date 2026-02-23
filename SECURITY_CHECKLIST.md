# Production Security Checklist

## 🔒 Critical Security Items

### Credentials & Secrets
- [ ] **SECRET_KEY** - Changed from default, generated with `openssl rand -hex 32`
- [ ] **Admin Password** - Changed from "changeme" to strong password
- [ ] **Docs Password** - Changed from default
- [ ] **Database Password** - Strong, random password set
- [ ] **Redis Password** - Configured and strong
- [ ] **RabbitMQ Password** - Configured and strong
- [ ] **SMTP Password** - Set to app-specific password (not main email password)
- [ ] **Payment Keys** - Securely stored and not in version control
- [ ] **SSL Certificates** - Valid and properly configured

### Environment Configuration
- [ ] **DEBUG Mode** - Set to `False` in production
- [ ] **EXPOSE_ERRORS_IN_RESPONSE** - Disabled in production
- [ ] **CORS Origins** - Limited to your domain(s) only
- [ ] **ALLOWED_HOSTS** - Configured to your domain(s)
- [ ] **LOG_LEVEL** - Set to INFO or WARNING (not DEBUG)
- [ ] **.env.production** - File has 600 permissions: `chmod 600 .env.production`
- [ ] **.env.production** - Not committed to git (check .gitignore)

### Database Security
- [ ] **Database User** - Not using default "postgres" or "admin"
- [ ] **Database Password** - Strong, random password (min 32 characters)
- [ ] **Database Connection** - Using SSL if connecting over network
- [ ] **Backup Encryption** - Backups should be encrypted
- [ ] **Backup Location** - Stored off-server or encrypted

### Application Security
- [ ] **HTTPS/SSL Required** - All traffic over HTTPS
- [ ] **HSTS Enabled** - Strict-Transport-Security header configured
- [ ] **Security Headers** - X-Frame-Options, X-Content-Type-Options, etc.
- [ ] **CSRF Protection** - Enabled (FastAPI default)
- [ ] **SQL Injection Prevention** - Using parameterized queries (SQLAlchemy)
- [ ] **XSS Protection** - Headers configured
- [ ] **Rate Limiting** - Configured on API endpoints
- [ ] **Input Validation** - Pydantic schemas validate all input
- [ ] **Output Encoding** - Response data properly encoded

### Infrastructure Security
- [ ] **Firewall** - UFW enabled with rules for 22, 80, 443 only
- [ ] **SSH Hardening** - Password auth disabled, key-based only
- [ ] **SSH Port** - Changed from 22 if possible
- [ ] **Root SSH** - Disabled (`PermitRootLogin no`)
- [ ] **Default Users** - Removed or disabled (especially ubuntu/root)
- [ ] **File Permissions** - Proper permissions on sensitive files
- [ ] **Directory Permissions** - /app/uploads has 750 permissions
- [ ] **SSL Permissions** - SSL directory has 700, files 600

### Docker Security
- [ ] **Images Updated** - Using latest stable versions
- [ ] **Build as Non-root** - Containers don't run as root
- [ ] **Resource Limits** - Memory/CPU limits configured
- [ ] **Secrets** - Not hardcoded in Dockerfile
- [ ] **Health Checks** - Configured for all critical services
- [ ] **.dockerignore** - Excludes sensitive files

### Network Security
- [ ] **Port Exposure** - Only 80, 443 exposed to internet
- [ ] **Internal Services** - Postgres, Redis, RabbitMQ not exposed
- [ ] **Docker Network** - Using internal network for service communication
- [ ] **VPN/SSH Tunnel** - For admin access to internal services
- [ ] **DDoS Protection** - Consider using Cloudflare or similar

### API Security
- [ ] **Authentication** - JWT tokens required for protected endpoints
- [ ] **Authorization** - Role-based access control implemented
- [ ] **Token Expiration** - Short expiration times set
- [ ] **Refresh Tokens** - Implemented if applicable
- [ ] **API Rate Limiting** - Configured per endpoint
- [ ] **API Versioning** - Using `/api/v1/` prefix
- [ ] **Sensitive Data** - Not logged or exposed in errors
- [ ] **API Documentation** - Protected with credentials

### Email Security
- [ ] **SMTP** - Using TLS/SSL encryption
- [ ] **SMTP Auth** - Username and password required
- [ ] **From Address** - Using domain email, not generic
- [ ] **Sender Verification** - SPF, DKIM, DMARC configured
- [ ] **Password Storage** - Using environment variables, not hardcoded

### Payment Security
- [ ] **PCI DSS Compliance** - If storing payment info, audit needed
- [ ] **Use Payment APIs** - Never store full card details
- [ ] **HTTPS Only** - All payment transmissions encrypted
- [ ] **Test Keys** - Removed from production
- [ ] **Error Handling** - Payment errors don't expose sensitive data

### Monitoring & Logging
- [ ] **Logging Enabled** - All important events logged
- [ ] **Log Rotation** - Configured to prevent disk space issues
- [ ] **Sensitive Data Logging** - Passwords/tokens NOT logged
- [ ] **Log Access** - Restricted to authorized users only
- [ ] **Monitoring** - Uptime monitoring configured
- [ ] **Alerts** - Configured for critical errors
- [ ] **Error Tracking** - Sentry or similar configured

### Data Protection
- [ ] **Data Encryption** - Sensitive data encrypted at rest
- [ ] **GDPR Compliance** - Data handling policy implemented
- [ ] **Data Retention** - Policy for old data removal
- [ ] **User Data Export** - Mechanism for user data export
- [ ] **Account Deletion** - User data properly deleted on removal
- [ ] **Privacy Policy** - Updated and accessible
- [ ] **Terms of Service** - Updated and accessible

### Backup & Disaster Recovery
- [ ] **Backup Strategy** - Daily backups configured
- [ ] **Backup Testing** - Restoration tested regularly
- [ ] **Backup Encryption** - Backups encrypted at rest
- [ ] **Backup Location** - Offsite or encrypted storage
- [ ] **Recovery Time** - RTO and RPO determined
- [ ] **Disaster Plan** - Procedures documented

### Third-party Services
- [ ] **API Keys** - All stored in environment variables
- [ ] **Vendor Security** - Verified vendor's security practices
- [ ] **Data Sharing** - Only necessary data shared
- [ ] **Compliance** - Vendor meets compliance requirements

### Tools & Updates
- [ ] **Dependency Scanning** - Run `pip audit` and `npm audit`
- [ ] **Security Updates** - Applied to OS and all packages
- [ ] **Python Version** - Using Python 3.11+ with security patches
- [ ] **Node Version** - Using Node 20+ with security patches
- [ ] **Docker Version** - Updated to latest stable
- [ ] **Regular Updates** - Schedule monthly updates

### Testing & Validation
- [ ] **OWASP Testing** - Basic OWASP Top 10 checks done
- [ ] **SQL Injection** - Tested and protected
- [ ] **XSS** - Tested and protected
- [ ] **CSRF** - Tested and protected
- [ ] **Authentication** - Tested and working
- [ ] **Authorization** - Tested and enforced
- [ ] **SSL Certificate** - Valid and not self-signed
- [ ] **SSL Configuration** - A+ rating on SSL Labs

### Documentation
- [ ] **Security README** - documented in docs/SECURITY.md
- [ ] **Incident Response** - Procedure documented
- [ ] **Access Control** - Documented and enforced
- [ ] **Audit Trail** - Available for review
- [ ] **Admin Guide** - Documentation for admin operations

### Pre-Launch
- [ ] **Staging Test** - Full deployment tested in staging
- [ ] **Load Testing** - Performance verified under load
- [ ] **All Logs** - Reviewed for errors and warnings
- [ ] **Dependencies** - All dependencies pinned to versions
- [ ] **Configuration** - All configs verified
- [ ] **Backups** - Initial backup taken
- [ ] **Monitoring** - Monitoring verified working
- [ ] **Alerts** - Alert recipients verified

---

## 🚨 Post-Deployment

Monitor for 24 hours:
- [ ] No critical errors in logs
- [ ] API response times normal
- [ ] Database performance good
- [ ] All services healthy
- [ ] No security alerts
- [ ] Users can login/register
- [ ] Payment processing working
- [ ] Email notifications sent

---

## 📋 Compliance Checklist

### Uzbekistan
- [ ] Terms & Conditions in Uzbek/Russian/English
- [ ] Privacy Policy compliant with local laws
- [ ] Data residency requirements met if applicable

### GDPR (if serving EU users)
- [ ] Privacy notice provided
- [ ] Consent obtained where needed
- [ ] Data processing agreement if using third parties
- [ ] Data subject rights implemented

### General
- [ ] Terms updated
- [ ] Privacy policy updated
- [ ] Cookies policy if needed
- [ ] Disclaimer for liability limitations

---

## 🔄 Maintenance Schedule

**Daily:**
- [ ] Check logs for errors
- [ ] Verify all services running

**Weekly:**
- [ ] Review security alerts
- [ ] Check backup status
- [ ] Monitor resource usage

**Monthly:**
- [ ] Update dependencies
- [ ] Security scan
- [ ] Performance review
- [ ] Backup restoration test

**Quarterly:**
- [ ] Security audit
- [ ] Penetration testing consideration
- [ ] Compliance review
- [ ] Infrastructure scaling review

---

## 📞 Emergency Contacts

- Security Team: [Your email]
- System Admin: [Your email]
- Incident Response: [Your procedure]

---

## Signature

I have verified all items on this checklist:

- [ ] **Name:** _________________
- [ ] **Date:** _________________
- [ ] **Signature:** _________________

---

**Last Updated:** February 23, 2026
**Document Version:** 1.0
