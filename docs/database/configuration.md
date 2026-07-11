### Configuration Tables
<details open="open">
<summary>Contents</summary>  

- [user_federations](#user_federations)

</details>

---

### user_federations
Defines which federations are accessible to each user.
This table maps users to the federations they are allowed to work with.

#### Relations
- related with ➡ [**federations**](reference.md) by `federation_id`
- related with ➡ [**user**](business.md) by `created_by_user_id`

### Business Rules
- A `USER` may have access to one or more federations.
- Access to federations is assigned by `ADMIN` users.
- Users can work only with federations assigned to them.
- The combination of `user_id` and `federation_id` must be `unique`.

---
