// Ambhujakshi Specials defaults — shared by the admin manager
export type Feature = { icon: string; text: string }
export type Variant = { id: string; label: string; price: number; mrp: number }
export type Special = { id: string; productId: string; name: string; image: string; story: string; features: Feature[]; variants: Variant[]; defaultVariant: number; enabled: boolean }
export type SpecialsSettings = { enabled: boolean; title: string; subtitle: string; tagline: string; tagText: string; moreText: string; showIntro: boolean }

export const DEFAULT_SPECIALS_SETTINGS: SpecialsSettings = {"enabled": true, "title": "AMBHUJAKSHI", "subtitle": "SPECIALS", "tagline": "Seen through the Lotus Eye", "tagText": "AMMA'S SPECIAL", "moreText": "MORE SPECIALS", "showIntro": true}

export const DEFAULT_SPECIALS: Special[] = [
  {
    "id": "gongura_pickle",
    "productId": "",
    "name": "Gongura Pickle",
    "image": "assets/images/special_gongura_pickle.png",
    "story": "Tangy sorrel leaves slow-cooked with garlic and Guntur chillies in sesame oil — the pride of Andhra.",
    "features": [
      {
        "icon": "leaf",
        "text": "Fresh gongura leaves"
      },
      {
        "icon": "jar",
        "text": "Cold-pressed sesame oil"
      },
      {
        "icon": "recipe",
        "text": "Amma's recipe"
      }
    ],
    "variants": [
      {
        "id": "250g",
        "label": "250g",
        "price": 189,
        "mrp": 220
      },
      {
        "id": "500g",
        "label": "500g",
        "price": 359,
        "mrp": 418
      },
      {
        "id": "1kg",
        "label": "1kg",
        "price": 680,
        "mrp": 792
      }
    ],
    "defaultVariant": 0,
    "enabled": true
  },
  {
    "id": "tomato_pickle",
    "productId": "",
    "name": "Tomato Pickle",
    "image": "assets/images/special_tomato_pickle.png",
    "story": "Ripe country tomatoes cooked down with mustard and red chilli until rich, glossy and tangy.",
    "features": [
      {
        "icon": "sun",
        "text": "Sun-ripened tomatoes"
      },
      {
        "icon": "fire",
        "text": "Slow cooked"
      },
      {
        "icon": "heart",
        "text": "No preservatives"
      }
    ],
    "variants": [
      {
        "id": "250g",
        "label": "250g",
        "price": 169,
        "mrp": 199
      },
      {
        "id": "500g",
        "label": "500g",
        "price": 321,
        "mrp": 378
      },
      {
        "id": "1kg",
        "label": "1kg",
        "price": 608,
        "mrp": 716
      }
    ],
    "defaultVariant": 0,
    "enabled": true
  },
  {
    "id": "kandi_podi",
    "productId": "",
    "name": "Kandi Podi",
    "image": "assets/images/special_kandi_podi.png",
    "story": "Roasted toor dal, chillies and cumin stone-ground into the classic hot-rice-and-ghee podi.",
    "features": [
      {
        "icon": "fire",
        "text": "Slow roasted"
      },
      {
        "icon": "ghee",
        "text": "Best with ghee"
      },
      {
        "icon": "hand",
        "text": "Stone ground"
      }
    ],
    "variants": [
      {
        "id": "250g",
        "label": "250g",
        "price": 149,
        "mrp": 175
      },
      {
        "id": "500g",
        "label": "500g",
        "price": 283,
        "mrp": 332
      },
      {
        "id": "1kg",
        "label": "1kg",
        "price": 536,
        "mrp": 630
      }
    ],
    "defaultVariant": 0,
    "enabled": true
  },
  {
    "id": "chekkalu",
    "productId": "",
    "name": "Chekkalu",
    "image": "assets/images/special_chekkalu.png",
    "story": "Crisp rice-flour crackers with chana dal, sesame and curry leaves — a Sankranti favourite.",
    "features": [
      {
        "icon": "hand",
        "text": "Hand-pressed"
      },
      {
        "icon": "leaf",
        "text": "Curry leaf & sesame"
      },
      {
        "icon": "heart",
        "text": "Tea-time crunch"
      }
    ],
    "variants": [
      {
        "id": "250g",
        "label": "250g",
        "price": 139,
        "mrp": 165
      },
      {
        "id": "500g",
        "label": "500g",
        "price": 264,
        "mrp": 314
      },
      {
        "id": "1kg",
        "label": "1kg",
        "price": 500,
        "mrp": 594
      }
    ],
    "defaultVariant": 0,
    "enabled": true
  },
  {
    "id": "ariselu",
    "productId": "",
    "name": "Ariselu",
    "image": "assets/images/special_ariselu.png",
    "story": "Soft jaggery-rice sweets fried golden and topped with sesame, made the traditional way.",
    "features": [
      {
        "icon": "ghee",
        "text": "Pure ghee"
      },
      {
        "icon": "recipe",
        "text": "Festival classic"
      },
      {
        "icon": "hand",
        "text": "Handmade"
      }
    ],
    "variants": [
      {
        "id": "250g",
        "label": "250g",
        "price": 229,
        "mrp": 260
      },
      {
        "id": "500g",
        "label": "500g",
        "price": 435,
        "mrp": 494
      },
      {
        "id": "1kg",
        "label": "1kg",
        "price": 824,
        "mrp": 936
      }
    ],
    "defaultVariant": 0,
    "enabled": true
  },
  {
    "id": "kaju_mixture",
    "productId": "",
    "name": "Kaju Mixture",
    "image": "assets/images/special_kaju_mixture.png",
    "story": "Crunchy sev, peanuts and whole cashews tossed with curry leaves and a gentle spice.",
    "features": [
      {
        "icon": "heart",
        "text": "Loaded with cashews"
      },
      {
        "icon": "leaf",
        "text": "Curry leaf tempered"
      },
      {
        "icon": "jar",
        "text": "Fresh every batch"
      }
    ],
    "variants": [
      {
        "id": "250g",
        "label": "250g",
        "price": 179,
        "mrp": 210
      },
      {
        "id": "500g",
        "label": "500g",
        "price": 340,
        "mrp": 399
      },
      {
        "id": "1kg",
        "label": "1kg",
        "price": 644,
        "mrp": 756
      }
    ],
    "defaultVariant": 0,
    "enabled": true
  }
]

export const SPECIAL_PREVIEWS: Record<string, string> = {
  'special_gongura_pickle.png': 'data:image/webp;base64,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',
  'special_tomato_pickle.png': 'data:image/webp;base64,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',
  'special_kandi_podi.png': 'data:image/webp;base64,UklGRlQMAABXRUJQVlA4IEgMAABQLQCdASqAAIAAPm0skkYkIqGhLRp6iIANiWwA1PzbC4/FeaLYv8B+O+J0Lp3L5/P9V6hPzB7AH6x/qf1wfMX5yvot/1npO9RHvIH+A/8XUAf//gnU+fA3xce7pAnalqF9w+KHfn8Isne9MgC6t/VE8K+wB5Of6HwRftv+y9gDyX/7zxs/VfsD9KP0kkDRyvp6rn1vpH/c3HyPY0BJCjJhw76gbbK7rACQjBL8FERMZgHIrctSjeQ51MBLJZro6o63Dd7PvZbKO7F5rKMrbehXvkmIXcp5uH4REftxW0QyL2GKXoc83i5hvlomXs0Cu1Z1tWKLppzF09upct0IwKVg19Tu+JUsYF6oZr8On/5ZzMCxL09X104NJoH4IuDlTc7zKe3Cp66hPgXc17f/7kUZCTsFyK1FUj1GOMMTrq5ee9XTOL1+C60KTSIDrwsltqHtTSROLmntDCr/6VgDT9NkkIdlsiDVmyTwa1qqOS1WrENvgAD+/PQADGwD6rpZEo0mHZluD9JwwCvyQ33WyFtThi9y4ewPTKXs8306PHGaVFJM6C2Pt9k4doXK+vRVVq+r/vtquALl87RKUAA0agHF1nSG82r9lvqo/4iKRoT58MZnQxT3Aia+Zeb2DwbA5JV0k6sHvA6d9O5NcP90HuSYSRwi71+D5SLVuz8uJ0bXaUwpMOBmiI60IaceFH5L4IQtIeMBDxld0GP2bi0yHv1cBIaq7WpJP9Le2InrD93+j8/WGbB7wisWOxxC0JG44hE3UwgO0xUaV4r8ILWrP+M/bByVfFDxp6d+S48j9pXp8kGM+Ofdrx2Qg+7+AzwY+PZm7sLLjqq0dWaLD3mxPBRj3q0InQerQxuLcO7BvAf93SMK/4ZhUrw78XQ+SvKBrBFPf/Q6iOBqJCfahrEHvhqKqh15pyWbZcQ6wv/+7J6kK1WdhxGVDhDOvpVabnNvWs7nVeJoeK5HoYag7NiN/pVxaJJdusigyKgEMYPvX9+oc60nBxJV4VqXRtJjhIwOfe7JS5qeUSoVfQq30Me2fOdMbxGu7gan1u/JRknUxbA07JN7kgF1AMia2HfaM8rja4CWQmUgHdXh4tn9z7yHFj9e+VgUIIoYAZvpcAB7xDv7xX40O92jP23coqWiWl6HPi3+jrjFGN/6xDVYz/q7XUKwX+jcY3+DsrSjRazOKyPEe4GCd4tHgt+84FDQnqXs3GKAs5ElDyRLosbtYvTmAmJcShlRlSU82GBmybdZrLZIUhdL0h6Gyfs9FSBeA4l1xaG1wtXlWWpx9O7oZtdsUeAqnxZj/7r42fRQsJ5xC64aookL03mNo9ya89WeoHcvTPvD/Dtwh9VT0h3dIC3TYHV8kWgYGhsrLWhxI6AhmPOHYpQut2kyODovGxtI90ex/eIy3ifX8NNVHtiZVyKpMeAXPxq4aTCR2/T47Yecl56az/z1JDYmxj+lPjEj6DpixUQUvJi0PK7LKMfelCabF/UIw0jN58+ofYWRNmQU/cAW1IQNCeJUe164Z/gs1uHIxA/m8ECeT+ATEEg8ftUh3xwAx7hcHslKHx2ELBjZEbcKG0EL0ElhtlPtXbQxb854h3s7syZr1hSqLgYxJRcsrotFSC4CV8gmORZ063DxM5tZlPrlzwG5LrhAg8H6iJ9c2++Fay3oRheGZ2QhFkjIQPaMz2wLElK8edUfunnqh9/fzoWAYJeT7gTK4nDAa0k05tBvxFyeoNFxZJGiH2vjV2o5LV7pm+7/QyQr1NG+W9bDeYvIQETCwqWLSZ+3dV/A7nf/TJ9viuPBVj2aXP+G0mezvMYGnir3dG6wUXlWE4z3JkWnJMxjHmEfaNJFVMkOVpxGsFopO1RrpJoagcTxKhnWJqs5OKCKQcc1yc96JhVtcgeWuF7Tg50ry1qU/h/bIlTdBM6rdg6/CI+Xb9jOmderv7ARnPGk9e1zwUz4lW5xMLTylJJq+bP4zq38v/MB9eNOHgbZxak60NwvQySBuszxgujbRDFhNBLKxi+mgObNLQ1p6w32E/MdJHpBrNpJW7dCrzLQY1UQlUBwBtELDHy30nWb9Vbs5O3sScgYQWOSMpqPCuBq0DeXDm8blft3pqTjUY0dyyKIy9w4InDe6unNsv3Bcz/+46MxYy9f26LLKlI7HSm1LO6RvGuWdtkHPMQXwhAxNoSXR/5pS9su6ENWi25N7VC6Fdg0m5JpFdMW+I877yzr8nS/Vl4rrT5j1EyL3xK2IzkXJsKl5R05VwNtKdbm1OjVrHAabbf4z6jO4W6CijynPGYTI5iegfSiVrRvJIaMEjG67K82DGqmc2WDedA4RR1AbFs4XsN5uqTsbfnc7Tv7E6xnIzfKR0r7iMnd8mrrrL0qiPFAJbFbKQu2731jLyNzhfBwqN5vlLrhGe9YFqdZ4JJ6/zoJbc5Lo/WDN9m27mod6e8+lxzgStiiGRokRlQRM9HS+T3ob2qXMsu0WPqNHtfqMWqGapM7wMb2+GP9KWwfLSr2q8tH/al4peeztK/MCRMhbOgPhz6B7P4upDZjLcIljSEZN0Gocb2Gg3XpxFi5Dc6/ZPzgG0e5raXKDYStjzthWakeJJqHIytvm5SZRLRodKBflG62MTqRw1B1ltuZhLwH9Mmo8PEtjRuiEkusv2wOllfhCBJ/tj+zfRA945ZXQzt2b8aICozOknNOR+0jBXv0L+QqBc0VhnF2N3zFuX6h4QOp5Zkn1ync+mujSjc/fjiUSjP2+OM0dQgNlj1HuB8MEdlbZa3dnA7exlXEWAa/1zTd7GTRWaTapK+1jedvPU7+brnlsuetXE/eFifJ2b4Bk6Erhbmhbe4lUuK4f6XPoAuidmheeEktQIr5bOqTbfpWydn4zbb5bNuPSvY0iyEsVzq9z6h+PJJThY2uhrGH5hGaNbn9YG1wkFXVAvWKcrfIbGF6g3/GnxEGpnDnAhitTdlDtk1jUsOdJe0wUaIeFFWiJP1lWfyfpRXvIqIcHqcxo0XSs/YpQ1KDSGxkjhThmyYYrGftrn5gxaZ8Fkcq/iUzu9MgHd+j6kzmcjmsunimFOrLlB/42DllF7G+0NaNfIjIX+72wj5/mtBlnbDvljqhHlsYDKUyt27Z+FZ/wAHogQljCkjqXe5JZQkDsgtetXsrZHlsvSfH6FFCKtJZfqHKfJ69AMD4IvTHFE98MyIPBG1YejkEdrtiArDSvTkw3nfGnlknbbX7O+7g7bRllw9OATq0lug6OsqXtXQ7JVlXWTZVTH54yP3fJZsl8wBub7mTwPj2xDHFX3IIEWmaURbl/P+fTminkCtLUyqBrE+o5LpR1kDZXBYbmtOQv2Py0vnXXDsn0Lp6F+c5fP3l0c62se4uElZd2maVKFSEYMtR1QMXOJIp10+RbS9lou1IGo6CTU1Ox+K0QqCQ5zTgyRHahM+mIhNcgx/xNvN/kFv0mk1720cB4MRCDoR0QthnVmMJtWvGSPW8sJ4/s1gNrM6sN6QLC+6M9Zgge2zSJ49WWCL2QszBV48jMwNPZjvuEMc6R2QCU9z0TEzNpuo9/R83/Oq6OCAXeM8LA/nlup+W2ZFQ+Xl1Uy2WccQwmGh4653COR688S/bKEFiMBPE3WJqxLwzSV57QZ/+P0J0tltM3cJEn9mJmpIGNDWggyJhZfDwzxrl4BM64C+XGjtawWLOqTirDLTaumEh36omtmJepRD19nRqaOwXBDH1myBSwYgXZJ7pZDvyNM3uGF0W/kSL0Ip5wJHIL/x8CmmfKlutm+6tcg2K1naqOkhEyzIsF6kZy4mTqxsNWJ4uGti9tOqbnJOAJy/ERgW0m3TBx2k9aXQACNpq21q6OQG/lcv3/ovRHGVzEquH1I4tH/CqFakC6HwDOncn86Vi/Bfy+Nh9aD6QfC5HBrhlFavcCG+WylNh8yI4gvNtZYEeb2+4sLtN/kv9xtWGF3wr2jnlf0sOEbiM5LDNr3WULt0JzkKwSh+WIbu/CD7pJBsOQhBl0g7sk36ICKXsULvG3vMLd+b9YmTokY0XAfosRT5rEOelh+hcntgrp6Odh4xOPShoMQ6+1KFyAAMYnWFM3cg075MQ4hQBmR+A8YCTeqDqHDSOdR0qWl+RQPgmzwDfWr8P0Cbyp3MaqlkKKRoTiol5YEwOYUPBOBO68d+oBJtgvRLmDQuuBA8fdAAAAAAAAAA=',
  'special_chekkalu.png': 'data:image/webp;base64,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',
  'special_ariselu.png': 'data:image/webp;base64,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',
  'special_kaju_mixture.png': 'data:image/webp;base64,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',
}
