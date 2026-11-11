// Generated from the approved API contract. Do not edit; regenerate when the contract changes.
import http from 'node:http';
const routes = [
  {
    "method": "GET",
    "path": "/healthz",
    "status": 200,
    "body": {
      "status": "ok"
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/auth/login",
    "status": 200,
    "body": {
      "id": 1,
      "username": "string"
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/auth/logout",
    "status": 204,
    "body": null
  },
  {
    "method": "GET",
    "path": "/api/v1/me",
    "status": 200,
    "body": {
      "id": 1,
      "username": "string"
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/categories",
    "status": 200,
    "body": {
      "categories": [
        {
          "slug": "string",
          "name": "string"
        }
      ]
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/apps/featured",
    "status": 200,
    "body": {
      "apps": [
        {
          "id": 1,
          "slug": "ledger-pro",
          "name": "Ledger Pro",
          "publisher": "Northstar Labs",
          "category": "productivity",
          "category_name": "Productivity",
          "price_idr": 150000,
          "rating": 4.7,
          "cover_url": "https://picsum.photos/seed/paladin-ledger-pro/640/360",
          "is_owned": false,
          "is_in_cart": true,
          "is_wishlisted": true
        }
      ],
      "count": 1
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/apps",
    "status": 200,
    "body": {
      "apps": [
        {
          "id": 1,
          "slug": "ledger-pro",
          "name": "Ledger Pro",
          "publisher": "Northstar Labs",
          "category": "productivity",
          "category_name": "Productivity",
          "price_idr": 150000,
          "rating": 4.7,
          "cover_url": "https://picsum.photos/seed/paladin-ledger-pro/640/360",
          "is_owned": false,
          "is_in_cart": true,
          "is_wishlisted": true
        }
      ],
      "count": 1
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/apps/{appId}",
    "status": 200,
    "body": {
      "id": 1,
      "slug": "string",
      "name": "string",
      "publisher": "string",
      "category": "string",
      "category_name": "string",
      "price_idr": 1,
      "rating": 1,
      "cover_url": "string",
      "is_owned": true,
      "is_in_cart": true,
      "is_wishlisted": true,
      "version": "string",
      "description": "string",
      "screenshots": [
        "string"
      ],
      "supported_os": [
        "string"
      ]
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/cart",
    "status": 200,
    "body": {
      "items": [
        {
          "app_id": 1,
          "name": "string",
          "cover_url": "string",
          "price_idr": 1
        }
      ],
      "count": 1,
      "total_idr": 1
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/cart/items",
    "status": 200,
    "body": {
      "items": [
        {
          "app_id": 1,
          "name": "string",
          "cover_url": "string",
          "price_idr": 1
        }
      ],
      "count": 1,
      "total_idr": 1
    }
  },
  {
    "method": "DELETE",
    "path": "/api/v1/cart/items/{appId}",
    "status": 200,
    "body": {
      "items": [
        {
          "app_id": 1,
          "name": "string",
          "cover_url": "string",
          "price_idr": 1
        }
      ],
      "count": 1,
      "total_idr": 1
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/wishlist",
    "status": 200,
    "body": {
      "apps": [
        {
          "id": 6,
          "slug": "terminus",
          "name": "Terminus",
          "publisher": "Hinterland Dev",
          "category": "developer-tools",
          "category_name": "Developer Tools",
          "price_idr": 250000,
          "rating": 4.6,
          "cover_url": "https://picsum.photos/seed/paladin-terminus/640/360",
          "is_owned": false,
          "is_in_cart": false,
          "is_wishlisted": true
        },
        {
          "id": 1,
          "slug": "ledger-pro",
          "name": "Ledger Pro",
          "publisher": "Northstar Labs",
          "category": "productivity",
          "category_name": "Productivity",
          "price_idr": 150000,
          "rating": 4.7,
          "cover_url": "https://picsum.photos/seed/paladin-ledger-pro/640/360",
          "is_owned": false,
          "is_in_cart": true,
          "is_wishlisted": true
        }
      ],
      "count": 2
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/wishlist/items",
    "status": 200,
    "body": {
      "apps": [
        {
          "id": 6,
          "slug": "terminus",
          "name": "Terminus",
          "publisher": "Hinterland Dev",
          "category": "developer-tools",
          "category_name": "Developer Tools",
          "price_idr": 250000,
          "rating": 4.6,
          "cover_url": "https://picsum.photos/seed/paladin-terminus/640/360",
          "is_owned": false,
          "is_in_cart": false,
          "is_wishlisted": true
        },
        {
          "id": 1,
          "slug": "ledger-pro",
          "name": "Ledger Pro",
          "publisher": "Northstar Labs",
          "category": "productivity",
          "category_name": "Productivity",
          "price_idr": 150000,
          "rating": 4.7,
          "cover_url": "https://picsum.photos/seed/paladin-ledger-pro/640/360",
          "is_owned": false,
          "is_in_cart": true,
          "is_wishlisted": true
        }
      ],
      "count": 2
    }
  },
  {
    "method": "DELETE",
    "path": "/api/v1/wishlist/items/{appId}",
    "status": 200,
    "body": {
      "apps": [
        {
          "id": 6,
          "slug": "terminus",
          "name": "Terminus",
          "publisher": "Hinterland Dev",
          "category": "developer-tools",
          "category_name": "Developer Tools",
          "price_idr": 250000,
          "rating": 4.6,
          "cover_url": "https://picsum.photos/seed/paladin-terminus/640/360",
          "is_owned": false,
          "is_in_cart": false,
          "is_wishlisted": true
        },
        {
          "id": 1,
          "slug": "ledger-pro",
          "name": "Ledger Pro",
          "publisher": "Northstar Labs",
          "category": "productivity",
          "category_name": "Productivity",
          "price_idr": 150000,
          "rating": 4.7,
          "cover_url": "https://picsum.photos/seed/paladin-ledger-pro/640/360",
          "is_owned": false,
          "is_in_cart": true,
          "is_wishlisted": true
        }
      ],
      "count": 2
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/wishlist/items/{appId}/move-to-cart",
    "status": 200,
    "body": {
      "wishlist": {
        "apps": [
          {
            "id": 6,
            "slug": "terminus",
            "name": "Terminus",
            "publisher": "Hinterland Dev",
            "category": "developer-tools",
            "category_name": "Developer Tools",
            "price_idr": 250000,
            "rating": 4.6,
            "cover_url": "https://picsum.photos/seed/paladin-terminus/640/360",
            "is_owned": false,
            "is_in_cart": false,
            "is_wishlisted": true
          }
        ],
        "count": 1
      },
      "cart": {
        "items": [
          {
            "app_id": 1,
            "name": "Ledger Pro",
            "cover_url": "https://picsum.photos/seed/paladin-ledger-pro/640/360",
            "price_idr": 150000
          }
        ],
        "count": 1,
        "total_idr": 150000
      }
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/checkout",
    "status": 200,
    "body": {
      "id": 1,
      "reference": "PAL-0001",
      "created_at": "2026-01-01T00:00:00Z",
      "total_idr": 1,
      "items": [
        {
          "app_id": 1,
          "name": "string",
          "license_key": "PALIN-7Q2M-4XRT-9KLP-3WZA",
          "price_idr": 1
        }
      ]
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/orders",
    "status": 200,
    "body": {
      "orders": [
        {
          "id": 1,
          "reference": "PAL-0001",
          "created_at": "2026-01-01T00:00:00Z",
          "total_idr": 1,
          "items": [
            {
              "app_id": 1,
              "name": "string",
              "license_key": "PALIN-7Q2M-4XRT-9KLP-3WZA",
              "price_idr": 1
            }
          ]
        }
      ],
      "count": 1
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/orders/{reference}",
    "status": 200,
    "body": {
      "id": 1,
      "reference": "PAL-0001",
      "created_at": "2026-01-01T00:00:00Z",
      "total_idr": 1,
      "items": [
        {
          "app_id": 1,
          "name": "string",
          "license_key": "PALIN-7Q2M-4XRT-9KLP-3WZA",
          "price_idr": 1
        }
      ]
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/library",
    "status": 200,
    "body": {
      "items": [
        {
          "app_id": 1,
          "slug": "string",
          "name": "string",
          "cover_url": "string",
          "license_key": "string",
          "purchased_at": "2026-01-01T00:00:00Z",
          "order_reference": "PAL-0001"
        }
      ],
      "count": 1
    }
  }
];
const rx = (p) => new RegExp('^' + p.split('/').map((s) => (/^\{[^}]+\}$/.test(s) ? '[^/]+' : s.replace(/[.*+?^${}()|[\]\\]/g, '\\{task}'))).join('/') + '/?'
);
const compiled = routes.map((r) => ({ ...r, re: rx(r.path) }));
const port = Number(process.argv[2] || 4010);
http.createServer((req, res) => {
  const pathname = (req.url || '/').split('?')[0];
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  res.setHeader('access-control-allow-methods', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const hit = compiled.find((r) => r.method === req.method && r.re.test(pathname));
  if (!hit) { res.writeHead(404, { 'content-type': 'application/json' }); return res.end('{"error":"not in contract"}'); }
  res.writeHead(hit.status, { 'content-type': 'application/json' });
  res.end(hit.body === null ? '' : JSON.stringify(hit.body));
}).listen(port, () => console.log('mock server on :' + port));
