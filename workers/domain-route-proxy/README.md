# Domain Route Proxy

Routes user custom domains to their respective Biscuits public apps.

One tricky thing is we want to transform the domain to map to a path, usually. i.e.

- `https://wish.gfor.rest` --> `https://lists.wish-wash.biscuits.club/abcde1234
- `https://wish.gfor.rest/items/1` --> `https://lists.wish-wash.biscuits.club/abcde1234/items/1`

But then we want assets to resolve from root, like `main.js` or `/assets/styles.css`, etc.
