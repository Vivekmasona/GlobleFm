# 🎧 Janus WebRTC Gateway Setup Guide for FM Radio Streaming

This guide explains how to install, configure, and connect the Janus Gateway with your FM Radio WebRTC system (Broadcaster + Listeners).

---

## 1. 🧰 Requirements

- Ubuntu 22.04 or Debian 12 (recommended)
- Root or sudo access
- Ports 8088 (HTTP API), 8188 (WebSocket), 10000–10200 (RTP)
- Node.js server (for your `api/server.js` signaling)
- Domain or public IP (if you want external users)

---

## 2. ⚙️ Install Dependencies

```bash
sudo apt update
sudo apt install -y git build-essential libmicrohttpd-dev libjansson-dev \
  libssl-dev libsrtp2-dev libsofia-sip-ua-dev libglib2.0-dev libopus-dev \
  libogg-dev libcurl4-openssl-dev liblua5.3-dev libconfig-dev pkg-config \
  gengetopt libtool automake
