# 👑 JuteIt: Master Access Guide (Shaan's Powers)

This document is for the **System Administrator (Shaan)**. It details root-level privileges that manage the foundation of the platform.

## 📑 Index
1. [The Master Key](#1-the-master-key)
2. [Owner Management](#2-owner-management)
3. [Database Maintenance](#3-database-maintenance)
4. [Security & Deployment](#4-security--deployment)

---

## 1. The Master Key
You possess the `MASTER_KEY` (defined in `.env`). This key is required to access sensitive management APIs and bypasses standard user roles.

## 2. Owner Management
Only you have the power to:
- **Assign Owners**: Grant full administrative permissions to any email address.
- **Revoke Roles**: Remove owner privileges if needed.
- **Wipe Users**: Delete any account (buyer or owner) from the system for maintenance.

## 3. Database Maintenance
You have direct access to the MongoDB URI to perform migrations, backups, or manual data corrections.

## 4. Security & Deployment
- Manage Environment Variables (JWT secrets, API keys).
- Oversee server-side logging and performance tuning.
- Handle production builds and deployment scripts.

> [!IMPORTANT]
> Keep your `MASTER_KEY` absolute private. It grants total control over the registration logic.
