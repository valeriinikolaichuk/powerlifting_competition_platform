### IndexedDB
- Client-side storage reserved exclusively for the `Frontend Application ( frontend/ )`.
- Managed via `Dexie.js` to simplify native browser database interactions.

Database: `BombingOutFrontend`  
Table: `frontend_session`

|Column	|Description|
|-------|-----------|
|id	|Single record identifier|
|login_at	|Timestamp set after successful login. Used to prevent opening multiple active tabs in the same browser after login.|
|heartbeat	|Timestamp of the last frontend activity check. Used to detect abnormal application termination and restore the application state after unexpected failures.|

The table always contains exactly one record.
