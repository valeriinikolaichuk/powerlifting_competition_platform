export const UPDATE_DEVICE_ROLE_SQL = 
`
  UPDATE device_status
  SET
    device_role = $2::"DeviceRole",
    updated_at = $3::timestamp
  WHERE id = $1::uuid
    AND is_deleted = false
`;