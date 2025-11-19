# 14. Assets & Animations

This document contains the source code for the Lottie animations and other binary assets used in the application.

---

## 1. Hero Scan Receipt Animation
**File:** `src/animations/hero-scan-receipt.json`

This Lottie animation plays during the "Scanning" phase. It shows a receipt transforming into a digital list.

```json
{
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 90,
  "w": 600,
  "h": 600,
  "nm": "Hero Scan Receipt",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Receipt",
      "sr": 1,
      "ks": {
        "o": {
          "a": 1,
          "k": [
            {
              "i": { "x": [0.833], "y": [0.833] },
              "o": { "x": [0.167], "y": [0.167] },
              "t": 0,
              "s": [0]
            },
            {
              "t": 30,
              "s": [100]
            }
          ]
        },
        "r": { "a": 0, "k": 0 },
        "p": { "a": 0, "k": [300, 300, 0] },
        "a": { "a": 0, "k": [0, 0, 0] },
        "s": {
          "a": 1,
          "k": [
            {
              "i": { "x": [0.667, 0.667, 0.667], "y": [1, 1, 1] },
              "o": { "x": [0.333, 0.333, 0.333], "y": [0, 0, 0] },
              "t": 0,
              "s": [80, 80, 100]
            },
            {
              "t": 30,
              "s": [100, 100, 100]
            }
          ]
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "rc",
              "d": 1,
              "s": { "a": 0, "k": [200, 300] },
              "p": { "a": 0, "k": [0, 0] },
              "r": { "a": 0, "k": 0 },
              "nm": "Rectangle Path 1",
              "mn": "ADBE Vector Shape - Rect",
              "hd": false
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 1, 1, 1] },
              "o": { "a": 0, "k": 100 },
              "r": 1,
              "bm": 0,
              "nm": "Fill 1",
              "mn": "ADBE Vector Graphic - Fill",
              "hd": false
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0], "ix": 2 },
              "a": { "a": 0, "k": [0, 0], "ix": 1 },
              "s": { "a": 0, "k": [100, 100], "ix": 3 },
              "r": { "a": 0, "k": 0, "ix": 6 },
              "o": { "a": 0, "k": 100, "ix": 7 },
              "sk": { "a": 0, "k": 0, "ix": 4 },
              "sa": { "a": 0, "k": 0, "ix": 5 },
              "nm": "Transform"
            }
          ],
          "nm": "Rectangle 1",
          "np": 3,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 90,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
}
```
