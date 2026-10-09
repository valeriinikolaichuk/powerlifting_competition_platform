import { 
    TABLE_USERS, 
    STATIC_REFERENCE_TABLES, 
    ADMIN_REFERENCE_TABLES, 
    USER_REFERENCE_TABLES, 
    USER_REFERENCE_FEDERATIONS, 
    CREATED_BY_USER_TABLES,
    COMPETITION_TABLES, 
    COMPETITION_SESSION_TABLES, 
    COMPETITION_GROUP_TABLES,  
    TABLE_DEVICE_STATUS, 
    COMPETITION_RUNTIME_TABLES, 
    ORGANIZATION_RESULT_TABLES, 
} from './sync/config.js';

import { CREATE_COMPETITION_SQL } from './queries/competitions/create.js';
import { UPDATE_COMPETITION_SQL } from './queries/competitions/update.js';
import { ARCHIVE_COMPETITION_SQL } from './queries/competitions/archive.js';

import { UPDATE_DEVICE_ROLE_SQL } from './queries/device_status/update_device_role.js';

import { SET_NOMINATION_DATES_SQL } from './queries/nominations/set_dates.js';
import { UPDATE_NOMINATION_STATUS_SQL } from './queries/nominations/update_staus.js';

import { CompetitionData, UpdateCompetitionData, ArchiveCompetitionData } from './dto/competition-data.js';
import { DeviceRole } from './dto/device-role.js';

export { 
    TABLE_USERS, 
    STATIC_REFERENCE_TABLES,
    ADMIN_REFERENCE_TABLES,  
    USER_REFERENCE_TABLES, 
    USER_REFERENCE_FEDERATIONS,
    CREATED_BY_USER_TABLES, 
    COMPETITION_TABLES, 
    COMPETITION_SESSION_TABLES, 
    COMPETITION_GROUP_TABLES, 
    TABLE_DEVICE_STATUS ,
    COMPETITION_RUNTIME_TABLES, 
    ORGANIZATION_RESULT_TABLES, 
};

export const SYNC_OPERATIONS = {

  CREATE_COMPETITION: CREATE_COMPETITION_SQL,
  UPDATE_COMPETITION: UPDATE_COMPETITION_SQL,
  ARCHIVE_COMPETITION: ARCHIVE_COMPETITION_SQL,

  UPDATE_DEVICE_ROLE: UPDATE_DEVICE_ROLE_SQL,

  SET_NOMINATION_DATES: SET_NOMINATION_DATES_SQL,
  UPDATE_NOMINATION_STATUS: UPDATE_NOMINATION_STATUS_SQL,

} as const;

export type { 
    CompetitionData, UpdateCompetitionData, ArchiveCompetitionData, 
    DeviceRole, 
};